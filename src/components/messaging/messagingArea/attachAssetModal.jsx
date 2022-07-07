import { createRef, useEffect, useState } from "react";
import SliderLoading from "../../sliderLoading/SliderLoading";
import { api } from "../../../services/api";

export default function AttachAssetsModal({ ...props }) {
  const { projectId, taskId, listSelected } = props;
  const [filesList, setFilesList] = useState([]);
  const [filesListFiltered, setFilesListFiltered] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState(
    listSelected ?? [],
  );
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [nameType, setNameType] = useState("");
  const searchField = createRef();

  useEffect(() => {
    getAssets();
  }, [projectId]);

  function getAssets() {
    setLoadingFiles(true);
    api
      .get(`/project/assets/${projectId} `)
      .then((result) => {
        if (result.data.assetsList) {
          const taskAssets = result.data.assetsList.filter(
            (asset) => parseInt(asset.task_id) === taskId,
          );
          setFilesList(taskAssets);
          setFilesListFiltered(taskAssets);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingFiles(false);
      });
  }

  async function addSelectedAttachment(e, id, name, file_path) {
    const addAttachment = e.currentTarget.checked;
    const newAttachment = { id, name, file_path };

    if (addAttachment) {
      setSelectedAttachments((old) => [...old, newAttachment]);
    } else {
      const newListOfAttachments = selectedAttachments.filter((attachment) => {
        return attachment.id !== newAttachment.id;
      });
      setSelectedAttachments(newListOfAttachments);
    }
  }

  const searchHandle = (event) => {
    const value = event.target.value.toLowerCase();
    const result = filesList.filter((item) =>
      Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(value),
      ),
    );
    setNameType(event.target.value);
    setFilesListFiltered(result);
  };

  async function addAttachmentsChecker() {
    setStatusMsg("");
    if (selectedAttachments.length === 0) {
      setStatusMsg("Please select at least one asset");
    } else {
      const newSelectedAttachments = await changeFilePathToSelectedAttachments(
        selectedAttachments,
      );
      setLoading(false);
      props.validationChecker(newSelectedAttachments);
      props.close();
    }
  }

  async function changeFilePathToSelectedAttachments(attachments) {
    setLoading(true);
    const newAttachments = await Promise.all(
      attachments.map(async (att) => {
        const newFilePath = await fetch("/call/file/attachment/move", {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            taskId,
            assetPath: att.file_path,
          }),
        })
          .then((res) => res.json())
          .then(
            (response) => {
              return response.filePath;
            },
            (error) => {
              // Todo: How are we going to show the errors
              console.log(error);
            },
          );
        return { id: att.id, name: att.name, file_path: newFilePath };
      }),
    );
    return newAttachments;
  }

  return (
    <div className="txt-editor-popup">
      <div id="fileList">
        {loadingFiles ? (
          <SliderLoading fitLoad />
        ) : (
          <>
            <div className="wrap-field-label">
              <label className="label-form">Search</label>
              <input
                className="navbar-search form-control"
                type="text"
                aria-label="Search"
                value={nameType}
                onChange={(e) => searchHandle(e)}
                ref={searchField}
              />
              <i
                className="material-icons icon-right"
                onClick={() => {
                  setNameType("");
                  searchField.current.focus();
                  setFilesListFiltered(filesList);
                }}
                style={{ cursor: "pointer" }}
              >
                {!nameType ? "search" : "close"}
              </i>
            </div>
            <div className="file-list">
              <ul>
                {filesListFiltered?.length > 0
                  ? filesListFiltered.map((file, index) => (
                      <li
                        className="file-list-item options-checkbox"
                        key={index}
                      >
                        <label
                          htmlFor={file.document_id}
                          title={file.name}
                          className="label-flex"
                        >
                          <input
                            id={file.document_id}
                            type="checkbox"
                            disabled={loading}
                            value="fileCheckbox"
                            defaultChecked={
                              listSelected.filter(
                                (selected) => selected.id === file.document_id,
                              ).length > 0
                            }
                            name={file.name}
                            onChange={(e) => {
                              addSelectedAttachment(
                                e,
                                file.document_id,
                                file.name,
                                file.file_path,
                              );
                            }}
                          />
                          <span>{file.name}</span>
                        </label>
                      </li>
                    ))
                  : "Sorry, no assets found"}
              </ul>
            </div>
            <div className="col-md-12 p-0 flex-between deanta-button-container">
              <p
                className={`text-warning ${
                  statusMsg.includes("success") ? "text-success" : "text-error"
                }`}
              >
                {statusMsg}
              </p>
              <button
                className="deanta-button-outlined save-users "
                disabled={loading}
                onClick={() => addAttachmentsChecker()}
              >
                {!loading ? (
                  "Attach"
                ) : (
                  <>
                    <i className="material-icons-outlined loading-icon-button">
                      sync
                    </i>{" "}
                    Attaching
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
