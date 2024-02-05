"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CategoryForm } from "@/components/Forms/Category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

async function postCategory(data) {
  return http().post(endpoints.categories.getAll, data);
}

async function updateCategory(data) {
  return http().put(`${endpoints.categories.getAll}/${data.id}`, data);
}

async function deleteCategory(data) {
  return http().delete(`${endpoints.categories.getAll}/${data.id}`);
}

async function fetchCategories() {
  return http().get(endpoints.categories.getAll);
}

export default function Categories() {
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchCategories,
    queryKey: ["categories"],
  });

  const createMutation = useMutation(postCategory, {
    onSuccess: () => {
      toast.success("New category added.");
      queryClient.invalidateQueries("categories");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const updateMutation = useMutation(updateCategory, {
    onSuccess: () => {
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: categoryId });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Categories"} />

        <Button
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create Category
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setCategoryId)}
          data={data?.map(({ id, name }) => ({ id, name }))}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <CategoryForm
            type={type}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            closeModal={closeModal}
            categoryId={categoryId}
          />
        </Modal>
      )}
    </div>
  );
}
