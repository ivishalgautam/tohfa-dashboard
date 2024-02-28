export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },
  profile: "/users/me",
  products: {
    getAll: "/products",
    admin: "/products/admin/getAll",
    attribute: {
      getAll: "/product-attributes",
      term: "/product-attribute-terms",
    },
  },
  categories: {
    getAll: "/categories",
  },
  banners: {
    getAll: "/banners",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
};
