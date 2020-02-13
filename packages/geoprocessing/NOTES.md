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
  * Make example clients
  * Get ResultCard stories working
    * make useFunction work (in test mode)
    * run storybook from `geoprocessing storybook`
  * get examples running from examples/output
    * create examples that include error, loading states
  * create stories for ResultsCard
  * Make report client init scripts
  * Create unit tests for client hooks and such?
  * Get the client working (project-side)
    * make sure it matches interchange format
  * Get the legacy client working again in SeaSketch, possibly using new apis

Big improvements
  * Documentation
  * Tabs
  * Data Sources
  * Preprocessing
  * Make UI actually look nice
  * Better integration with seasketch admin interface
  * Async executionModel
  * 

"Linting"
  * stats on bundle sizes
  * stats on imported json or distributed geobuf files
  * performance benchmarking of functions
  * 


