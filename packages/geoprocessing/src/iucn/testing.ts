import { Sketch } from "../types/index.js";

export const genSketchWithActivities = (activities: string[]): Sketch => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {
      id: "615bbbe9aac8c8285d50db2d",
      name: "mpa-test",
      updatedAt: "2021-10-05T02:43:53.326Z",
      createdAt: "2021-10-05T02:43:53.326Z",
      sketchClassId: "615b59e1aac8c8285d50d9b8",
      isCollection: false,
      userAttributes: [
        {
          label: "Allowed Activities",
          fieldType: "ChoiceField",
          exportId: "ACTIVITIES",
          value: activities,
        },
      ],
    },
  };
};
