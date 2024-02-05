import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchProducts = async () => {
  return await http().get(endpoints.products.getAll);
};

export function useFetchProducts() {
  return useQuery(["products"], () => fetchProducts());
}
