import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

async function fetchAttributes() {
  const data = await http().get(endpoints.products.attribute.getAll);
  return data?.map((item) => {
    item.terms.length === 1 && Object.values(item.terms[0]).every(Boolean);
    return {
      value: item.id,
      label: item.name,
      terms: item.terms
        .map((ele) => {
          if (Object.values(ele).every((d) => d === null)) {
            return null;
          }
          return ele;
        })
        .filter(Boolean)
        .map(({ id: value, name: label }) => ({ value, label })),
    };
  });
}

export function useFetchAttributes(isModal) {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: fetchAttributes,
    enabled: !!isModal,
  });
}
