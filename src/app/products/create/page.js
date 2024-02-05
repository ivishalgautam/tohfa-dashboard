"use client";

import http from "@/utils/http";
import { ProductForm } from "../../../components/Forms/product/Product.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import Title from "@/components/Title";
import { useEffect, useState } from "react";

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

async function createProduct(data) {
  return http().post(endpoints.products.getAll, data);
}

export default function Create() {
  const [hash, setHash] = useState(
    typeof window !== "undefined" ? window.location.hash : null
  );
  const queryClient = useQueryClient();

  const createMutation = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created.");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    // Listen for hash changes
    typeof window !== "undefined" &&
      window.addEventListener("hashchange", handleHashChange);

    // Clean up the event listener when the component unmounts
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleCreate = async (data) => {
    createMutation.mutate(data);
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
        <ProductForm type="create" handleCreate={handleCreate} />
      </div>
    </div>
  );
}
