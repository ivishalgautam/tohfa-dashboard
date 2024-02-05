export const getHeader = (headerType) => {
  let access_token;

  if (typeof window !== "undefined") {
    access_token = window.localStorage.getItem("token");
  }

  let header = {};

  switch (headerType) {
    case "json":
      header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token ? `${access_token}` : ""}`,
      };
      break;

    case "multipart":
      header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token ? `${access_token}` : ""}`,
        Accept: "application/json",
      };
      break;

    case "default":
      header = {
        "Content-Type": "application/json",
      };
      break;

    default:
      header = {
        "Content-Type": "application/json",
      };
  }

  return header;
};
