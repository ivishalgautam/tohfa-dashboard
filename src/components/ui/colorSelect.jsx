import React from "react";
import chroma from "chroma-js";

import Select, { StylesConfig } from "react-select";
import { colorOptions } from "../../data/product";

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    console.log({ data });
    const color = chroma(data?.value);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.value
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.value
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.value);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.value,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.value,
    ":hover": {
      backgroundColor: data.value,
      color: "white",
    },
  }),
};

export default function ColorSelect(props) {
  return (
    <Select
      {...props}
      closeMenuOnSelect={false}
      isMulti
      options={colorOptions.map((color) => ({
        value: color.hex,
        label: color.name,
      }))}
      styles={colourStyles}
    />
  );
}
