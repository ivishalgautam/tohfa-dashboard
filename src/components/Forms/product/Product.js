"use client";
import React, { useEffect, useState } from "react";
import Title from "../../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetchCategories } from "../../../hooks/useFetchCategories";
import Select from "react-select";
import Modal from "@/components/Modal";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PlusIcon from "@/components/icons/PlusIcon.js";
import VariantForm from "@/components/Forms/product/Variant";
import { useFetchAttributes } from "../../../hooks/useFetchAttributes.js";
import useLocalStorage from "@/hooks/useLocalStorage.js";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { AiOutlineDelete } from "react-icons/ai";

export function ProductForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  productId,
  filteredProducts,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const [isModal, setIsModal] = useState(false);
  const [pictures, setPictures] = useState([]);
  const { data: categories } = useFetchCategories();
  const [token] = useLocalStorage("token");

  const {
    data: attributes,
    isLoading,
    isError,
    error,
  } = useFetchAttributes(isModal);

  const productTypes = [
    { value: "personalized", label: "Personalized" },
    { value: "corporate", label: "Corporate" },
  ];

  const formattedCategories = categories?.map(({ id: value, name: label }) => ({
    value,
    label,
  }));

  const onSubmit = (data) => {
    console.log({ data });
    const payload = {
      title: data.name,
      description: data?.description,
      type: data?.product_type.value,
      moq: data?.moq,
      quantity:
        data.variants.length > 0
          ? data.variants
              .map((field) => parseInt(field.quantity, 10))
              .reduce((accu, curr) => accu + curr, 0)
          : data?.quantity,
      price: parseInt(data?.price, 10),
      discounted_price: parseInt(data?.discounted_price, 10),
      category_id: data?.category?.value,
      sku_id: data.variants.length > 0 ? "" : data?.sku_id,
      gst: data?.gst,
      hsn_code: data?.hsn_code,
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
      weight: data?.weight,
      variants: data?.variants,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(productId);
    }
    remove();
    reset();
  };

  const watchProductType = watch("product_type");
  const watchInputs = watch();
  console.log({ watchInputs });

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.products.getAll}/getById/${productId}`
        );

        data && setValue("name", data?.title);
        data &&
          setValue(
            "category",
            formattedCategories?.find((so) => so.value === data?.category_id)
          );
        data &&
          setValue(
            "product_type",
            productTypes?.find((so) => so.value === data?.type)
          );
        data && setValue("moq", data?.moq);
        data && setValue("price", data?.price);
        data && setValue("discounted_price", data?.discounted_price);
        data && setValue("description", data?.description);
      } catch (error) {
        console.error(error);
      }
    };

    if (
      productId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [productId, type]);

  const handleFileChange = async (event, inputName) => {
    try {
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!inputName) {
        setPictures([...pictures, ...response.data.path]);
      }

      setValue(inputName, response.data.path[0]);

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath, inputPath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`
      );
      toast.success(resp.message);
      setValue(inputPath, "");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
        <div className="space-y-4">
          {/* title */}
          <div className="">
            <Title
              text={
                type === "create"
                  ? "Create product"
                  : type === "view"
                  ? "Product details"
                  : type === "edit"
                  ? "Edit product"
                  : "Are you sure you want to delete"
              }
            />
          </div>

          {/* product info */}
          <div
            id="product-information"
            className="bg-white p-8 rounded-lg border-input shadow-lg space-y-4"
          >
            <Title text={"Product Information"} />
            <div className="grid grid-cols-3 gap-2">
              {/* product name */}
              <div>
                <Label htmlFor="name">Product name</Label>
                <Input
                  type="text"
                  disabled={type === "view" || type === "delete"}
                  placeholder="Product Name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>

              {/* category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  maxMenuHeight={230}
                  rules={{ required: "Please select category" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={formattedCategories}
                      placeholder="Status"
                      isDisabled={type === "view"}
                      className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={
                        typeof document !== "undefined" && document.body
                      }
                      menuPosition="absolute"
                    />
                  )}
                />

                {errors.category && (
                  <span className="text-red-600">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* product type */}
              <div>
                <Label htmlFor="product_type">Product type</Label>
                <Controller
                  control={control}
                  name="product_type"
                  maxMenuHeight={230}
                  rules={{ required: "Please select category" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={productTypes}
                      placeholder="Select type"
                      isDisabled={type === "view"}
                      className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={
                        typeof document !== "undefined" && document.body
                      }
                      menuPosition="absolute"
                    />
                  )}
                />

                {errors.product_type && (
                  <span className="text-red-600">
                    {errors.product_type.message}
                  </span>
                )}
              </div>

              {/* moq */}
              {watchProductType?.value === "corporate" && (
                <div>
                  <Label htmlFor="moq">Minimum order quantity</Label>
                  <Input
                    type="number"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Minimum order quantity"
                    {...register("moq", {
                      required: "Minimum order quantity is required!",
                    })}
                  />
                  {errors.moq && (
                    <span className="text-red-600">{errors.moq.message}</span>
                  )}
                </div>
              )}

              {/* product price */}
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  disabled={type === "view" || type === "delete"}
                  placeholder="Price"
                  {...register("price", {
                    required: "Price is required",
                  })}
                />
                {errors.price && (
                  <span className="text-red-600">{errors.price.message}</span>
                )}
              </div>

              {/* discounted price */}
              <div>
                <Label htmlFor="discounted_price">Discounted price</Label>
                <Input
                  type="number"
                  disabled={type === "view" || type === "delete"}
                  placeholder="Discounted price"
                  {...register("discounted_price", {
                    required: "Discounted price is required",
                  })}
                />
                {errors.discounted_price && (
                  <span className="text-red-600">
                    {errors.discounted_price.message}
                  </span>
                )}
              </div>

              {/* weight */}
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="text"
                  disabled={type === "view" || type === "delete"}
                  placeholder="Weight"
                  {...register("weight", {
                    required: "Weight is required",
                  })}
                />
                {errors.weight && (
                  <span className="text-red-600">{errors.weight.message}</span>
                )}
              </div>

              {/* gst */}
              <div>
                <Label htmlFor="gst">GST</Label>
                <Input
                  type="number"
                  disabled={type === "view" || type === "delete"}
                  placeholder="GST"
                  {...register("gst", {
                    required: "GST is required",
                  })}
                />
                {errors.gst && (
                  <span className="text-red-600">{errors.gst.message}</span>
                )}
              </div>

              {/* sku */}
              <div>
                <Label htmlFor="sku">SKU ID</Label>
                <Input
                  type="text"
                  disabled={type === "view" || type === "delete"}
                  placeholder="SKU"
                  {...register("sku_id", {
                    required: "SKU is required",
                  })}
                />
                {errors.sku && (
                  <span className="text-red-600">{errors.sku.message}</span>
                )}
              </div>

              {/* quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  disabled={type === "view" || type === "delete"}
                  placeholder="Quantity"
                  {...register("quantity", {
                    required: "Quantity is required",
                  })}
                />
                {errors.quantity && (
                  <span className="text-red-600">
                    {errors.quantity.message}
                  </span>
                )}
              </div>

              {/* description */}
              <div className="col-span-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  disabled={type === "view" || type === "delete"}
                />
                {errors.description && (
                  <span className="text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* product media */}
          <div
            id="product-media"
            className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2"
          >
            <div className="space-y-1">
              <Title text={"Product Media"} />
              <p className="text-gray-400 text-sm">
                Upload captivating images and videos to make your product stand
                out.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {getValues("picture") && (
                <div>
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    type="file"
                    id="picture"
                    multiple
                    {...register("picture", {
                      required: "Please selecct pictures",
                    })}
                  />
                  {errors.picture && (
                    <span className="text-red-600">
                      {errors.picture.message}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Recommended size (1000px*1248px)
            </p>
          </div>

          {/* inventory */}
          <div
            id="inventory"
            className="bg-white p-8 rounded-lg border-input shadow-lg"
          >
            <Title text={"Inventory"} />

            <div className="grid grid-cols-3 gap-2">
              {/* Quantity */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <div className="text-start">
                      <Label htmlFor="name">Quantity</Label>
                      <Input
                        type="number"
                        disabled={fields?.length > 0}
                        placeholder="Quantity"
                        {...register("quantity", {
                          required: "Quantity is required",
                        })}
                      />
                      {errors.quantity && (
                        <span className="text-red-600">
                          {errors.quantity.message}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  {fields?.length > 0 ? (
                    <TooltipContent>
                      <p className="text-center">
                        Since you have added variants, you can only edit this{" "}
                        <br /> field in the variant section below.
                      </p>
                    </TooltipContent>
                  ) : (
                    <></>
                  )}
                </Tooltip>
              </TooltipProvider>

              {/* sku_id */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <div className="text-start">
                      <Label htmlFor="name">SKU ID</Label>
                      <Input
                        type="text"
                        disabled={fields?.length > 0}
                        placeholder="SKU ID"
                        {...register("sku_id", {
                          required: "SKU ID is required",
                        })}
                      />
                      {errors.sku_id && (
                        <span className="text-red-600">
                          {errors.sku_id.message}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  {fields?.length > 0 ? (
                    <TooltipContent>
                      <p className="text-center">
                        Since you have added variants, you can only edit this{" "}
                        <br /> field in the variant section below.
                      </p>
                    </TooltipContent>
                  ) : (
                    <></>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* shipping and tax */}
          <div
            id="shipping-and-tax"
            className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2"
          >
            <Title text={"Shipping & Tax"} />
            <div className="grid grid-cols-3 gap-2">
              {/* weight */}
              <div>
                <Label htmlFor="weight">Shipment Weight</Label>
                <Input
                  type="text"
                  id="weight"
                  placeholder="Enter shipment weight"
                  {...register("weight", {
                    required: "Product weight is required",
                  })}
                />
                {errors.weight && (
                  <span className="text-red-600">{errors.weight.message}</span>
                )}
              </div>

              {/* hsn code */}
              <div>
                <Label htmlFor="hsn_code">HSN Code</Label>
                <Input
                  type="text"
                  id="hsn_code"
                  placeholder="Enter HSN code"
                  {...register("hsn_code", {
                    required: "Product HSN code is required",
                  })}
                />
                {errors.hsn_code && (
                  <span className="text-red-600">
                    {errors.hsn_code.message}
                  </span>
                )}
              </div>

              {/* gst */}
              <div>
                <Label htmlFor="gst">GST</Label>
                <Input
                  type="number"
                  id="gst"
                  placeholder="Enter GST"
                  {...register("gst", {
                    required: "Please enter GST",
                  })}
                />
                {errors.gst && (
                  <span className="text-red-600">{errors.gst.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* variants */}
          <div
            id="variants"
            className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2"
          >
            <Title text={"Variants"} />
            {fields?.length > 0 ? (
              <div className="">
                <table cellSpacing={20}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Variant</th>
                      <th>Price</th>
                      <th>Discounted Price</th>
                      <th>SKU ID</th>
                      <th>Quantity</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {getValues(`variants.${index}.image_path`) ? (
                            <div className="relative">
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white"
                                onClick={() =>
                                  deleteFile(
                                    getValues(`variants.${index}.image_path`),
                                    `variants.${index}.image_path`
                                  )
                                }
                              >
                                <AiOutlineDelete />
                              </button>
                              <Image
                                src={
                                  process.env.NEXT_PUBLIC_IMAGE_DOMAIN +
                                  "/" +
                                  getValues(`variants.${index}.image_path`)
                                }
                                width={80}
                                height={80}
                                className="w-full h-full object-cover object-center rounded-lg"
                                alt="variant image"
                              />
                            </div>
                          ) : (
                            <Input
                              {...register(`variants.${index}.image`)}
                              type="file"
                              placeholder="Name"
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  `variants.${index}.image_path`
                                )
                              }
                            />
                          )}
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.name`)}
                            disabled
                            type="text"
                            placeholder="Name"
                          />
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.price`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            placeholder="Price"
                          />
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.discounted_price`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            placeholder="Discounted Price"
                          />
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.sku_id`)}
                            type="text"
                            placeholder="SKU ID"
                          />
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            placeholder="Quantity"
                          />
                        </td>
                        <td>
                          <Input
                            {...register(`variants.${index}.weight`)}
                            type="text"
                            placeholder="Weight"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <></>
            )}
            <Button
              type="button"
              className="p-1 h-auto space-x-1 px-1.5"
              // variant="outline"
              onClick={() => setIsModal(true)}
            >
              <PlusIcon />
              <span>Add Variant</span>
            </Button>
          </div>

          {/* product seo */}
          <div className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2">
            <Title text={"Product SEO"} />
            <div className="grid grid-cols-1 gap-2">
              {/* meta title */}
              <div>
                <Label htmlFor={"meta_title"}>Title Tag</Label>
                <Input
                  type="text"
                  placeholder="Enter title tag"
                  {...register("meta_title", {
                    required: "Please enter title tag.",
                  })}
                />
                {errors.meta_title && (
                  <span className="text-red-600">
                    {errors.meta_title.message}
                  </span>
                )}
              </div>

              {/* meta descrition */}
              <div>
                <Label htmlFor={"meta_description"}>Meta Description Tag</Label>
                <Input
                  type="text"
                  placeholder="Enter meta description tag"
                  {...register("meta_description", {
                    required: "Please enter meta description tag.",
                  })}
                />
                {errors.meta_description && (
                  <span className="text-red-600">
                    {errors.meta_description.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* submit */}
          <div className="text-right">
            {type !== "view" && (
              <Button variant={type === "delete" ? "destructive" : "primary"}>
                {type === "create"
                  ? "Create"
                  : type === "edit"
                  ? "Update"
                  : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {isModal && (
        <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
          <VariantForm
            attributes={attributes}
            isLoading={isLoading}
            isError={isError}
            error={error}
            closeModal={() => setIsModal(false)}
            variantAppend={append}
            variantRemove={remove}
          />
        </Modal>
      )}
    </>
  );
}
