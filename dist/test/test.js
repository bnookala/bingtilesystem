"use strict";
exports.__esModule = true;
var index_1 = require("../src/index");
var testQuad = "033331323000000000";
var tileXYResults = index_1.quadKeyToTileXY(testQuad);
var pixelXY = index_1.tileXYToPixelXY(tileXYResults.tileX, tileXYResults.tileY);
var latLongResults = index_1.pixelXYtoLatLong(pixelXY.pixelX, pixelXY.pixelY, tileXYResults.levelOfDetail);
console.log(latLongResults.latitude);
console.log(latLongResults.longitude);
//# sourceMappingURL=test.js.map