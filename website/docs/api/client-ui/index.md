# client-ui

`client-ui` provides all of the core React UI components for geoprocessing
projects, including the building blocks for creating custom UI components
needed by a project. Run the `storybook` command to explore them
interactively.

## Index

### Classes

| Class | Description |
| ------ | ------ |
| [ReportError](classes/ReportError.md) | - |

### Interfaces

| Interface | Description |
| ------ | ------ |
| [AppProps](interfaces/AppProps.md) | - |
| [CardProps](interfaces/CardProps.md) | - |
| [CircleProps](interfaces/CircleProps.md) | - |
| [ClassTableColumnConfig](interfaces/ClassTableColumnConfig.md) | - |
| [ClassTableProps](interfaces/ClassTableProps.md) | - |
| [CollapseGroupProps](interfaces/CollapseGroupProps.md) | - |
| [CollapseProps](interfaces/CollapseProps.md) | - |
| [DataDownloadProps](interfaces/DataDownloadProps.md) | - |
| [DataDownloadToolbarProps](interfaces/DataDownloadToolbarProps.md) | - |
| [DataFormatters](interfaces/DataFormatters.md) | - |
| [DownloadOption](interfaces/DownloadOption.md) | - |
| [DropdownContainerProps](interfaces/DropdownContainerProps.md) | - |
| [DropdownProps](interfaces/DropdownProps.md) | Renders an element with a dropdown list |
| [ErrorStatusProps](interfaces/ErrorStatusProps.md) | - |
| [FilterSelect](interfaces/FilterSelect.md) | Custom table data filters that are only active when selected by the user |
| [FilterSelectOption](interfaces/FilterSelectOption.md) | Custom table data filter |
| [FilterSelectTableOptions](interfaces/FilterSelectTableOptions.md) | The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code. |
| [GeographySwitcherProps](interfaces/GeographySwitcherProps.md) | - |
| [GroupCircleProps](interfaces/GroupCircleProps.md) | - |
| [GroupCircleRowProps](interfaces/GroupCircleRowProps.md) | - |
| [GroupPillProps](interfaces/GroupPillProps.md) | - |
| [HorizontalStackedBarProps](interfaces/HorizontalStackedBarProps.md) | - |
| [IucnActivityRank](interfaces/IucnActivityRank.md) | - |
| [IucnLevelCircleProps](interfaces/IucnLevelCircleProps.md) | - |
| [IucnLevelCircleRowProps](interfaces/IucnLevelCircleRowProps.md) | - |
| [IucnLevelPillProps](interfaces/IucnLevelPillProps.md) | - |
| [KeySectionProps](interfaces/KeySectionProps.md) | - |
| [LabelProps](interfaces/LabelProps.md) | Array of Labels to be inserted into the waters diagram |
| [LegendProps](interfaces/LegendProps.md) | - |
| [ObjectiveStatusProps](interfaces/ObjectiveStatusProps.md) | - |
| [PillColumnProps](interfaces/PillColumnProps.md) | - |
| [PillProps](interfaces/PillProps.md) | - |
| [RbcsIconProps](interfaces/RbcsIconProps.md) | - |
| [RbcsLearnMoreProps](interfaces/RbcsLearnMoreProps.md) | - |
| [RbcsMpaClassPanelProps](interfaces/RbcsMpaClassPanelProps.md) | - |
| [RbcsMpaObjectiveStatusProps](interfaces/RbcsMpaObjectiveStatusProps.md) | - |
| [RbcsNetworkObjectiveProps](interfaces/RbcsNetworkObjectiveProps.md) | - |
| [RbcsPanelProps](interfaces/RbcsPanelProps.md) | - |
| [ReportChartFigureProps](interfaces/ReportChartFigureProps.md) | - |
| [ReportContextState](interfaces/ReportContextState.md) | - |
| [ReportPageProps](interfaces/ReportPageProps.md) | - |
| [ReportStoryLayoutProps](interfaces/ReportStoryLayoutProps.md) | - |
| [ResultsCardProps](interfaces/ResultsCardProps.md) | - |
| [Row](interfaces/Row.md) | - |
| [SegmentControlProps](interfaces/SegmentControlProps.md) | - |
| [SimpleButtonProbs](interfaces/SimpleButtonProbs.md) | - |
| [SketchAttributesCardProps](interfaces/SketchAttributesCardProps.md) | - |
| [SketchClassTableProps](interfaces/SketchClassTableProps.md) | - |
| [StatusProps](interfaces/StatusProps.md) | - |
| [StyledHorizontalStackedBarProps](interfaces/StyledHorizontalStackedBarProps.md) | - |
| [StyledLegendProps](interfaces/StyledLegendProps.md) | - |
| [StyledTwoColorPointyCircleProps](interfaces/StyledTwoColorPointyCircleProps.md) | - |
| [TableOptions](interfaces/TableOptions.md) | The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code. |
| [ToolbarCardProps](interfaces/ToolbarCardProps.md) | - |
| [ToolbarProps](interfaces/ToolbarProps.md) | - |
| [TooltipContainerProps](interfaces/TooltipContainerProps.md) | - |
| [TooltipProps](interfaces/TooltipProps.md) | Renders an element with a tooltip |
| [TwoColorPointyCircleProps](interfaces/TwoColorPointyCircleProps.md) | - |
| [VerticalSpacerProps](interfaces/VerticalSpacerProps.md) | - |

