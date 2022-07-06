import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/modal";
import { api } from "../../../services/api";

import MilestoneList from "./milestonesTemplate";

import "./styles/template.styles.css";

function ClientTemplate(props) {
  const companyId = props.clientData.id;
  const [dataClients, setDataClients] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [createType, setCreateType] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const [typeId, setTypeId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [nameType, setNameType] = useState("");
  const [nameCategory, setNameCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicateType, setDuplicateType] = useState(false);
  const [duplicateCategory, setDuplicateCategory] = useState(false);
  const [validation, setValidation] = useState("");
  const [modalImport, setModalImport] = useState(false);

  const [modalDelete, setModalDelete] = useState(false);
  const [item, setItem] = useState("");
  const [indexId, setIndexId] = useState("");
  const [indexIdType, setIndexIdType] = useState("");
  const [columnNumber, setColumnNumber] = useState("");

  const focusTypeField = useRef(null);
  const focusCategoryField = useRef(null);
  const endList = useRef(null);

  useEffect(() => {
    getData();
    getClients();
  }, []);

  async function getData() {
    props.loadingIcon("show");
    await api
      .post("/configuration/project/templatelist", {
        companyId,
      })
      .then((data) => {
        setTypeList(data.data.projectTemplateList);
        props.loadingIcon("hide");
      });
  }

  async function getClients() {
    props.loadingIcon("show");
    await api
      .post("/configuration/client/list", {
        userId: 1,
      })
      .then((data) => {
        setDataClients(data.data.companyList);
        props.loadingIcon("hide");
      });
  }

  function scrollToNew() {
    setTimeout(() => {
      if (endList.current) {
        endList.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 1500);
  }

  function itemClickFunction(id, columnNumber, _index) {
    let newActiveItems = activeItems;
    setColumnNumber(columnNumber);
    switch (parseInt(columnNumber)) {
      case 1:
        newActiveItems = [];
        newActiveItems[0] = id;
        setCreateType(false);
        setDuplicateType(false);
        setCreateCategory(false);
        setTypeId(id);
        typeList.filter(function (item) {
          return +item.id === +id;
        })[0]?.categoryList;
        break;

      case 2:
        newActiveItems[1] = id;
        setCategoryId(id);
        break;
      default:
        newActiveItems = [];
    }
    setActiveItems(newActiveItems);
  }

  function handleType(value, id) {
    props.loadingIcon("show");
    if (duplicateType) {
      api
        .post("/duplicate-template-type", {
          type_id: id,
          type_name: nameType,
        })
        .then(() => {
          setNameType("");
          setCreateType(false);
          setDuplicateType(false);
          setValidation("");
          scrollToNew();
          props.loadingIcon("hide");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getData();
          setLoading(false);
        });
    } else if (value !== "") {
      if (id === "") {
        setLoading(true);
        api
          .post("/configuration/create/type", {
            typeName: value,
            companyId,
          })
          .then((res) => {
            scrollToNew();
            setCreateType(false);
            setActiveItems([]);
            setTypeList(res.data.projectTemplateList);
            setNameType("");
            setValidation("");
            props.loadingIcon("hide");
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getData();
            setLoading(false);
          });
      } else {
        api
          .put(`/milestone-template-type/${id}`, {
            type_name: value,
          })
          .then((res) => {
            setCreateType(false);
            setActiveItems([]);
            setNameType("");
            setValidation("");
            props.loadingIcon("hide");
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getData();
            setLoading(false);
          });
      }
    } else {
      setValidation("Name is required");
      props.loadingIcon("hide");
    }
  }

  async function handleCategory(id, val) {
    setLoading(true);
    props.loadingIcon("show");

    if (id) {
      await api
        .put(`/milestone-template-category/${id}`, {
          category_name: val,
        })
        .then(() => {
          setNameCategory("");
          setCreateCategory(false);
          props.loadingIcon("hide");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getData();
          setLoading(false);
        });
    } else if (id === "") {
      setLoading(true);
      props.loadingIcon("show");

      await api
        .post("/configuration/create/category", {
          categoryName: val,
          companyId,
          typeId,
        })
        .then(() => {
          setNameCategory("");
          setCreateCategory(false);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getData();
          setLoading(false);
          props.loadingIcon("hide");
        });
    }
  }

  function editItem(id, val, columnNumber) {
    switch (+columnNumber) {
      case 1:
        focusTypeField.current?.focus();
        setCreateType(true);
        setNameType(val);
        setTypeId(id);
        break;

      case 2:
        focusCategoryField.current?.focus();
        setCreateCategory(true);
        setNameCategory(val);
        setCategoryId(id);

        break;

      default:
        break;
    }
    // +columnNumber === 1 && (setNameType(val), setTypeId(id));
  }

  function deleteItem(id, columnNumber) {
    setLoading(true);
    props.loadingIcon("show");

    switch (+columnNumber) {
      case 1:
        api
          .post(`/milestone-template-type/${id}`)
          .then(() => {
            setModalDelete(false);
            setActiveItems([]);
            props.loadingIcon("hide");
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getData();
            setLoading(false);
          });
        break;

      case 2:
        api
          .post(`/milestone-template-category/${id}`)
          .then(() => {
            setModalDelete(false);
            props.loadingIcon("hide");
            setActiveItems([]);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getData();
            setLoading(false);
          });

      default:
        break;
    }
  }

  function duplicateItem(value, id, columnNumber) {
    switch (+columnNumber) {
      case 1:
        focusTypeField.current?.focus();
        setCreateType(true);
        setNameType(value);
        setDuplicateType(true);
        setTypeId(id);
        setValidation(false);
        break;

      case 2:
        focusCategoryField.current?.focus();
        setCreateCategory(true);
        setNameCategory(value);
        setDuplicateCategory(true);
        setCategoryId(id);
        setValidation(false);
        break;

      default:
        break;
    }
  }

  return (
    <>
      <div className="templates_milestones">
        <div className="notifications-configuration-panel roles">
          <div className="undefined lvl-1">
            <h2 className="h2">Type</h2>
            {typeList?.length > 0 && (
              <ul className="undefined" id="typeList">
                {typeList.map((list, index) => {
                  return (
                    <li
                      className={
                        activeItems[0] === list.id
                          ? "hoveredit  active"
                          : "hoveredit"
                      }
                      id={list.name}
                      data-id={list.id}
                      key={list.id}
                    >
                      <button
                        className={
                          activeItems[0] === list.id
                            ? "icon-text-bold active"
                            : "icon-text"
                        }
                        onClick={() => {
                          itemClickFunction(list.id, 1, index);
                          setIndexIdType(list.id);
                        }}
                      >
                        <span>{list.name}</span>
                      </button>
                      <div className="buttons_actions">
                        <span className="templateedit">
                          <i
                            className={`material-icons-outlined nameEdit icon-configuration-panel ${
                              activeItems[0] === list.id ? "active" : ""
                            }`}
                            onClick={(e) => {
                              editItem(list.id, list.name, 1);
                            }}
                          >
                            edit
                          </i>
                        </span>
                        <span
                          className="templateedit"
                          onClick={() =>
                            duplicateItem(`${list.name}_1`, list.id, 1)
                          }
                        >
                          <i
                            className={`material-icons-outlined nameEdit ${
                              activeItems[0] === list.id ? "active" : ""
                            }`}
                          >
                            content_copy
                          </i>
                        </span>
                        <span className="templateedit">
                          <i
                            className={`material-icons-outlined nameEdit ${
                              activeItems[0] === list.id ? "active" : ""
                            }`}
                            onClick={() => {
                              setModalDelete(true);
                              setColumnNumber(1);
                              setItem(list);
                            }}
                          >
                            delete
                          </i>
                        </span>
                      </div>
                    </li>
                  );
                })}
                <li ref={endList} />
              </ul>
            )}
            {!createType && (
              <div className="new_wrapper createrole">
                <button
                  onClick={() => {
                    setCreateType(true);
                    setNameType("");
                    setValidation(false);
                    setTypeId("");
                    focusTypeField.current?.focus();
                  }}
                >
                  <i className="undefined  material-icons-outlined ">add</i>
                  <span>Create New Type</span>
                </button>
              </div>
            )}
            {createType && (
              <div className="create-role">
                <div className="wrap-field-label">
                  <div className="inputWrapper">
                    <label className="label-form">Type Name</label>
                    <input
                      className={
                        !validation
                          ? "default-input-text"
                          : "default-input-text error_val_input"
                      }
                      autoFocus
                      ref={focusTypeField}
                      disabled={loading}
                      type="text"
                      id="type"
                      value={nameType}
                      onChange={(e) => {
                        setNameType(e.target.value);
                      }}
                    />
                    {validation && !nameType && (
                      <span className="validation">{validation}</span>
                    )}
                  </div>
                </div>
                <div className="button_wrapper">
                  <button
                    onClick={() => {
                      setCreateType(false);
                      setDuplicateType(false);
                      setNameType("");
                    }}
                    disabled={loading}
                  >
                    <i className="material-icons-outlined">close</i>
                  </button>
                  <button
                    onClick={() => {
                      handleType(nameType, typeId);
                    }}
                    disabled={loading}
                  >
                    <i className="material-icons-outlined">save</i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeItems[0] && (
            <div className="undefined lvl-2">
              <h2 className="h2">Category</h2>
              {typeList[0].categoryList?.length > 0 && (
                <ul className="undefined">
                  {typeList
                    .filter(function (item) {
                      return +item.id === +indexIdType;
                    })[0]
                    ?.categoryList.map((list, index) => {
                      return (
                        <li
                          className={
                            activeItems[1] === list.id
                              ? "hoveredit  active"
                              : "hoveredit"
                          }
                          id={list.name}
                          data-id={list.id}
                          key={list.id + index}
                        >
                          <button
                            className={
                              activeItems[1] === list.id
                                ? "icon-text-bold active"
                                : "icon-text"
                            }
                            onClick={() => {
                              itemClickFunction(list.id, 2, index);
                              setIndexId(index);
                            }}
                          >
                            <span>{list.name}</span>
                          </button>
                          <div className="buttons_actions">
                            {editItem && (
                              <span className="templateedit">
                                <i
                                  className={`material-icons-outlined nameEdit ${
                                    activeItems[1] === list.id ? "active" : ""
                                  }`}
                                  onClick={() =>
                                    editItem(list.id, list.name, 2)
                                  }
                                >
                                  edit
                                </i>
                              </span>
                            )}
                            {/* <span
                                className="templateedit"
                                onClick={() =>
                                  duplicateItem(list.name + '_1', list.id, 2)
                                }
                              >
                                <i
                                  className={
                                    'material-icons-outlined nameEdit ' +
                                    (activeItems[1] === list.id ? 'active' : '')
                                  }
                                >
                                  content_copy
                                </i>
                              </span> */}
                            <span className="templateedit">
                              <i
                                className={`material-icons-outlined nameEdit ${
                                  activeItems[1] === list.id ? "active" : ""
                                }`}
                                onClick={() => {
                                  setModalDelete(true);
                                  setColumnNumber(2);
                                  setItem(list);
                                  setCategoryId(list.id);
                                }}
                              >
                                delete
                              </i>
                            </span>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
              {!createCategory && (
                <div className="new_wrapper createrole">
                  <button
                    onClick={() => {
                      setCreateCategory(true);
                      setNameCategory("");
                      setValidation(false);
                      setCategoryId("");
                      focusCategoryField.current?.focus();
                    }}
                  >
                    <i className="undefined  material-icons-outlined ">add</i>
                    <span>Create New Category</span>
                  </button>
                </div>
              )}
              {createCategory && (
                <div className="create-role">
                  <div className="wrap-field-label">
                    <div className="inputWrapper">
                      <label className="label-form">Category Name</label>
                      <input
                        className="default-input-text"
                        type="text"
                        id="category"
                        disabled={loading}
                        value={nameCategory}
                        onChange={(e) => setNameCategory(e.target.value)}
                        autoFocus
                        ref={focusCategoryField}
                      />
                    </div>
                  </div>
                  <div className="button_wrapper">
                    <button
                      disabled={loading}
                      onClick={() => {
                        setCreateCategory(false);
                      }}
                    >
                      <i className="material-icons-outlined">close</i>
                    </button>
                    <button
                      onClick={() => handleCategory(categoryId, nameCategory)}
                      disabled={loading}
                    >
                      <i className="material-icons-outlined">save</i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {activeItems[1] && (
          <MilestoneList
            companyId={companyId}
            typeId={typeId}
            categoryId={categoryId}
            indexId={indexId}
            loader={props.loadingIcon}
          />
        )}
      </div>

      <Modal
        displayModal={modalDelete}
        title={`Delete ${item.name}`}
        body={`Are you sure you want to delete ${item.name} ?`}
        button1Text="Cancel"
        handleButton1Modal={() => {
          setModalDelete(false);
        }}
        closeModal={() => {
          setModalDelete(false);
        }}
        Button2Text="Yes, delete"
        handleButton2Modal={() => {
          deleteItem(item.id, columnNumber);
        }}
      />

      <Modal
        displayModal={modalImport}
        title="Import Category"
        content={<ImportCategory data={dataClients} />}
        button1Text="Cancel"
        handleButton1Modal={() => {
          setModalImport(false);
        }}
        closeModal={() => {
          setModalImport(false);
        }}
        Button2Text="Import"
        handleButton2Modal={() => {}}
      />
    </>
  );
}

function ImportCategory({ data }) {
  return (
    <div
      className="wrap-field-label last-f mt-3 modal-clients"
      style={{ margin: 0 }}
    >
      <fieldset className="chooseRole dropdown" style={{ width: "100%" }}>
        <div className="DdWrapper">
          <label htmlFor="roleSelect">Client</label>
          <div className="styled-select TaskNameInput">
            <select style={{ textAlignLast: "left" }}>
              <option value="">Choose Client</option>
              {data?.map((data) => {
                return (
                  <option value={data.company_id} key={data.company_id}>
                    {data.company_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default ClientTemplate;
