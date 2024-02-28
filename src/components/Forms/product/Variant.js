import React, { useState } from "react";
import Title from "../../Title";
import { Label } from "@radix-ui/react-dropdown-menu";
import Select from "react-select";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function Variant({
  type,
  attributes,
  isLoading,
  isError,
  error,
  closeModal,
  variantAppend,
  variantRemove,
}) {
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedValues, setSelectedValues] = useState([[]]);
  const [selectedValuesSet, setSelectedValuesSet] = useState([new Set()]);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variant: [
        {
          name: "",
          value: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variant",
    rules: { maxLength: 2 },
  });

  const onSubmit = async (data) => {
    variantRemove();
    if (selectedValues && selectedValues.length > 0) {
      const flattenArr = selectedValues.flat();
      // console.log({ selectedOption });
      console.log({ selectedValues });

      const pairs = [];

      // Iterate over the first array's objects
      selectedValues[0].forEach((obj1) => {
        // Iterate over the rest of the arrays
        for (let i = 1; i < selectedValues.length; i++) {
          // Extract value and label properties and push them into pairs array
          selectedValues[i].forEach((obj2) => {
            variantAppend({
              attribute_ids: [obj1.value, obj2.value],
              slugs: [obj1.label, obj2.label],
              name: `${obj1.label} | ${obj2.label}`,
              price: 0,
              discounted_price: 0,
              sku_id: "",
              quantity: "",
              weight: "",
            });
          });
        }
      });
    }
    closeModal();
  };

  const addInputs = () => {
    if (fields.length === 2) return;
    append({
      name: "",
      value: "",
    });
  };

  function handleSelectChange(selected, index) {
    const updatedSelectedOptions = [...selectedOption];
    updatedSelectedOptions[index] = JSON.parse(selected.target.value);
    setSelectedOption(updatedSelectedOptions);
    setSelectedValues((prev) => {
      const newValue = [...prev];
      newValue[index] = [];
      return newValue;
    });
    setSelectedValuesSet((prev) => {
      const newValue = [...prev];
      newValue[index] = new Set();
      return newValue;
    });
  }

  function handleSelectValueChange(selected, index) {
    const updatedSelectedValues = [...selectedValues];
    updatedSelectedValues[index] = [
      ...(updatedSelectedValues?.[index] || []),
      JSON.parse(selected.target.value),
    ];
    const updatedSelectedValuesSet = [...selectedValuesSet];
    updatedSelectedValuesSet[index] = new Set([
      ...Array.from(updatedSelectedValuesSet[index] || []),
      JSON.parse(selected.target.value)?.value,
    ]);
    setSelectedValues(updatedSelectedValues);
    setSelectedValuesSet(updatedSelectedValuesSet);
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
      <div className="space-y-3">
        <Title text={"Add variants"} />
        <div>
          {fields.map((field, index) => (
            <div className="grid grid-cols-12 gap-4" key={field.id}>
              {/* option name */}
              <div className="col-span-3">
                <Label htmlFor={`variant.${index}.name`}>Option name</Label>
                <select
                  name={`variant.${index}.name`}
                  id={`variant.${index}.name`}
                  onChange={(selected) => handleSelectChange(selected, index)}
                >
                  {attributes?.map((attribute) => (
                    <option
                      key={attribute.value}
                      value={JSON.stringify(attribute)}
                    >
                      {attribute.label}
                    </option>
                  ))}
                </select>
                {errors.option_name && (
                  <span className="text-red-600">
                    {errors.option_name.message}
                  </span>
                )}
              </div>

              {/* option value */}
              <div className="col-span-8">
                <div className="border p-1 rounded-lg flex items-center justify-start flex-wrap">
                  <div className="flex items-center justify-start flex-wrap gap-1">
                    {selectedValues?.[index]?.map((selectedValue) => (
                      <span
                        key={selectedValue.value}
                        className="bg-primary p-1 px-2 text-sm text-white rounded-full"
                      >
                        {selectedValue.label}
                      </span>
                    ))}
                    <div>
                      <select
                        className="w-full"
                        name={`variant.${index}.value`}
                        id={`variant.${index}.value`}
                        onChange={(selected) =>
                          handleSelectValueChange(selected, index)
                        }
                        defaultValue={""}
                      >
                        <option value={""}>Select value</option>
                        {(selectedOption?.[index]
                          ? attributes?.find(
                              (item) =>
                                item.value === selectedOption?.[index]?.value
                            )?.terms ?? []
                          : []
                        ).map(
                          (elem) =>
                            !selectedValuesSet?.[index]?.has(elem.value) && (
                              <option
                                key={elem.value}
                                value={JSON.stringify(elem)}
                              >
                                {elem.label}
                              </option>
                            )
                        )}
                      </select>
                      {errors.option_value && (
                        <span className="text-red-600">
                          {errors.option_value.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center col-span-1 align-bottom">
                <div className="mt-auto mb-1">
                  <Button
                    variant="ghost"
                    className="p-3"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <FaRegTrashCan size={20} className="text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={addInputs}
            disabled={fields?.length === 2}
          >
            Append
          </Button>
          <div className="text-center">
            <Button variant="primary">Submit</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
