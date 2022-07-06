import React from "react";
import { api } from "../../../services/api";
import PermissionsMenuTab from "../components/PermissionsMenuTab/permissionsMenuTab";
import { Tooltip } from "../../../components/tooltip/tooltip";
import ModalForm from "../../../components/ModalForm/modalForm";
import Dropdown from "../../../components/dropdown/dropdown";
import Toast from "../../../components/toast/toast";

class RolesPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      activeItems: [],
      createRole: false,
      roleName: "",
      validationError: "",
      firstColumn: [],
      permission: [],
      modules: [],
      checkboxList: [],
      moduleTitle: "",
      formData: [],
      isHover: {
        hovered: false,
        itemId: "",
      },
      openImportRoleModal: false,
      clientSelected: {
        id: 0,
        value: "",
        roleId: 0,
      },
      toast: {
        text: "",
        type: "",
      },
      companyList: [],
      clientSelectedRoles: [],
    };
    this.showFirstColumn = this.showFirstColumn.bind(this);
    this.itemClickFunction = this.itemClickFunction.bind(this);
    this.handleClickRole = this.handleClickRole.bind(this);
    this.createNewRole = this.createNewRole.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkboxSave = this.checkboxSave.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleIconMouseevent = this.handleIconMouseevent.bind(this);
    this.handleDuplicateButton = this.handleDuplicateButton.bind(this);
    this.handleDeleteRole = this.handleDeleteRole.bind(this);
    this.handleOnClickImportRole = this.handleOnClickImportRole.bind(this);
    this.handleSaveImportRole = this.handleSaveImportRole.bind(this);
    this.handleOnChangeDropdown = this.handleOnChangeDropdown.bind(this);
    this.handleSaveEditRole = this.handleSaveEditRole.bind(this);
    this.handleToastOnClick = this.handleToastOnClick.bind(this);
    this.showRole = this.showRole.bind(this);
    this.handleOnChangeRoles = this.handleOnChangeRoles.bind(this);
  }

  componentDidMount() {
    const clients = this.props.clientList.map((client) => ({
      id: client.company_id,
      value: client.company_name,
    }));

    const data = this.props.rolesList;
    this.setState(
      {
        roles: data,
        companyList: clients,
      },
      () => {
        this.showFirstColumn();
      },
    );
  }

  showRole(clientId) {
    // call configuration roles list based on client

    return api
      .get(`/client/${clientId}/roles`)
      .then((response) => {
        return { rolesList: response.data.roles };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showFirstColumn() {
    const { roles } = this.state;
    const firstColumn = this.menuFormat(roles);

    this.setState({
      firstColumn,
    });
  }

  menuFormat(data) {
    const result = data?.map((item, i) => ({
      menuTitle: item.name,
      menuId: item.id,
    }));
    return result;
  }

  handleClickRole(action) {
    const errorSpan = document.getElementById("roleName-validation");
    if (errorSpan) {
      errorSpan.classList.remove("is-invalid");
    }
    this.setState({
      createRole: action,
      validationError: "",
      roleName: "",
    });
  }

  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const role = event.target.value;
    this.setState(
      {
        roleName: role,
        validationError: "",
      },
      () => {
        this.handleValidation("roleName");
      },
    );
  }

  handleValidation(id) {
    const errorSpan = document.getElementById(`${id}-validation`);
    const elementVal = this.state[id];

    errorSpan.classList.remove("is-invalid");
    let res = true;
    const { validationError } = this.state;

    let roleExists = false;
    // check if role name already exists
    this.state.firstColumn.map((role) => {
      if (role.menuTitle.toLowerCase() == elementVal.toLowerCase()) {
        return (roleExists = true);
      }
    });

    if (elementVal === "" || validationError !== "" || roleExists) {
      errorSpan.classList.add("is-invalid");
      res = false;
    }

    this.setState({
      validationError: res
        ? ""
        : validationError !== ""
        ? validationError
        : roleExists
        ? "Role Name already exists."
        : "Role Name cannot be blank.",
    });
    return res;
  }

  createNewRole() {
    const rolevalidation = this.handleValidation("roleName");
    if (rolevalidation) {
      this.props.loadingIcon("show");
      const clientId = this.props.clientData.id;
      // api call for create role

      const roleCreated = api
        .post("/configuration/create/role", {
          roleName: this.state.roleName,
          companyId: clientId,
          userId: this.props.userId,
        })
        .catch(() => {
          this.props.loadingIcon("hide");
          this.setState({
            toast: {
              text: "Role was not added successfully",
              type: "success",
            },
          });
        });

      if (roleCreated.data.success === "error") {
        this.setState(
          {
            validationError: "Role Name Already Exits.",
            toast: {
              text: "Role was not added",
              type: "fail",
            },
          },
          () => {
            this.props.loadingIcon("hide");
            this.handleValidation("roleName");
          },
        );
      }

      if (roleCreated.data && roleCreated.data.success !== "error") {
        const rolesResponse = api.get(`/client/${clientId}/roles`);

        const { roles } = rolesResponse.data;
        this.setState(
          {
            validationError: "",
            createRole: false,
            activeItems: [],
            roles,
            toast: {
              text: "Role added successfully",
              type: "success",
            },
          },
          () => {
            this.props.loadingIcon("hide");
            this.showFirstColumn();
          },
        );
      }
    }
  }

  itemClickFunction(event, id, columnNumber) {
    let newActiveItems = this.state.activeItems;
    let moduleTitle = "";
    switch (parseInt(columnNumber)) {
      case 1:
        newActiveItems = [];
        newActiveItems[0] = id;
        const firstItemSelected = this.state.roles.filter(
          (item) => +item.id === +id,
        )[0];
        this.getMenuList("permission", firstItemSelected.permissionList);
        break;
      case 2:
        newActiveItems[1] = id;
        const firstId = newActiveItems[0];
        const firstItem = this.state.roles.filter(
          (item) => +item.id === +firstId,
        )[0];
        const secondItemSelected = firstItem.permissionList.filter(
          (item) => +item.id === +id,
        )[0];
        this.getMenuList("modules", secondItemSelected.moduleList);
        break;
      case 3:
        newActiveItems[2] = id;
        const firstIds = newActiveItems[0];
        const secondId = newActiveItems[1];
        const firstItems = this.state.roles.filter(
          (item) => +item.id === +firstIds,
        )[0];
        const secondItem = firstItems.permissionList.filter(
          (item) => +item.id === +secondId,
        )[0];
        const thirdItemSelected = secondItem.moduleList.filter(
          (item) => +item.id === +id,
        )[0];
        moduleTitle = thirdItemSelected.name;
        let list = thirdItemSelected.checkboxList;
        // checking checklist value 1
        // if (list == '1') {
        //   list = [];
        // }
        if (!Array.isArray(list)) {
          list = [];
        }
        this.getMenuList("checkboxList", list);
        break;
      case 4:
        newActiveItems[2] = id;
        break;
      default:
        newActiveItems = [];
    }
    this.setState({
      activeItems: newActiveItems,
      moduleTitle,
    });
  }

  getMenuList(id, list) {
    let data;
    if (id === "checkboxList") {
      data = list;
    } else {
      data = this.menuFormat(list);
    }
    this.setState({
      [id]: data,
    });
  }

  handleCheckboxChange(key, checkAttr) {
    const checkBox = document.getElementById(checkAttr);
    const checkVal = checkBox.checked;
    let columnValue = 0;
    if (checkVal) {
      columnValue = 1;
    }
    const newField = {
      columnName: checkAttr,
      value: columnValue,
    };
    const formData = [...this.state.formData];
    let arrayIndex = "";
    // checkbox value updating
    const checkboxList = [...this.state.checkboxList];
    checkboxList[key].checked = checkVal;
    formData.forEach((field, index) => {
      const { columnName } = field;
      if (columnName === checkAttr) {
        arrayIndex = index;
      }
    });

    if (arrayIndex !== "") {
      formData[arrayIndex].value = columnValue;
      this.setState({
        formData,
        checkboxList,
      });
    } else {
      this.setState({
        formData: [...this.state.formData, newField],
        checkboxList,
      });
    }
  }

  // role updating
  async checkboxSave() {
    const { formData } = this.state;
    if (formData.length > 0) {
      this.props.loadingIcon("show");
      // getting first row selected item
      const id = this.state.activeItems[0];
      const clientId = this.props.clientData.id;
      // api call for client permission update

      const userUpdated = await api
        .post("/configuration/update/permissionlist/client", {
          roleId: id,
          clientId,
          permissionList: this.state.formData,
          userId: this.props.userId,
        })
        .catch(() => {
          this.props.loadingIcon("hide");
          this.setState({
            toast: {
              text: "Role was not updated successfully",
              type: "fail",
            },
          });
        });

      const responseRoles = await api
        .get(`/client/${clientId}/roles`)
        .catch(() => {
          this.props.loadingIcon("hide");
          this.setState({
            toast: {
              text: "Role was not updated successfully",
              type: "fail",
            },
          });
        });

      if (userUpdated?.data && responseRoles?.data) {
        const { roles } = responseRoles.data;
        this.setState(
          {
            roles,
            validationError: "",
            createRole: false,
            activeItems: [],
            formData: [],
            toast: {
              text: "Role updated successfully",
              type: "success",
            },
          },
          () => {
            this.showFirstColumn();
            this.props.loadingIcon("hide");
          },
        );
      }
    }
  }

  handleIconMouseevent(e, checkboxId) {
    if (e.type === "mouseleave") {
      this.setState({
        isHover: {
          hovered: false,
          itemId: "",
        },
      });
    } else {
      this.setState({
        isHover: {
          hovered: true,
          itemId: checkboxId,
        },
      });
    }
  }

  async handleSaveEditRole(e, value, id) {
    // api call for updating role name
    this.props.loadingIcon("show");

    await api
      .put(`/configuration/role/${id}`, { roleId: id, roleName: value })
      .then(() => {
        this.setState(
          {
            toast: {
              text: "Role updated successfully",
              type: "success",
            },
          },
          () => {
            this.props.loadingIcon("hide");
          },
        );
      })
      .catch(() => {
        this.props.loadingIcon("hide");
        this.setState({
          toast: {
            text: "Role was not updated successfully",
            type: "success",
          },
        });
      });
  }

  async handleDeleteRole(e, id) {
    const clientId = this.props.clientData.id;

    this.props.loadingIcon("show");
    const rolesFiltered = this.state.roles.filter((roles) => roles.id !== id);

    // api call for deleting role
    await api
      .delete(`/configuration/role/${id}`, {
        roleId: id,
        clientId,
      })
      .then(() => {
        this.setState(
          {
            roles: rolesFiltered,
            validationError: "",
            createRole: false,
            activeItems: [],
            formData: [],
            toast: {
              text: "Role deleted successfully",
              type: "success",
            },
          },
          () => {
            this.showFirstColumn();
            this.props.loadingIcon("hide");
          },
        );
      })
      .catch((err) => {
        this.props.loadingIcon("hide");
        this.setState({
          toast: {
            text: "Role was not deleted successfully",
            type: "fail",
          },
        });
      });
  }

  async handleDuplicateButton(e, title, id) {
    this.props.loadingIcon("show");
    const clientId = this.props.clientData.id;
    // api call for deleting role
    await api
      .post("/configuration/copy/role", {
        roleId: id,
        companyId: clientId,
        flag: "duplicate",
      })
      .then(async () => {
        const rolesData = await this.showRole(clientId);

        this.setState(
          {
            roles: rolesData.rolesList,
            validationError: "",
            createRole: false,
            activeItems: [],
            formData: [],
            toast: {
              text: "Role duplicated successfully",
              type: "success",
            },
          },
          () => {
            this.showFirstColumn();
            this.props.loadingIcon("hide");
          },
        );
      })
      .catch(() => {
        this.props.loadingIcon("hide");
        this.setState({
          toast: {
            text: "Role was not duplicated successfully",
            type: "fail",
          },
        });
      });
  }

  handleOnClickImportRole() {
    this.setState({
      openImportRoleModal: true,
    });
  }

  async handleOnChangeDropdown(e) {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));
      this.props.loadingIcon("show");
      const clientRoles = await this.showRole(eleValue.id);

      this.setState({
        clientSelected: {
          id: eleValue.id,
          value: eleValue.value,
          roleId: 0,
        },
        clientSelectedRoles: clientRoles.rolesList,
      });
      this.props.loadingIcon("hide");
    }
  }

  handleToastOnClick() {
    this.setState({
      toast: {
        text: "",
        type: "",
      },
    });
  }

  handleOnChangeRoles(e) {
    if (e) {
      this.setState({
        clientSelected: {
          ...this.state.clientSelected,
          roleId: e.target.value,
        },
      });
    }
  }

  async handleSaveImportRole() {
    // we call "import role" endpoint
    this.props.loadingIcon("show");
    const clientId = this.props.clientData.id;
    // api call for deleting role
    await api
      .post("/configuration/copy/role", {
        roleId: this.state.clientSelected.roleId,
        companyId: clientId,
        flag: "import",
      })
      .then(async () => {
        const rolesData = await this.showRole(clientId);

        this.setState(
          {
            roles: rolesData.rolesList,
            validationError: "",
            createRole: false,
            activeItems: [],
            formData: [],
            openImportRoleModal: false,
            clientSelected: {
              id: 0,
              value: "",
              roleId: 0,
            },
            clientSelectedRoles: [],
            toast: {
              text: "Role imported successfully",
              type: "success",
            },
          },
          () => {
            this.showFirstColumn();
            this.props.loadingIcon("hide");
          },
        );
      })
      .catch(() => {
        this.props.loadingIcon("hide");
        this.setState({
          toast: {
            text: "Role was not imported successfully",
            type: "fail",
          },
        });
      });
  }

  render() {
    return (
      <>
        {this.state.toast.text != "" && (
          <Toast
            type={this.state.toast.type}
            text={this.state.toast.text}
            handleToastOnClick={this.handleToastOnClick}
          />
        )}
        {this.state.openImportRoleModal && (
          <ModalForm
            show={this.state.openImportRoleModal}
            className="import-role-modal"
          >
            <div className="header-import-role-modal">
              <h1 className="title-import-role-modal">Import Role</h1>

              <i
                className="material-icons-outlined icon-close"
                onClick={() => {
                  this.setState({
                    openImportRoleModal: false,
                    clientSelected: {
                      id: 0,
                      value: "",
                    },
                  });
                }}
              >
                close
              </i>
            </div>

            <div className="content-import-role-modal">
              <Dropdown
                label="Client"
                name="companyFilter"
                id="companyFilter"
                value={this.state.clientSelected?.value}
                valuesDropdown={this.state.companyList}
                handleOnChange={(e) => this.handleOnChangeDropdown(e)}
                iconName="keyboard_arrow_down"
                iconClassName="material-icons"
              />
              <div className="roles-import-role-modal">
                {this.state.clientSelectedRoles.length > 0 &&
                  this.state.clientSelectedRoles.map((clientRole) => (
                    <div
                      key={clientRole.id}
                      className="custom-control custom-radio custom-control-inline w-100 d-flex align-items-center"
                    >
                      <input
                        type="radio"
                        className="custom-control-input"
                        value={clientRole.id}
                        name="clientRole"
                        id={`clientRole${clientRole.id}`}
                        onChange={(e) => this.handleOnChangeRoles(e)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`clientRole${clientRole.id}`}
                      >
                        {clientRole.name}
                      </label>
                    </div>
                  ))}
              </div>
              <div className="modal-footer cta-right">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-dismiss="modal"
                  onClick={() => {
                    this.setState({
                      openImportRoleModal: false,
                      clientSelected: {
                        id: 0,
                        value: "",
                        roleId: 0,
                      },
                      clientSelectedRoles: [],
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-dismiss="modal"
                  onClick={() => this.handleSaveImportRole()}
                >
                  Import
                </button>
              </div>
            </div>
          </ModalForm>
        )}

        <div className="notifications roles">
          <div className="undefined wider" style={{ minWidth: `${200}px` }}>
            <h2 className="h2">
              Roles
              {/* <Tooltip
                content="Admin tasks is for changing who can see the admin tasks"
                direction="top"
              >
                <i className="material-icons-outlined">info</i>
              </Tooltip> */}
            </h2>

            {this.state.firstColumn?.length > 0 &&
              this.state.firstColumn !== undefined && (
                <PermissionsMenuTab
                  columnNumber="1"
                  listOfItems={this.state.firstColumn}
                  itemClickFunction={this.itemClickFunction}
                  activeItem={this.state.activeItems[0]}
                  handleDeleteRole={this.handleDeleteRole}
                  handleDuplicateButton={this.handleDuplicateButton}
                  handleSaveEditRole={this.handleSaveEditRole}
                />
              )}

            {!this.state.createRole && (
              <div className="config-role-container">
                <div className="new_wrapper createrole">
                  <button onClick={() => this.handleClickRole(true)}>
                    <i className="undefined  material-icons-outlined ">add</i>
                    <span>Create New Role</span>
                  </button>
                </div>

                <div className="new_wrapper importrole">
                  <button onClick={() => this.handleOnClickImportRole()}>
                    <i className="undefined  material-icons-outlined ">add</i>
                    <span>Import Role</span>
                  </button>
                </div>
              </div>
            )}
            {this.state.createRole && (
              <div className="create-role">
                <div className="wrap-field-label">
                  <div className="inputWrapper">
                    <label className="label-form">Role Name</label>
                    <input
                      className="default-input-text"
                      maxLength="45"
                      type="text"
                      id="roleName"
                      value={this.state.roleName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <span className="validation-error" id="roleName-validation">
                    {this.state.validationError}
                  </span>
                </div>
                <div className="button-wrapper-container mt-3">
                  <Tooltip content="Close" direction="top">
                    <button
                      className="button-wrapper"
                      onClick={() => this.handleClickRole(false)}
                    >
                      <i className="material-icons-outlined">close</i>
                    </button>
                  </Tooltip>
                  <Tooltip content="Save" direction="top">
                    <button
                      className="button-wrapper"
                      onClick={this.createNewRole}
                    >
                      <i className="material-icons-outlined icon-save">save</i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
          {this.state.activeItems.length > 0 && (
            <div className="undefined" style={{ minWidth: `${200}px` }}>
              <h2 className="h2">
                {/* Permissions */}
                Sections
                {/* <Tooltip
                  content="Admin tasks is for changing who can see the admin tasks"
                  direction="top"
                >
                  <i className="material-icons-outlined">info</i>
                </Tooltip> */}
              </h2>
              {this.state.permission?.length > 0 &&
                this.state.permission !== undefined && (
                  <PermissionsMenuTab
                    columnNumber="2"
                    listOfItems={this.state.permission}
                    itemClickFunction={this.itemClickFunction}
                    activeItem={this.state.activeItems[1]}
                  />
                )}
            </div>
          )}
          {this.state.activeItems.length > 1 && (
            <div className="undefined" style={{ minWidth: `${200}px` }}>
              <h2 className="h2">
                Modules
                {/* <Tooltip
                  content="Admin tasks is for changing who can see the admin tasks"
                  direction="top"
                >
                  <i className="material-icons-outlined">info</i>
                </Tooltip> */}
              </h2>
              {this.state.modules?.length > 0 &&
                this.state.modules !== undefined && (
                  <PermissionsMenuTab
                    columnNumber="3"
                    listOfItems={this.state.modules}
                    itemClickFunction={this.itemClickFunction}
                    activeItem={this.state.activeItems[2]}
                  />
                )}
            </div>
          )}
          {this.state.activeItems.length > 2 && (
            <div className="undefined wider" style={{ minWidth: `${200}px` }}>
              <h2 className="h2">
                Permissions
                {/* <Tooltip
                  content="Admin tasks is for changing who can see the admin tasks"
                  direction="top"
                >
                  <i className="material-icons-outlined">info</i>
                </Tooltip> */}
              </h2>
              <div className="wrapper module-wrapper roleCheckbox">
                {/* <h4 className="labels">{this.state.moduleTitle}</h4> */}
                <form className="checkbox-wrapper" id="roles-form">
                  {this.state.checkboxList?.length > 0 &&
                    this.state.checkboxList?.map((checkbox, key) => {
                      const checkboxId = checkbox.column;
                      const checkboxLabel = checkbox.label;
                      const checkStatus = checkbox.checked;
                      return (
                        <div
                          key={key}
                          className="permission-checkboxes"
                          onMouseEnter={(e) =>
                            this.handleIconMouseevent(e, checkboxId)
                          }
                          onMouseLeave={(e) =>
                            this.handleIconMouseevent(e, checkboxId)
                          }
                        >
                          <label className="undefined checkboxes">
                            <input
                              type="checkbox"
                              id={checkboxId}
                              checked={checkStatus}
                              onChange={() =>
                                this.handleCheckboxChange(key, checkboxId)
                              }
                            />
                            {checkboxLabel}
                          </label>

                          {this.state.isHover.hovered &&
                            this.state.isHover.itemId == checkboxId && (
                              <Tooltip
                                content="Admin tasks is for changing who can see the admin tasks"
                                direction="top"
                              >
                                <i
                                  className="material-icons-outlined"
                                  style={{ cursor: "pointer" }}
                                >
                                  info
                                </i>
                              </Tooltip>
                            )}
                        </div>
                      );
                    })}
                </form>
                {this.state.checkboxList.length > 0 && (
                  <div className="adduseranotherclient add-user-button">
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2"
                      onClick={this.roleSettings}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={this.checkboxSave}
                    >
                      Update Role
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
export default RolesPermissions;
