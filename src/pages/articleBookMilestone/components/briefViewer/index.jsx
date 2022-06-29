import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import Modal from "../../../../components/Modal/modal";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function BriefViewer({
  setModalBrief,
  modalBrief,
  file,
  fileName,
  file64,
  mimeType,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const currentURL = import.meta.env.VITE_URL_SERVICE;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Modal
      displayModal={modalBrief}
      closeModal={() => setModalBrief(false)}
      title="Project Manager Brief"
      content={
        <>
          {mimeType.includes("pdf") ? (
            <div className="pdf-viewer">
              <Document
                file={`data:application/pdf;base64,${file64}`}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={console.error}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <a
                href="#"
                className="btn-float-dwn"
                onClick={() => Lanstad.File.download(file, fileName)}
              >
                <button type="button" className="btn btn-outline-primary">
                  Download File
                </button>
              </a>
            </div>
          ) : (
            <p>This file isn't available for viewing</p>
          )}
        </>
      }
      button1Text="Close"
      handleButton1Modal={() => setModalBrief(false)}
    />
  );
}
