import { useState } from "react";
import { api } from "../../../../services/api";
import ModalForm from "../../../../components/ModalForm/modalForm";
import Dropdown from "../../../../components/dropdown/dropdown";
import Input from "../../../../components/input/input";
import DatePicker from "../../../../components/datePicker/datePicker";
import Loading from "../../../../components/loader/Loading";

import "./styles/editBookModal.styles.css";

const newLxe = [
  {
    id: 1,
    value: "VXE FP",
  },
  {
    id: 2,
    value: "VXE",
  },
  {
    id: 3,
    value: "VXE LITE AQR",
  },
  {
    id: 4,
    value: "VXE LITE FP",
  },
  {
    id: 5,
    value: "VXE LIT",
  },
];

const indexer = [
  {
    id: 1,
    value: "Deanta",
    labelDropdown: "Deanta",
  },
  {
    id: 2,
    value: "Author",
    labelDropdown: "Author",
  },
  {
    id: 3,
    value: "Freelancer",
    labelDropdown: "Freelancer",
  },
];

const projectPriority = [
  {
    id: 0,
    value: "Low Priority",
    labelDropdown: "Low Priority",
  },
  {
    id: 1,
    value: "Medium Priority",
    labelDropdown: "Medium Priority",
  },
  {
    id: 2,
    value: "High Priority",
    labelDropdown: "High Priority",
  },
  {
    id: 3,
    value: "Demo Priority",
    labelDropdown: "Demo Priority",
  },
];

const xmlType = [
  {
    id: 1,
    value: "DOCBOOK",
  },
  {
    id: 2,
    value: "NLM",
  },
  {
    id: 3,
    value: "DOCBOOK/MathML",
  },
  {
    id: 4,
    value: "NLM/MathML",
  },
];

const complexityData = [
  {
    id: 1,
    value: "Simple",
  },
  {
    id: 2,
    value: "Medium",
  },
  {
    id: 3,
    value: "Complex",
  },
];

const zone = [
  {
    id: 1,
    value: "UK",
  },
  {
    id: 2,
    value: "US",
  },
];

const currency = [
  {
    id: 1,
    value: "Dollar",
  },
  {
    id: 2,
    value: "Euro",
  },
  {
    id: 3,
    value: "Yen",
  },
  {
    id: 4,
    value: "Pound",
  },
  {
    id: 5,
    value: "Rand",
  },
  {
    id: 6,
    value: "Rupee",
  },
  {
    id: 7,
    value: "Cent",
  },
  {
    id: 8,
    value: "Øre",
  },
  {
    id: 9,
    value: "Centavo",
  },
];

const indexType = [
  {
    id: 1,
    value: "Author",
  },
  {
    id: 2,
    value: "Publisher",
  },
  {
    id: 3,
    value: "Author and Publisher",
  },
];

