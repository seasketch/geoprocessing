"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[77933],{86624:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>i,toc:()=>l});var r=s(74848),a=s(28453);const t={},o="Advanced Concepts",i={id:"concepts/AdvancedConcepts",title:"Advanced Concepts",description:"Sketching",source:"@site/docs/concepts/AdvancedConcepts.md",sourceDirName:"concepts",slug:"/concepts/AdvancedConcepts",permalink:"/geoprocessing/docs/next/concepts/AdvancedConcepts",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/concepts/AdvancedConcepts.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Skill Building",permalink:"/geoprocessing/docs/next/skills"},next:{title:"Upgrade Project",permalink:"/geoprocessing/docs/next/upgrade"}},c={},l=[{value:"Sketching",id:"sketching",level:2},{value:"Sketch",id:"sketch",level:3},{value:"Sketch Collection",id:"sketch-collection",level:3},{value:"Geographies",id:"geographies",level:2},{value:"Geography Properties",id:"geography-properties",level:3},{value:"Geography Switcher",id:"geography-switcher",level:3},{value:"Datasources",id:"datasources",level:2},{value:"Datasource Properties",id:"datasource-properties",level:3},{value:"External Datasources",id:"external-datasources",level:2},{value:"Internal Vector Datasource",id:"internal-vector-datasource",level:3},{value:"Internal Raster Datasource",id:"internal-raster-datasource",level:3},{value:"Metrics",id:"metrics",level:2},{value:"What can be measured?",id:"what-can-be-measured",level:3},{value:"Metric Group",id:"metric-group",level:3},{value:"Objectives",id:"objectives",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"advanced-concepts",children:"Advanced Concepts"})}),"\n",(0,r.jsx)(n.h2,{id:"sketching",children:"Sketching"}),"\n",(0,r.jsx)(n.p,{children:"The core SeaSketch platform allows users to create and collaborate on the design of areas or features. They are the main input to a geoprocessing project for processing and display of reports."}),"\n",(0,r.jsx)(n.h3,{id:"sketch",children:"Sketch"}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/interfaces/geoprocessing.Sketch.html",children:"Sketch"})," is a user-drawn feature, typically a Polygon, that can be shared, further altered or put into a Sketch Collection. A Sketch is an extension of a GeoJSON ",(0,r.jsx)(n.a,{href:"https://www.rfc-editor.org/rfc/rfc7946#section-3.2",children:"Feature"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/interfaces/geoprocessing.SketchProperties.html",children:"Sketch Properties"})," are defined for both Sketches and SketchCollections and include key properties allowing sketches to be created and organized within a planning tool."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"id"})," - the unique UUID of this sketch."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"name"})," - the user-provided name"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"sketchClassId"})," - defines what type of sketch it is depending on the ",(0,r.jsx)(n.a,{href:"https://docs.google.com/document/d/1i0baxgK8JEUjtU8mnzFiG5VB_gO8lmxCrAtJ5rltk30/edit?usp=sharing",children:"classification system"})," used (e.g. Marine Reserve, Marine Sanctuary, High Protection MPA, Full Protection MPA)."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"userAttributes"})," - one or more attributes that the user can define on creation, for example a list of allowed activities in this area."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"createdAt"})," - timestamp of original creation"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"updatedAt"})," - timestamp of last edit"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"isCollection"})," - whether or not the object is a sketch or a collection"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"An example of a Sketch is as follows:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "type": "Feature",\n  "properties": {\n    "name": "fsm-east-west",\n    "updatedAt": "2022-11-17T10:02:53.645Z",\n    "sketchClassId": "123abc",\n    "id": "abc123"\n  },\n  "geometry": {\n    "type": "Polygon",\n    "coordinates": [\n      [\n        [149.3793667126688, 7.033915089905491],\n        [167.1102326219892, 7.196404501212555],\n        [167.0449537138265, 7.671995147373664],\n        [149.3384476090506, 7.40755063883897],\n        [149.3793667126688, 7.033915089905491]\n      ]\n    ]\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["This is a sketch with unique ID ",(0,r.jsx)(n.code,{children:"abc123"})," called ",(0,r.jsx)(n.code,{children:"fsm-east-west"})," because it is a long thin polygon that stretches across the entire EEZ from east to west. You can paste this sketch snippet into ",(0,r.jsx)(n.a,{href:"https://geojson.io",children:"geojson.io"})," and view it."]}),"\n",(0,r.jsx)(n.h3,{id:"sketch-collection",children:"Sketch Collection"}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/interfaces/geoprocessing.SketchCollection.html",children:"Sketch Collection"})," is a collection of user-drawn Sketches. It can be used to represent a proposed group of areas. It is an extension of a GeoJSON ",(0,r.jsx)(n.a,{href:"https://www.rfc-editor.org/rfc/rfc7946#section-3.3",children:"FeatureCollection"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "id": 10924,\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "id": 10923,\n      "bbox": [137.42888, 8.6295395, 138.27959, 9.424693],\n      "type": "Feature",\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [\n          [\n            [137.428882987, 8.929802778],\n            [137.778280122, 8.959815644],\n            [138.127677257, 8.629539565],\n            [138.279589055, 8.77970155],\n            [137.89980956, 9.229818944],\n            [137.550412426, 9.424693174],\n            [137.428882987, 8.929802778]\n          ]\n        ]\n      },\n      "properties": {\n        "id": "10923",\n        "name": "small-west",\n        "createdAt": "2023-01-10T17:20:17.178528+00:00",\n        "updatedAt": "2023-01-10T17:20:36.678816+00:00",\n        "isCollection": false,\n        "sketchClassId": "104",\n        "userAttributes": [\n          {\n            "label": "Author(s)",\n            "value": "Tim Welch",\n            "exportId": "authors",\n            "fieldType": "TextArea"\n          },\n          {\n            "label": "Description",\n            "value": "Test sketch",\n            "exportId": "descriptionconsider_adding_a_ra",\n            "fieldType": "TextArea"\n          }\n        ]\n      }\n    }\n  ],\n  "properties": {\n    "id": "10924",\n    "name": "yes-contig-ssn",\n    "createdAt": "2023-01-10T17:20:33.668529+00:00",\n    "updatedAt": "2023-01-10T17:21:07.432889+00:00",\n    "description": null,\n    "isCollection": true,\n    "sketchClassId": "119",\n    "userAttributes": [\n      {\n        "label": "Description",\n        "value": "Test collection",\n        "exportId": "description",\n        "fieldType": "TextArea"\n      },\n      {\n        "label": "Author(s)",\n        "value": "Tim Welch",\n        "exportId": "authors",\n        "fieldType": "TextArea"\n      }\n    ]\n  }\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"geographies",children:"Geographies"}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.code,{children:"Geography"})," represents one or more geographic boundaries for the project, and is primarily used to define project planning boundaries and clip sketches and datasources against them during analysis, especially when calculating percentage of total area/value of a class of data, that is within a sketch/sketch collection."]}),"\n",(0,r.jsxs)(n.p,{children:["Geographies are contained in ",(0,r.jsx)(n.code,{children:"project/geographies.json"}),". You are not required to use the concept of Geographies, but support is built-in. A simple alternative for being able to calculate percent area/value is to pre-clip your datasources to your planning boundary, and manually pre-calculate the total area (the denominator). Then in your geoprocessing function you just need to calculate the area/value within your sketch/collection (numerator) and you can calculate your percentage."]}),"\n",(0,r.jsx)(n.p,{children:"The default Geography for a new blank project is the entire world. The default Geography for a new Ocean EEZ project is the EEZ boundary you chose at creation time."}),"\n",(0,r.jsx)(n.p,{children:"World geography:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "geographyId": "world",\n  "datasourceId": "world",\n  "display": "World",\n  "groups": ["default-boundary"],\n  "precalc": true\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"Example of EEZ geography using a global datasource:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n    "geographyId": "world",\n    "datasourceId": "world",\n    "display": "World",\n    "groups": [],\n    "precalc": false\n  },\n  {\n    "geographyId": "eez",\n    "datasourceId": "global-eez-mr-v12",\n    "display": "Samoan EEZ",\n    "propertyFilter": {\n      "property": "GEONAME",\n      "values": [\n        "Samoan Exclusive Economic Zone"\n      ]\n    },\n    "bboxFilter": [\n      -174.51139447157757,\n      -15.878383591829206,\n      -170.54265693017294,\n      -10.960825304544073\n    ],\n    "groups": [\n      "default-boundary"\n    ],\n    "precalc": true\n  }\n'})}),"\n",(0,r.jsxs)(n.p,{children:["Each ",(0,r.jsx)(n.code,{children:"Geography"})," points to a ",(0,r.jsx)(n.a,{href:"#datasources",children:"datasource"}),", which provides the polygon or multipolygon boundary for that Geography."]}),"\n",(0,r.jsx)(n.p,{children:"The way that Geographies are used in reporting is that sketches and datasources are clipped to these geographies, in order to produce metrics that are representative of that geographic boundary. Project code is geography-aware at multiple points including:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Preprocessing functions - clipping a sketch to one or more geographies up front, usually the project planning boundary."}),"\n",(0,r.jsx)(n.li,{children:"Geoprocessing functions - when sketches should be clipped to one or more geographies at runtime (common in multi-geography use case)"}),"\n",(0,r.jsx)(n.li,{children:"Precalc - to calculate overall metrics (total area, count, sum of value) within each geography for each datasource. These precalc metrics are used in the denominator when calculating a sketches % overlap with a given datasource within a given geography."}),"\n",(0,r.jsx)(n.li,{children:"Report clients - to retrieve precalculated metrics, allow the user to potentially switch between geographies, and to pass the current user-selected geography to the geoprocessing functions."}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"geography-properties",children:"Geography Properties"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"geographyId"})," (string) - unique ID of the geography"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"datasourceId"})," (string) - unique ID of the datasource containing Geography bondary"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"display"})," (string) - display name for the Geography. Can be used with GeographySwitcher to allow user to select a Geography."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"layerId"})," (string, optional) - unique ID of external layer for visualizing the Geography. Can be used with LayerSwitcher to send layer toggle event via iFrame."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"groups"})," (string[], optional) - allows geography to identify as a member of one or more ad-hoc groups. A default geography which identifies the planning boundary must be assigned to the ",(0,r.jsx)(n.code,{children:"default-boundary"})," group."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"precalc"})," (boolean) - whether or not datasources should be precalculated against this geography."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"propertyFilter"})," (object[], optional) - for vector datasources only, defines filter to constrain geography features, matches feature property having one or more specific values."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"property"})," (string) - name of vector feature property to use in filter"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"values"})," (string | number[]) - one or more values to match on to include features. For example you could match on one or more EEZ names, or one or more smaller planning boundaries."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"bboxFilter"})," ([number, number, number, number]) - constrain geography to only features within a bounding box"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"geography-switcher",children:"Geography Switcher"}),"\n",(0,r.jsxs)(n.p,{children:["By default, a report will only display results for one geography at a time if the geoprocessing functions are designed to only process one geography at a time. A ",(0,r.jsx)(n.code,{children:"GeographySwitcher"})," is typically used to provide the ability to switch geographies, which will run the geoprocessing functions with a different geography input."]}),"\n",(0,r.jsx)(n.p,{children:"You could write a geoprocessing function that processes all geographies in one run, you just have to take into consideration the processing time required to complete it."}),"\n",(0,r.jsx)(n.h2,{id:"datasources",children:"Datasources"}),"\n",(0,r.jsxs)(n.p,{children:["A datasource represents a spatial dataset, including what type it is, how to acces it, and optionally some key statistics for the whole dataset (count, sum, area). Datasources are a combination of ",(0,r.jsx)(n.code,{children:"vector"})," or ",(0,r.jsx)(n.code,{children:"raster"})," and ",(0,r.jsx)(n.code,{children:"internal"})," or ",(0,r.jsx)(n.code,{children:"external"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"datasource-properties",children:"Datasource Properties"}),"\n",(0,r.jsx)(n.p,{children:"Base:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"datasourceId"})," - unique string identifier for datasource."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"geo_type"})," - vector | raster"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/d633b20/packages/geoprocessing/src/types/datasource.ts#L11",children:"formats"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://flatgeobuf.org/",children:"fgb"})," - Flatgeobuf. Efficient file and network transfer size."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://geojson.org/",children:"json"})," - GeoJSON. Easy to use and human readable."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://github.com/seasketch/union-subdivided-polygons",children:"subdivided"})," - Subdivided polygons that can be unioned back together. Efficient file and network transfer size"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://www.cogeo.org/",children:"tif"})," - Cloud-optimized GeoTiff. Efficient network transfer size."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Vector:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"layerName"})," - name of layer within datasource to import, if format support multiple layers. Otherwise layername should match the ",(0,r.jsx)(n.code,{children:"src"})," dataset name, minus the extension (e.g. eez.shp has layerName of eez)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"classKeys"}),': names of properties that data classes will be created for (e.g. "reef_type" property with name of reef type feature represents.)']}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Raster:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"measurementType"})," - quantitative | categorical"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"band"})," - band number to import from source dataset"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"noDataValue"})," - value that if assigned to a raster cell, should not be counted as data."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"External:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"url"})," - url to access the datasource at"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Internal:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"src"})," - local file path to access the datasource at"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"external-datasources",children:"External Datasources"}),"\n",(0,r.jsxs)(n.p,{children:["External ",(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#ExternalVectorDatasource",children:"vector"})," and ",(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#ExternalRasterDatasource",children:"raster"})," datasources are published on the Internet, external to the geoprocessing project and its stack. This is commonly used for what are called ",(0,r.jsx)(n.code,{children:"global"})," datasets that any geoprocessing project can use."]}),"\n",(0,r.jsx)(n.p,{children:"Global datasets are published independently and available for use in each project. They include:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"eez_union_land"})," (version 3, based on EEZ version 11). This is the union of world country boundaries and Exclusive Economic Zones (EEZs) which are 200 nautical miles . This allows a polygon be clipped to the outer EEZ boundary without using the Marine Regions interpretation of the shoreline which can be very coarse - ",(0,r.jsx)(n.a,{href:"https://marineregions.org/downloads.php",children:"https://marineregions.org/downloads.php"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"osm_land"})," (latest snapshot at time of download). Derived from OpenStreetMap ways tagged with natural=coastline. Uses the OSMCoastline program to assembline a single contigous polygon dataset."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"internal-vector-datasource",children:"Internal Vector Datasource"}),"\n",(0,r.jsxs)(n.p,{children:["Internal ",(0,r.jsx)(n.a,{href:"https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#InternalVectorDatasource",children:"vector"})," datasource have a ",(0,r.jsx)(n.code,{children:"src"})," path as well as optional ",(0,r.jsx)(n.code,{children:"layerName"})," and ",(0,r.jsx)(n.code,{children:"classKeys"})," properties."]}),"\n",(0,r.jsxs)(n.p,{children:["This example is for an ",(0,r.jsx)(n.code,{children:"eez"})," boundary datasets, that is imported from the ",(0,r.jsx)(n.code,{children:"current-vector"})," geopackage with layerName ",(0,r.jsx)(n.code,{children:"eez_mr_osm"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "datasourceId": "eez",\n  "geo_type": "vector",\n  "formats": ["fgb"],\n  "layerName": "eez_mr_osm",\n  "classKeys": [],\n  "created": "2022-11-16T23:04:19.554Z",\n  "lastUpdated": "2023-01-19T03:00:30.544Z",\n  "src": "data/src/Analytics/current-vector.gpkg",\n  "propertiesToKeep": []\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"internal-raster-datasource",children:"Internal Raster Datasource"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "datasourceId": "depth_zone_photic",\n  "geo_type": "raster",\n  "formats": ["tif"],\n  "measurementType": "quantitative",\n  "band": 1,\n  "noDataValue": -3.3999999521443642e38,\n  "created": "2022-11-21T21:44:08.941Z",\n  "lastUpdated": "2023-01-19T03:00:39.518Z",\n  "src": " data/src/Data_Received/EmLab/offshore/inputs/features/photic_zone.tif"\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"metrics",children:"Metrics"}),"\n",(0,r.jsx)(n.p,{children:"Metrics are measurements, whether statistical, geometric, or something more qualitative."}),"\n",(0,r.jsxs)(n.p,{children:["In the geoprocessing framework a ",(0,r.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/Metric",children:"Metric"})," refers specifically to a single recorded ",(0,r.jsx)(n.code,{children:"value"}),", for one or more dimensions. A geoprocessing function might return an array with hundreds of ",(0,r.jsx)(n.code,{children:"Metric"})," values."]}),"\n",(0,r.jsx)(n.p,{children:"The following is an example of a single Metric object."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "metricId": "boundary-area",\n  "sketchId": "abc123",\n  "classId": "eez",\n  "groupId": null,\n  "geographyId": null,\n  "value": 75066893245.88089,\n  "extra": {\n    "sketchName": "fsm-east-west"\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["It's a metric measuring the area of boundaries for sketch ",(0,r.jsx)(n.code,{children:"abc123"}),", measuring an overlap of ",(0,r.jsx)(n.code,{children:"75066893245.88089 square meters"})," with the ",(0,r.jsx)(n.code,{children:"eez"})," boundary. There is no associated group or geography. The name of the sketch is additionally included for human readability."]}),"\n",(0,r.jsxs)(n.p,{children:["The base properties for a ",(0,r.jsx)(n.code,{children:"Metric"})," are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"metricId"})," - the unique id of the metric"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"value"})," - the numeric value of the measurement."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"extra"})," - additional properties that can be added as needed."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["A Metric has properties for one or more standard ",(0,r.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/d633b20/packages/geoprocessing/src/types/metrics.ts#L5",children:"dimensions"}),". These are used for ",(0,r.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Stratified_sampling",children:"stratifying"})," data. A ",(0,r.jsx)(n.code,{children:"null"})," value for an individual metric object property indicates the dimension does not apply."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"sketchId"})," - optional id of sketch this measurement is for."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"classId"})," - optional id of data class that this metric is for.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Example - boundary overlap metrics may be categorized by boundary type (e.g. eez, offshore, nearshore). This ID can often be used to represent informal geographic boundaries instead of formal ",(0,r.jsx)(n.code,{children:"Geographies"})," like with ",(0,r.jsx)(n.code,{children:"geographyId"})]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"groupId"})," - optional id of group that this metric is for. Groups are typically not defined by the datasource, but by the planning process.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Example - protections levels, where all of the sketches in a collection may be grouped by the protection level they achieve (low, high, full) and their metrics combined into an aggregate value for each level."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"geographyId"})," - optional id of a ",(0,r.jsx)(n.code,{children:"Geography"})," that this metric is for.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Example - you want to stratify by multiple jurisdictional boundaries (eez, nearshore, offshore) and you also want to stratify by multiple distinct environmental regions defined by natural clusterings of depth, species, seabottom, etc. (region 1, region 2, region 3). This allows you to answer for example how much does a sketch overlap with areas that are nearshore and environmental region 1? You can use classId for the jurisdictional boundaries and ",(0,r.jsx)(n.code,{children:"groupId"})," for the environmental regions."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"what-can-be-measured",children:"What can be measured?"}),"\n",(0,r.jsxs)(n.p,{children:["A number of metrics can be calculated by overlaying a sketch with a vector or raster datasource. See the ",(0,r.jsx)(n.a,{href:"/geoprocessing/docs/next/geoprocessing",children:"geoprocessing"})," guide for more information. Common ",(0,r.jsx)(n.code,{children:"metricIds"})," include:"]}),"\n",(0,r.jsx)(n.p,{children:"Vector:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"/** Area of vector features in square meters */\narea: number;\n/** Number of vector features */\ncount: number;\n"})}),"\n",(0,r.jsx)(n.p,{children:"Raster:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"/** Number of cells that are not nodata */\nvalid?: number;\n/** Number of nodata cells in raster */\ninvalid?: number;\n/** Total number of cells in raster, valid or invalid */\ncount?: number;\n/** Area of valid cells in raster in square meters */\narea?: number;\n/** Minimum value of valid cells in raster */\nmin?: Nullable<number>;\n/** Maximum value of any one valid cell in raster */\nmax?: Nullable<number>;\n/** Mean average value of valid cells in raster */\nmean?: Nullable<number>;\n/** Median average value of valid cells in raster */\nmedian?: Nullable<number>;\n/** Mode of valid cells in raster */\nmode?: Nullable<number>;\n/** Different between min and max value */\nrange?: Nullable<number>;\n/** Sum of all valid cennls in raster */\nsum?: number;\n/** Standard deviation of valid cells in raster */\nstd?: Nullable<number>;\n/** Statistical measurement of spread between values in raster */\nvariance?: Nullable<number>;\n**/\n"})}),"\n",(0,r.jsx)(n.h3,{id:"metric-group",children:"Metric Group"}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metricGroup.ts#L11",children:"MetricGroup"})," defines a specific type of metric for your project, with a base metric type, and one or more data classes. Think of it as a unifying configuration object, that pulls everything together."]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/dataclass.ts#L8",children:"DataClass"})," - represents a single class of data. It ties it to an underlying datasource, and holds attributes used for displaying the class in user interfaces."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The following is an example of a MetricGroup object containing an array of DataClass objects:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "metricId": "boundary-area",\n  "type": "areaOverlap",\n  "classes": [\n    {\n      "classId": "eez",\n      "display": "EEZ",\n      "datasourceId": "eez",\n      "objectiveId": "eez",\n      "layerId": "607b3caa11ccf2303daf87c5"\n    },\n    {\n      "classId": "offshore",\n      "display": "Offshore",\n      "datasourceId": "offshore",\n      "objectiveId": "offshore",\n      "layerId": "607b3caa11ccf2303daf87c7"\n    },\n    {\n      "classId": "contiguous",\n      "display": "Contiguous",\n      "datasourceId": "12_24_nm_boundary",\n      "objectiveId": "12_24_zone",\n      "layerId": "607b3caa11ccf2303daf87c9"\n    }\n  ]\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["This defines a ",(0,r.jsx)(n.code,{children:"boundaryAreaOverlap"})," metric of type ",(0,r.jsx)(n.code,{children:"areaOverlap"}),", which we define to represent the area of overlap between a sketch and a given boundary polygon or multipolygon. In this case 3 different boundaries are configured as data classes:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"eez - 0-200 nautical miles"}),"\n",(0,r.jsx)(n.li,{children:"offshore - typically 12-200 nautical miles"}),"\n",(0,r.jsx)(n.li,{children:"nearshore - typically 0-12 nautical miles, aka territorial sea boundary."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Each data class points to its own datasource. And you can assume each of those datasources contain a single polygon boundary. It's also acceptable to have a single datasource, with 3 different boundaries in it, and an attribute to differentiate them, which would become the ",(0,r.jsx)(n.code,{children:"classId"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Each data ",(0,r.jsx)(n.code,{children:"class"})," can be tied to its own planning ",(0,r.jsx)(n.code,{children:"objective"}),", and its own map ",(0,r.jsx)(n.code,{children:"layer"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"objectives",children:"Objectives"}),"\n",(0,r.jsxs)(n.p,{children:["Each planning ",(0,r.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/d633b202a855689655032bdb290e036f2733b33d/packages/geoprocessing/src/types/objective.ts",children:"objective"})," defines a target and 1 or more protection levels that count towards that target. The default protection level is ",(0,r.jsx)(n.code,{children:"Fully Protected Area"})," which means no activities are allowed. You can learn more about MPA ",(0,r.jsx)(n.a,{href:"https://docs.google.com/document/d/1i0baxgK8JEUjtU8mnzFiG5VB_gO8lmxCrAtJ5rltk30/edit?usp=sharing",children:"classification schemes"})]}),"\n",(0,r.jsx)(n.p,{children:"In the geoprocessing framework, objectives are structured as follows:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "objectiveId": "eez",\n  "shortDesc": "EEZ Objective",\n  "target": 0.2,\n  "countsToward": {\n    "Fully Protected Area": "yes"\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["This is an objective to target protection of at least ",(0,r.jsx)(n.code,{children:"20%"})," of the ",(0,r.jsx)(n.code,{children:"eez"})," boundary, which is defined as the shoreline out to 200 nautical miles. A proposed area must be classified as a ",(0,r.jsx)(n.code,{children:"Fully Protected Area"})," to count towards this objective."]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>i});var r=s(96540);const a={},t=r.createContext(a);function o(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);