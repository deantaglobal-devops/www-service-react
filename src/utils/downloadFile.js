import { api } from "../services/api";

export async function downloadFile(filePath) {
  if (filePath) {
    await api.get(`/file/get?path=${filePath}`).then((response) => {
      const a = document.createElement("a"); // Create <a>
      a.href = `data:application/octet-stream;base64,${response.data.content}`; // File Base64 Goes here
      a.download = response.data.file_name; // File name Here
      a.click(); // Downloaded file
    });
  }
}
