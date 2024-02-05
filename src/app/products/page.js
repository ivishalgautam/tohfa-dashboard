"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/Modal";
import { ProductForm } from "@/components/Forms/product/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";

async function updateProduct(data) {
  return http().put(`${endpoints.products.getAll}/${data.id}`, data);
}

async function deleteProduct(data) {
  return http().delete(`${endpoints.products.getAll}/${data.id}`);
}

export default function Products() {
  const [type, setType] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFetchProducts();
  const filteredProducts = data?.map(
    ({ id, title, type, price, discounted_price, created_at }) => ({
      id,
      title,
      type,
      price,
      discounted_price,
      created_at,
    })
  );

  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);
  }

  const updateMutation = useMutation(updateProduct, {
    onSuccess: () => {
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: productId });
  };
  const handleDelete = async (data) => {
    deleteMutation.mutate(data);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto bg-white p-10 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Products"} />
        <Button asChild>
          <Link href={"/products/create"}>Create</Link>
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns(setType, openModal, setProductId)}
          data={filteredProducts}
        />
      </div>

      {isModal && (
        <Modal onClose={closeModal} isOpen={isModal}>
          <ProductForm
            type={type}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            closeModal={closeModal}
            productId={productId}
            filteredProducts={filteredProducts}
          />
        </Modal>
      )}
    </div>
  );
}
