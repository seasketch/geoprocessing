Workplan

  * setup lerna so that you can have multiple linked packages
  * create @seasketch/geoprocessing so you have some basic utilities used in the examples
  * build out templates/ enough to create example
  * create cli utilies to construct example (@seasketch/geoprocessing or geoprocessing scripts...?)
    * x update dockerfile
    * x print next steps
    * create geoprocessing functions
      * x print next steps
      * x support non-interactive mode
      * x example-project reproduction script
    * verify lerna by running tests
      * x create some example sketches
      * x get a reasonable handler and test cases working
    * x make createExampleProject a built-in bin method
    * cleanup bin/ folder
    * x npx @seasketch/geoprocessing init
      * x test
      * x create:function
      * x create:client
      * x rename handlers -> functions across the board
    * x test cases for example-project creation
    * x data folder README.md
  * setup webpack/babel/rollup to build and deploy scripts using cdk
    * make basic metadata services
    * rollup into appropriate js files
    * deploy using cdk
    * determine how to do the same with gp functions, probably using a plugin to wrap handlers
  * add support for preprocessing scripts
  * get storybook running with example sketches and components
  * get full client build working
  * monitor json includes for file size issues
  * monitor bundle size
  * setup eslint
 


 NEW WAY OF COMPILING...


   * Assemble project function metadata into a manifest
   * Create metadata handler functions
     * and eventually results fetchers, websocket integration, logs, etc
   * Build handlers, wrapping them in outer functions
   * Run cdk, creating resources based on manifest




Next steps:

  * x Create dynamodb table
  * x link up dynamodb info to handlers
  * x deploy api gateway endpoints for functions
  * x deploy test events using examples [ can't :( ]
  * x see if it works...
  * x take a step back and make sure example edits are copied back
  * x make sure example creation works still
  * x try publishing and creating a project using the npm module :()
  * x automate npm install?
  * x get source on github
  * x incorporate markdown docs

Client
  * x Make example clients
  * x Get ResultCard stories working
    * x make useFunction work (in test mode)
    * x run storybook from `geoprocessing storybook`
  * x get examples running from examples/output
    * x create examples that include error, loading states
  * x create stories for ResultsCard
  * x Make report client init scripts
    * x Backport changes to example-project
    * x hook into createExampleProject
  * x Get the client working (project-side)
    * x make sure it matches interchange format
  * x Integrate client packaging with build process
  * x Deploy client with build
    * x Make sure cache headers are set properly and assets can be found from project manifest
  * x Make sure client init works, including in npm-based workflow
    * x doesn't build, likely due to App.tsx not being recognized by the ts loader
  * x Get the legacy client working again in SeaSketch, possibly using new apis

Big improvements
  * x De-dupe requests that apply to multiple ResultsCards
  * x Better loading indicators
  * x Make UI actually look nice
  * x Make sure caching results works... but how can it work when isolated in an iframe. Guess they have to be reused
  * Tests overall...
    * client
      * x useFunction
      * x useSketchProperties
      * x SketchAttributesCard?
      * x ResultsCard? --- I don't really want to get into testing this because it would require duplicating a lot of the setup that's in useFunction to test what is a very very simple component
    * lambda
      * x handlers - test behavior in all exceptional conditions -- worthwhile to set this up even though the testing needs are pretty simple right now.
      * eventually test storage of files, access control, rate limiting features
    * framework itself
      * add tests to build from init without lerna?
      * github actions
  * x Update rendering order of ResultsCard, using useFunction to set "loading" while loading the geoprocessingProject. There's no need to wait for this before rendering!
  * x Why aren't results being cached?!?!?!?!?!
  * x SketchAttributesCard -- done for now, but needs improvement
  * Data Sources
    * review api signature
    * how to handle points vs lines and polygons
    * support both union and non-union type datasets
    * fit into @seasketch/geoprocessing and decide on module boundaries
    * can you even run old examples?
    * review methodology of generation
    * review embedded-id vs boundary analysis methods of union tree generation
    * nested spatial indexes?
      * or just handle in data product generation phase?
    * unit tests
      * tree generation
      * union algorithm
      * data fetching
      * data caching
  * Redo ProtectedSeas
  * Preprocessing
  * Async executionModel
  * Documentation
    * MDX storybook component docs
    * Author documentation
      * getting started
      * api documentation
      * integrating with seasketch
    * Protocols and underlying systems
      * reference type definitions
  * Tabs
  * Rate limiting
  * Authorization
  * Container tasks
  * re-use iframes? this seems like a nice-to-have that would only decrease latency by 100ms or less. BUT has local caching implications...

"Linting"
  * stats on bundle sizes
  * stats on imported json or distributed geobuf files
  * performance benchmarking of functions


