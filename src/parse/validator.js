export class Validator {
  constructor() { }
  isValid(coordinates) {
    var error, isValid, validationError;
    isValid = true;
    try {
      this.validate(coordinates);
      return isValid;
    } catch (error) {
      validationError = error;
      isValid = false;
      return isValid;
    }
  }
  validate(coordinates) {
    this.checkContainsNoLetters(coordinates);
    this.checkValidOrientation(coordinates);
    return this.checkNumbers(coordinates);
  }
  checkContainsNoLetters(coordinates) {
    var containsLetters;
    containsLetters = /(?![neswd])[a-z]/i.test(coordinates);
    if (containsLetters) {
      throw new Error('Coordinate contains invalid alphanumeric characters.');
    }
  }
  checkValidOrientation(coordinates) {
    var validOrientation;
    validOrientation = /^[^nsew]*[ns]?[^nsew]*[ew]?[^nsew]*$/i.test(coordinates);
    if (!validOrientation) {
      throw new Error('Invalid cardinal direction.');
    }
  }
  checkNumbers(coordinates) {
    var coordinateNumbers;
    coordinateNumbers = coordinates.match(/-?\d+(\.\d+)?/g);
    this.checkAnyCoordinateNumbers(coordinateNumbers);
    this.checkEvenCoordinateNumbers(coordinateNumbers);
    return this.checkMaximumCoordinateNumbers(coordinateNumbers);
  }
  checkAnyCoordinateNumbers(coordinateNumbers) {
    if (coordinateNumbers.length === 0) {
      throw new Error('Could not find any coordinate number');
    }
  }
  checkEvenCoordinateNumbers(coordinateNumbers) {
    var isUnevenNumbers;
    isUnevenNumbers = coordinateNumbers.length % 2;
    if (isUnevenNumbers) {
      throw new Error('Uneven count of latitude/longitude numbers');
    }
  }
  checkMaximumCoordinateNumbers(coordinateNumbers) {
    if (coordinateNumbers.length > 6) {
      throw new Error('Too many coordinate numbers');
    }
  }
}