### Functions

| Function | Description |
| ------ | ------ |
| [App](functions/App.md) | - |
| [Card](functions/Card.md) | - |
| [CardDecorator](functions/CardDecorator.md) | Default decorator. Create additional building on StoryLayout for more sophisticated needs |
| [ChartLegend](functions/ChartLegend.md) | Horizontal stacked bar chart component |
| [CheckboxGroup](functions/CheckboxGroup.md) | Controlled checkbox group |
| [Circle](functions/Circle.md) | Circle with user-defined component inside |
| [ClassTable](functions/ClassTable.md) | Table displaying class metrics, one class per table row. Having more than one metric per class may yield unexpected results Returns 0 value in table when faced with a 'missing' metric instead of erroring Handles "class has no value" NaN situation (common when sketch doesn't overlap with a geography) by overwriting with 0 and adding information circle |
| [ClassTableStyled](functions/ClassTableStyled.md) | - |
| [Collapse](functions/Collapse.md) | - |
| [CollapseGroup](functions/CollapseGroup.md) | - |
| [createReportDecorator](functions/createReportDecorator.md) | Think of this as a ReportDecorator generator, that allows you to pass in context and override the default The only reason to use this instead of ReportDecorator directly is to pass context |
| [DataDownload](functions/DataDownload.md) | Dropdown menu for transforming data to CSV/JSON format and initiating a browser download Defaults to CSV and JSON, and filename will include sketch name from ReportContext (if available) and current timestamp |
| [DataDownloadToolbar](functions/DataDownloadToolbar.md) | Convenience component that creates a Toolbar with Header and DataDownload |
| [Dropdown](functions/Dropdown.md) | - |
| [DropdownContainer](functions/DropdownContainer.md) | - |
| [DropdownItem](functions/DropdownItem.md) | - |
| [DropdownTrigger](functions/DropdownTrigger.md) | - |
| [ErrorStatus](functions/ErrorStatus.md) | - |
| [EstimateLabel](functions/EstimateLabel.md) | - |
| [FilterSelectTable](functions/FilterSelectTable.md) | Table with customizable filter functions as CheckboxGroup that when selected filter the rows if the function return true. By default only 'some' filter function has to match for it to filter the row |
| [FilterSelectTableStyled](functions/FilterSelectTableStyled.md) | - |
| [finishTask](functions/finishTask.md) | Finishes task by hitting the remote cache, updating the hook with the task result and cleaning up |
| [GeographySwitcher](functions/GeographySwitcher.md) | - |
| [GreenPill](functions/GreenPill.md) | - |
| [GroupCircle](functions/GroupCircle.md) | Circle with user-defined group colors |
| [GroupCircleRow](functions/GroupCircleRow.md) | GroupCircle with layout for use in table row |
| [GroupPill](functions/GroupPill.md) | Pill with colors assigned to each group name |
| [HorizontalStackedBar](functions/HorizontalStackedBar.md) | Horizontal stacked bar chart component |
| [InfoStatus](functions/InfoStatus.md) | - |
| [IucnActivitiesCard](functions/IucnActivitiesCard.md) | - |
| [IucnDesignationTable](functions/IucnDesignationTable.md) | - |
| [IucnLevelCircle](functions/IucnLevelCircle.md) | - |
| [IucnLevelCircleRow](functions/IucnLevelCircleRow.md) | - |
| [IucnLevelPill](functions/IucnLevelPill.md) | - |
| [IucnMatrix](functions/IucnMatrix.md) | - |
| [KeySection](functions/KeySection.md) | - |
| [LanguageSwitcher](functions/LanguageSwitcher.md) | - |
| [LayerToggle](functions/LayerToggle.md) | - |
| [ObjectiveStatus](functions/ObjectiveStatus.md) | - |
| [Pill](functions/Pill.md) | - |
| [PillColumn](functions/PillColumn.md) | - |
| [PointyCircle](functions/PointyCircle.md) | Circle with pointy top right corner |
| [ProgressBar](functions/ProgressBar.md) | - |
| [ProgressBarWrapper](functions/ProgressBarWrapper.md) | - |
| [RbcsActivitiesCard](functions/RbcsActivitiesCard.md) | - |
| [RbcsIcon](functions/RbcsIcon.md) | - |
| [RbcsLearnMore](functions/RbcsLearnMore.md) | Describes RBCS and lists minimum level of protection required for each objective |
| [RbcsMpaClassPanel](functions/RbcsMpaClassPanel.md) | Sketch collection status panel for MPA regulation-based classification |
| [RbcsMpaObjectiveStatus](functions/RbcsMpaObjectiveStatus.md) | - |
| [RbcsNetworkObjectiveStatus](functions/RbcsNetworkObjectiveStatus.md) | Displays status toward meeting Network objective |
| [RbcsZoneClassPanel](functions/RbcsZoneClassPanel.md) | Single-sketch status panel for MPA regulation-based classification |
| [RbcsZoneRegIcon](functions/RbcsZoneRegIcon.md) | - |
| [ReportChartFigure](functions/ReportChartFigure.md) | Chart container styled with spacing for layout in report pages |
| [ReportDecorator](functions/ReportDecorator.md) | Decorator that renders a story into ReportStoryLayout. |
| [ReportPage](functions/ReportPage.md) | - |
| [ReportStoryLayout](functions/ReportStoryLayout.md) | Wraps a story to look and behave like a sketch report It also replicates much of the functionality of App.tx like setting text direction and loading ReportContext. The context value can be added to or overridden by passing a value prop Layout includes a language switcher (connected to the report context) and a report width selector The caller must wrap the story in a Translator component to provide translations |
| [ReportTableStyled](functions/ReportTableStyled.md) | - |
| [ReportTextDirection](functions/ReportTextDirection.md) | Controls text direction for report based on current language |
| [ResultsCard](functions/ResultsCard.md) | - |
| [runTask](functions/runTask.md) | Runs task by sending GET request to url with payload and optional flags Task can be aborted using caller-provided AbortSignal |
| [SegmentControl](functions/SegmentControl.md) | - |
| [SimpleButton](functions/SimpleButton.md) | A simple button component that accepts any text value so unicode can be used including emojis |
| [SimpleButtonStyled](functions/SimpleButtonStyled.md) | - |
| [Skeleton](functions/Skeleton.md) | - |
| [SketchAttributesCard](functions/SketchAttributesCard.md) | - |
| [SketchClassTable](functions/SketchClassTable.md) | Table displaying sketch class metrics, one table row per sketch |
| [SketchClassTableStyled](functions/SketchClassTableStyled.md) | Style component for SketchClassTable |
| [SmallReportTableStyled](functions/SmallReportTableStyled.md) | - |
| [StyledCircle](functions/StyledCircle.md) | Default style for Circle |
| [StyledPill](functions/StyledPill.md) | - |
| [StyledTwoColorPointyCircle](functions/StyledTwoColorPointyCircle.md) | - |
| [Table](functions/Table.md) | Table component suited to geoprocessing client reports. Builds on the `react-table` useTable hook and re-exports its interface, so reference those API docs to suit your needs. |
| [TableStyled](functions/TableStyled.md) | - |
| [Toolbar](functions/Toolbar.md) | - |
| [ToolbarCard](functions/ToolbarCard.md) | - |
| [ToolbarStyled](functions/ToolbarStyled.md) | - |
| [Tooltip](functions/Tooltip.md) | - |
| [TooltipContainer](functions/TooltipContainer.md) | - |
| [TooltipItem](functions/TooltipItem.md) | - |
| [TooltipTrigger](functions/TooltipTrigger.md) | - |
| [Translator](functions/Translator.md) | Loads translations asynchronously using dynamic import abd react-i18next will have translations eventually and update When language changes in context, the i18n instance will be updated and child components will update |
| [TwoColorPointyCircle](functions/TwoColorPointyCircle.md) | Two-color reg-based classification circle for collection index value |
| [useCheckboxes](functions/useCheckboxes.md) | Hook to maintain checkbox state |
| [useFunction](functions/useFunction.md) | Runs the given geoprocessing function for the current sketch, as defined by ReportContext During testing, useFunction will look for example output values in SketchContext.exampleOutputs |
| [useLanguage](functions/useLanguage.md) | Hook that returns current language from report context, and provides function to change the language Also include language text direction as third parameter |
| [useSketchProperties](functions/useSketchProperties.md) | - |
| [VerticalSpacer](functions/VerticalSpacer.md) | - |
| [WarningPill](functions/WarningPill.md) | - |
| [WatersDiagram](functions/WatersDiagram.md) | Serves up a translatable SVG image showing nautical boundaries |

### Type Aliases

| Type alias | Description |
| ------ | ------ |
| [Block](type-aliases/Block.md) | Single rectangle block value representing length |
| [BlockGroup](type-aliases/BlockGroup.md) | Group of blocks with the same color |
| [Column](type-aliases/Column.md) | - |
| [HorizontalStackedBarRow](type-aliases/HorizontalStackedBarRow.md) | One or more BlockGroups forming a single linear stacked row |
| [RbcsMpaObjectiveRenderMsgFunction](type-aliases/RbcsMpaObjectiveRenderMsgFunction.md) | - |
| [RbcsNetworkObjectiveRenderMsgFunction](type-aliases/RbcsNetworkObjectiveRenderMsgFunction.md) | - |
| [RowConfig](type-aliases/RowConfig.md) | - |
| [StringOrNumber](type-aliases/StringOrNumber.md) | - |
| [SUPPORTED\_FORMAT](type-aliases/SUPPORTED_FORMAT.md) | - |
| [TargetFormatter](type-aliases/TargetFormatter.md) | Function that given target value for current table row, the table row index, and total number of table rows, returns a function that given target value returns a formatted string or Element. In other words a function that handles the formatting based on where the row is in the table and returns a function handling the remaining formatting. |

## References

### defaultReportContext

Re-exports [defaultReportContext](../geoprocessing/variables/defaultReportContext.md)

***

### PartialReportContextValue

Re-exports [PartialReportContextValue](../geoprocessing/type-aliases/PartialReportContextValue.md)

***

### ReportContext

Re-exports [ReportContext](../geoprocessing/variables/ReportContext.md)

***

### ReportContextValue

Re-exports [ReportContextValue](../geoprocessing/interfaces/ReportContextValue.md)

***

### sampleSketchReportContextValue

Re-exports [sampleSketchReportContextValue](../geoprocessing/functions/sampleSketchReportContextValue.md)

***

### TestExampleOutput

Re-exports [TestExampleOutput](../geoprocessing/interfaces/TestExampleOutput.md)
