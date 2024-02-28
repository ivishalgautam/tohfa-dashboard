"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFetchProducts } from "../../../../hooks/useFetchProducts.js";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Modal from "@/components/Modal";
import { ProductForm } from "@/components/Forms/product/Product";
import http from "@/utils/http";
import { endpoints } from "../../../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";

export const quickNavigation = [
  {
    title: "Product Information",
    link: "#product-information",
  },
  {
    title: "Product Media",
    link: "#product-media",
  },
  {
    title: "Inventory",
    link: "#inventory",
  },
  {
    title: "Shipping & Tax",
    link: "#shipping-and-tax",
  },
  {
    title: "Variants",
    link: "#variants",
  },
];

async function updateProduct(data) {
  return http().put(`${endpoints.products.getAll}/${data.id}`, data);
}

export default function Update({ params: { id } }) {
  const [hash, setHash] = useState(
    typeof window !== "undefined" ? window.location.hash : null
  );
  const [isModal, setIsModal] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFetchProducts();
  const filteredProducts = data?.map(
    ({
      id,
      title,
      type,
      price,
      discounted_price,
      pictures,
      is_published,
      created_at,
    }) => ({
      id,
      title,
      type,
      price,
      discounted_price,
      pictures,
      is_published,
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
      toast.success("Product updated.");
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
    updateMutation.mutate({ ...data, id: id });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <div className="bg-white p-8 rounded-lg shadow-lg sticky top-0">
          <Title text={"Quick navigation"} />
          <ul className="mt-3">
            {quickNavigation.map((item, key) => (
              <li key={key} className={`${key !== 0 && "border-t"} py-2`}>
                <a
                  href={item.link}
                  className={hash === item.link ? "text-primary" : null}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container col-span-3 mx-auto space-y-4 overflow-y-auto pb-10">
        <ProductForm
          type="edit"
          handleUpdate={handleUpdate}
          filteredProducts={filteredProducts}
          productId={id}
        />
      </div>
    </div>
  );
}
