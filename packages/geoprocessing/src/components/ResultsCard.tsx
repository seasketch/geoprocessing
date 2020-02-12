import React, { useState, ReactNode } from "react";
import Card, { Props } from "./Card";
import { useFunction } from "../hooks/useFunction";

export interface ResultsCardProps<T> extends Props {
  functionName: string;
  children: (results: T) => ReactNode;
}


function ResultsCard<T>(props:ResultsCardProps<T>) {
  if (!props.functionName) {
    throw new Error("No function specified for ResultsCard");
  }
  const { task, loading, error } = useFunction(props.functionName);

  if (error) {
    return <Card title={props.title}>
      <h3>Error!</h3>
      <p>{error}</p>
    </Card>
  } else {
    return <Card title={props.title}>
      { loading || !task ? <>
        <p>loading...</p>
      </> : <>{props.children(task.data as T)}</>}
    </Card>
  }
}

export default ResultsCard;