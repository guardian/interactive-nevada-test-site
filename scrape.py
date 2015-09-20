#!/usr/bin/python
import sys, bs4, json

tests = []
for fn in sys.argv[1:]:
    soup = bs4.BeautifulSoup(open(fn))

    operation = soup.h1.text.strip()
    print >> sys.stderr, operation

    for tr in soup.find('table', class_='wikitable').find_all('tr')[1:]:
        # messes with bs4 .text
        for sortkey in tr.find_all(class_='sortkey'):
            sortkey.extract()

        tds = tr.find_all(['th', 'td'])
        if len(tds) == 12:
            name, datetime, timezone, location, elevation, delivery, purpose, device, yield_, fallout, refs, notes = tds
        else:
            name, datetime, timezone, location, elevation, delivery, device, yield_, fallout, refs, notes = tds

        try:
            lat, lng = location.find(class_='vcard').find(class_='geo').text.split(';')
        except AttributeError:
            print >> sys.stderr, 'Error', operation
            continue

        tests.append({
            'name': name.text.strip(),
            'datetime': datetime.text.strip(),
            'yield': yield_.text.strip(),
            'lat': float(lat),
            'lng': float(lng),
            'delivery': delivery.text.strip()
        })

print json.dumps(tests)
