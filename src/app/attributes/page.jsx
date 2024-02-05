"use client";
import Modal from "@/components/Modal";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { AttributeForm } from "@/components/Forms/product/Attribute";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import Spinner from "@/components/Spinner";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";

const createAttribute = (data) => {
  return http().post(endpoints.products.attribute.getAll, data);
};

async function fetchAttributes() {
  return http().get(endpoints.products.attribute.getAll);
}

async function updateAttribute(data) {
  return http().put(`${endpoints.products.attribute.getAll}/${data.id}`, data);
}

async function deleteAttribute(data) {
  return http().delete(`${endpoints.products.attribute.getAll}/${data.id}`);
}

export default function Attributes() {
  const router = useRouter();
  const [type, setType] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const queryClient = useQueryClient();
  const [attributeId, setAttributeId] = useState(null);
  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchAttributes,
    queryKey: ["attributes"],
  });

  const createMutation = useMutation(createAttribute, {
    onSuccess: () => {
      toast.success("Attribute created");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: (error) => {
      console.error(error);
      if (isObject(error)) {
        toast.error(error.message);
      }
    },
  });

  const updateMutation = useMutation(updateAttribute, {
    onSuccess: () => {
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteAttribute, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
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
    updateMutation.mutate({ ...data, id: attributeId });
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
        <Title text={"Attributes"} />
        <Button
          variant="default"
          onClick={() => {
            setType("create");
            setIsModal(true);
          }}
        >
          Add Attributes
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns(setType, openModal, setAttributeId, router)}
          data={data?.map(({ id, name, slug }) => ({ id, name, slug }))}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <AttributeForm
            type={type}
            handleCreate={handleCreate}
            closeModal={closeModal}
            attributeId={attributeId}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
}
