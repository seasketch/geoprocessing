# Updating A Datasource

When updating a datasource, you should try to take it all the way through the process of `import`, `precalc`, and `publish` so that there's no confusion about which step you are on. It's easy to leave things in an incomplete state and its not obvious when you pick it back up.

- Edit/update your data in data/src
- Run `npm run reimport:data`, choose your source datasource and choose to not publish right away. `data/dist` will now contain your updated datasource file(s).
- Run `npm run precalc:data`, choose the datasource to precalculate stats for.
- `npm test` to run your smoke tests which read data from `data/dist` and make sure the geoprocessing function results change as you would expect based on the data changes. Are you expecting result values to go up or down? Stay about or exactly the same? Try not to accept changes that you don't understand.
- Add additional sketches or features to your smoke tests as needed. Exporting sketches from SeaSketch as geojson and copying to `examples/sketches` is a great way to do this. Convince yourself the results are correct.
- Publish your updated datasets with `npm run publish:data`.
- Clear the cache for all reports that use this datasource with `npm run clear:results` and type the name of your geoprocessing function (e.g. `boundaryAreaOverlap`) or simply `all`. Cached results are cleared one record at a time in dynamodb so this can take quite a while. In fact, the process can run out of memory and suddenly die. In this case, you can simply rerun the clear command and it will continue. Eventually you will get through them all.
- Test your reports in SeaSketch. Any sketches you exported should produce the same numbers. Test with any really big sketches, make sure your data updates haven't reached any new limit. This can happen if your updated data is much larger, has more features, higher resolution, etc.
