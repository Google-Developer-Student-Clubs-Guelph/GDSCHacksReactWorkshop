import React from "react";

export default function Button(props) {
  return <button className="btn" onClick={(e) => props.onClick?.(e)}>{props.children}</button>;
}
