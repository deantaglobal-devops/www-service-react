import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../services/api";

export function DownloadAttachment() {
  const [searchParams] = useSearchParams();
  const userId = 4169;

  useEffect(() => {
    handleDownloadFile();
  }, []);

  const handleDownloadFile = async () => {
    const token = await api
      .post("/token/author/create", { userId })
      .then((response) => response.data.token);

    const filePath = searchParams.get("file");

    const file = await api
      .get(`/file/get?path=/resources/${filePath}`, {
        headers: {
          "Lanstad-Token": token,
        },
      })
      .then((response) => {
        return response.data;
      });

    const a = document.createElement("a"); // Create <a>
    a.href = `data:application/octet-stream;base64,${file.content}`; // File Base64 Goes here
    a.download = file.file_name; // File name Here
    a.click(); // Downloaded file

    return <></>;
  };
}
