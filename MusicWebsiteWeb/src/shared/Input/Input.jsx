import React from "react";

const Input = ({ value, setValue, text = "", ...props }) => {
  return (
    <div>
      <label>{text}</label>
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Input;
