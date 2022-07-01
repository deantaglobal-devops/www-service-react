import { useState } from "react";
import moment from "moment";
import { api } from "../../../../../services/api";
import Modal from "../../../../../components/Modal/modal";

function ListRevisions({ item, permissions }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteRevision = async (documentId) => {
    const bodyRequest = {
      documentid: [documentId],
    };
    await api
      .post("/project/assets/delete", bodyRequest)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <tr className="revisions">
        <td />
        <td>
          <input
            type="text"
            disabled
            value={item.document_name}
            data-src-document-id={item.document_id}
            id="asset-file-id-latest"
          />
        </td>
        <td />
        <td>{moment(item.updatedDate).format("MMMM Do YYYY, h:mm:ss a")}</td>
        <td>Uploaded to: {item.task_name}</td>
        <td className="asset-options">
          <span>
            {!!parseInt(permissions.assets.download) && (
              <a
                href="#"
                data-toggle="tooltip"
                data-placement="top"
                title="Download"
                data-src={item.document_path}
                data-src-document-id={item.document_id}
                data-src-name={item.document_name}
                className="download-file"
              >
                <i className="material-icons-outlined">save_alt</i>
              </a>
            )}
            <a
              href="#"
              data-toggle="tooltip"
              data-placement="top"
              title="Cancel"
              data-src-name={item.document_name}
              data-html-id="asset-file-id-latest"
              className="cancel-file"
            >
              <i className="material-icons-outlined">close</i>
            </a>

            <a
              href="#"
              data-toggle="tooltip"
              data-placement="top"
              title="Update"
              data-src-name={item.document_name}
              data-src-document-id={item.document_id}
              data-html-id="asset-file-id-latest"
              className="save-file save-icon"
            >
              <i className="material-icons-outlined">save</i>
            </a>

            {!!parseInt(permissions.assets.delete) && (
              <a
                href="#"
                className="delete-file"
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
              >
                <i className="material-icons-outlined">delete</i>
              </a>
            )}
          </span>
        </td>
      </tr>

      {openDeleteModal && (
        <Modal
          displayModal={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          title="Confirmation"
          body="Are you sure you’d like to delete this revision?"
          button1Text="Cancel"
          handleButton1Modal={() => setOpenDeleteModal(false)}
          Button2Text="Delete Revision"
          handleButton2Modal={() => deleteRevision(item.document_id)}
        />
      )}
    </>
  );
}

export default ListRevisions;
