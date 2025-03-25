import { parse } from '../src/index'
import { format } from '../src/index'

test('parse', () => {

    let str = '46.8523� N, 121.7603� W';
    let coordinates = parse(str);

    expect(coordinates).not.toEqual(null);
    expect(coordinates.latitude).toEqual(46.8523);
    expect(coordinates.longitude).toEqual(-121.7603);
});

test('format', () => {

    let str = format(46.8523, -121.7603);
    expect(str).toEqual("46.852&deg; N 121.760&deg; W");

    str = format([46.8523, -121.7603]);
    expect(str).toEqual("46.852&deg; N 121.760&deg; W");

    str = format({lat:46.8523, lon:-121.7603});
    expect(str).toEqual("46.852&deg; N 121.760&deg; W");
});