export function EditBookModal({
  openEditBookModal,
  handleOnCloseEditBookModal,
  project,
  permissions,
}) {
  const [editBookData, setEditBookData] = useState(project);
  const [validateForm, setValidateForm] = useState({
    title: false,
    abbreviation: false,
    author: false,
    productionEditor: false,
  });
  const [bookImageUpdated, setBookImageUpdated] = useState("");
  const [bookImageFile, setBookImageFile] = useState("");

  const [projectManagerBriefUpdated, setProjectManagerBriefUpdated] =
    useState("");
  const [projectManagerBriefFile, setProjectManagerBriefFile] = useState("");

  const [materialAnalysisReportUpdated, setMaterialAnalysisReportUpdated] =
    useState("");
  const [materialAnalysisReportFile, setMaterialAnalysisReportFile] =
    useState("");

  const [isLoading, setIsLoading] = useState(false);
  const altDropVal = [
    {
      id: 1,
      value: "Yes",
    },
    {
      id: 1,
      value: "No",
    },
  ];

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (name === "author") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, author: true });
          } else {
            setValidateForm({ ...validateForm, author: false });
          }
        } else if (name === "productionEditor") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, productionEditor: true });
          } else {
            setValidateForm({ ...validateForm, productionEditor: false });
          }
        } else if (name === "title") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, title: true });
          } else {
            setValidateForm({ ...validateForm, title: false });
          }
        } else if (name === "abbreviation") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, abbreviation: true });
          } else {
            setValidateForm({ ...validateForm, abbreviation: false });
          }
        }

        if (e.target.type == "checkbox") {
          setEditBookData({
            ...editBookData,
            [e.target.name]: +e.target.checked,
          }); // + => 'Convert true and false to 1 and 0'
        } else {
          setEditBookData((prevState) => ({
            ...prevState,
            [name]: value || "",
          }));
        }
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = e.target.getAttribute("data-value");
        const keyValue = JSON.parse(e.target.getAttribute("data-id"));

        if (
          eleName === "companyId" ||
          eleName === "projectManager" ||
          eleName === "indexer" ||
          eleName === "projectPriority" ||
          eleName === "newLxe" ||
          eleName === "typeCategory" ||
          eleName === "category" ||
          eleName === "xmlType" ||
          eleName === "pmComplexity" ||
          eleName === "ceComplexity" ||
          eleName === "tsComplexity" ||
          eleName === "complexity" ||
          eleName === "zone" ||
          eleName === "currency" ||
          eleName === "indexType"
        ) {
          if (eleName === "companyId") {
            setEditBookData((prevState) => ({
              ...prevState,
              [eleName]: keyValue.id ? keyValue.id : "",
              client: keyValue.value ? keyValue.value : "",
            }));
          } else if (eleName === "projectManager") {
            setEditBookData((prevState) => ({
              ...prevState,
              [eleName]: keyValue.value ? keyValue.value : "",
              projectManagerId: keyValue.id ? keyValue.id : "",
            }));
          } else if (
            eleName === "indexer" ||
            eleName === "projectPriority" ||
            eleName === "newLxe" ||
            eleName === "typeCategory" ||
            eleName === "category" ||
            eleName === "pmComplexity" ||
            eleName === "ceComplexity" ||
            eleName === "tsComplexity" ||
            eleName === "xmlType" ||
            eleName === "complexity" ||
            eleName === "zone" ||
            eleName === "currency" ||
            eleName === "indexType"
          ) {
            setEditBookData((prevState) => ({
              ...prevState,
              [eleName]: keyValue || "",
            }));
          }
        } else {
          setEditBookData((prevState) => ({
            ...prevState,
            [eleName]: eleValue || "",
          }));
        }
      }
    }
  };

  const handleBookImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      setBookImageUpdated(URL.createObjectURL(img));
      setBookImageFile(img);
    }
  };

  const handlePmMaFile = (event, isPMbrief) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (isPMbrief) {
        setProjectManagerBriefUpdated(URL.createObjectURL(file));
        setProjectManagerBriefFile(file);
      } else {
        setMaterialAnalysisReportUpdated(URL.createObjectURL(file));
        setMaterialAnalysisReportFile(file);
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("cover-image", bookImageFile);
    formData.append("coverFlag", bookImageUpdated ? 0 : 1);
    formData.append("Projects[project_name]", editBookData.title);
    formData.append("Projects[project_id]", editBookData.projectId);
    formData.append("Projects[subtitle]", editBookData.subtitle);
    formData.append("Projects[company_id]", editBookData.companyId);
    formData.append("Projects[project_description]", editBookData.description);
    formData.append("Projects[author]", editBookData.author);
    formData.append("Projects[author_mailid]", editBookData.authorMailid);
    formData.append(
      "Projects[production_editor]",
      editBookData.productionEditor,
    );
    formData.append(
      "Projects[productioneditor_mailid]",
      editBookData.editorMailid,
    );
    formData.append("Projects[project_manager]", editBookData.projectManagerId);
    formData.append(
      "Projects[project_manager_name]",
      editBookData.projectManager,
    );
    formData.append("Projects[Indexer]", editBookData.indexer.id);
    formData.append("Projects[binding]", editBookData.binding);
    formData.append("Projects[series]", editBookData.series);
    formData.append("Projects[bisac_code]", editBookData.bisacCode);
    formData.append("Projects[bisac_value]", editBookData.bisacValue);
    formData.append(
      "Projects[originator_1_phone]",
      editBookData.originator1Phone,
    );
    formData.append(
      "Projects[originator_1_details]",
      editBookData.originator1Details,
    );
    formData.append("Projects[text_design]", editBookData.textDesign);
    formData.append("Projects[typeface]", editBookData.typeface);
    formData.append("Projects[Imprint]", editBookData.imprint);
    formData.append("Projects[interior_colour]", editBookData.interiorColour);
    formData.append("Projects[line_figures]", editBookData.lineFigures);
    formData.append("Projects[half_tones]", editBookData.halfTones);
    formData.append("Projects[tables]", editBookData.tables);
    formData.append("Projects[volume]", editBookData.volume);
    formData.append("Projects[job_number]", editBookData.jobNumber);
    formData.append("Projects[dac]", editBookData.dac);
    formData.append("Projects[pantone]", editBookData.pantone);
    formData.append(
      "Projects[project_priority]",
      editBookData.projectPriority.id,
    );
    formData.append("Projects[template]", editBookData.template);
    formData.append("Projects[new_lxe]", editBookData.newLxe.id);
    formData.append("Projects[doi]", editBookData.doi);
    formData.append("Projects[isbn]", editBookData.isbn);
    formData.append("Projects[ebook_master]", editBookData.ebookMaster);
    formData.append("Projects[ebook_pdf]", editBookData.ebookPdf);
    formData.append("Projects[ebook_set]", editBookData.ebookSet);
    formData.append("Projects[hardback_isbn]", editBookData.hardbackIsbn);
    formData.append("Projects[paperback_isbn]", editBookData.paperbackIsbn);
    formData.append("Projects[epub_isbn]", editBookData.epubIsbn);
    formData.append("Projects[epub2_isbn]", editBookData.epub2Isbn);
    formData.append("Projects[mobi_isbn]", editBookData.mobiIsbn);
    formData.append("Projects[bookcode]", editBookData.bookcode);
    formData.append("Projects[edition]", editBookData.edition);
    formData.append("Projects[tps]", editBookData.tps);
    formData.append("Projects[published_date]", editBookData.publishedDate);
    formData.append("Projects[project_startDate]", editBookData.startDate);
    formData.append("Projects[project_endDate]", editBookData.endDate);
    formData.append("Projects[type]", editBookData.typeCategory.id);
    formData.append("Projects[currency_id]", editBookData.category.id);
    formData.append("Projects[xml_type]", editBookData.xmlType.id);
    formData.append("Projects[PM_Complexity]", editBookData.pmComplexity.id);
    formData.append("Projects[CE_Complexity]", editBookData.ceComplexity.id);
    formData.append("Projects[TS_Complexity]", editBookData.tsComplexity.id);
    formData.append("Projects[complexity]", editBookData.complexity.id);
    formData.append("Projects[abbreviation]", editBookData.abbreviation);
    formData.append(
      "Projects[multipleauthor_status]",
      editBookData.multipleauthorStatus,
    );
    formData.append("Projects[chapter_wise]", editBookData.chapterWise);
    formData.append("Projects[isbn10]", editBookData.isbn10);
    formData.append("Projects[collect_footnote]", editBookData.collectFootnote);
    formData.append(
      "Projects[content_generation]",
      editBookData.contentGeneration,
    );
    formData.append("Projects[project_hold]", editBookData.projectHold);
    formData.append("Projects[aitrigger]", editBookData.aitrigger);
    formData.append("Projects[fmbmisvisible]", editBookData.fmbmisvisible);
    formData.append("Projects[projectactive]", editBookData.projectActive);
    formData.append("Projects[equations]", editBookData.equations);
    formData.append("Projects[deliverables_pdf]", editBookData.deliverablesPdf);
    formData.append(
      "Projects[deliverables_ebooks]",
      editBookData.deliverablesEbooks,
    );
    formData.append("Projects[deliverables_xml]", editBookData.deliverablesXml);
    formData.append(
      "Projects[offshore_indexing]",
      editBookData.offshoreIndexing,
    );
    formData.append("Projects[Toc_abbr]", editBookData.tocAbbr);
    formData.append("Projects[Offshore_PM]", editBookData.offshorePm);
    formData.append("Projects[page_count]", editBookData.pageCount);
    formData.append("Projects[word_count]", editBookData.wordCount);
    formData.append("Projects[zone]", editBookData.zone.id);
    formData.append("Projects[currency]", editBookData.currency.id);
    formData.append("Projects[index_type]", editBookData.indexType.id);
    formData.append("Projects[other_cost]", editBookData.otherCost);
    formData.append(
      "Projects[other_cost_description]",
      editBookData.otherCostDescription,
    );
    formData.append(
      "Projects[alt_text]",
      editBookData?.altText && editBookData?.altText !== "null"
        ? editBookData?.altText
        : "",
    );
    formData.append(
      "Projects[altTextSupply]",
      editBookData?.altTextSupply ? editBookData?.altTextSupply : "",
    );

    formData.append("pmbrief", projectManagerBriefFile);
    formData.append("pmbriefFlag", projectManagerBriefUpdated ? 0 : 1);

    formData.append("materialanalysis", materialAnalysisReportFile);
    formData.append("marFlag", materialAnalysisReportUpdated ? 0 : 1);

    const token = localStorage.getItem("lanstad-token");

    await fetch(`${import.meta.env.VITE_URL_API_SERVICE}/project/update/sbmt`, {
      method: "POST",
      headers: {
        "Lanstad-Token": token,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(
        (msg) => {
          const { projectId } = msg;
          const chapterId = 0;
          const { categoryChangedFlag } = msg;
          if (categoryChangedFlag == 1) {
            specialInstructionDelete(projectId, chapterId);
          } else {
            location.reload();
          }
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );
    setIsLoading(false);
  };

  const specialInstructionDelete = async (_projectId, _chapterId) => {
    await api
      .post("/checklist/specialinstruction/delete", {
        projectId: _projectId,
        chapterId: _chapterId,
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <ModalForm show={openEditBookModal}>
        <div className="project-general-forms" id="edit-book">
          <div className="modal-header">
            <h5 className="modal-title" id="new_book_modal">
              Edit Book
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={(e) => handleOnCloseEditBookModal(e)}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="modal-body" id="project-updateform">
            <h3>General</h3>
            <div className="general-info">
              <div className="left-side flex-side">
                <div className="thumb-project" id="thumb-journal">
                  {bookImageUpdated === "" ? (
                    <img
                      alt="issue cover"
                      className="profile-image"
                      id="IssuecoverImage"
                      src={`/file/src/?path=/epublishing/books/${editBookData?.projectImage}&storage=blob`}
                    />
                  ) : (
                    <img
                      alt="journal cover"
                      className="profile-image"
                      id="JournalcoverImage"
                      src={bookImageUpdated}
                    />
                  )}

                  <i className="material-icons-outlined">add_photo_alternate</i>
                  <input
                    type="file"
                    className="image-file-input"
                    id="cover-image"
                    name="cover-image"
                    onChange={handleBookImage}
                  />
                </div>

                <div className="half-side" style={{ marginRight: `${10}px` }}>
                  {/* Name */}
                  <Input
                    label="Name *"
                    name="title"
                    value={editBookData?.title ? editBookData?.title : ""}
                    titleError="Please enter the Project Title."
                    hasError={validateForm?.title}
                    onChange={(e) => handleOnChange(e)}
                    maxLength="200"
                  />

                  {/* Subtitle */}
                  <Input
                    label="Subtitle"
                    name="subtitle"
                    value={editBookData?.subtitle ?? ""}
                    onChange={(e) => handleOnChange(e)}
                  />

                  {project.client === "" ? (
                    <Dropdown
                      label="Client"
                      name="client"
                      value={editBookData?.client ?? ""}
                      valuesDropdown={editBookData?.companyList.map(
                        (company, index) => {
                          return {
                            id: index,
                            value: company.company_id,
                            labelDropdown: company.company_name,
                          };
                        },
                      )}
                      handleOnChange={(e) => handleOnChange(e)}
                      iconName="keyboard_arrow_down"
                      iconClassName="material-icons"
                    />
                  ) : (
                    // Client
                    <Input
                      label="Client"
                      name="client"
                      value={editBookData?.client ?? ""}
                      // onChange={(e) => handleOnChange(e)}
                      disabled="disabled"
                      readOnly
                    />
                  )}
                </div>
              </div>
              <div className="right-side">
                <div className="wrap-field-label">
                  <label className="label-form">Description</label>
                  <textarea
                    className="default-textarea"
                    name="description"
                    value={editBookData?.description ?? ""}
                    onChange={(e) => handleOnChange(e)}
                  />
                </div>
              </div>
            </div>

            {/* This is inside the Book Edit Modal */}
            <h3>Settings/Additional Information</h3>
            <div className="full-info-grid">
              <div className="f-col">
                {/* Author */}
                <Input
                  label="Author *"
                  name="author"
                  value={editBookData?.author ?? ""}
                  titleError="Please enter the Author."
                  hasError={validateForm?.author ?? ""}
                  onChange={(e) => handleOnChange(e)}
                  required
                />

                {/* Author mail ID */}
                <Input
                  label="Author mail ID"
                  name="authorMailid"
                  value={editBookData?.authorMailid ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Production editor */}
                <Input
                  label="Production editor *"
                  name="productionEditor"
                  value={editBookData?.productionEditor ?? ""}
                  titleError="Please enter the Production Editor."
                  hasError={validateForm?.productionEditor}
                  onChange={(e) => handleOnChange(e)}
                  required
                />

                {/* Production edito mail ID */}
                <Input
                  label="Production edito mail ID"
                  name="editorMailid"
                  value={editBookData?.editorMailid ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {parseInt(permissions?.books?.edit_project_manager) ? (
                  <Dropdown
                    label="Project manager"
                    name="projectManager"
                    value={editBookData?.projectManager ?? ""}
                    valuesDropdown={editBookData?.PMList.filter(
                      (pmdata, index, self) =>
                        index ===
                        self.findIndex(
                          (t) =>
                            t.user_id === pmdata.user_id &&
                            t.username === pmdata.username,
                        ),
                    ).map((pmdata) => {
                      return {
                        id: pmdata.user_id,
                        value: pmdata.username,
                      };
                    })}
                    handleOnChange={(e) => handleOnChange(e)}
                    iconName="keyboard_arrow_down"
                    iconClassName="material-icons"
                  />
                ) : (
                  // Project manager
                  <Input
                    label="Project manager"
                    name="projectManagerId"
                    value={editBookData?.projectManager ?? ""}
                    readOnly
                  />
                )}

                <Dropdown
                  label="Indexer"
                  name="indexer"
                  value={editBookData?.indexer?.value ?? ""}
                  valuesDropdown={indexer}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Binding */}
                <Input
                  label="Binding"
                  name="binding"
                  value={editBookData?.binding ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Series */}
                <Input
                  label="Series"
                  name="series"
                  value={editBookData?.series ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Bisac code */}
                <Input
                  label="Bisac code"
                  name="bisacCode"
                  value={editBookData?.bisacCode ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Bisac value */}
                <Input
                  label="Bisac value"
                  name="bisacValue"
                  value={editBookData?.bisacValue ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Originator phone */}
                <Input
                  label="Originator phone"
                  name="originator1Phone"
                  value={editBookData?.originator1Phone ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Originator details */}
                <Input
                  label="Originator details"
                  name="originator1Details"
                  value={editBookData?.originator1Details ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Text design */}
                <Input
                  label="Text design"
                  name="textDesign"
                  value={editBookData?.textDesign ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Typeface */}
                <Input
                  label="Typeface"
                  name="typeface"
                  value={editBookData?.typeface ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Imprint */}
                <Input
                  label="Imprint"
                  name="imprint"
                  value={editBookData?.imprint ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Interior colour */}
                <Input
                  label="Interior colour"
                  name="interiorColour"
                  value={editBookData?.interiorColour ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  maxLength="3"
                />

                {/* Nº of line figures */}
                <Input
                  label="Nº of line figures"
                  name="lineFigures"
                  value={editBookData?.lineFigures ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  maxLength="3"
                />

                {/* Nº of half tones */}
                <Input
                  label="Nº of half tones"
                  name="halfTones"
                  value={editBookData?.halfTones ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  maxLength="3"
                />

                {/* Nº of tables */}
                <Input
                  label="Nº of tables"
                  name="tables"
                  value={editBookData?.tables ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  maxLength="3"
                />

                {/* Volume */}
                <Input
                  label="Volume"
                  name="volume"
                  value={editBookData?.volume ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  maxLength="3"
                />

                {/* Job number */}
                <Input
                  label="Job number"
                  name="jobNumber"
                  value={editBookData?.jobNumber ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* DAC */}
                <Input
                  label="DAC"
                  name="dac"
                  value={editBookData?.dac ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Pantone */}
                <Input
                  label="Pantone"
                  name="pantone"
                  value={editBookData?.pantone ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                <Dropdown
                  label="Project priority"
                  name="projectPriority"
                  value={editBookData?.projectPriority?.value ?? ""}
                  valuesDropdown={projectPriority}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Template Name */}
                <Input
                  label="Template Name"
                  name="template"
                  value={editBookData?.template ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="m-col">
                <Dropdown
                  label="Editor type"
                  name="newLxe"
                  value={editBookData?.newLxe?.value ?? ""}
                  valuesDropdown={newLxe}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* DOI */}
                <Input
                  label="DOI"
                  name="doi"
                  value={editBookData?.doi ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* ISBN */}
                <Input
                  label="ISBN *"
                  name="isbn"
                  value={editBookData?.isbn ?? ""}
                  titleError="Please enter the ISBN Number."
                  hasError={validateForm?.title}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                  required
                  maxLength="13"
                />

                {/* E-Book master ISBN */}
                <Input
                  label="E-Book master ISBN"
                  name="ebookMaster"
                  value={editBookData?.ebookMaster ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* E-Book PDF ISBN */}
                <Input
                  label="E-Book PDF ISBN"
                  name="ebookPdf"
                  value={editBookData?.ebookPdf ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* E-Book set */}
                <Input
                  label="E-Book set"
                  name="ebookSet"
                  value={editBookData?.ebookSet ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Hardback ISBN */}
                <Input
                  label="Hardback ISBN"
                  name="hardbackIsbn"
                  value={editBookData?.hardbackIsbn ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* Paperback ISBN */}
                <Input
                  label="Paperback ISBN"
                  name="paperbackIsbn"
                  value={editBookData?.paperbackIsbn ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* ePUB ISBN */}
                <Input
                  label="ePUB ISBN"
                  name="epubIsbn"
                  value={editBookData?.epubIsbn ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* ePUB2 ISBN */}
                <Input
                  label="ePUB2 ISBN"
                  name="epub2Isbn"
                  value={editBookData?.epub2Isbn ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* Mobi ISBN */}
                <Input
                  label="Mobi ISBN"
                  name="mobiIsbn"
                  value={editBookData?.mobiIsbn ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* Book code */}
                <Input
                  label="Book code"
                  name="bookcode"
                  value={editBookData?.bookcode ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Edition */}
                <Input
                  label="Edition"
                  name="edition"
                  value={editBookData?.edition ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* TPS */}
                <Input
                  label="TPS"
                  name="tps"
                  value={editBookData?.tps ?? ""}
                  onChange={(e) => {
                    if (isFinite(e.target.value)) {
                      handleOnChange(e);
                    }
                  }}
                />

                {/* Publication date */}
                <DatePicker
                  type="month"
                  name="publishedDate"
                  label="Publication date"
                  defaultValue={new Date(editBookData?.publishedDate)}
                  getSelectedDate={(event) => handleOnChange(event)}
                />

                {/* Start date */}
                <DatePicker
                  type="date"
                  name="startDate"
                  label="Start date *"
                  defaultValue={editBookData?.startDate
                    .split("/")
                    .reverse()
                    .join("-")}
                  getSelectedDate={(event) => handleOnChange(event)}
                />

                {/* <div className="wrap-field-label">
                <label className="label-form">Start date *</label>
                <div className="content-datepicker">
                  <input
                    type="text"
                    className="form-control datepicker"
                    name="Projects[project_startDate]"
                    value={project.startDate}
                    required
                  />
                  <i className="material-icons-outlined">calendar_today</i>
                  <div className="invalid-feedback">
                    Please enter the start date.
                  </div>
                  <span
                    className="validation-error hide"
                    style={{ color: 'var(--red' }}
                  >
                    Start date can not be after end date
                  </span>
                </div>
              </div> */}

                {/* End date */}
                <DatePicker
                  type="date"
                  name="endDate"
                  label="End date *"
                  defaultValue={editBookData?.endDate
                    .split("/")
                    .reverse()
                    .join("-")}
                  getSelectedDate={(event) => handleOnChange(event)}
                />
                {/* <div className="wrap-field-label">
                <label className="label-form">End date *</label>
                <div className="content-datepicker">
                  <input
                    type="text"
                    className="form-control datepicker"
                    name="Projects[project_endDate]"
                    value={project.endDate}
                    required
                  />
                  <i className="material-icons-outlined">calendar_today</i>
                  <div className="invalid-feedback">
                    Please enter the end date.
                  </div>
                </div>
              </div> */}

                <Dropdown
                  label="Type"
                  name="typeCategory"
                  value={editBookData?.typeCategory?.valu ?? ""}
                  valuesDropdown={editBookData?.TypeList.map((type) => {
                    return {
                      id: type.type_id,
                      value: type.type_name,
                    };
                  })}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <div className="wrap-field-label">
                  <div className="deanta-toast-alert warning category-warning hidden">
                    <i className="material-icons-outlined">warning</i>
                    <p className="deanta-toast-text">
                      Changing Category will reschedule project dates & reset
                      tasks. This can not be undone.
                    </p>
                  </div>

                  <Dropdown
                    label="Category"
                    name="category"
                    value={editBookData?.category?.value ?? ""}
                    valuesDropdown={editBookData?.CategoryList.map(
                      (category) => {
                        return {
                          id: category.category_id,
                          value: category.category_name,
                        };
                      },
                    )}
                    handleOnChange={(e) => handleOnChange(e)}
                    iconName="keyboard_arrow_down"
                    iconClassName="material-icons"
                  />
                </div>

                <Dropdown
                  label="XML type"
                  name="xmlType"
                  value={editBookData?.xmlType?.value ?? ""}
                  valuesDropdown={xmlType}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="PM complexity"
                  name="pmComplexity"
                  value={editBookData?.pmComplexity?.value ?? ""}
                  valuesDropdown={complexityData}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="CE complexity"
                  name="ceComplexity"
                  value={editBookData?.ceComplexity?.value ?? ""}
                  valuesDropdown={complexityData}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="TS complexity"
                  name="tsComplexity"
                  value={editBookData?.tsComplexity?.value ?? ""}
                  valuesDropdown={complexityData}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="Complexity"
                  name="complexity"
                  value={editBookData?.complexity?.value ?? ""}
                  valuesDropdown={Object.keys(editBookData.complexityList).map(
                    (keys, index) => {
                      return {
                        id: index,
                        value: editBookData.complexityList[keys],
                        // labelDropdown: editBookData.complexityList[keys],
                      };
                    },
                  )}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Template Abbreviation */}
                <Input
                  label="Template Abbreviation"
                  name="abbreviation"
                  value={editBookData?.abbreviation ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="l-col">
                <div className="wrap-field-label2">
                  <label className="label-radio">Settings</label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="multipleauthor_status"
                      name="multipleauthorStatus"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.multipleauthorStatus == 1}
                    />
                    <span>Multiple Author</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="chapter_wise"
                      name="chapterWise"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.chapterWise == 1}
                    />
                    <span>Chapter Module</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="isbn10"
                      name="isbn10"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.isbn10 == 1}
                    />
                    <span>TOC</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="collect_footnote"
                      name="collectFootnote"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.collectFootnote == 1}
                    />
                    <span>Collect Footnote</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="content_generation"
                      name="contentGeneration"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.contentGeneration == 1}
                    />
                    <span>Collect TOC</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="project_hold"
                      name="projectHold"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.projectHold == 1}
                    />
                    <span>Project hold</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="aitrigger"
                      name="aitrigger"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.aitrigger == 1}
                    />
                    <span>AI-trigger</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="fmbmisvisible"
                      name="fmbmisvisible"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.fmbmisvisible == 1}
                    />
                    <span>Show DM/BM section to multiple contributor</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="projectactive"
                      name="projectActive"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.projectActive == 1}
                    />
                    <span>Project Active</span>
                  </label>
                  <label className="pure-material-checkbox">
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      id="equations"
                      name="equations"
                      onChange={(e) => handleOnChange(e)}
                      checked={editBookData.equations == 1}
                    />
                    <span>Contains Equations</span>
                  </label>
                </div>
                <div className="wrap-field-label">
                  <label className="label-form">Proof</label>
                  <input
                    className="default-input-text"
                    type="text"
                    onChange={(e) => handleOnChange(e)}
                    name="proof"
                    value={editBookData?.proof ? editBookData.proof : ""}
                  />
                </div>
                <div className="wrap-field-label">
                  <label className="label-radio">Deliverables PDF</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_pdf"
                        value="Yes"
                        name="deliverablesPdf"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={editBookData.deliverablesPdf == "Yes"}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_pdf"
                        value="No"
                        name="deliverablesPdf"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={editBookData.deliverablesPdf == "No"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="wrap-field-label">
                  <label className="label-radio">Deliverables E-Books</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_ebooks"
                        value="Yes"
                        name="deliverablesEbooks"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={
                          editBookData.deliverablesEbooks == "Yes"
                        }
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_ebooks"
                        value="No"
                        name="deliverablesEbooks"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={editBookData.deliverablesEbooks == "No"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="wrap-field-label">
                  <label className="label-radio">Deliverables XML</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_xml"
                        value="Yes"
                        name="deliverablesXml"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={editBookData.deliverablesXml == "Yes"}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_xml"
                        value="No"
                        name="deliverablesXml"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={editBookData.deliverablesXml == "No"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="wrap-field-label">
                  <label className="label-radio">Deliverables Indexing</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="offshore_indexing"
                        value="Yes"
                        name="offshoreIndexing"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={
                          editBookData.offshoreIndexing == "Yes"
                            ? "checked"
                            : ""
                        }
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="offshore_indexing"
                        value="No"
                        name="offshoreIndexing"
                        onChange={(e) => handleOnChange(e)}
                        defaultChecked={
                          editBookData.offshoreIndexing == "No" ? "checked" : ""
                        }
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* TOC abbreviation */}
                <Input
                  label="TOC abbreviation"
                  name="tocAbbr"
                  value={editBookData?.tocAbbr ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Offshore PM */}
                <Input
                  label="Offshore PM"
                  name="offshorePm"
                  value={editBookData?.offshorePm ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Client's estimated extent */}
                <Input
                  label={"Client's estimated extent"}
                  name="pageCount"
                  value={editBookData?.pageCount ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                {/* Word count */}
                <Input
                  label="Word count"
                  name="wordCount"
                  value={editBookData?.wordCount ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />

                <Dropdown
                  label="Origin"
                  name="zone"
                  value={editBookData?.zone?.value ?? ""}
                  valuesDropdown={zone}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="Currency"
                  name="currency"
                  value={editBookData?.currency?.value ?? ""}
                  valuesDropdown={currency}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <Dropdown
                  label="Index type"
                  name="indexType"
                  value={editBookData?.indexType?.value ?? ""}
                  valuesDropdown={indexType}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Other cost */}
                <Input
                  label="Other cost"
                  name="otherCost"
                  value={editBookData?.otherCost ?? ""}
                  onChange={(e) => handleOnChange(e)}
                />
                <div className="wrap-field-label">
                  <label className="label-form">Other cost description</label>
                  <textarea
                    className="default-textarea"
                    name="otherCostDescription"
                    value={
                      editBookData?.otherCostDescription
                        ? editBookData?.otherCostDescription
                        : ""
                    }
                    onChange={(e) => handleOnChange(e)}
                  />
                </div>

                <Dropdown
                  label="Alt Text Supplied"
                  name="altTextSupply"
                  value={editBookData?.altTextSupply ?? ""}
                  valuesDropdown={altDropVal}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />
                <Dropdown
                  label="Alt Text Supplied Creation"
                  name="altText"
                  value={
                    editBookData?.altText && editBookData?.altText !== "null"
                      ? editBookData?.altText
                      : ""
                  }
                  valuesDropdown={altDropVal}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                <div className="wrap-field-label">
                  {editBookData.pmbrief && editBookData.pmbriefLink ? (
                    <>
                      <label
                        className="label-form"
                        htmlFor="pmbrief"
                        style={{ top: `${0}px` }}
                      >
                        Project Manager brief
                      </label>
                      <input
                        className="default-input-text"
                        type="text"
                        id="pmbriefinput"
                        value={
                          editBookData?.pmbrief ? editBookData?.pmbrief : ""
                        }
                        readOnly="readonly"
                        style={{ width: `${91}%` }}
                      />
                      <i
                        className="material-icons-outlined"
                        id="pmbriefdelete"
                        data-toggle="tooltip"
                        data-placement="top"
                        title=""
                        onClick={(e) => {
                          e.preventDefault();
                          setEditBookData({ ...editBookData, pmbrief: "" });
                        }}
                        data-original-title="Delete"
                      >
                        delete
                      </i>
                      <div
                        className="form-group pmbriefForm"
                        style={{ display: "none" }}
                      >
                        <input
                          type="file"
                          className="form-control-file"
                          name="pmbrief"
                          id="pmbrief"
                          accept="application/pdf,application/msword,.docx,doc"
                        />
                        <div
                          className="errorMessage"
                          id="pmbriefError"
                          style={{ display: "none" }}
                        />
                      </div>
                      <input
                        type="hidden"
                        name="pmbriefFlag"
                        id="pmbriefFlag"
                        value="1"
                      />
                    </>
                  ) : (
                    <>
                      <label
                        className="label-form"
                        htmlFor="pmbrief"
                        style={{ top: `${0}px` }}
                      >
                        Project Manager brief
                      </label>
                      <div className="form-group">
                        <input
                          type="file"
                          className="form-control-file"
                          name="pmbrief"
                          id="pmbrief"
                          accept="application/pdf,application/msword,.docx,doc"
                          onChange={(e) => handlePmMaFile(e, true)}
                        />
                        <div
                          className="errorMessage"
                          id="pmbriefError"
                          style={{ display: "none" }}
                        />
                      </div>
                      <input
                        type="hidden"
                        name="pmbriefFlag"
                        id="pmbriefFlag"
                        value="0"
                      />
                    </>
                  )}
                </div>

                <div className="wrap-field-label">
                  {editBookData.marSheet && editBookData.marSheetLink ? (
                    <>
                      <label
                        className="label-form"
                        htmlFor="materialanalysis"
                        style={{ top: `${0}px` }}
                      >
                        Material Analysis Report
                      </label>
                      <input
                        className="default-input-text"
                        type="text"
                        id="marinput"
                        value={
                          editBookData?.marSheet ? editBookData?.marSheet : ""
                        }
                        readOnly
                        style={{ width: `${91}%` }}
                      />
                      <i
                        className="material-icons-outlined"
                        id="mardelete"
                        data-toggle="tooltip"
                        data-placement="top"
                        title=""
                        data-original-title="Delete"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditBookData({ ...editBookData, marSheet: "" });
                        }}
                      >
                        delete
                      </i>
                      <div
                        className="form-group marForm"
                        style={{ display: "none" }}
                      >
                        <input
                          type="file"
                          className="form-control-file"
                          name="materialanalysis"
                          id="materialanalysis"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        <div
                          className="errorMessage"
                          id="materialanalysisError"
                          style={{ display: "none" }}
                        />
                      </div>
                      <input
                        type="hidden"
                        name="marFlag"
                        id="marFlag"
                        value="1"
                      />
                    </>
                  ) : (
                    <>
                      <label
                        className="label-form"
                        htmlFor="materialanalysis"
                        style={{ top: `${0}px` }}
                      >
                        Material Analysis Report
                      </label>
                      <div className="form-group">
                        <input
                          type="file"
                          className="form-control-file"
                          name="materialanalysis"
                          id="materialanalysis"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={(e) => handlePmMaFile(e, false)}
                        />
                        <div
                          className="errorMessage"
                          id="materialanalysisError"
                          style={{ display: "none" }}
                        />
                      </div>
                      <input
                        type="hidden"
                        name="marFlag"
                        id="marFlag"
                        value="0"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer cta-right">
            <button
              type="button"
              className="btn btn-outline-primary danger"
              data-dismiss="modal"
              onClick={(e) => handleOnCloseEditBookModal(e)}
            >
              Delete Book
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              data-dismiss="modal"
              onClick={(e) => handleOnCloseEditBookModal(e)}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="project-update-btn"
              className="btn btn-outline-primary"
              onClick={(e) => handleSubmitForm(e)}
            >
              Update
            </button>
          </div>
        </div>
      </ModalForm>
    </>
  );
}
