import React from "react";

const InputNumber = ({
  value,
  setValue,
  min = 0,
  max = 10,
  text = "",
  ...props
}) => {
  const add = () => {
    if (value + 1 <= max) setValue(value + 1);
  };
  const del = () => {
    if (value - 1 >= min) setValue(value - 1);
  };

  return (
    <div {...props}>
      <label>{text}</label>
      <button onClick={del}>{"<"}</button>
      <label>{value}</label>
      <button onClick={add}>{">"}</button>
    </div>
  );
};

export default InputNumber;
