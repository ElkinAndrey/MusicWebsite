import React from "react";

const Select = ({ value, setValue, values }) => {
  if (!values?.length) return <></>;
  return (
    <div>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
