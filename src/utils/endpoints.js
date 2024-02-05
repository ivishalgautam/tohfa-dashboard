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
    attribute: {
      getAll: "/product-attributes",
      term: "/product-attribute-terms",
    },
  },
  categories: {
    getAll: "/categories",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
};
