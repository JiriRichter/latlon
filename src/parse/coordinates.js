import { CoordinateNumber } from './coordinate-number';
import { Validator } from './validator';

export class Coordinates {
  constructor(coordinateString) {
    this.coordinates = coordinateString;
    this.latitudeNumbers = null;
    this.longitudeNumbers = null;
    this.validate();
    this.parse();
  }
  validate() {
    var validator;
    validator = new Validator;
    return validator.validate(this.coordinates);
  }
  parse() {
    this.groupCoordinateNumbers();
    this.latitude = this.extractLatitude();
    return this.longitude = this.extractLongitude();
  }
  groupCoordinateNumbers() {
    var coordinateNumbers, numberCountEachCoordinate;
    coordinateNumbers = this.extractCoordinateNumbers(this.coordinates);
    numberCountEachCoordinate = coordinateNumbers.length / 2;
    this.latitudeNumbers = coordinateNumbers.slice(0, numberCountEachCoordinate);
    return this.longitudeNumbers = coordinateNumbers.slice(0 - numberCountEachCoordinate);
  }
  extractCoordinateNumbers(coordinates) {
    return coordinates.match(/-?\d+(\.\d+)?/g);
  }
  extractLatitude() {
    var latitude;
    latitude = this.coordinateNumbersToDecimal(this.latitudeNumbers);
    if (this.latitudeIsNegative()) {
      latitude = latitude * -1;
    }
    return latitude;
  }
  extractLongitude() {
    var longitude;
    longitude = this.coordinateNumbersToDecimal(this.longitudeNumbers);
    if (this.longitudeIsNegative()) {
      longitude = longitude * -1;
    }
    return longitude;
  }
  coordinateNumbersToDecimal(coordinateNumbers) {
    var coordinate, decimalCoordinate;
    coordinate = new CoordinateNumber(coordinateNumbers);
    coordinate.detectSpecialFormats();
    decimalCoordinate = coordinate.toDecimal();
    return decimalCoordinate;
  }
  latitudeIsNegative() {
    var isNegative;
    isNegative = this.coordinates.match(/s/i);
    return isNegative;
  }
  longitudeIsNegative() {
    var isNegative;
    isNegative = this.coordinates.match(/w/i);
    return isNegative;
  }
  getLatitude() {
    return this.latitude;
  }
  getLongitude() {
    return this.longitude;
  }
}