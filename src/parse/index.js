import { Coordinates } from './coordinates';

export function parse(str) {
    let coordinates = new Coordinates(str);
    coordinates.parse();

    return {
        latitude: coordinates.latitude, 
        longitude: coordinates.longitude
    };
}