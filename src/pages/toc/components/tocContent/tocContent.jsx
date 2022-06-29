import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { api } from "../../../../services/api";
import TocRow from "../tocRow/tocRow";
import EditFileName from "../editFileNameModal/editFileNameModal";
import Modal from "../../../../components/Modal/modal";
import { Tooltip } from "../../../../components/tooltip/tooltip";

import Dropdown from "../../../../components/dropdown/dropdown";
import Loading from "../../../../components/loader/Loading";

import "./styles/tocContent.styles.css";

export default function TocContent(props) {
  const [tocData, setTocData] = useState(
    props?.project?.chapters ? props?.project?.chapters : [],
  );
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [chapterNames, setChapterNames] = useState([]);
  const [openEditChapterModal, setOpenEditChapterModal] = useState(false);
  const [chapterId, setChapterId] = useState(0);
  const [chapterName, setChapterName] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bodyModal, setBodyModal] = useState("");
  const [chapterNumber, setChapterNumber] = useState(
    props?.project?.chap_count,
  );
  const [newElement, setNewElement] = useState({ id: 0, value: "" });
  const [modalAction, setModalAction] = useState("");
  const [chaptersSelected, setChaptersSelected] = useState([]);
  const [deleteMultipleChapters, setDeleteMultipleChapters] = useState(false);
  const [selectAllChapters, setSelectAllChapters] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditModal = (e, _chapterId, _chapterName) => {
    e.preventDefault();
    setChapterId(_chapterId);
    setChapterName(_chapterName == "" ? "Untitled" : _chapterName);
    setModalAction("Edit");
    setOpenEditChapterModal(true);
  };

  const selectList = [
    { id: "FM", value: "New Frontmatter Element" },
    { id: "CHAP", value: "New Chapter" },
    { id: "BM", value: "New Backmatter Element" },
  ];

  useEffect(() => {
    // get all chapter names
    const names = tocData.map((chapter) => chapter.name);

    setChapterNames(names);
  }, [tocData]);

  useEffect(() => {
    if (selectAllChapters) {
      // get all chapter ids
      const ids = tocData.map((chapter) => chapter.id);

      setChaptersSelected(ids);
    } else {
      setChaptersSelected([]);
    }
  }, [selectAllChapters]);

  const saveOrder = async (chapterUpdate) => {
    let bodyRequest = { projectId: props?.project.projectId };
    const orderArray = [];
    chapterUpdate.map((chapter, index) => {
      orderArray.push({ id: chapter.id, orderId: index + 1 });
    });

    bodyRequest = {
      ...bodyRequest,
      chapterData: orderArray,
    };

    await api
      .post("/project/toc/reordertocchapter", bodyRequest)
      .then((response) => {
        // Ordering the chapter
        const chapterOrdered = [];

        chapterUpdate?.map((chapter) => {
          Object.values(response?.data?.tocList)?.map((resultChapter) => {
            if (chapter.id == resultChapter.tocId) {
              const newChaterObject = {
                ...chapter,
                number: resultChapter.orderId,
                startPage: resultChapter.endPage,
              };

              chapterOrdered.push(newChaterObject);
            }
          });
        });

        setTocData(chapterOrdered);

        // return result;
      })
      .catch((err) => console.log(err));
  };

  const handleCreateNewChapter = async () => {
    const selectedRows = document
      .getElementById("content-tab-1")
      .getElementsByClassName("tocRow active");
    const currentRows = document
      .getElementById("content-tab-1")
      .getElementsByClassName("tocRow");
    const lastSelectedRow = selectedRows[selectedRows.length - 1];
    const lastRow = currentRows[currentRows.length - 1];
    let lastRowFlag = 0;
    if (lastSelectedRow) {
      lastRowFlag = parseInt(
        lastSelectedRow.querySelector(".chapter-number").innerHTML,
      );
    } else if (lastRow) {
      lastRowFlag = parseInt(
        lastRow.querySelector(".chapter-number").innerHTML,
      );
    }
    const RowOrderId = parseInt(lastRowFlag) + 1;
    const bookCode = document.querySelector(".projectBookcode").value;
    const abbreviation = document.querySelector(".projectAbr").value;
    const chapterCount =
      parseInt(document.querySelector(".chapterCount").value) + 1;
    let chapterName =
      chapterCount < 10
        ? `${abbreviation}_0${chapterCount}_${bookCode}_C00${RowOrderId}`
        : `${abbreviation}_${chapterCount}_${bookCode}_C0${RowOrderId}`;
    let type = "";
    const chapCount = parseInt(chapterNumber) + 1;
    chapterName = `${abbreviation}_${String(chapCount).padStart(
      2,
      "0",
    )}_${bookCode}_C${String(chapCount).padStart(3, "0")}`;
    if (newElement) {
      type = newElement.id;
      if (newElement.id !== "CHAP") {
        chapterName = newFileName;
      }
    }

    setIsLoading(true);

    const bodyRequest = {
      projectId: props?.project.projectId,
      lastRowFlag,
      chapterName,
      RowOrderId,
      chapterType: type,
    };
    await api
      .post("/project/toc/createtocchapter", bodyRequest)
      .then(async () => {
        await api
          .get(`/project/${props?.project.projectId}/toc`)
          .then((response) => {
            setIsLoading(false);
            setNewElement({ id: 0, value: "" });
            setOpenEditChapterModal(false);
            setChapterNumber(response.data.chap_count);
            setTocData(response.data.chapters);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
    setIsLoading(false);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const tocArray = Array.from(tocData);
    tocArray.splice(source.index, 1);
    tocArray.splice(destination.index, 0, tocData[source.index]);

    setTocData(tocArray);
    saveOrder(tocArray);
    // reorderList(tocArray, source.index, destination.index);
  };

  const handleUpdateData = (data) => {
    const tocUpdated = tocData.map((chapter) => {
      if (chapter.id == data.tocId) {
        return {
          ...chapter,
          name: data.chapterName,
        };
      }
      return chapter;
    });

    setTocData(tocUpdated);
  };

  const selectDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDeleteModal = (e, _chapterId, _chapterName) => {
    if (_chapterId != undefined) {
      setDeleteMultipleChapters(false);
    } else {
      setDeleteMultipleChapters(true);
    }
    setChapterId(_chapterId);
    setChapterName(_chapterName == "" ? "Untitled" : _chapterName);
    setOpenDeleteModal(true);
    setBodyModal(
      _chapterName
        ? `Are you sure you’d like to delete the chapter ${_chapterName}?`
        : "Are you sure you’d like to delete multiple chapters?",
    );
  };

  const confirmationHandleDeleteModal = async () => {
    let bodyRequest = {
      projectId: props?.project.projectId,
    };

    const chapterArray = [];

    if (deleteMultipleChapters) {
      chaptersSelected.map((chapter) => {
        chapterArray.push(chapter);
      });

      bodyRequest = {
        ...bodyRequest,
        tocId: chapterArray,
      };
    } else {
      bodyRequest = {
        ...bodyRequest,
        tocId: [chapterId],
      };
    }

    await api
      .post("/project/toc/deletetocchapter", bodyRequest)
      .then(() => {
        let chapterUpdate = [];

        if (deleteMultipleChapters) {
          // removing ids from tocData
          chapterUpdate = tocData.filter(
            (chapter) => !chaptersSelected.includes(chapter.id),
          );
        } else {
          chapterUpdate = tocData.filter((chapter) => chapter.id !== chapterId);
        }

        setChaptersSelected([]);
        setTocData(chapterUpdate);
        selectDeleteModal();
        saveOrder(chapterUpdate);
        // return result;
      })
      .catch((err) => console.log(err));
  };

  const handleChapterSelected = (_chapterId) => {
    if (!chaptersSelected.includes(_chapterId)) {
      setChaptersSelected([...chaptersSelected, _chapterId]);
    } else {
      setChaptersSelected(
        chaptersSelected.filter((chapter) => chapter !== _chapterId),
      );
    }
  };

  const handleSelectAllChapters = (e) => {
    e.preventDefault();
    setSelectAllChapters(!selectAllChapters);
  };

  const handleSelectElement = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));
      setNewElement(eleValue);
    }
  };

  const createTocElement = (fileName) => {
    setNewFileName(fileName);
  };

  useEffect(() => {
    if (newElement.id) {
      if (newElement.id === "FM") {
        setModalAction("Add");
        setOpenEditChapterModal(true);
      } else if (newElement.id === "CHAP") {
        handleCreateNewChapter();
      } else if (newElement.id === "BM") {
        setModalAction("Add");
        setOpenEditChapterModal(true);
      }
    }
  }, [newElement]);

  useEffect(() => {
    if (newFileName !== "") {
      handleCreateNewChapter();
    }
  }, [newFileName]);

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      {openEditChapterModal && (
        <EditFileName
          originalFileName={chapterName}
          projectCode={props?.project.abbreviation}
          bookCode={props?.project.bookcode}
          projectId={props?.project.projectId}
          tocId={chapterId}
          fileNameList={chapterNames}
          modalAction={modalAction}
          newElement={newElement}
          handleUpdateData={(data) => handleUpdateData(data)}
          handleCloseModal={() => setOpenEditChapterModal(false)}
          createTocElement={(fileName) => createTocElement(fileName)}
        />
      )}

      {openDeleteModal && (
        <Modal
          displayModal={openDeleteModal}
          closeModal={selectDeleteModal}
          title="Confirmation"
          body={bodyModal}
          button1Text="Cancel"
          handleButton1Modal={() => selectDeleteModal()}
          Button2Text="Confirm"
          handleButton2Modal={() => confirmationHandleDeleteModal()}
        />
      )}

      <div className="toc-content">
        <div className="row mt-4">
          <div className="col-sm-12 col-lg-12 mb15">
            <div className="container-content-page">
              <div className="toc-buttons">
                {!!parseInt(props?.permissions?.toc?.delete) && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteModal(e)}
                    className={
                      chaptersSelected.length >= 2
                        ? "toc-button delete-chapters"
                        : "toc-button delete-chapters hidden"
                    }
                  >
                    <i className="material-icons-outlined">delete</i>
                    <span>Delete {chaptersSelected.length} chapters</span>
                  </button>
                )}

                {!!parseInt(props?.permissions?.toc?.download) &&
                  props?.project?.bookpdf_path && (
                    <a
                      href={`/download/file/?filePath=${props?.project?.bookpdf_path}&fileName=${props?.project?.bookpdf_name}`}
                      className="toc-button"
                      // onClick={(e) =>
                      //   handleDownload(
                      //     e,
                      //     props?.project?.bookpdf_path,
                      //     props?.project?.bookpdf_name,
                      //     'pdf'
                      //   )
                      // }
                    >
                      <i className="material-icons-outlined">save_alt</i>{" "}
                      Download Book
                    </a>
                  )}

                {!!parseInt(props?.permissions?.toc?.create) && (
                  <>
                    <button
                      type="button"
                      className="toc-button create-chapter hide"
                      onClick={(e) => handleCreateNewChapter(e)}
                    >
                      <i className="material-icons-outlined">add</i>
                      Create New Chapter
                    </button>
                    <div className="col-2">
                      <Dropdown
                        label="New Element"
                        name="newElement"
                        value={newElement.value}
                        valuesDropdown={selectList}
                        handleOnChange={(e) => handleSelectElement(e)}
                        placeholder="Select"
                        iconName="keyboard_arrow_down"
                        iconClassName="material-icons"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="body-tab-content active" id="content-tab-1">
                <table
                  className={
                    chaptersSelected.length >= 2
                      ? "table table-striped table-borderless table-oversize toc-table multiple-selected"
                      : "table table-striped table-borderless table-oversize toc-table"
                  }
                >
                  <thead className="table-head">
                    <tr>
                      {!!parseInt(props?.permissions?.toc?.edit) && (
                        <th
                          className="ws toc-checkbox-column"
                          onClick={(e) => handleSelectAllChapters(e)}
                        >
                          <button
                            type="button"
                            className="toc-dragger-column hidden"
                          >
                            <i className="material-icons-outlined">
                              drag_indicator
                            </i>
                          </button>
                          <button
                            type="button"
                            className={
                              selectAllChapters
                                ? "toc-checkbox active"
                                : "toc-checkbox"
                            }
                          >
                            <i className="material-icons-outlined">
                              {selectAllChapters
                                ? "check_box_outline"
                                : "check_box_outline_blank"}
                            </i>
                          </button>
                        </th>
                      )}
                      <th className="ws">Nº</th>
                      <th className="ws">Chapter Title</th>
                      <th className="ws">File name</th>
                      {!!parseInt(props?.permissions?.toc?.edit) && (
                        <th className="ws ws-edit">Edit</th>
                      )}
                      <th className="ws">Start page</th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Pages
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Words
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Characters
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Special Char.
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Tables
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Images
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Word Eqt.
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Math Eqt.
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Footnotes
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Endnotes
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        References
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Tab. Citation
                      </th>
                      <th
                        className={
                          showMoreInfo ? "ws report" : "ws report hide"
                        }
                      >
                        Fig. Citation
                      </th>
                      <th
                        className={showMoreInfo ? "ws files hide" : "ws files "}
                      >
                        Latest version
                      </th>

                      <th
                        className={
                          showMoreInfo
                            ? "ws show-hide-report active"
                            : "ws show-hide-report"
                        }
                        onClick={() => setShowMoreInfo(!showMoreInfo)}
                      >
                        <Tooltip content="Content Report" direction="left">
                          <i className="material-icons-outlined">
                            {showMoreInfo ? "report" : "report_off"}
                          </i>
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  {tocData?.length > 0 && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="column-1">
                        {(provided, snapshot) => (
                          <tbody
                            className="row_drag"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isdraggingover={snapshot.isDraggingOver.toString()}
                            key="column-1"
                          >
                            {tocData?.map((chapter, index) => (
                              <Draggable
                                draggableId={chapter.id.toString()}
                                index={index}
                                key={chapter.id}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    isdragging={snapshot.isDragging.toString()}
                                    className={
                                      chaptersSelected.includes(chapter.id)
                                        ? "tocRow active selected"
                                        : "tocRow no-active"
                                    }
                                  >
                                    <TocRow
                                      // key={chapter.id}
                                      permissions={props?.permissions}
                                      chapter={chapter}
                                      showMoreInfo={showMoreInfo}
                                      dragHandleProps={provided.dragHandleProps}
                                      handleEditModal={(
                                        e,
                                        _chapterId,
                                        _chapterName,
                                      ) =>
                                        handleEditModal(
                                          e,
                                          _chapterId,
                                          _chapterName,
                                        )
                                      }
                                      handleDeleteModal={(
                                        e,
                                        _chapterId,
                                        _chapterName,
                                      ) =>
                                        handleDeleteModal(
                                          e,
                                          _chapterId,
                                          _chapterName,
                                        )
                                      }
                                      handleChapterSelected={(_chapterId) =>
                                        handleChapterSelected(_chapterId)
                                      }
                                      allChaptersSelected={selectAllChapters}
                                    />
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {/* </div> */}
                          </tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </table>
                <input
                  type="hidden"
                  className="projectAbr"
                  value={props.project.abbreviation}
                />
                <input
                  type="hidden"
                  className="projectBookcode"
                  value={props.project.bookcode}
                />
                {props?.project?.chaptercount ? (
                  <input
                    type="hidden"
                    className="chapterCount"
                    value={props.project.chaptercount}
                  />
                ) : (
                  <input type="hidden" className="chapterCount" value="0" />
                )}
              </div>
            </div>
          </div>
        </div>

        <table className="resume">
          <tbody>
            <tr>
              <td>Pages: {props?.project?.totalCount}</td>
              <td>Index: {props?.project?.index}</td>
              <td>Blank: {props?.project?.blankPageCount}</td>
              <td>
                <span className="total">
                  <strong>Total Book Pages: {props?.project?.bookPages}</strong>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
