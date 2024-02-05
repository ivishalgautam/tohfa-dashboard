import { useEffect, createContext, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "react-hot-toast";
import { isObject } from "@/utils/object";

export const MainContext = createContext(null);

function Context({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchData() {
      await http()
        .get(endpoints.profile)
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          if (isObject(error)) {
            toast.error(error.message);
          } else {
            toast.error("Unauthorized Access");
          }
        });
    }
    fetchData();
  }, []);

  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export default Context;
