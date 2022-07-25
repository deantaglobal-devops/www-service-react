import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function DownloadAttachment() {
  const [searchParams] = useSearchParams();
  const userId = 4169;

  useEffect(() => {
    handleDownloadFile();
  }, []);

  const handleDownloadFile = async () => {
    const token = await fetch(
      `${import.meta.env.VITE_URL_API_SERVICE}/token/author/create`,
      {
        method: "POST",
        body: JSON.stringify({ userId }),
      },
    )
      .then((res) => res.json())
      .then(
        (response) => {
          return response?.token;
        },
        (error) => {
          console.log(error);
        },
      );

    const filePath = searchParams.get("file");
    const fileName = searchParams.get("name");

    const file = await fetch(
      `${
        import.meta.env.VITE_URL_API_SERVICE
      }/file/get?path=/resources/${filePath}`,
      {
        method: "GET",
        headers: {
          "Lanstad-Token": token,
        },
      },
    )
      .then((res) => res.json())
      .then(
        (response) => {
          return response;
        },
        (error) => {
          console.log(error);
        },
      );

    const a = document.createElement("a"); // Create <a>
    a.href = `data:application/octet-stream;base64,${file.content}`; // File Base64 Goes here
    a.download = fileName; // File name Here
    a.click(); // Downloaded file

    return <></>;
  };
}
