import { IoStatsChartOutline } from "react-icons/io5";
import { AiOutlineShop } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";

// Define the roles for each user type
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const AllRoutes = [
  {
    label: "Dashboard",
    link: "/",
    icon: IoStatsChartOutline,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/edit/[id]",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Attributes",
    link: "/attributes",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Attributes",
    link: "/attributes/terms/create/[id]",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
];
