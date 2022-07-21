import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { downloadFile } from "../../../../utils/downloadFile";

export default function TocRow({
  permissions,
  chapter,
  showMoreInfo,
  dragHandleProps,
  handleEditModal,
  handleDeleteModal,
  handleChapterSelected,
  allChaptersSelected,
}) {
  const [chapterSelected, setChapterSelected] = useState(false);

  useEffect(() => {
    setChapterSelected(allChaptersSelected);
  }, [allChaptersSelected]);

  const selectChapter = (e) => {
    e.preventDefault();

    setChapterSelected(!chapterSelected);
    handleChapterSelected(chapter.id);
  };

  const handleDownload = async (e, filePath, fileFormat) => {
    e.preventDefault();

    if (filePath) {
      downloadFile(
        filePath,
        chapter?.name === ""
          ? `Untitled.${fileFormat}`
          : `${chapter?.name}.${fileFormat}`,
      );
    }
  };

  return (
    <>
      {!!parseInt(permissions?.toc.edit) && (
        <td className="ws toc-checkbox-item">
          <i
            {...dragHandleProps}
            className={
              chapterSelected
                ? "toc-dragger material-icons-outlined"
                : "toc-dragger material-icons-outlined hidden"
            }
          >
            drag_indicator
          </i>
          {!!parseInt(permissions?.toc.edit) && (
            <button
              className={
                chapterSelected ? "toc-checkbox active" : "toc-checkbox"
              }
              onClick={(e) => selectChapter(e)}
            >
              <i className="material-icons-outlined">
                {chapterSelected
                  ? "check_box_outline"
                  : "check_box_outline_blank"}
              </i>
            </button>
          )}
        </td>
      )}
      <td className="ws chapter-number" id={chapter.id}>
        {chapter.number}
      </td>

      {chapter.pageBlank == 1 ? (
        <td className="ws chapter-title">
          {" "}
          {chapter.toc_title == "" ? "Untitled" : chapter.toc_title}{" "}
          <div className="has-blank-page">
            <span>{chapter.pageBlank} blank page</span>
          </div>
        </td>
      ) : chapter.pageBlank > 1 ? (
        <td className="ws chapter-title">
          {chapter.toc_title == "" ? "Untitled" : chapter.toc_title}
          <div className="has-blank-page">
            <span>{chapter.pageBlank} blank pages</span>
          </div>
        </td>
      ) : (
        <td className="ws chapter-title">
          {chapter.toc_title == "" ? "Untitled" : chapter.toc_title}
        </td>
      )}

      <td className="chapter-name">
        <span className="chapterTitleElement">
          {chapter.name == "" ? "Untitled" : chapter.name}
        </span>
      </td>

      {!!parseInt(permissions?.toc.edit) && (
        <td
          className="ws toc-edit"
          // aria-chapterName={chapter.name}
          // aria-chapterBlankPages={chapter.pageBlank}
        >
          <span className="hidden">
            <button
              className="toc-edit-edit"
              onClick={(e) => handleEditModal(e, chapter.id, chapter.name)}
            >
              <i className="material-icons-outlined">edit</i>
            </button>

            {!!parseInt(permissions?.toc.delete) && (
              <button
                className="toc-edit-delete"
                onClick={(e) => handleDeleteModal(e, chapter.id, chapter.name)}
              >
                <i className="material-icons-outlined">delete</i>
              </button>
            )}
          </span>
        </td>
      )}

      <td className="ws">{chapter.startPage}</td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.pages}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.words}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.characters}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.specialCharacters}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.tables}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.images}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.wordEquations}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.mathEquations}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.footNotes}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.endNotes}
      </td>
      <td className={showMoreInfo ? "ws report" : "ws report hide"}>
        {chapter.references}
      </td>
      <td className={showMoreInfo ? "report" : "report hide"}>
        {Object.values(chapter?.tableCitations)?.map((table, index) => {
          return (
            <React.Fragment key={index}>
              {table.tableName}
              <br />
            </React.Fragment>
          );
        })}
      </td>
      <td className={showMoreInfo ? "report" : "report hide"}>
        {Object.values(chapter?.figureCitations)?.map((figure, index) => {
          return (
            <React.Fragment key={index}>
              {figure.figureName}
              <br />
            </React.Fragment>
          );
        })}
      </td>

      <td className={showMoreInfo ? "ws files hide" : "ws files"}>
        {Object.values(chapter?.files)?.map((file) => {
          return (
            !!parseInt(permissions?.toc.download) && (
              <a
                onClick={(e) => {
                  handleDownload(e, file?.link, file?.format);
                }}
                key={file.link}
                href="#"
                data-src={file.link}
                data-src-name={chapter.name}
                data-src-format={file.format}
                className="download-chapter"
              >
                <img src={`/assets/icons/${file.format}.svg`} />
              </a>
            )
          );
        })}
      </td>
      <td className="no-padding" />
    </>
  );
}
