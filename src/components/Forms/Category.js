"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function CategoryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  categoryId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(categoryId);
    }
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.categories.getAll}/getById/${categoryId}`
        );

        data && setValue("name", data?.name);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      categoryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [categoryId, type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create category"
              : type === "view"
              ? "Category details"
              : type === "edit"
              ? "Edit category"
              : "Are you sure you want to delete"
          }
        />
        <div>
          <Input
            type="text"
            disabled={type === "view" || type === "delete"}
            // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Category Name"
            {...register("name", {
              required: "Category is required",
            })}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>

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
