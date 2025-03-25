(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LATLON = {}));
})(this, (function (exports) { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  function getLatLngCoord(_lat, _lng, options) {
    var latlng = {
        lat: _lat,
        lng: _lng
      },
      lat,
      lng,
      deg,
      min;

    // 180 degrees & negative
    if (latlng.lng < 0) {
      latlng.lng_neg = true;
      latlng.lng = Math.abs(latlng.lng);
    } else {
      latlng.lng_neg = false;
    }
    if (latlng.lat < 0) {
      latlng.lat_neg = true;
      latlng.lat = Math.abs(latlng.lat);
    } else {
      latlng.lat_neg = false;
    }
    if (latlng.lng > 180) {
      latlng.lng = 360 - latlng.lng;
      latlng.lng_neg = !latlng.lng_neg;
    }

    // format
    if (options['format'] === 'DM') {
      deg = parseInt(latlng.lng);
      lng = deg + '&deg; ' + _format('00.' + '0'.repeat(options['digits']), (latlng.lng - deg) * 60) + "'";
      deg = parseInt(latlng.lat);
      lat = deg + '&deg; ' + _format('00.' + '0'.repeat(options['digits']), (latlng.lat - deg) * 60) + "'";
    } else if (options['format'] === 'DMS') {
      deg = parseInt(latlng.lng);
      min = (latlng.lng - deg) * 60;
      lng = deg + '&deg; ' + _format('00', parseInt(min)) + "' " + _format('00.0', (min - parseInt(min)) * 60) + "''";
      deg = parseInt(latlng.lat);
      min = (latlng.lat - deg) * 60;
      lat = deg + '&deg; ' + _format('00', parseInt(min)) + "' " + _format('00.0', (min - parseInt(min)) * 60) + "''";
    } else {
      // 'DD'
      lng = _format('#0.' + '0'.repeat(options['digits']), latlng.lng) + '&deg;';
      lat = _format('##0.' + '0'.repeat(options['digits']), latlng.lat) + '&deg;';
    }
    return {
      'lng': (!options['designators'] && latlng.lng_neg ? '-' : '') + lng + (options['designators'] ? latlng.lng_neg ? ' W' : ' E' : ''),
      'lat': (!options['designators'] && latlng.lat_neg ? '-' : '') + lat + (options['designators'] ? latlng.lat_neg ? ' S' : ' N' : '')
    };
  }

  /**
      * @preserve IntegraXor Web SCADA - JavaScript Number Formatter
      * http://www.integraxor.com/
      * author: KPL, KHL
      * (c)2011 ecava
      * Dual licensed under the MIT or GPL Version 2 licenses.
      */
  ////////////////////////////////////////////////////////////////////////////////
  // param: Mask & Value
  ////////////////////////////////////////////////////////////////////////////////
  function _format(m, v) {
    if (!m || isNaN(+v)) {
      return v; //return as it is.
    }
    //convert any string to number according to formation sign.
    var v = m.charAt(0) === '-' ? -v : +v;
    var isNegative = v < 0 ? v = -v : 0; //process only abs(), and turn on flag.

    //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
    var result = m.match(/[^\d\-\+#]/g);
    var Decimal = result && result[result.length - 1] || '.'; //treat the right most symbol as decimal 
    var Group = result && result[1] && result[0] || ','; //treat the left most symbol as group separator

    //split the decimal for the format string if any.
    var m = m.split(Decimal);
    //Fix the decimal first, toFixed will auto fill trailing zero.
    v = v.toFixed(m[1] && m[1].length);
    v = +v + ''; //convert number to string to trim off *all* trailing decimal zero(es)

    //fill back any trailing zero according to format
    var pos_trail_zero = m[1] && m[1].lastIndexOf('0'); //look for last zero in format
    var part = v.split('.');
    //integer will get !part[1]
    if (!part[1] || part[1] && part[1].length <= pos_trail_zero) {
      v = (+v).toFixed(pos_trail_zero + 1);
    }
    var szSep = m[0].split(Group); //look for separator
    m[0] = szSep.join(''); //join back without separator for counting the pos of any leading 0.

    var pos_lead_zero = m[0] && m[0].indexOf('0');
    if (pos_lead_zero > -1) {
      while (part[0].length < m[0].length - pos_lead_zero) {
        part[0] = '0' + part[0];
      }
    } else if (+part[0] === 0) {
      part[0] = '';
    }
    v = v.split('.');
    v[0] = part[0];

    //process the first group separator from decimal (.) only, the rest ignore.
    //get the length of the last slice of split result.
    var pos_separator = szSep[1] && szSep[szSep.length - 1].length;
    if (pos_separator) {
      var integer = v[0];
      var str = '';
      var offset = integer.length % pos_separator;
      for (var i = 0, l = integer.length; i < l; i++) {
        str += integer.charAt(i); //ie6 only support charAt for sz.
        //-pos_separator so that won't trail separator on full length
        if (!((i - offset + 1) % pos_separator) && i < l - pos_separator) {
          str += Group;
        }
      }
      v[0] = str;
    }
    v[1] = m[1] && v[1] ? Decimal + v[1] : "";
    return (isNegative ? '-' : '') + v[0] + v[1]; //put back any negation and combine integer and fraction.
  }
  var defaults = {
    //template: '{lat} | {lng}',
    'template': '{lat} {lng}',
    // https://en.wikipedia.org/wiki/ISO_6709
    'format': 'DD',
    // DD, DM, DMS
    'designators': true,
    'digits': 3
  };
  function format(a, b, c) {
    var lat, lng, options;
    if (Array.isArray(a)) {
      lat = a[0];
      lng = a[1];
      options = b;
    } else if (typeof a === 'number') {
      lat = a;
      lng = b;
      options = c;
    } else if (_typeof(a) === 'object') {
      lat = a['lat'];
      lng = 'lon' in a ? a['lon'] : a['lng'];
      options = b;
    }
    var settings = Object.assign({}, defaults, options);
    var latlng = getLatLngCoord(lat, lng, settings);
    return settings['template'].replace(/\{lat\}/g, latlng['lat']).replace(/\{lng\}/g, latlng['lng']);
  }

  var CoordinateNumber = /*#__PURE__*/function () {
    function CoordinateNumber(coordinateNumbers) {
      _classCallCheck(this, CoordinateNumber);
      coordinateNumbers = this.normalizeCoordinateNumbers(coordinateNumbers);
      this.degrees = coordinateNumbers[0], this.minutes = coordinateNumbers[1], this.seconds = coordinateNumbers[2], this.milliseconds = coordinateNumbers[3];
      this.sign = this.normalizedSignOf(this.degrees);
      this.degrees = Math.abs(this.degrees);
    }
    return _createClass(CoordinateNumber, [{
      key: "normalizeCoordinateNumbers",
      value: function normalizeCoordinateNumbers(coordinateNumbers) {
        var currentNumber, i, j, len, normalizedNumbers;
        normalizedNumbers = [0, 0, 0, 0];
        for (i = j = 0, len = coordinateNumbers.length; j < len; i = ++j) {
          currentNumber = coordinateNumbers[i];
          normalizedNumbers[i] = parseFloat(currentNumber);
        }
        return normalizedNumbers;
      }
    }, {
      key: "normalizedSignOf",
      value: function normalizedSignOf(number) {
        if (number >= 0) {
          return 1;
        } else {
          return -1;
        }
      }
    }, {
      key: "detectSpecialFormats",
      value: function detectSpecialFormats() {
        if (this.degreesCanBeSpecial()) {
          if (this.degreesCanBeMilliseconds()) {
            return this.degreesAsMilliseconds();
          } else if (this.degreesCanBeDegreesMinutesAndSeconds()) {
            return this.degreesAsDegreesMinutesAndSeconds();
          } else if (this.degreesCanBeDegreesAndMinutes()) {
            return this.degreesAsDegreesAndMinutes();
          }
        }
      }
    }, {
      key: "degreesCanBeSpecial",
      value: function degreesCanBeSpecial() {
        var canBe;
        canBe = false;
        if (!this.minutes && !this.seconds) {
          canBe = true;
        }
        return canBe;
      }
    }, {
      key: "degreesCanBeMilliseconds",
      value: function degreesCanBeMilliseconds() {
        var canBe;
        if (this.degrees > 909090) {
          canBe = true;
        } else {
          canBe = false;
        }
        return canBe;
      }
    }, {
      key: "degreesAsMilliseconds",
      value: function degreesAsMilliseconds() {
        this.milliseconds = this.degrees;
        return this.degrees = 0;
      }
    }, {
      key: "degreesCanBeDegreesMinutesAndSeconds",
      value: function degreesCanBeDegreesMinutesAndSeconds() {
        var canBe;
        if (this.degrees > 9090) {
          canBe = true;
        } else {
          canBe = false;
        }
        return canBe;
      }
    }, {
      key: "degreesAsDegreesMinutesAndSeconds",
      value: function degreesAsDegreesMinutesAndSeconds() {
        var newDegrees;
        newDegrees = Math.floor(this.degrees / 10000);
        this.minutes = Math.floor((this.degrees - newDegrees * 10000) / 100);
        this.seconds = Math.floor(this.degrees - newDegrees * 10000 - this.minutes * 100);
        return this.degrees = newDegrees;
      }
    }, {
      key: "degreesCanBeDegreesAndMinutes",
      value: function degreesCanBeDegreesAndMinutes() {
        var canBe;
        if (this.degrees > 360) {
          canBe = true;
        } else {
          canBe = false;
        }
        return canBe;
      }
    }, {
      key: "degreesAsDegreesAndMinutes",
      value: function degreesAsDegreesAndMinutes() {
        var newDegrees;
        newDegrees = Math.floor(this.degrees / 100);
        this.minutes = this.degrees - newDegrees * 100;
        return this.degrees = newDegrees;
      }
    }, {
      key: "toDecimal",
      value: function toDecimal() {
        var decimalCoordinate;
        decimalCoordinate = this.sign * (this.degrees + this.minutes / 60 + this.seconds / 3600 + this.milliseconds / 3600000);
        return decimalCoordinate;
      }
    }]);
  }();

  var Validator = /*#__PURE__*/function () {
    function Validator() {
      _classCallCheck(this, Validator);
    }
    return _createClass(Validator, [{
      key: "isValid",
      value: function isValid(coordinates) {
        var isValid;
        isValid = true;
        try {
          this.validate(coordinates);
          return isValid;
        } catch (error) {
          isValid = false;
          return isValid;
        }
      }
    }, {
      key: "validate",
      value: function validate(coordinates) {
        this.checkContainsNoLetters(coordinates);
        this.checkValidOrientation(coordinates);
        return this.checkNumbers(coordinates);
      }
    }, {
      key: "checkContainsNoLetters",
      value: function checkContainsNoLetters(coordinates) {
        var containsLetters;
        containsLetters = /(?![neswd])[a-z]/i.test(coordinates);
        if (containsLetters) {
          throw new Error('Coordinate contains invalid alphanumeric characters.');
        }
      }
    }, {
      key: "checkValidOrientation",
      value: function checkValidOrientation(coordinates) {
        var validOrientation;
        validOrientation = /^[^nsew]*[ns]?[^nsew]*[ew]?[^nsew]*$/i.test(coordinates);
        if (!validOrientation) {
          throw new Error('Invalid cardinal direction.');
        }
      }
    }, {
      key: "checkNumbers",
      value: function checkNumbers(coordinates) {
        var coordinateNumbers;
        coordinateNumbers = coordinates.match(/-?\d+(\.\d+)?/g);
        this.checkAnyCoordinateNumbers(coordinateNumbers);
        this.checkEvenCoordinateNumbers(coordinateNumbers);
        return this.checkMaximumCoordinateNumbers(coordinateNumbers);
      }
    }, {
      key: "checkAnyCoordinateNumbers",
      value: function checkAnyCoordinateNumbers(coordinateNumbers) {
        if (coordinateNumbers.length === 0) {
          throw new Error('Could not find any coordinate number');
        }
      }
    }, {
      key: "checkEvenCoordinateNumbers",
      value: function checkEvenCoordinateNumbers(coordinateNumbers) {
        var isUnevenNumbers;
        isUnevenNumbers = coordinateNumbers.length % 2;
        if (isUnevenNumbers) {
          throw new Error('Uneven count of latitude/longitude numbers');
        }
      }
    }, {
      key: "checkMaximumCoordinateNumbers",
      value: function checkMaximumCoordinateNumbers(coordinateNumbers) {
        if (coordinateNumbers.length > 6) {
          throw new Error('Too many coordinate numbers');
        }
      }
    }]);
  }();

  var Coordinates = /*#__PURE__*/function () {
    function Coordinates(coordinateString) {
      _classCallCheck(this, Coordinates);
      this.coordinates = coordinateString;
      this.latitudeNumbers = null;
      this.longitudeNumbers = null;
      this.validate();
      this.parse();
    }
    return _createClass(Coordinates, [{
      key: "validate",
      value: function validate() {
        var validator;
        validator = new Validator();
        return validator.validate(this.coordinates);
      }
    }, {
      key: "parse",
      value: function parse() {
        this.groupCoordinateNumbers();
        this.latitude = this.extractLatitude();
        return this.longitude = this.extractLongitude();
      }
    }, {
      key: "groupCoordinateNumbers",
      value: function groupCoordinateNumbers() {
        var coordinateNumbers, numberCountEachCoordinate;
        coordinateNumbers = this.extractCoordinateNumbers(this.coordinates);
        numberCountEachCoordinate = coordinateNumbers.length / 2;
        this.latitudeNumbers = coordinateNumbers.slice(0, numberCountEachCoordinate);
        return this.longitudeNumbers = coordinateNumbers.slice(0 - numberCountEachCoordinate);
      }
    }, {
      key: "extractCoordinateNumbers",
      value: function extractCoordinateNumbers(coordinates) {
        return coordinates.match(/-?\d+(\.\d+)?/g);
      }
    }, {
      key: "extractLatitude",
      value: function extractLatitude() {
        var latitude;
        latitude = this.coordinateNumbersToDecimal(this.latitudeNumbers);
        if (this.latitudeIsNegative()) {
          latitude = latitude * -1;
        }
        return latitude;
      }
    }, {
      key: "extractLongitude",
      value: function extractLongitude() {
        var longitude;
        longitude = this.coordinateNumbersToDecimal(this.longitudeNumbers);
        if (this.longitudeIsNegative()) {
          longitude = longitude * -1;
        }
        return longitude;
      }
    }, {
      key: "coordinateNumbersToDecimal",
      value: function coordinateNumbersToDecimal(coordinateNumbers) {
        var coordinate, decimalCoordinate;
        coordinate = new CoordinateNumber(coordinateNumbers);
        coordinate.detectSpecialFormats();
        decimalCoordinate = coordinate.toDecimal();
        return decimalCoordinate;
      }
    }, {
      key: "latitudeIsNegative",
      value: function latitudeIsNegative() {
        var isNegative;
        isNegative = this.coordinates.match(/s/i);
        return isNegative;
      }
    }, {
      key: "longitudeIsNegative",
      value: function longitudeIsNegative() {
        var isNegative;
        isNegative = this.coordinates.match(/w/i);
        return isNegative;
      }
    }, {
      key: "getLatitude",
      value: function getLatitude() {
        return this.latitude;
      }
    }, {
      key: "getLongitude",
      value: function getLongitude() {
        return this.longitude;
      }
    }]);
  }();

  function parse(str) {
    var coordinates = new Coordinates(str);
    coordinates.parse();
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };
  }

  exports.format = format;
  exports.parse = parse;

}));
//# sourceMappingURL=latlon.js.map
