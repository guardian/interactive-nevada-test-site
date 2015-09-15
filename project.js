var rw = require('rw');
var _ = require('lodash');
var d3 = require('d3');
require('d3-geo-projection')(d3);

var projection = d3.geo.mercator().scale(1).translate([0, 0]);
var path = d3.geo.path().projection(projection);

var b = path.bounds({
    'type': 'MultiPoint',
    'coordinates': [[-117.600403, 38.134557], [-114.095764, 35.554574]]
});

// [-117° 36' 1.4508", 38° 8' 4.4052"], [-114° 5' 44.7504", 35° 33' 16.4664"]

var s = 1 / Math.max((b[1][0] - b[0][0]) / 100, (b[1][1] - b[0][1]) / 100),
    t = [(100 - s * (b[1][0] + b[0][0])) / 2, (100 - s * (b[1][1] + b[0][1])) / 2];

projection.scale(s).translate(t);

tests = JSON.parse(rw.readFileSync('/dev/stdin'));

var points = tests.map(function (test) {
    return [
        projection([test.lng, test.lat]).map(function (p) { return Number(p.toFixed(2)); }),
        test.name,
        test.operation,
        test.yield
    ];
}).filter(function (test) {
    var point = test[0];
    return point[0] >= 0 && point[0] <= 100 && point[1] >= 0 && point[1] <= 100;
});

rw.writeFileSync('/dev/stdout', JSON.stringify(points));
