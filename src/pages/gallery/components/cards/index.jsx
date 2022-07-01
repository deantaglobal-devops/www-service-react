import { useEffect, useState } from "react";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import UserPagination from "../../../../components/userPagination";
import ImageDetails from "../imageDetails";

export function GalleryCard({
  gallery,
  allSelected,
  selectType,
  toggleSelected,
  selected,
  limit,
  start,
  setStart,
  currentPage,
  setCurrentPage,
  permissions,
  project,
}) {
  const [filterProjects, setFilterProjects] = useState([]);
  const [openDetails, setOpenDetails] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    setFilterProjects(gallery);
  }, [gallery, selectType]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  return (
    <>
      <div id="gallery-card-container">
        <div className="mt-4" id="gallery-card-container">
          <div className="mt-2 tab-content gallery-list" id="gallery-table">
            {(selectType === "all"
              ? filterProjects
              : filterProjects.filter((item) => item.type.includes(selectType))
            )
              .slice(start, start + limit)
              .map((item, index) => (
                <div
                  className={
                    selected[item.document_id]
                      ? `gallery-itens ${item?.typefile}-type all-type selected`
                      : `gallery-itens ${item?.typefile}-type all-type`
                  }
                  id={`gallery-item-${item.document_id}`}
                  key={item.document_id + index}
                >
                  <div className="gallery-box" id="gallery-{i}">
                    {!!Number(permissions?.gallery.edit) && (
                      <div className="pt-1 pl-1">
                        <label
                          htmlFor="editGallery"
                          className="pure-material-checkbox"
                        >
                          <input
                            id="editGallery"
                            type="checkbox"
                            data-documentid={item.document_id}
                            checked={selected[item.document_id] || allSelected}
                            onChange={toggleSelected(item.document_id)}
                          />
                          <span />
                        </label>
                      </div>
                    )}

                    <div
                      className="gallery-image-content"
                      onClick={() => {
                        setOpenDetails(item);
                        setOpenDrawer(true);
                      }}
                    >
                      {item.type === ".tif" ||
                      item.type === ".tiff" ||
                      item.type === "tif" ||
                      item.type === "tiff" ? (
                        <a
                          href="#"
                          className="open-details"
                          data-id={item.document_id}
                          data-src-name={item.document_name}
                          data-src={item.file_path}
                        >
                          <img
                            alt="tiff background"
                            className="gallery-image tif-background"
                            src={`/file/src/?path=${item.file_path}`}
                            data-documentid={item.document_id}
                          />
                        </a>
                      ) : item.type === ".eps" || item.type === "eps" ? (
                        <a
                          href="#"
                          className="open-details"
                          data-id={item.document_id}
                          data-src-name={item.document_name}
                          data-src={item.file_path}
                        >
                          <img
                            alt="gallery icon"
                            className="gallery-image just-icon"
                            src="/assets/icons/eps.svg"
                            data-documentid={item.document_id}
                          />
                        </a>
                      ) : (
                        <a
                          href="#"
                          className="open-details"
                          data-id={item.document_id}
                          data-src-name={item.document_name}
                          data-src={item.file_path}
                        >
                          <img
                            alt="gallery"
                            className="gallery-image"
                            src={`/file/src/?path=${item.file_path}`}
                            data-documentid={item.document_id}
                          />
                        </a>
                      )}
                    </div>
                    <div
                      className="info-image-content"
                      onClick={() => {
                        setOpenDetails(item);
                        setOpenDrawer(true);
                      }}
                    >
                      {item.document_name.length > 20 ? (
                        <Tooltip
                          direction="bottom-title"
                          content={item.document_name}
                        >
                          <h3 id="{{ assetsgallery.document_id}}">
                            {item.document_name}
                          </h3>
                        </Tooltip>
                      ) : (
                        <h3 id="{{ assetsgallery.document_id}}">
                          {item.document_name}
                        </h3>
                      )}
                      <p>{item.taskName}</p>
                      <p>{item.updatedDate}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {filterProjects.length > limit && (
            <UserPagination
              dataLength={filterProjects.length}
              start={start}
              limit={limit}
              currentPage={currentPage}
              handleNextPage={handleNextPage}
            />
          )}
        </div>
      </div>
      {openDrawer && (
        <ImageDetails
          project={project}
          data={openDetails}
          show={openDrawer}
          set={setOpenDrawer}
          permissions={permissions}
        />
      )}
    </>
  );
}
