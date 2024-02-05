"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

export function AttributeTermForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  attributeId,
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
      slug: data.slug,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(attributeId);
    }
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.products.attribute.term}/getById/${attributeId}`
        );

        data && setValue("name", data?.name);
        data && setValue("slug", data?.slug);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      attributeId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [attributeId, type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create Attribute Term"
              : type === "view"
              ? "Attribute Term details"
              : type === "edit"
              ? "Edit Attribute Term"
              : "Are you sure you want to delete"
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              placeholder="Name"
              {...register("name", {
                required: "name is required",
              })}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              placeholder="Slug"
              {...register("slug", {
                required: "slug is required",
              })}
            />
            {errors.slug && (
              <span className="text-red-600">{errors.slug.message}</span>
            )}
          </div>
        </div>

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
  );
}
