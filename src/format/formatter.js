
function getLatLngCoord(_lat, _lng, options) {

    var latlng = { lat: _lat, lng: _lng },
        lat,
        lng,
        deg,
        min;

    // 180 degrees & negative
    if (latlng.lng < 0) {
        latlng.lng_neg = true;
        latlng.lng = Math.abs(latlng.lng);
    }
    else {
        latlng.lng_neg = false;
    }

    if (latlng.lat < 0) {
        latlng.lat_neg = true;
        latlng.lat = Math.abs(latlng.lat);
    }
    else {
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
    }
    else if (options['format'] === 'DMS') {
        deg = parseInt(latlng.lng);
        min = (latlng.lng - deg) * 60;
        lng = deg + '&deg; ' + _format('00', parseInt(min)) + "' " + _format('00.0', (min - parseInt(min)) * 60) + "''";
        deg = parseInt(latlng.lat);
        min = (latlng.lat - deg) * 60;
        lat = deg + '&deg; ' + _format('00', parseInt(min)) + "' " + _format('00.0', (min - parseInt(min)) * 60) + "''";
    }
    else { // 'DD'
        lng = _format('#0.' + '0'.repeat(options['digits']), latlng.lng) + '&deg;';
        lat = _format('##0.' + '0'.repeat(options['digits']), latlng.lat) + '&deg;';
    }

    return {
        'lng': (!options['designators'] && latlng.lng_neg ? '-' : '') + lng + (options['designators'] ? (latlng.lng_neg ? ' W' : ' E') : ''),
        'lat': (!options['designators'] && latlng.lat_neg ? '-' : '') + lat + (options['designators'] ? (latlng.lat_neg ? ' S' : ' N') : '')
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
    var Decimal = (result && result[result.length - 1]) || '.'; //treat the right most symbol as decimal 
    var Group = (result && result[1] && result[0]) || ',';  //treat the left most symbol as group separator

    //split the decimal for the format string if any.
    var m = m.split(Decimal);
    //Fix the decimal first, toFixed will auto fill trailing zero.
    v = v.toFixed(m[1] && m[1].length);
    v = +(v) + ''; //convert number to string to trim off *all* trailing decimal zero(es)

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
        while (part[0].length < (m[0].length - pos_lead_zero)) {
            part[0] = '0' + part[0];
        }
    }
    else if (+part[0] === 0) {
        part[0] = '';
    }

    v = v.split('.');
    v[0] = part[0];

    //process the first group separator from decimal (.) only, the rest ignore.
    //get the length of the last slice of split result.
    var pos_separator = (szSep[1] && szSep[szSep.length - 1].length);
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

    v[1] = (m[1] && v[1]) ? Decimal + v[1] : "";
    return (isNegative ? '-' : '') + v[0] + v[1]; //put back any negation and combine integer and fraction.
}

const defaults = {
    //template: '{lat} | {lng}',
    'template': '{lat} {lng}',
    // https://en.wikipedia.org/wiki/ISO_6709
    'format': 'DD', // DD, DM, DMS
    'designators': true,
    'digits': 3
};

export function format(a, b, c) {
    let lat, lng, options;

    if (Array.isArray(a)) {
        lat = a[0];
        lng = a[1];
        options = b;
    }
    else if (typeof a === 'number') {
        lat = a;
        lng = b;
        options = c;
    }
    else if (typeof a === 'object') {
        lat = a['lat'];
        lng = 'lon' in a ? a['lon'] : a['lng'];
        options = b;
    }

    let settings = Object.assign({}, defaults, options);

    let latlng = getLatLngCoord(lat, lng, settings);
    return settings['template'].replace(/\{lat\}/g, latlng['lat']).replace(/\{lng\}/g, latlng['lng']);
}
