var rw = require('rw');
var _ = require('lodash');
var d3 = require('d3');
require('d3-geo-projection')(d3);

function scale(value, min, max, range) {
    return (value - min) / (max - min) * range;
}

var projection = d3.geo.mercator().scale(1).translate([0, 0]);

var tl = projection([-118.351914860166, 38.0135624552784]);
var br = projection([-113.068119056973, 35.5813229544127]);

testsIn = JSON.parse(rw.readFileSync('/dev/stdin'));

var unitMultiplier = {
    'kg': 0.001,
    't': 1,
    'kt': 1000,
    'Mt': 1000000
};

var minYield = 100000, maxYield = 0;
var minR = 7, maxR = 155;
var yearLapse = 1000;

var tests = testsIn.map(function (test) {
    var yield;
    if (test.yield === 'no yield') {
        yield = 0;
    } else if (test.yield === 'unknown yield') {
        yield = 1;
    } else {
        if (test.yield.substr(0, 9) === 'less than') {
            test.yield = test.yield.substr(9);
        }
        var parts = test.yield.replace(/\s+/g, ' ').trim().split(' ');
        var n = parts[0], unit = parts[1];
        yield = parseFloat(n) * unitMultiplier[unit];
    }

    minYield = Math.min(minYield, yield);
    maxYield = Math.max(maxYield, yield);

    var point = projection([test.lng, test.lat]);
    var scaled = [scale(point[0], tl[0], br[0], 100), scale(point[1], tl[1], br[1], 100)];

    var date = +new Date(test.datetime.split(' ').slice(0, 3).join(' '));

    return {
        'point': scaled.map(function (p) { return Number(p.toFixed(3)); }),
        'name': test.name,
        'yield': yield,
        'date': date,
        'year': parseInt(test.datetime.split(' ')[2]),
        'type': test.delivery.indexOf('underground') === -1 ? 'atmospheric' : 'underground'
    };
}).filter(function (test) {
    var point = test.point;
    return point[0] >= 0 && point[0] <= 100 && point[1] >= 0 && point[1] <= 100;
});

var yearCounts = _(tests).groupBy('year').mapValues(function (yearTests) { return yearTests.length; }).value();

// Hack to leave gap for year with no tests
for (var year = 1952; year <= 1992; year++) {
    if (!yearCounts[year]) {
        tests.push({
            'point': [0, 0],
            'date': +new Date(year, 0, 1),
            'year': year,
            'yield': 0
        });
        yearCounts[year] = 1;
    }
}

tests.sort(function (a, b) { return a.date - b.date; });

tests.forEach(function (test) {
    if (test.yield) {
        test.yield = Math.round(scale(test.yield, minYield, maxYield, maxR) + minR);
    }
    test.delay = Number((yearLapse / yearCounts[test.year]).toFixed(2));
    delete test.date;
});

rw.writeFileSync('/dev/stdout', JSON.stringify(tests, 'year'));
