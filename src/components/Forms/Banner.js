"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalStorage";
import { isObject } from "@/utils/object";
import { AiOutlineDelete } from "react-icons/ai";
import Select from "react-select";

const typeOptions = [
  { value: "main", label: "Main" },
  { value: "featured", label: "Featured" },
  { value: "top-selling", label: "Top selling" },
];

export function BannerForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  bannerId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [token] = useLocalStorage("token");
  const [pictures, setPictures] = useState({ mobile: "", desktop: "" });

  const onSubmit = (data) => {
    const payload = {
      type: data?.type?.value,
      name: data.name,
      image: pictures,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(bannerId);
    }
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.banners.getAll}/${bannerId}`
        );

        data && setValue("name", data?.name);
        data &&
          setValue(
            "type",
            typeOptions.find((so) => so.value === data?.type)
          );
        data && setPictures(data?.image);
      } catch (error) {
        console.error(error);
      }
    };
    if (bannerId && (type === "edit" || type === "view" || type === "delete")) {
      fetchData();
    }
  }, [bannerId, type]);

  const handleFileChange = async (event, type) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
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

      type === "desktop"
        ? setPictures((prev) => ({ ...prev, desktop: response.data.path[0] }))
        : setPictures((prev) => ({ ...prev, mobile: response.data.path[0] }));

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath, type) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`
      );
      toast.success(resp?.message);

      type === "desktop"
        ? setPictures((prev) => ({ ...prev, desktop: "" }))
        : setPictures((prev) => ({ ...prev, mobile: "" }));
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error?.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create banner"
              : type === "view"
              ? "Banner details"
              : type === "edit"
              ? "Edit banner"
              : "Are you sure you want to delete"
          }
        />

        {/* name */}
        <div>
          <Input
            type="text"
            disabled={type === "view" || type === "delete"}
            // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Banner name"
            {...register("name", {
              required: "Banner name is required",
            })}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>

        {/* type */}
        <div>
          <Controller
            control={control}
            type="text"
            disabled={type === "view" || type === "delete"}
            // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Banner name"
            name="type"
            render={({ field }) => <Select {...field} options={typeOptions} />}
          />
        </div>

        {/* desktop banner */}
        {pictures?.desktop ? (
          <div className="relative w-full h-32">
            {type === "edit" || type === "create" ? (
              <button
                type="button"
                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                onClick={() => deleteFile(pictures.desktop, "desktop")}
              >
                <AiOutlineDelete />
              </button>
            ) : (
              <></>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pictures.desktop}`}
              fill
              objectFit="cover"
              objectPosition="center"
              className="rounded-lg"
              alt="category image"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="picture">Desktop</Label>
            <Input
              {...register("desktop_picture", {
                required: "Please select pictures",
              })}
              type="file"
              id="picture"
              multiple
              onChange={(e) => handleFileChange(e, "desktop")}
            />
            {errors.desktop_picture && (
              <span className="text-red-600">
                {errors.desktop_picture.message}
              </span>
            )}
          </div>
        )}

        {/* mobile banner */}
        {pictures?.mobile ? (
          <div className="relative w-full h-32">
            {type === "edit" || type === "create" ? (
              <button
                type="button"
                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                onClick={() => deleteFile(pictures.mobile, "mobile")}
              >
                <AiOutlineDelete />
              </button>
            ) : (
              <></>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pictures.mobile}`}
              fill
              objectFit="cover"
              objectPosition="center"
              className="rounded-lg"
              alt="category image"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="picture">Mobile</Label>
            <Input
              {...register("mobile_picture", {
                required: "Please select pictures",
              })}
              type="file"
              id="picture"
              multiple
              onChange={(e) => handleFileChange(e, "mobile")}
            />
            {errors.mobile_picture && (
              <span className="text-red-600">
                {errors.mobile_picture.message}
              </span>
            )}
          </div>
        )}

        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "default"}>
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
  );
}
