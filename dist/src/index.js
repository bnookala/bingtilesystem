"use strict";
exports.__esModule = true;
var EarthRadius = 6378137;
var MinLatitude = -85.05112878;
var MaxLatitude = 85.05112878;
var MinLongitude = -180;
var MaxLongitude = 180;
exports.clip = function (number, minValue, maxValue) {
    return Math.min(Math.max(number, minValue), maxValue);
};
exports.mapSize = function (levelOfDetail) {
    return 256 << levelOfDetail;
};
exports.groundResolution = function (latitude, levelOfDetail) {
    var newLatitude = exports.clip(latitude, MinLatitude, MaxLatitude);
    return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * EarthRadius / exports.mapSize(levelOfDetail);
};
exports.mapScale = function (latitude, levelOfDetail, screenDpi) {
    return exports.groundResolution(latitude, levelOfDetail) * screenDpi / 0.0254;
};
exports.latLongToPixelXY = function (latitude, longitude, levelOfDetail) {
    var newLatitude = exports.clip(latitude, MinLatitude, MaxLatitude);
    var newLongitude = exports.clip(longitude, MinLongitude, MaxLongitude);
    var x = (newLongitude + 180) / 360;
    var sinLatitude = Math.sin(newLatitude * Math.PI / 180);
    var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    var mapSizeLod = exports.mapSize(levelOfDetail);
    return {
        pixelX: exports.clip(x * mapSizeLod + 0.5, 0, mapSizeLod - 1),
        pixelY: exports.clip(y * mapSizeLod + 0.5, 0, mapSizeLod - 1)
    };
};
exports.pixelXYtoLatLong = function (pixelX, pixelY, levelOfDetail) {
    var mapLodSize = exports.mapSize(levelOfDetail);
    var x = (exports.clip(pixelX, 0, mapLodSize - 1) / mapLodSize) - 0.5;
    var y = 0.5 - (exports.clip(pixelY, 0, mapLodSize - 1) / mapLodSize);
    var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    var longitude = 360 * x;
    return {
        latitude: latitude,
        longitude: longitude
    };
};
exports.pixelXYtoTileXY = function (pixelX, pixelY) {
    return {
        tileX: Math.floor(pixelX / 256),
        tileY: Math.floor(pixelY / 256)
    };
};
exports.tileXYToPixelXY = function (tileX, tileY) {
    return {
        pixelX: tileX * 256,
        pixelY: tileY * 256
    };
};
exports.tileXYToQuadKey = function (tileX, tileY, levelOfDetail) {
    var quadKey = "";
    for (var i = levelOfDetail; i > 0; i--) {
        var digit = 0;
        var mask = 1 << (i - 1);
        if ((tileX & mask) !== 0) {
            digit++;
        }
        if ((tileY & mask) !== 0) {
            digit += 2;
        }
        quadKey = quadKey + digit.toString();
    }
    return quadKey;
};
exports.quadKeyToTileXY = function (quadKey) {
    var tileX = 0, tileY = 0;
    var levelOfDetail = quadKey.length;
    for (var i = levelOfDetail; i > 0; i--) {
        var mask = 1 << (i - 1);
        switch (quadKey[levelOfDetail - i]) {
            case '0':
                break;
            case '1':
                tileX |= mask;
                break;
            case '2':
                tileY |= mask;
                break;
            case '3':
                tileX |= mask;
                tileY |= mask;
                break;
            default:
                throw "Invalid QuadKey digit sequence.";
        }
    }
    return {
        tileX: tileX,
        tileY: tileY,
        levelOfDetail: levelOfDetail
    };
};
//# sourceMappingURL=index.js.map