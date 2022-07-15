import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { downloadFile } from "../../utils/downloadFile";
import { api } from "../../services/api";

export function DownloadAttachmentFromEmail() {
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
    // const fileName = searchParams.get("name");

    // downloadFile(`/file/get/?storage=azure&path=/resources/${filePath}`);
    const file = await api
      .get(`/file/get/?storage=azure&path=/resources/${filePath}`, {
        headers: {
          "Lanstad-Token": token,
        },
      })
      .then((response) => response.data);

    console.log("file", file);
  };

  return <></>;
}
