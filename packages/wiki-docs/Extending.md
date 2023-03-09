It is possible to extend the geoprocessing framework to meet your needs right in your project code space. Here are some common use cases.

# I need to do additional data preparation before `data:import`

Maybe you need to copy data in from over the Internet or write a script that transforms a dataset further before being ready to be imported.  Here's a couple of options that keeps your code to do this right in the `data` directory.

* Write a standalone Typescript script that [sorts a dataset](https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic-data-sort.ts).  Can be run from the root project directory with `npm run ts-node data/ous-demographic-data-sort.ts`
* Write a more complex Typescript script that uses Turf geoprocessing functions like [this proof of concept](https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic.ts) 

# I need to change the `data:import` scripts

Maybe you need to alter the parameters passed to gdal or ogr.  Many of the scripts that get run during data import are loaded from your projects `data/bin` directory.  You can alter these scripts to meet your needs.

[Example](https://github.com/seasketch/fsm-reports/tree/main/data/bin)

If you upgrade your geoprocessing library, the files in `data/bin` will get overwritten and you'll need to look at the git code changes and re-merge your changes manually.

# I need my own data import

If the escape hatches above aren't enough, it is possible to skip the use of `data:import` entirely.  Consider reserving this for datasource that you want to import directly into your but it won't be easy.

* Write your own script that pre-calculates keyStats
* Amend `project/projectClient.ts` to side-load your own custom datasource record and merge it with what is loaded from `datasources.json`
* You may The benefit of it is that it creates a datasource record in `project/datasources.json` which can then be referenced in `project/metrics.json`.  These are read in by the `ProjectClient` in `project/projectClient.ts`, which is used by your functions and UI clients.  To do this you can edit `projectClient.ts` to add your own custom datasources outside of the `datasources.json` file and merge them in.  It's up to you to pre-calculate the `keyStats`, and structure it properly if you still want to be able to run `data:publish`

# I need to extend the base types or code

Most things exported via the `client-core` and `client-ui` modules can be extended in `project-space`, whether it's UI components, base types/schemas, or utility functions.  Here are some examples to get you started.

* The [rbcs](https://github.com/seasketch/geoprocessing/tree/dev/packages/geoprocessing/src/rbcs) module is a great example of extending all of these to create things specific to use of the `regulation-based classification system`.
* The ClassTable component is an extension of the base[Table](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/Table.tsx) component, capable of displaying metrics for one or more classes of data.  And you can layer this multiple levels deep as the [SketchClassTable](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/SketchClassTable.tsx) component is an extension of the [ClassTable](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/ClassTable.tsx) component, capable of displaying metrics for all classes, for a SketchCollection with one or more sketches.
