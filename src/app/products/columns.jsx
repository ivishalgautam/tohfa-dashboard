"use client";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";

export const columns = (setType, openModal, setProductId, publishProduct) => [
  {
    accessorKey: "pictures",
    header: ({ column }) => {
      return <Button variant="ghost">Image</Button>;
    },
    cell: ({ row }) => {
      const image = row.original.pictures?.[0];
      return (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
          width={100}
          height={100}
          alt="image"
          className="rounded"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <Button variant="ghost">Price</Button>;
    },
  },
  {
    accessorKey: "discounted_price",
    header: ({ column }) => {
      return <Button variant="ghost">Discounted price</Button>;
    },
  },
  {
    accessorKey: "is_published",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const is_published = row.original.is_published;
      const id = row.original.id;
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={is_published}
            id="airplane-mode"
            onCheckedChange={() => publishProduct(id, !is_published)}
          />

          <span
            className={`${is_published ? "text-emerald-500" : "text-red-500"}`}
          >
            {is_published ? "Active" : "Hidden"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">Created At</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setProductId(id);
                setType("view");
                openModal();
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/products/edit/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setProductId(id);
                setType("delete");
                openModal();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
