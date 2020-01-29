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
    * npx @seasketch/geoprocessing init
      * test
      * create function
      * create report
      * create tab
      * rename handlers -> functions across the board
    * test cases for example-project creation
    * data folder README.md
  * setup webpack/babel/rollup to build and deploy scripts using cdk
  * add support for preprocessing scripts
  * get storybook running with example sketches and components
  * get full client build working
  * monitor json includes for file size issues
  * monitor bundle size
  * setup eslint
 