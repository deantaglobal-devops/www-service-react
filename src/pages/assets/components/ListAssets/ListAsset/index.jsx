import { useState } from "react";
import moment from "moment";
import { api } from "../../../../../services/api";

import Modal from "../../../../../components/Modal/modal";
import { Tooltip } from "../../../../../components/tooltip/tooltip";
import Loading from "../../../../../components/loader/Loading";
import ListRevisions from "../ListRevisions";
import { downloadFile } from "../../../../../utils/downloadFile";

function ListAsset({
  allSelected,
  toggleSelected,
  assetsSelecteds,
  selected,
  asset,
  permissions,
  project,
}) {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [reqHistory, setReqHistory] = useState();
  const [loading, setIsLoading] = useState();
  const [editing, setEditing] = useState(false);
  const [nameAsset, setNameAsset] = useState("");
  const [assetSpoted, setAssetSpoted] = useState();
  const [revisions, setRevisions] = useState();

  const getHistory = async (projectId, documentId, documentName) => {
    setIsLoading(true);

    !reqHistory
      ? await api
          .get(
            `/project/assets/revision/${projectId}/${documentId}/${documentName}`,
          )
          .then((response) => {
            setReqHistory(response.data.revisionList);
            setIsLoading(false);
            return result;
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            return false;
          })
      : (setReqHistory(""), setIsLoading(false));
  };

  const editAsset = async (documentId) => {
    if (nameAsset !== "") {
      const bodyRequest = {
        documentId,
        documentName: nameAsset,
      };
      await api
        .post("/project/assets/edit/filename", bodyRequest)
        .then(() => {
          setEditing(false);
          setNameAsset("");
        })
        .catch((err) => console.log(err));
    } else {
      setEditing(false);
    }
  };

  const verificationAsset = async (documentid, documentName, projectId) => {
    const bodyRequest = {
      documentid,
      documentName,
      projectId,
    };
    await api
      .post("/project/assets/section/revision", bodyRequest)
      .then((response) => {
        setRevisions(response.data.revisionCount);
        setOpenDeleteModal(true);
      })
      .catch((err) => console.log(err));
  };

  // const deleteAllAsset = async (documentId) => {
  //   const data = new FormData();
  //   data.append('documentid', documentId);

  // WE NEED TO USE THIS ENDPOINT: /project/assets/deleteall instead.
  // WE'RE NOT USING SIMFONY ANYMORE.
  // I've just keep it commented, because all the function was commented. :)

  //   await fetch('/call/assets/deleteall', {
  //     method: 'POST',
  //     body: data,
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       () => {
  //         window.location.reload();
  //         setAssetsSelecteds([]);
  //         setAllSelected(false);
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //     );
  // };

  const deleteAsset = async (documentId) => {
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
      {loading && <Loading loadingText="loading..." />}
      <tr className={editing ? "editing" : ""}>
        <td className="select-asset">
          <label htmlFor={asset.document_id}>
            <input
              type="checkbox"
              id={asset.document_id}
              checked={selected[asset.document_id] || allSelected}
              onChange={toggleSelected(asset.document_id)}
            />
          </label>
        </td>

        <td className="asset-info">
          <span>
            <input
              type="text"
              id="asset-file-id-latest"
              disabled={!editing}
              defaultValue={asset.name}
              onChange={(e) => {
                setNameAsset(e.target.value);
              }}
            />
          </span>
        </td>
        <td className="asset-info">
          <span>{asset.description}</span>
        </td>
        <td className="asset-info">
          <span>{moment(asset.updatedDate).format("MMM D, YYYY h:mm:ss")}</span>
        </td>
        <td className="asset-info">
          <span>
            {/* Better this part  */}
            {(asset.type === ".tif" ||
              asset.type === ".tiff" ||
              asset.type === "tif" ||
              asset.type === "tiff") && (
              <img
                alt="tiff"
                className="icon-line"
                src="/assets/icons/tiff.svg"
              />
            )}
            {(asset.type === ".eps" || asset.type === "eps") && (
              <img
                alt="eps"
                className="icon-line"
                src="/assets/icons/eps.svg"
              />
            )}
            {(asset.type === ".jpg" || asset.type === "jpg") && (
              <img
                alt="jpg"
                className="icon-line"
                src="/assets/icons/jpg.svg"
              />
            )}
            {(asset.type === ".png" || asset.type === "png") && (
              <img
                alt="png"
                className="icon-line"
                src="/assets/icons/png.svg"
              />
            )}
            {(asset.type === ".xml" || asset.type === "xml") && (
              <img
                alt="xml"
                className="icon-line"
                src="/assets/icons/xml.svg"
              />
            )}
            {(asset.type === ".indd" || asset.type === "indd") && (
              <img
                alt="indd"
                className="icon-line"
                src="/assets/icons/indd.svg"
              />
            )}
            {(asset.type === ".rtf" || asset.type === "rtf") && (
              <img
                alt="rtf"
                className="icon-line"
                src="/assets/icons/rtf.svg"
              />
            )}
            {(asset.type === ".html" || asset.type === "html") && (
              <img
                alt="html"
                className="icon-line"
                src="/assets/icons/html.svg"
              />
            )}
            {(asset.type === ".rtf" || asset.type === "rtf") && (
              <img
                alt="rtf"
                className="icon-line"
                src="/assets/icons/rtf.svg"
              />
            )}
            {(asset.type === ".dtd" || asset.type === "dtd") && (
              <img
                alt="dtd"
                className="icon-line"
                src="/assets/icons/dtd.svg"
              />
            )}
            {(asset.type === ".zip" || asset.type === "zip") && (
              <img
                alt="zip"
                className="icon-line"
                src="/assets/icons/zip.svg"
              />
            )}
            {(asset.type === ".dtd" || asset.type === "dtd") && (
              <img
                alt="dtd"
                className="icon-line"
                src="/assets/icons/dtd.svg"
              />
            )}
            {(asset.type === ".zip" || asset.type === "zip") && (
              <img
                alt="zip"
                className="icon-line"
                src="/assets/icons/zip.svg"
              />
            )}
            {(asset.type === ".pdf" || asset.type === "pdf") && (
              <img
                alt="pdf"
                className="icon-line"
                src="/assets/icons/pdf.svg"
              />
            )}
            {(asset.type === ".txt" || asset.type === "txt") && (
              <img
                alt="txt"
                className="icon-line"
                src="/assets/icons/txt.svg"
              />
            )}
            {(asset.type === ".xlsx" || asset.type === "xlsx") && (
              <img
                alt="xlsx"
                className="icon-line"
                src="/assets/icons/xlsx.svg"
              />
            )}
            {(asset.type === ".docx" || asset.type === "docx") && (
              <img
                alt="docx"
                className="icon-line"
                src="/assets/icons/docx.svg"
              />
            )}
          </span>
        </td>

        <td className="asset-info" />

        {/* {# Latest Files #} */}
        <td className="asset-options">
          <span>
            {!!parseInt(permissions.assets.edit) && (
              <Tooltip direction="top" content="Edit">
                <a className="edit-file" onClick={() => setEditing(true)}>
                  <i className="material-icons-outlined ">edit</i>
                </a>
              </Tooltip>
            )}

            <Tooltip direction="top" content="Update">
              <a
                className="update-file"
                onClick={() => setOpenUpdateModal(true)}
              >
                <i className="material-icons-outlined ">autorenew</i>
              </a>
            </Tooltip>

            {asset.hasRevisions && (
              <Tooltip content="Revisions" direction="top">
                <a
                  className="history-file"
                  onClick={() =>
                    getHistory(project.projectId, asset.document_id, asset.name)
                  }
                >
                  <i className="material-icons-outlined ">history</i>
                </a>
              </Tooltip>
            )}

            {!!parseInt(permissions?.assets?.download) && (
              <Tooltip content="Download" direction="top">
                <a
                  className="download-file"
                  onClick={() => {
                    downloadFile(asset?.file_path, asset?.name);
                  }}
                >
                  <i className="material-icons-outlined ">save_alt</i>
                </a>
              </Tooltip>
            )}

            {/* {# Show Delete icon #} */}
            {!!parseInt(permissions.assets.delete) && (
              <Tooltip direction="top" content="Delete">
                <a
                  className="delete-file"
                  onClick={() => {
                    verificationAsset(
                      asset.document_id,
                      asset.name,
                      project.projectId,
                    );
                    setAssetSpoted(asset);
                  }}
                >
                  <i className="material-icons-outlined ">delete</i>
                </a>
              </Tooltip>
            )}

            <Tooltip direction="top" content="Cancel">
              <a className="cancel-file" onClick={() => setEditing(false)}>
                <i className="material-icons-outlined ">close</i>
              </a>
            </Tooltip>

            <Tooltip direction="top" content="Update">
              <a
                className="save-file save-icon"
                onClick={() => editAsset(asset.document_id)}
              >
                <i className="material-icons-outlined">save</i>
              </a>
            </Tooltip>
          </span>
        </td>
      </tr>

      {reqHistory && (
        <>
          <tr className="revisions-title" id="revisionlist">
            <td>
              <p className="history-label">File History</p>
            </td>
            <td />
            <td />
            <td />
          </tr>
          {reqHistory.map((item, index) => (
            <ListRevisions
              item={item.document_id}
              permissions={permissions}
              key={item.document_id + index}
            />
          ))}
        </>
      )}

      {/* Modal de Update */}
      {openUpdateModal && (
        <Modal
          displayModal={openUpdateModal}
          closeModal={() => setOpenUpdateModal(false)}
          title="Update File"
          body="You will be redirected to Google Drive document"
          button1Text="Cancel"
          handleButton1Modal={() => setOpenUpdateModal(false)}
          Button2Text="Yes, that's okay"
          handleButton2Modal={() => setOpenUpdateModal(false)}
        />
      )}

      {/* Modal de Delete */}
      {openDeleteModal && (
        <Modal
          displayModal={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          title="Delete Asset"
          content={
            <p
              className="modal-body-container"
              style={{ minWidth: 400, paddingBottom: 50 }}
            >
              Are you sure you want to delete this asset?
            </p>
          }
          button1Text="Cancel"
          handleButton1Modal={() => setOpenDeleteModal(false)}
          Button2Text="Yes, Delete"
          handleButton2Modal={() => deleteAsset(assetSpoted.document_id)}
        />
      )}
    </>
  );
}

export default ListAsset;
