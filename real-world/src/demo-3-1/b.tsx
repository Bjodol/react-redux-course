import { FC, ReactNode } from "react";
import { Article } from "../types";

type MyProps = {
  article: Article;
  text: string;
  isLight?: boolean;
};

export const MyReactComponent = (props: MyProps): ReactNode => {
  const { article } = props;
  return <div>{article.title}</div>;
};

export const MyReactShortHandComponent: FC<MyProps> = (props) => {
  return <div>{props.article.title}</div>;
};

export const MyButton: FC<
  JSX.IntrinsicElements["button"] & { label: string }
> = ({ label, ...rest }) => {
  return <button {...rest}>{label}</button>;
};
