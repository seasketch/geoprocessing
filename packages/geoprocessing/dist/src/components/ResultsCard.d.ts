import { ReactNode } from "react";
import { Props } from "./Card";
export interface ResultsCardProps<T> extends Props {
    functionName: string;
    children: (results: T) => ReactNode;
}
declare function ResultsCard<T>(props: ResultsCardProps<T>): JSX.Element;
export default ResultsCard;
