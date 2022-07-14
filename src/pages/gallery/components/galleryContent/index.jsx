import { useState, useEffect, createRef } from "react";
import { api } from "../../../../services/api";
import Modal from "../../../../components/Modal/modal";
import Toast from "../../../../components/toast/toast";
import { GalleryCard } from "../cards/index";
import GalleryUpload from "../uploadGallery";
import { downloadFile } from "../../../../utils/downloadFile";

import "./styles/galleryContent.styles.css";

export default function GalleryContent({ permissions, project, chapter }) {
  const gallery = project?.assetsGallery;

  const [selectType, setSelectType] = useState("all");
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [imagesSelecteds, setImagesSelecteds] = useState([]);
  const [loading, setLoading] = useState("");

  const [nameType, setNameType] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const searchField = createRef();

  // Pagination
  const [start, setStart] = useState(0);
  const limit = 30;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal and Toast
  const [messageToast, setMessageToast] = useState("");
  const [typeToast, setTypeToast] = useState("success");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [openPROModal, setOpenPROModal] = useState(false);
  const [openDrawerUpload, setOpenDrawerUpload] = useState(false);

  // Hidratation of images types
  const typesArray = gallery.map((list) => list.type);
  const types = typesArray.filter(
    (item, pos) => typesArray.indexOf(item) == pos,
  );
  const typesDotsOff = types.map((item) => item.replace(".", ""));
  const typesExtension = typesDotsOff.filter(
    (item, pos) => typesDotsOff.indexOf(item) == pos,
  );

  // Select Manager
  const selectedCount = Object.values(imagesSelecteds).filter(Boolean).length;
  const isAllSelected = selectedCount === filteredData.length;

  useEffect(() => {
    setFilteredData(gallery);
  }, []);

  useEffect(() => {
    const getKeys = () => {
      setImagesSelecteds([]);
      for (const [key, value] of Object.entries(selected)) {
        if (value) {
          setImagesSelecteds((imagesSelecteds) => [...imagesSelecteds, key]);
        }
      }
    };

    isAllSelected ? setAllSelected(true) : setAllSelected(false);

    getKeys();
  }, [selected, isAllSelected, filteredData]);

  useEffect(() => {
    filterTypeHandle(selectType);
  }, [selectType]);

  async function deleteAllImages() {
    const gallerySection = 1;
    const allid = imagesSelecteds.join(",");

    await api
      .post("/project/assets/deleteall", {
        documentid: allid,
        gallery: gallerySection,
      })
      .then(() => {
        window.location.reload();
        setOpenDeleteModal(false);
      })
      .catch((err) => console.log(err));
  }

  function downloadAllImages() {
    setLoading("downloading");
    const allid = imagesSelecteds.join(",");

    api
      .get(`/project/assets/downloadall/${allid}`)
      .then((response) => {
        downloadFile(response.data.zipfilepath);
        setLoading("");
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  function moveImageToVxe() {
    const allid = imagesSelecteds.join(",");

    api
      .post("/project/assets/moveto/vxe", { documentid: allid })
      .then((response) => {
        if (response.data.status == "true") {
          // Uncheck all selected items automatically
          setImagesSelecteds([]);
          setAllSelected(false);
          setOpenPROModal(false);
          setSelected({});

          // Show the Success Toast Bar
          setMessageToast(
            "The image(s) have been successfully sent to the PRO Editor.",
          );
          setTypeToast("success");
        }
      })
      .catch((err) => {
        console.log(err);
        setMessageToast(
          "There was an error sending your image(s) to the PRO Editor. Please try again later.",
        );
        setTypeToast("fail");
        return false;
      });
  }

  const toggleSelected = (id) => (e) => {
    if (!e.target.checked) {
      setAllSelected(false);
    }

    setSelected((selected) => ({
      ...selected,
      [id]: !selected[id],
    }));
  };

  const clearSelections = () => {
    filteredData.map((asset) => {
      setSelected((selected) => ({
        ...selected,
        [asset.document_id]: false,
      }));
    });
  };

  const toggleAllSelected = () => {
    setAllSelected(!allSelected);

    !allSelected && clearSelections();

    filteredData.map((asset) => {
      setSelected((selected) => ({
        ...selected,
        [asset.document_id]: !selected[asset.document_id],
      }));
    });
  };

  // Search Function
  const searchHandle = (event) => {
    const value = event.target.value.toLowerCase();
    let result = [];
    result = gallery?.filter((item) =>
      Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(value),
      ),
    );
    setNameType(event.target.value);
    setFilteredData(result);
  };

  const filterTypeHandle = (type) => {
    type !== "all"
      ? setFilteredData(
          gallery?.filter((images) =>
            images?.type?.replace(".", "").includes(type),
          ),
        )
      : setFilteredData(gallery);
  };

  return (
    <>
      {gallery?.length > 0 ? (
        <>
          <div className="navigation-gallery">
            <div className="actions-filters">
              <div className="wrap-field-label input-search">
                <div className="inputWrapper search-asset">
                  <label className="label-form">Search Galleries</label>
                  <input
                    className="default-input-text"
                    type="text"
                    placeholder="Search by: Name"
                    value={nameType}
                    onChange={(event) => {
                      searchHandle(event);
                      setCurrentPage(1);
                      setStart(0);
                    }}
                    ref={searchField}
                  />
                  <span
                    className="material-icons-outlined search-icon"
                    onClick={() => {
                      setNameType("");
                      searchField?.current?.focus();
                      setFilteredData(gallery);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {!nameType ? "search" : "close"}
                  </span>
                </div>
              </div>
              <div className="nav-tags">
                <a
                  href="#"
                  onClick={() => {
                    setSelectType("all");
                  }}
                  className={selectType === "all" ? "active" : ""}
                >
                  All types
                </a>
                {typesExtension?.map((item, index) =>
                  item.includes("tiff") || item.includes("jpeg") ? (
                    ""
                  ) : (
                    <a
                      href="#"
                      key={item + index}
                      className={item === selectType ? "active" : ""}
                      onClick={() => {
                        setSelectType(item.replace(".", ""));
                      }}
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>

            <div className="actions-filters ">
              <div className="secondary-navigation nav-top secondary-navigation-gallery">
                {!!parseInt(permissions?.gallery?.create) && (
                  <a
                    href="#"
                    className="add-new uploadFile"
                    onClick={() => {
                      setOpenDrawerUpload(true);
                    }}
                  >
                    <i className="material-icons-outlined">
                      add_photo_alternate
                    </i>
                    Add new
                  </a>
                )}
                {!!parseInt(permissions?.gallery?.edit) && (
                  <a
                    href="#"
                    className="select-all"
                    onClick={toggleAllSelected}
                  >
                    <i className="material-icons-outlined">select_all</i>
                    {allSelected || isAllSelected
                      ? "Deselect all"
                      : "Select all"}
                  </a>
                )}

                {!!parseInt(permissions?.gallery?.delete) && (
                  <a
                    href="#"
                    className="delete-selection"
                    onClick={() => {
                      imagesSelecteds?.length > 0
                        ? setOpenDeleteModal(true)
                        : setAlertModal(true);
                    }}
                  >
                    <i className="material-icons-outlined">delete</i>
                    Delete Selected
                  </a>
                )}
                {!!parseInt(permissions?.gallery?.download) && (
                  <a
                    href="#"
                    className={`download-all ${
                      loading === "downloading" && "disabled-loading"
                    }`}
                    onClick={() => {
                      if (loading !== "downloading") {
                        imagesSelecteds?.length > 0
                          ? downloadAllImages()
                          : setAlertModal(true);
                      }
                    }}
                  >
                    {loading !== "downloading" ? (
                      <>
                        <i className="material-icons-outlined">save_alt</i>
                        Download Selected
                      </>
                    ) : (
                      <>
                        <i className="material-icons-outlined loading-icon-button">
                          sync
                        </i>
                        Processing Download
                      </>
                    )}
                  </a>
                )}
                {!!parseInt(permissions?.gallery?.edit) && (
                  <a
                    href="#"
                    className="send-to-PRO move-to-vxe"
                    onClick={() => {
                      imagesSelecteds?.length > 0
                        ? setOpenPROModal(true)
                        : setAlertModal(true);
                    }}
                  >
                    <i className="material-icons-outlined">format_shapes</i>
                    Send Selected to PRO Editor
                  </a>
                )}
              </div>
              <p className="count-gallery">
                Total Count: {filteredData?.length}
              </p>
            </div>
          </div>

          <GalleryCard
            permissions={permissions}
            project={project}
            gallery={filteredData}
            selectType={selectType}
            allSelected={allSelected}
            toggleSelected={toggleSelected}
            selected={selected}
            limit={limit}
            start={start}
            setStart={setStart}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          <div id="image-details" className="show-details" />
        </>
      ) : (
        <>
          {!!parseInt(permissions?.gallery?.create) && (
            <div className="secondary-navigation nav-top">
              <a
                href="#"
                className="add-new uploadFile"
                onClick={() => {
                  setOpenDrawerUpload(true);
                }}
              >
                <i className="material-icons-outlined">add_photo_alternate</i>
                Add new
              </a>
            </div>
          )}
          <p>This project has no files associated yet.</p>
        </>
      )}

      {alertModal && (
        <Modal
          displayModal={alertModal}
          closeModal={() => setAlertModal(false)}
          title="Alert"
          body="Please select any image"
          Button2Text="Ok"
          handleButton2Modal={() => setAlertModal(false)}
        />
      )}

      {openDeleteModal && (
        <Modal
          displayModal={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          title="Confirmation"
          body={
            imagesSelecteds?.length > 1
              ? "Are you sure you’d like to delete the images? Please note: If any of the images <br/> have Revisions, these will also be deleted."
              : "Are you sure you’d like to delete the image? Please note: If the image <br/> has Revisions, these will also be deleted."
          }
          button1Text="Cancel"
          handleButton1Modal={() => setOpenDeleteModal(false)}
          Button2Text="Delete Image"
          handleButton2Modal={() => deleteAllImages()}
        />
      )}

      {openPROModal && (
        <Modal
          displayModal={openPROModal}
          closeModal={() => setOpenPROModal(false)}
          title="Confirmation"
          body={
            imagesSelecteds?.length > 1
              ? "Are you sure you’d like to move the images to the PRO Editor?"
              : "Are you sure you’d like to move the image to the PRO Editor?"
          }
          button1Text="Cancel"
          handleButton1Modal={() => setOpenPROModal(false)}
          Button2Text="Move Image"
          handleButton2Modal={() => moveImageToVxe()}
        />
      )}

      {messageToast && (
        <Toast
          type={typeToast}
          text={messageToast}
          handleToastOnClick={() => setMessageToast("")}
        />
      )}

      {openDrawerUpload && (
        <GalleryUpload
          project={project}
          chapter={chapter}
          show={openDrawerUpload}
          set={setOpenDrawerUpload}
        />
      )}
    </>
  );
}
