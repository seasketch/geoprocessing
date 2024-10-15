# DataClass

```ts
type DataClass: z.infer<typeof dataClassSchema>;
```

Represents a group of data classes.
Used to access the data, and calcualte metrics based on them.
This interface is murky but it supports a variety of scenarios:

- Vector dataset with one feature class
- Vector dataset with multiple feature class, each with their own file datasource, and possibly only one layerId to display them all
- Vector dataset with multiple feature classes, all in one file datasource, each class with its own layerId
- Raster with multiple feature classes represented by unique integer values that map to class names
