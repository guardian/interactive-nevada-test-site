var rw = require('rw');
var _ = require('lodash');
var d3 = require('d3');
require('d3-geo-projection')(d3);

function scale(value, min, max, range) {
    return (value - min) / (max - min) * range;
}

var projection = d3.geo.mercator().scale(1).translate([0, 0]);

var tl = projection([-117.816211392359,37.6208295393796]);
var br = projection([-113.393483642213,35.5546056227236]);

testsIn = JSON.parse(rw.readFileSync('/dev/stdin'));

var unitMultiplier = {
    'kg': 0.001,
    't': 1,
    'kt': 1000,
    'Mt': 1000000
};

var minYield = 100000, maxYield = 0;
var minR = 5, maxR = 145;

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

    return {
        'point': scaled.map(function (p) { return Number(p.toFixed(3)); }),
        'name': test.name,
        'yield': yield,
        'year': parseInt(test.datetime.split(' ')[2])
    };
}).filter(function (test) {
    var point = test.point;
    return point[0] >= 0 && point[0] <= 100 && point[1] >= 0 && point[1] <= 100;
}).sort(function (a, b) {
    return a.year - b.year;
});

tests.forEach(function (test) {
    if (test.yield) {
        test.yield = Math.round(scale(test.yield, minYield, maxYield, maxR) + minR);
    }
});

rw.writeFileSync('/dev/stdout', JSON.stringify(tests));
