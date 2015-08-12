# Australian daylight savings periods

This code scrapes the [Australian Bureau of Meteorology's information page on daylight savings](http://www.bom.gov.au/climate/averages/tables/dst_times.shtml)
and creates a computer readable dataset of historical daylight savings start and
end dates.

There are plenty of caveats that go with this data if you're using it for any
serious purpose. It doesn't even attempt to take account of all [edge cases and
anomalies](https://en.wikipedia.org/wiki/Time_in_Australia#Anomalies).

## Data

Start and end dates are output in ISO8601 format at UTC which is mildly annoying
for a human, but no trouble for computers.

Get [the data](https://morph.io/drzax/australian-daylight-savings) via morph.io.

## Improvements

Pull requests are most welcome. As noted by the BOM, this is in no sense an official
list of Australian DST periods, however it is the best source I've found.

Each state government has separate responsibility for implementing daylight savings
and as a result there doesn't appear to be a centralised source of historical timezone
data in Australia. If you can find a better source, [contact me](mailto:simon@elvery.net).

## Running

This is a scraper that runs on [Morph](https://morph.io). To get started [see the documentation](https://morph.io/documentation).
You can also run it locally if you have [Node.JS](https://nodejs.org/) installed
by cloning this repository.

```
git clone https://github.com/drzax/morph-australian-daylight-savings.git
cd morph-australian-daylight-savings
npm i
node scraper
```

This will deposit `data.sqlite` in the project root.
