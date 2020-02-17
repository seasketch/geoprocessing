import React from 'react';
export interface Props {
    title?: string;
    children: React.ReactNode;
    style?: object;
}
declare const Card: ({ children, title, style }: Props) => JSX.Element;
export default Card;
