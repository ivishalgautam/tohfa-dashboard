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
import { endpoints } from "../../utils/endpoints";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";
import { BannerForm } from "../../components/Forms/Banner";

async function postBanner(data) {
  return http().post(endpoints.banners.getAll, data);
}

async function updateBanner(data) {
  return http().put(`${endpoints.banners.getAll}/${data.id}`, data);
}

async function deleteBanner(data) {
  return http().delete(`${endpoints.banners.getAll}/${data.id}`);
}

async function fetchBanners() {
  return http().get(endpoints.banners.getAll);
}

export default function Categories() {
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const [bannerId, setBannerId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchBanners,
    queryKey: ["banners"],
  });

  const createMutation = useMutation(postBanner, {
    onSuccess: () => {
      toast.success("New banner added.");
      queryClient.invalidateQueries("banners");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const updateMutation = useMutation(updateBanner, {
    onSuccess: () => {
      toast.success("Banner updated.");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteBanner, {
    onSuccess: () => {
      toast.success("Banner deleted.");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
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
    updateMutation.mutate({ ...data, id: bannerId });
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
        <Title text={"Banners"} />

        <Button
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create Banner
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setBannerId)}
          data={data?.map(({ id, type, name, image }) => ({
            id,
            type,
            name,
            image,
          }))}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <BannerForm
            type={type}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            closeModal={closeModal}
            bannerId={bannerId}
          />
        </Modal>
      )}
    </div>
  );
}
