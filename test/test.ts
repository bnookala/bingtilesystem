import {quadKeyToTileXY, tileXYToPixelXY, pixelXYtoLatLong} from '../src/index';

let testQuad = "033331323000000000";

let tileXYResults = quadKeyToTileXY(testQuad);
let pixelXY = tileXYToPixelXY(tileXYResults.tileX, tileXYResults.tileY);

let latLongResults = pixelXYtoLatLong(pixelXY.pixelX, pixelXY.pixelY, tileXYResults.levelOfDetail);

console.log(latLongResults.latitude);
console.log(latLongResults.longitude);