export declare const clip: (number: number, minValue: number, maxValue: number) => number;
export declare const mapSize: (levelOfDetail: number) => number;
export declare const groundResolution: (latitude: number, levelOfDetail: number) => number;
export declare const mapScale: (latitude: number, levelOfDetail: number, screenDpi: number) => number;
export declare const latLongToPixelXY: (latitude: number, longitude: number, levelOfDetail: number) => {
    pixelX: number;
    pixelY: number;
};
export declare const pixelXYtoLatLong: (pixelX: number, pixelY: number, levelOfDetail: number) => {
    latitude: number;
    longitude: number;
};
export declare const pixelXYtoTileXY: (pixelX: number, pixelY: number) => {
    tileX: number;
    tileY: number;
};
export declare const tileXYToPixelXY: (tileX: number, tileY: number) => {
    pixelX: number;
    pixelY: number;
};
export declare const tileXYToQuadKey: (tileX: number, tileY: number, levelOfDetail: number) => string;
export declare const quadKeyToTileXY: (quadKey: string) => {
    tileX: number;
    tileY: number;
    levelOfDetail: number;
};