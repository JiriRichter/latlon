# Coordinate parsing and formating utility

This unfinished module provides basic formatting and parsing utility function for geographic coordinates.

## Parse

```
    let str = '46.8523° N, 121.7603° W';
    let coordinates = LATLON.parse(str);

    console.debug(coordinates.latitude); // 46.8523
    console.debug(coordinates.longitude); // -121.7603
```

## Format

```
    let str = LATLON.parse(46.8523, -121.7603);

    console.debug(str); // 46.852&deg; N 121.760&deg; W
```

```
    let str = LATLON.parse([46.8523, -121.7603]);

    console.debug(str); // 46.852&deg; N 121.760&deg; W
```

```
    let str = LATLON.parse({ lat: 46.8523, lon: -121.7603});

    console.debug(str); // 46.852&deg; N 121.760&deg; W
```