# Precalc Data

Work in progress

Precalc is all about calculating expensive spatial metrics ahead of time.

- `precalc:data` will start a web server on localhost port 8001 that serve up data from `data/dist`.
- Precalc will see the two datasources you selected and that they have `precalc: true`. It will also see the one geography `eez` that is defined in geographies.json that has `precalc: true`. It will then calculate `area`, `sum`, and `count` metrics for each datasource, in combination with each geography.
- `project/precalc.json` will be updated with the new values.

Tips for precalculation:

- You have to re-run `precalc:data` every time you change a geography or datasource.
- Set `precalc:false` for datasources that are not currently used, or are only used to define a geography (not displayed in reports). This is why the datasource for the default geography for a project is always set by default to `precalc: false`.
- If you are using one of the [global-datasources](https://github.com/seasketch/global-datasources) in your project, and you want to use it in reporting % sketch overlap, so you've set `precalc:true`, strongly consider defining a `bboxFilter`. This will ensure that precalc doesn't have to fetch the entire datasource when precalculating a metric, which can be over 1 Gigabyte in size. Also consider setting a `propertyFilter` to narrow down to just the features you need. This filter is applied on the client-side so it won't reduce the number of features you are sending over the wire.

#### Precalc Data Cleanup

If you remove a geography/datasource, then in order to remove their precalculated metrics from `precalc.json`, you will need to run the cleanup command.

```bash
npm run precalc:data:cleanup
```
