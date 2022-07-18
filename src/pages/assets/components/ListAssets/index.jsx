import { createRef, useEffect, useState } from "react";
import { api } from "../../../../services/api";

import Modal from "../../../../components/Modal/modal";
import UserPagination from "../../../../components/userPagination";
import ListAsset from "./ListAsset";
import Loading from "../../../../components/loader/Loading";
import { downloadFile } from "../../../../utils/downloadFile";

function ListAssets({ assets, permissions, project }) {
  const [filteredData, setFilteredData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [assetsSelecteds, setAssetsSelecteds] = useState([]);

  const [sorting, setSorting] = useState("updatedDate");
  const [nameType, setNameType] = useState("");
  const [ascDesc, setAscDesc] = useState(false);
  const [loading, setLoading] = useState("");

  const searchField = createRef();

  const ListingAssets = assets?.assetsList;

  useEffect(() => {
    setFilteredData(ListingAssets);
  }, []);

  const handleNextPage = (currentPage, pageClicked, _start, _limit) => {
    const defaultLimit = limit;
    let newStartPage = 0;
    let newLimitPage = defaultLimit - 1;
    if (currentPage === pageClicked) {
      return true;
    }
    if (pageClicked > currentPage) {
      newStartPage = _start + (pageClicked - currentPage) * defaultLimit;
      newLimitPage = _limit + defaultLimit * (pageClicked - currentPage);
    } else {
      newStartPage = _start - defaultLimit * (currentPage - pageClicked);
      newLimitPage = pageClicked * defaultLimit - 1;
    }
    setStart(newStartPage);
    setCurrentPage(pageClicked);

    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Search Function
  const searchHandle = (event) => {
    const value = event.target.value.toLowerCase();
    let result = [];
    result = ListingAssets.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(value),
      );
    });
    setNameType(event.target.value);
    setFilteredData(result);
  };

  async function downloadAll() {
    const allid = assetsSelecteds.join(",");

    const BodyRequest = {
      documentid: allid,
    };
    setLoading("downloading");
    await api
      .post("/project/assets/downloadallforAsset/", BodyRequest)
      .then((response) => {
        downloadFile(response.data.zipfilepath).then(() => {
          setLoading("");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const deleteAllAsset = async (documentId) => {
    const allid = documentId.join(",");

    const bodyRequest = {
      documentid: allid,
    };
    await api
      .post("/project/assets/deleteall", bodyRequest)
      .then(() => {
        window.location.reload();
        setAssetsSelecteds([]);
        setAllSelected(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteAsset = async (documentId) => {
    const bodyRequest = {
      documentid: documentId,
    };
    await api
      .post("/project/assets/delete", bodyRequest)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

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

  // Select Manager
  const selectedCount = Object.values(assetsSelecteds).filter(Boolean).length;
  const isAllSelected = selectedCount === filteredData?.length;

  useEffect(() => {
    const getKeys = () => {
      setAssetsSelecteds([]);
      for (const [key, value] of Object.entries(selected)) {
        if (value) {
          setAssetsSelecteds((assetsSelecteds) => [...assetsSelecteds, key]);
        }
      }
    };

    isAllSelected ? setAllSelected(true) : setAllSelected(false);

    getKeys();
  }, [selected, isAllSelected, filteredData]);

  return (
    <>
      <div className="head-actions">
        <div className="wrap-field-label">
          <div className="inputWrapper search-asset">
            <label className="label-form">Search Assets</label>
            <input
              className="default-input-text"
              type="text"
              placeholder="Search by: Name or File Type"
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
                searchField.current.focus();
                setFilteredData(ListingAssets);
              }}
              style={{ cursor: "pointer" }}
            >
              {!nameType ? "search" : "close"}
            </span>
          </div>
        </div>
        <div
          className={`secondary-navigation nav-top ${
            assetsSelecteds?.length > 0 && "active-assets"
          }`}
        >
          {/* <a
          href="#"
          className="delete-selection"
          onClick={() => {
            setOpenDeleteModal(true);
          }}
        >
          <i className="material-icons-outlined">delete</i>
          Delete Selected
        </a> */}
          <a href="#" className="select-all" onClick={toggleAllSelected}>
            <i className="material-icons-outlined">select_all</i>
            <span>
              {allSelected || isAllSelected ? "Deselect all" : "Select all"}
            </span>
          </a>
          <a
            href="#"
            className={`download-selected ${
              loading === "downloading" && "disabled-loading"
            }`}
            onClick={() => {
              if (loading !== "downloading") {
                downloadAll();
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
        </div>
      </div>
      <table className="table table-striped table-borderless table-oversize assets-list-table stages table-task table-assets">
        <thead>
          <tr>
            <th className="select-all">
              <label>
                <span>Select All</span>
                <input
                  type="checkbox"
                  className="select-all"
                  checked={allSelected || isAllSelected}
                  onChange={toggleAllSelected}
                />
              </label>
            </th>

            <th className="name">
              <div
                className={
                  sorting === "name"
                    ? "assets-head-table assets-head-table-active"
                    : "assets-head-table"
                }
                onClick={() => {
                  setSorting("name");
                  sorting === "name" ? setAscDesc(!ascDesc) : setAscDesc(true);
                }}
              >
                <span>Name</span>
                <i className="material-icons-outlined">
                  {sorting === "name" && ascDesc
                    ? "unfold_more"
                    : "unfold_less"}
                </i>
              </div>
            </th>

            <th>
              <div className="assets-head-table">
                <span>Task</span>
              </div>
            </th>
            <th className="modified">
              <div
                className={
                  sorting === "updatedDate"
                    ? "assets-head-table assets-head-table-active"
                    : "assets-head-table"
                }
                onClick={() => {
                  setSorting("updatedDate");
                  sorting === "updatedDate"
                    ? setAscDesc(!ascDesc)
                    : setAscDesc(true);
                }}
              >
                <span>Date Update</span>
                <i className="material-icons-outlined">
                  {sorting === "updatedDate" && ascDesc
                    ? "unfold_more"
                    : "unfold_less"}
                </i>
              </div>
            </th>
            <th>
              <div
                className={
                  sorting === "type"
                    ? "assets-head-table assets-head-table-active"
                    : "assets-head-table"
                }
                onClick={() => {
                  setSorting("type");
                  sorting === "type" ? setAscDesc(!ascDesc) : setAscDesc(true);
                }}
              >
                <span>Type</span>
                <i className="material-icons-outlined">
                  {sorting === "type" && ascDesc
                    ? "unfold_more"
                    : "unfold_less"}
                </i>
              </div>
            </th>
            <th />
            <th className="actions" />
          </tr>
        </thead>
        <tbody>
          {filteredData
            ?.sort(function (l, r) {
              return l[sorting] > r[sorting]
                ? ascDesc
                  ? 1
                  : -1
                : l[sorting] < r[sorting]
                ? ascDesc
                  ? -1
                  : 1
                : 1;
            })
            .slice(start, start + limit)
            .map((asset, index) => (
              <ListAsset
                project={project}
                permissions={permissions}
                asset={asset}
                toggleSelected={toggleSelected}
                selected={selected}
                allSelected={allSelected}
                assetsSelecteds={assetsSelecteds}
                key={`${asset.document_id} + ${index} + 2`}
              />
            ))}
        </tbody>
      </table>

      {filteredData?.length > limit && (
        <UserPagination
          dataLength={filteredData?.length}
          start={start}
          limit={limit}
          currentPage={currentPage}
          handleNextPage={handleNextPage}
        />
      )}

      {openDeleteModal && (
        <Modal
          displayModal={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          title="Confirmation"
          body="Are you sure you’d like to delete the Asset?"
          button1Text="Cancel"
          handleButton1Modal={() => setOpenDeleteModal(false)}
          Button2Text="Delete Selected Asset Only"
          handleButton2Modal={() => deleteAsset(assetsSelecteds)}
          Button3Text="Delete Selected Asset & All Revisions"
          handleButton3Modal={() => {
            deleteAllAsset(assetsSelecteds);
          }}
        />
      )}
    </>
  );
}

export default ListAssets;
