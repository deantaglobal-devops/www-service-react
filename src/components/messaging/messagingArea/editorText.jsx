import { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import { useForm } from "react-hook-form";

import Modal from "../../modal";
import AttachAssetsModal from "./attachAssetModal";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export function EditorText({ ...props }) {
  const {
    editorState,
    setEditorState,
    attachmentList,
    attachsAssetList,
    setAttachsAssetList,
    setAttachmentList,
    setSignature,
    setStatusMsg,
  } = props;

  const uploadRef = useRef(null);
  const refDropDown = useRef(null);
  const signatureEditorRef = useRef(null);

  const { register, watch } = useForm();
  const [editorSignatureState, setEditorSignatureState] = useState(
    EditorState.createEmpty(),
  );

  const [dropdownAttach, setDropdownAttach] = useState(false);
  const [dropdownPalette, setDropdownPalette] = useState(false);
  const [addLinkModal, setAddLinkModal] = useState(false);
  const [attachAssetModal, setAttachAssetModal] = useState(false);
  const [signatureModal, setSignatureModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progressUpload, setProgressUpload] = useState("");

  const colorStyleMap = {
    BLUE: {
      color: "rgba(7,  73, 115, 1.0)",
    },
    GREY: {
      color: "rgba(85, 99, 108, 1.0)",
    },
    BLACK: {
      color: "rgba(0, 0, 0, 1.0)",
    },
  };

  const formatTools = [
    {
      name: "bold",
      editor: "BOLD",
      icon: "format_bold",
    },
    {
      name: "italic",
      editor: "ITALIC",
      icon: "format_italic",
    },
    {
      name: "underline",
      editor: "UNDERLINE",
      icon: "format_underline",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (refDropDown.current && !refDropDown.current.contains(event.target)) {
        setDropdownAttach(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refDropDown]);

  useEffect(() => {
    uploadFiles();
  }, [fileList]);

  useEffect(() => {
    const removeOld = attachmentList.filter(
      (prev) => prev.file !== progressUpload.file,
    );
    progressUpload !== "" && setAttachmentList([...removeOld, progressUpload]);
  }, [progressUpload]);

  useEffect(() => {
    loadSignature();
  }, [signatureModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (refDropDown.current && !refDropDown.current.contains(event.target)) {
        setDropdownAttach(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refDropDown]);

  const loadSignature = () => {
    const signatureData =
      JSON.parse(localStorage.getItem("signature")) ||
      convertToRaw(editorSignatureState.getCurrentContent());
    const contentBlock = convertFromRaw(signatureData);
    const editorDataState = EditorState.createWithContent(contentBlock);

    setEditorSignatureState(editorDataState);
  };

  const saveSignature = () => {
    const contentEditor = convertToRaw(
      editorSignatureState.getCurrentContent(),
    );
    setSignature(contentEditor);
    localStorage.setItem("signature", JSON.stringify(contentEditor));
    setSignatureModal(false);
  };

  function getExtensionFile(filename) {
    return filename.match(/\.[0-9a-zA-Z]+$/i)
      ? filename.match(/\.[0-9a-zA-Z]+$/i)[0]
      : 0;
  }

  async function fileUploadInputChange(e) {
    let attchs = [...attachmentList];
    const filesSelected = [...e.target.files];

    filesSelected.map(async (file) => {
      if (
        file.size / 1024 / 1024 <= fileSizeLimit &&
        attchs?.filter((item) => item.name === file.name).length === 0
      ) {
        setFileList(filesSelected);
      }
    });

    filesSelected.map(async (file) => {
      const fileData = {
        file_path: "",
        upload: "uploading",
        name: file.name,
        error: "",
        size: file.size,
        ext: getExtensionFile(file.name),
        file,
      };
      if (file.size / 1024 / 1024 > fileSizeLimit) {
        fileData.error = "File is too big";
        fileData.upload = "error";
      }
      if (attchs?.filter((item) => item.name === file.name).length > 0) {
        setStatusMsg("File is already added in the attachment");
      } else {
        attchs = [...attchs, fileData];
        setAttachmentList(attchs);
      }
    });
  }

  const uploadFiles = () => {
    fileList?.length > 0 &&
      fileList?.map((item) => {
        const fileUpload = {
          name: item.name,
          size: item.size,
          ext: getExtensionFile(item.name),
          file: item,
          upload: "uploading",
          error: "",
        };
        const dataBody = new FormData();
        dataBody.append("taskId", props.taskId);
        dataBody.append("attachment", item);

        const token = localStorage.getItem("lanstad-token");

        fetch(
          `${import.meta.env.VITE_URL_API_SERVICE}/file/upload/attachment`,
          {
            method: "POST",
            body: dataBody,
            headers: {
              "Lanstad-Token": token,
            },
          },
        )
          .then((response) => {
            fileUpload.file_path = response.filePath;
            fileUpload.upload = "uploaded";
            fileUpload.error = "";
          })
          .finally(() => {
            setProgressUpload(fileUpload);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  }

  function handleKeyCommandSignature(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorSignatureState(newState);
      return "handled";
    }
    return "not-handled";
  }

  function toggleColor(toggledColor) {
    const selection = editorSignatureState.getSelection();
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color);
      },
      editorSignatureState.getCurrentContent(),
    );
    let nextEditorState = EditorState.push(
      editorSignatureState,
      nextContentState,
      "change-inline-style",
    );
    const currentStyle = editorSignatureState.getCurrentInlineStyle();

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor,
      );
    }

    setEditorSignatureState(nextEditorState);
  }

  function Link({ entityKey, contentState, children }) {
    const { url, linkText } = contentState.getEntity(entityKey).getData();
    return (
      <a
        style={{ color: "blue", fontStyle: "italic" }}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {linkText || children}
      </a>
    );
  }

  const findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  };

  const createLinkDecorator = () =>
    new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

  const onAddLink = (hyperLink, linkDisplayText) => {
    let linkUrl = hyperLink;
    const decorator = createLinkDecorator();

    if (!hyperLink.includes("http://")) {
      if (!hyperLink.includes("https://")) {
        linkUrl = `http://${hyperLink}`;
      }
    }
    const currentContent = editorState.getCurrentContent();
    currentContent.createEntity("LINK", "MUTABLE", {
      url: linkUrl,
      target: "_blank ",
    });
    const entityKey = currentContent.getLastCreatedEntityKey();
    const selection = editorState.getSelection();
    const textWithEntity = Modifier.replaceText(
      currentContent,
      selection,
      linkDisplayText,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    const newState = EditorState.createWithContent(textWithEntity, decorator);
    setEditorState(newState);
    setAddLinkModal(false);
  };

  return (
    <>
      <div className="composer-tools-formatting">
        {formatTools.map((tool) => (
          <button
            key={tool.name}
            type="button"
            className={`deanta-button formatting-button formatting-${
              tool.name
            } ${
              editorState.getCurrentInlineStyle().has(tool.editor)
                ? "active"
                : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setEditorState(
                RichUtils.toggleInlineStyle(editorState, tool.editor),
              );
            }}
          >
            <i className="material-icons-outlined">{tool.icon}</i>
          </button>
        ))}
        <button
          type="button"
          className="deanta-button formatting-button formatting-bulleted"
          onMouseDown={(e) => {
            e.preventDefault();
            setEditorState(
              RichUtils.toggleBlockType(editorState, "unordered-list-item"),
            );
          }}
        >
          <i className="material-icons-outlined">format_list_bulleted</i>{" "}
        </button>
        <button
          type="button"
          className="deanta-button formatting-button formatting-numbered"
          onMouseDown={() => {
            setEditorState(
              RichUtils.toggleBlockType(editorState, "ordered-list-item"),
            );
          }}
        >
          <i className="material-icons-outlined">format_list_numbered</i>{" "}
        </button>
        <button
          type="button"
          className="deanta-button formatting-button formatting-link"
          onClick={() => setAddLinkModal(!addLinkModal)}
        >
          <i className="material-icons-outlined">insert_link</i>{" "}
        </button>
        <button
          type="button"
          className="deanta-button formatting-button formatting-attachment"
          onClick={() => setDropdownAttach(!dropdownAttach)}
        >
          <i className="material-icons-outlined">attach_file</i>
          <input
            ref={uploadRef}
            id="file-dialog"
            name="file-dialog"
            type="file"
            multiple
            hidden
            onChange={(e) => fileUploadInputChange(e)}
          />

          {(attachmentList.length !== 0 || attachsAssetList.length !== 0) && (
            <span className="formatting-attachment-bubble">
              {attachmentList.length + attachsAssetList.length}
            </span>
          )}
          {dropdownAttach && (
            <div className="dropdown-menu-comms" ref={refDropDown}>
              <p>Attach files from:</p>
              <ul>
                <li
                  onClick={() => {
                    setAttachAssetModal(true);
                    setDropdownAttach(false);
                  }}
                >
                  Assets library
                </li>
                <li
                  onClick={() => {
                    uploadRef.current.click();
                    setDropdownAttach(false);
                  }}
                >
                  Your computer
                </li>
              </ul>
            </div>
          )}
        </button>
        <button
          type="button"
          className="deanta-button formatting-button formatting-signature"
          onClick={() => setSignatureModal(!signatureModal)}
        >
          <i className="material-icons-outlined">draw</i>
        </button>
      </div>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        customStyleMap={colorStyleMap}
        onChange={setEditorState}
      />
      {addLinkModal && (
        <Modal
          modalInSlider={false}
          title="Add Link"
          body={
            <div className="wrap-field-label">
              <div className="wrap-field-label">
                <label className="label-form">Text</label>
                <input
                  className="default-input-text form-control"
                  type="text"
                  name="linkText"
                  {...register("linkText")}
                />
              </div>
              <div className="wrap-field-label">
                <label className="label-form">Link</label>
                <input
                  className="default-input-text form-control"
                  type="text"
                  name="hyperLink"
                  {...register("hyperLink")}
                />
              </div>
            </div>
          }
          footer={
            <div className="col-md-12 p-0">
              <button
                type="button"
                className="deanta-button composer-tools-send deanta-button-outlined"
                onClick={() => onAddLink(watch("hyperLink"), watch("linkText"))}
              >
                Apply
              </button>
            </div>
          }
          closeModal={() => {
            setAddLinkModal(false);
          }}
        />
      )}

      {attachAssetModal && (
        <Modal
          modalInSlider
          title="Attach files from the list below"
          body={
            <AttachAssetsModal
              taskId={props.taskId}
              projectId={props.projectId}
              listSelected={attachsAssetList}
              validationChecker={(array) => {
                setAttachsAssetList(array);
              }}
              close={() => setAttachAssetModal(false)}
            />
          }
          closeModal={() => {
            setAttachAssetModal(false);
          }}
        />
      )}

      {signatureModal && (
        <Modal
          modalInSlider={false}
          title="Signature"
          body={
            <div className="editor-signature">
              <div className="flex-between-editor">
                <p className="subtitle-signature">Preview</p>
                <div className="tools-signature">
                  {formatTools.map((tool) => (
                    <button
                      key={tool.name}
                      type="button"
                      className={`deanta-button formatting-button formatting-${
                        tool.name
                      } ${
                        editorSignatureState
                          .getCurrentInlineStyle()
                          .has(tool.editor)
                          ? "active"
                          : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setEditorSignatureState(
                          RichUtils.toggleInlineStyle(
                            editorSignatureState,
                            tool.editor,
                          ),
                        );
                      }}
                    >
                      <i className="material-icons-outlined">{tool.icon}</i>
                    </button>
                  ))}

                  <button
                    type="button"
                    className="deanta-button formatting-button"
                    onClick={() => {
                      signatureEditorRef.current.focus();
                      setDropdownPalette(!dropdownPalette);
                    }}
                  >
                    <i className="material-icons-outlined">palette</i>
                    {dropdownPalette && (
                      <div className="dropdown-menu-comms">
                        <ul>
                          <li
                            className="color-palette"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              toggleColor("BLUE");
                            }}
                          >
                            <span className="color-bubble dark-blue" />
                            Dark Blue
                          </li>
                          <li
                            className="color-palette"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              toggleColor("GREY");
                            }}
                          >
                            <span className="color-bubble grey" />
                            Grey
                          </li>
                          <li
                            className="color-palette"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              toggleColor("BLACK");
                            }}
                          >
                            <span className="color-bubble black" />
                            Dark Blue
                          </li>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
              </div>
              <Editor
                ref={signatureEditorRef}
                editorState={editorSignatureState}
                customStyleMap={colorStyleMap}
                handleKeyCommand={handleKeyCommandSignature}
                onChange={setEditorSignatureState}
              />
            </div>
          }
          footer={
            <div className="flex-gap">
              <button
                type="button"
                className="deanta-button composer-tools-send deanta-button-outlined"
                onClick={() => setSignatureModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="deanta-button composer-tools-send deanta-button-outlined"
                onClick={() => {
                  saveSignature();
                }}
              >
                Save
              </button>
            </div>
          }
          closeModal={() => {
            setSignatureModal(false);
          }}
        />
      )}
    </>
  );
}
