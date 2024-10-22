# Advanced storybook usage

There are multiple ways to introduce state into your stories. Many components draw their state from the ReportContext, which contains a lot of the information passed to the app on startup from seasketch.

There are 3 common methods for creating a story with context. All of these methods are built on `ReportStoryLayout`.

ReportStoryLayout is a component used by storybook that wraps your story in the things that the top-level App component would provide including setting report context, changing language, changing text direction, as well as offering dropdown menus for changing the language and the report width for different device sizes.

1. ReportDecorator - decorator that wraps story in ReportStoryLayout and otherwise uses default context value. A good starting point because it's simple. (see Card.stories.tsx). Language translation will work in the story with this method.
2. If you want to override the context in your stories use `createReportDecorator()` - decorator generator that wraps story in ReportStoryLayout and lets you override report context. Because a decorator can only be specified for the whole file, you should only use this if you want all stories in the file to be overidden with the same context. (see SegmentControl.stories.tsx). But you can split them up into multiple story files. Language translation will work in the story with this method.
3. For optimal control can use the ReportCardDecorator in combindation with `sampleSketchReportContextValue()` to set the context per story (see LayerToggle.stories.tsx). Language translation will not work with the story in this method.
