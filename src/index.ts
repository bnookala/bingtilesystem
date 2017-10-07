const EarthRadius = 6378137;
const MinLatitude = -85.05112878;
const MaxLatitude = 85.05112878;
const MinLongitude = -180;
const MaxLongitude = 180;

export const clip = (number:number, minValue:number, maxValue:number):number => {
   return Math.min(Math.max(number, minValue), maxValue);
}

export const mapSize = (levelOfDetail:number):number => {
    return 256 << levelOfDetail;
}

export const groundResolution = (latitude:number, levelOfDetail:number):number => {
    let newLatitude = clip(latitude, MinLatitude, MaxLatitude);
    return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * EarthRadius / mapSize(levelOfDetail);
}

export const mapScale = (latitude:number, levelOfDetail:number, screenDpi:number):number => {
    return groundResolution(latitude, levelOfDetail) * screenDpi / 0.0254;
}

export const latLongToPixelXY = (latitude:number, longitude:number, levelOfDetail:number): {pixelX:number, pixelY:number} => {
    let newLatitude = clip(latitude, MinLatitude, MaxLatitude);
    let newLongitude = clip(longitude, MinLongitude, MaxLongitude);

    let x = (newLongitude + 180) / 360;
    let sinLatitude = Math.sin(newLatitude * Math.PI / 180);
    let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

    let mapSizeLod = mapSize(levelOfDetail);

    return {
        pixelX: clip(x * mapSizeLod + 0.5, 0, mapSizeLod -1),
        pixelY: clip(y * mapSizeLod + 0.5, 0, mapSizeLod -1)
    };
}

export const pixelXYtoLatLong = (pixelX:number, pixelY:number, levelOfDetail:number): {latitude:number, longitude:number} => {
    let mapLodSize = mapSize(levelOfDetail);
    let x = (clip(pixelX, 0, mapLodSize - 1) / mapLodSize) - 0.5;
    let y = 0.5 - (clip(pixelY, 0, mapLodSize - 1) / mapLodSize);

    let latitude =  90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    let longitude = 360 * x;

    return {
        latitude,
        longitude
    };
}

export const pixelXYtoTileXY = (pixelX:number, pixelY:number): {tileX: number, tileY:number} => {
    return {
        tileX: Math.floor(pixelX / 256),
        tileY: Math.floor(pixelY / 256)
    }
}

export const tileXYToPixelXY = (tileX:number, tileY:number) => {
    return {
        pixelX: tileX * 256,
        pixelY: tileY * 256
    }
}

export const tileXYToQuadKey = (tileX:number, tileY:number, levelOfDetail:number):string => {
    let quadKey = "";

    for (let i = levelOfDetail; i > 0; i-- ) {
        let digit = 0;
        let mask = 1 << (i - 1);

        if ((tileX & mask) !== 0) {
            digit++;
        }

        if ((tileY & mask) !== 0) {
            digit+=2;
        }

        quadKey = quadKey + digit.toString();
    }

    return quadKey;
}

export const quadKeyToTileXY = (quadKey:string): {tileX:number, tileY:number, levelOfDetail:number} => {
    let tileX = 0, tileY = 0;
    let levelOfDetail = quadKey.length;

    for (let i = levelOfDetail; i > 0; i--) {
        let mask = 1 << (i - 1);
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
        tileX,
        tileY,
        levelOfDetail
    }
}