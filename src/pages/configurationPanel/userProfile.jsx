import React from "react";
import { api } from "../../services/api";
import NewMenuTabs from "../../components/newMenuTabs/newMenuTabs";
import Dropdown from "../../components/dropdown/dropdown";
import Toast from "../../components/toast/toast";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;
// import ClientRoleComp from './clientRoleComp';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastname: "",
      password: "",
      role: "",
      roleName: "",
      clientName: "",
      internalrole: "",
      email: "",
      phone: "",
      avatar: "",
      city: "",
      editAll: false,
      userData: [],
      activeItems: [],
      formData: [],
      activeSettings: false,
      permission: [],
      modules: [],
      checkboxList: [],
      moduleTitle: "",
      userImg: "",
      newUserPassword: "",
      tooltipText: "Show Password",
      passwordType: "password",
      emailValidation: "Email cannot be blank.",
      rolesDropdown: [],
      clientsDropdown: [],
      addUserClientData: [],
      isClientSelect: false,
      showAddUser: true,
      roleSelected: {
        id: 0,
        value: "",
      },
      currentRole: {
        id: this.props?.userData?.rolesList?.id
          ? this.props?.userData?.rolesList?.id
          : 0,
        value: this.props?.userData?.rolesList?.name
          ? this.props?.userData?.rolesList?.name
          : "",
      },
      clientSelected: {
        id: 0,
        value: "",
      },
      toast: {
        text: "",
        type: "",
      },
    };
    this.inputReference = React.createRef();
    this.loaderReference = React.createRef();
    this.fileUploadAction = this.fileUploadAction.bind(this);
    this.fileUploadInputChange = this.fileUploadInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.showEditAll = this.showEditAll.bind(this);
    this.itemClickFunction = this.itemClickFunction.bind(this);
    this.checkboxSave = this.checkboxSave.bind(this);
    this.roleSettings = this.roleSettings.bind(this);
    this.getMenuList = this.getMenuList.bind(this);
    this.togglePasswordRef = React.createRef();
    this.passwordInputRef = React.createRef();
    this.toggleViewPassword = this.toggleViewPassword.bind(this);
    this.handleRoleOnChange = this.handleRoleOnChange.bind(this);
    this.handleClient = this.handleClient.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleUserList = this.handleUserList.bind(this);
    this.handleToastOnClick = this.handleToastOnClick.bind(this);
  }

  componentDidMount() {
    const { userId } = this.props;
    if (userId !== "") {
      const { userData } = this.props;
      this.userProfileData(userData);
    } else {
      this.showEditAll(true);
    }

    this.handleClient();
    if (this.props.isCreatingNewUser) {
      this.handleClientList();
    }
  }

  handleClientList() {
    const clientsFiltered = this.props.clientList.map(
      ({ company_id, company_name }) => ({
        id: company_id,
        value: company_name,
      }),
    );

    // removing duplicates roles
    const noDuplicatesClients = clientsFiltered.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    );

    this.setState({
      clientSelected: {
        id: 0,
        value: "",
      },
      clientsDropdown: noDuplicatesClients,
    });
  }

  componentWillReceiveProps(prevProps) {
    // this.setState({ userData: this.prevProps.userData.rolesList.user_data });
    if (this.props.userData != undefined && this.props.userData) {
      this.userProfileData(this.props.userData);
      this.handleClient();
    }
  }

  userProfileData(userData) {
    if (userData.rolesList) {
      const data = userData.rolesList.user_data;
      const permission = userData.rolesList.permissionList;
      const role = userData.rolesList.id;
      const roleName = userData.rolesList.name;

      // filtering company_id's and company_name result to build the clients filter drop down
      const clientsFiltered = userData.companies.map(
        ({ company_id, company_name }) => ({
          id: company_id,
          value: company_name,
        }),
      );

      // removing duplicates roles
      const noDuplicatesClients = clientsFiltered.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );

      this.setState({
        name: data.name,
        lastname: data.lastname,
        role,
        roleName,
        roleSelected: {
          id: role,
          value: roleName,
        },
        clientSelected: {
          id: 0,
          value: "",
        },
        email: data.email,
        phone: data.phone,
        avatar: data.avatar ? `/file/src/?path=${data.avatar}` : "",
        city: data.city,
        permission,
        userData: data,
        clientsDropdown: noDuplicatesClients,
      });
    }
  }

  fileUploadAction() {
    this.inputReference.current.click();
  }

  handleToastOnClick() {
    this.setState({
      toast: {
        text: "",
        type: "",
      },
    });
  }

  async fileUploadInputChange(e) {
    const areFilesSelected = e.target.files && e.target.files[0];
    if (
      areFilesSelected &&
      e.target.files[0].size / 1024 / 1024 <= fileSizeLimit
    ) {
      const newImage = e.target.files[0];
      const data = new FormData();
      data.append("avatar", newImage);

      const token = localStorage.getItem("lanstad-token");

      // For this endpoint we need to use fetch instead of axios.
      // Headers is not being created properly using axios
      await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/file/upload/avatar`,
        {
          method: "POST",
          body: data,
          headers: {
            "Lanstad-Token": token,
          },
        },
      )
        .then((res) => res.json())
        .then(
          (response) => {
            if (response.filePath) {
              this.setState({
                userImg: response.filePath,
                avatar: URL.createObjectURL(newImage),
              });
            }
          },
          (error) => {
            console.log(error);
          },
        );
    } else if (
      areFilesSelected &&
      e.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      window.showFailToast({
        statusText: `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
      });
    }
  }

  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const { id } = event.target;
    if (id === "phone") {
      const newNumber = event.target.value
        .replace(/[^0-9-+ ()]/g, "")
        .replace("  ", " ")
        .replace("--", "-");
      this.setState(
        {
          [id]: newNumber,
        },
        () => {
          this.handleValidation(id, false);
        },
      );
    } else if (id === "email") {
      let msg = "Email cannot be blank.";
      if (event.target.value !== "") {
        msg = "";
      }
      const newEmail = event.target.value.replace(
        /[^[A-Z0-9._ %+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$]/g,
        "",
      );
      this.setState(
        {
          [id]: newEmail,
          emailValidation: msg,
        },
        () => {
          this.handleValidation(id, false);
        },
      );
    } else {
      this.setState(
        {
          [id]: event.target.value,
        },
        () => {
          this.handleValidation(id);
        },
      );
    }
  }

  handleUserList(userData) {
    const userUpdated = {
      avatar:
        userData?.rolesList?.user_data?.avatar != ""
          ? userData?.rolesList?.user_data?.avatar
          : `https://eu.ui-avatars.com/api/?bold=true&color=fff&background=999&size=35&name=${userData?.rolesList?.user_data?.name}+${userData?.rolesList?.user_data?.lastname}`,
      email: userData?.rolesList?.user_data?.email,
      fullname: `${userData?.rolesList?.user_data?.name} ${userData?.rolesList?.user_data?.lastname}`,
      id: userData?.rolesList?.user_data?.id,
      lastname: userData?.rolesList?.user_data?.lastname,
      location: userData?.rolesList?.user_data?.city,
      name: userData?.rolesList?.user_data?.name,
      role: userData?.rolesList?.name,
    };

    const listUserUpdated = this.props?.usersList?.map((user) => {
      if (user.id == userUpdated.id) {
        return userUpdated;
      }
      return user;
    });

    this.props.updateUserList(listUserUpdated);
  }

  async handleSave() {
    const nameValidation = this.handleValidation("name");
    const lastnameValidation = this.handleValidation("lastname");
    const { userId } = this.props;
    const emailValidation = this.handleValidation("email", true);
    let passwordValidation = true;
    // password validation only on create user
    if (userId === "") {
      passwordValidation = this.handleValidation("password");
    }

    const roleValidation = this.handleValidation("roleSelected");
    // let clientValidation = true;
    // let clientValidation = this.handleValidation('clientSelected');

    // needed to create these two variables, because the state was losing the
    // value inside the call of the endpoint
    const roleId = this.state.roleSelected.id;
    const roleValue = this.state.roleSelected.value;

    if (
      nameValidation &&
      lastnameValidation &&
      emailValidation &&
      passwordValidation &&
      roleValidation
      // && clientValidation
    ) {
      this.props.loadingIcon("show");
      // get selected role data
      //   let roleId = this.state.roleSelected.id;
      //   let selectedRole = this.props.rolesList.filter(function (item) {
      //     return +item.id === +roleId;
      //   })[0];
      this.state.addUserClientData[0].selectedRoleVal.id;
      if (this.props.userId !== "") {
        const bodyRequest = {
          avatar: this.state.userImg,
          city: this.state.city,
          currentRoleId: this.state.currentRole.id,
          companyId: this.state.addUserClientData[0].selectedVal.id,
          email: this.state.email,
          firstName: this.state.name,
          lastName: this.state.lastname,
          phone: this.state.phone,
          permissions: {},
          roleId: this.state.addUserClientData[0].selectedRoleVal.id,
          roleName: this.state.addUserClientData[0].selectedRoleVal.value,
          userId: this.props.userId,
        };

        const updateUserResponse = await api
          .put(`/user/${this.props.userId}`, bodyRequest)
          .catch((err) => {
            this.setState({
              toast: {
                text: "User details were not updated successfully",
                type: "fail",
              },
            });
            this.props.loadingIcon("hide");
            console.log(err);
          });

        if (this.state.userImg !== "") {
          const updateAvatarUserResponse = await api
            .post("/user/edit/avatar", {
              filePath: this.state.userImg,
              userId: this.props.userId,
            })
            .catch((err) => {
              this.setState({
                toast: {
                  text: "User details were not updated successfully",
                  type: "fail",
                },
              });
              this.props.loadingIcon("hide");
              console.log(err);
            });
        }

        this.setState(
          {
            currentRole: {
              id: roleId,
              value: roleValue,
            },
            toast: {
              text: "User details updated successfully",
              type: "success",
            },
          },
          () => {
            // let userData = data.usersData;
            this.props.loadingIcon("hide");

            // this.userProfileData(userData);
            this.props.userProfile(this.props.userId);
            this.handleUserList(updateUserResponse.data.usersData);
            this.showEditAll(false);
          },
        );
      } else {
        const userData = {
          firstname: this.state.name,
          lastname: this.state.lastname,
          emailId: this.state.email,
          phone: this.state.phone,
          location: this.state.city,
          role_id: this.state.roleSelected.id,
          role_name: this.state.roleSelected.value,
          avatar: this.state.userImg,
          password: this.state.password,
          clientId: this.state.clientSelected.id,
          realCompany: 1,
        };
        const newUser = await api
          .post("/configuration/user/create", {
            user: userData,
          })
          .catch((err) => {
            this.props.loadingIcon("hide");
            this.setState({
              toast: {
                text: "User has not been created sucessfully.",
                type: "fail",
              },
            });
            console.log(err);
          });

        let usersList = null;

        if (newUser.data.message !== "User has been inserted") {
          this.setState({
            toast: {
              text: "User was not created successfully",
              type: "fail",
            },
          });
        } else {
          usersList = await api
            .post("/configuration/users/list", {
              userId: this.props.userId,
            })
            .catch((err) => {
              this.props.loadingIcon("hide");
              this.setState({
                toast: {
                  text: "User has not been created sucessfully.",
                  type: "fail",
                },
              });
              console.log(err);
            });
        }

        if (usersList && newUser) {
          this.setState({
            toast: {
              text: "User has been created sucessfully.",
              type: "success",
            },
          });
          this.props.updateUserList(usersList.data);
          this.props.createNewUser(false);
          this.props.loadingIcon("hide");
        } else {
          this.setState({
            emailValidation: "Email Already Exits.",
          });
          const errorSpan = document.getElementById("email-validation");
          errorSpan.classList.add("is-invalid");
        }
      }
    }
  }

  handleValidation(id, action) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const errorSpan = document.getElementById(`${id}-validation`);
    let elementVal = "";
    if (id != "roleSelected" && id != "clientSelected") {
      elementVal = this.state[id];
    } else if (id == "roleSelected") {
      elementVal = this.state.roleSelected.value;
    } else {
      elementVal = this.state.clientSelected.value;
    }
    errorSpan.classList.remove("is-invalid");
    let res = true;
    if (elementVal === "") {
      errorSpan.classList.add("is-invalid");
      res = false;
    }
    if (
      id === "email" &&
      elementVal !== "" &&
      !elementVal.match(mailFormat) &&
      action
    ) {
      errorSpan.classList.add("is-invalid");
      this.setState({
        emailValidation: "Invalid Email.",
      });
      res = false;
    }
    return res;
  }

  showEditAll(action) {
    this.setState({
      editAll: action,
      roleSelected: {
        id: this.state.role,
        value: this.state.roleName,
      },
    });
  }

  itemClickFunction(id, columnNumber) {
    let newActiveItems = this.state.activeItems;
    let moduleTitle = "";
    switch (parseInt(columnNumber)) {
      case 1:
        newActiveItems = [];
        newActiveItems[0] = id;
        const firstItemSelected = this.state.permission.filter(
          (item) => +item.menuId === +id,
        )[0];
        this.getMenuList("modules", firstItemSelected.moduleList);
        break;
      case 2:
        newActiveItems[1] = id;
        const secondItemSelected = this.state.modules.filter(
          (item) => +item.menuId === +id,
        )[0];
        moduleTitle = secondItemSelected.menuTitle;
        let list = secondItemSelected.checkboxList;
        // checking checklist value 1
        if (list == "1") {
          list = {};
        }
        this.getMenuList("checkboxList", list);
        break;
      case 3:
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
    this.setState({
      [id]: list,
    });
  }

  roleSettings() {
    const currentState = this.state.activeSettings;
    this.setState({
      activeSettings: !currentState,
      activeItems: [],
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
      colunmName: checkAttr,
      value: columnValue,
    };
    const _formData = [...this.state.formData];
    let arrayIndex = "";
    // checkbox value updating
    const checkboxList = [...this.state.checkboxList];
    checkboxList[key].checked = checkVal;
    _formData.forEach((field, index) => {
      if (field.colunmName === checkAttr) {
        arrayIndex = index;
      }
    });

    if (arrayIndex !== "") {
      _formData[arrayIndex].value = columnValue;
      this.setState({
        formData: _formData,
        checkboxList,
      });
    } else {
      this.setState({
        formData: [...this.state.formData, newField],
        checkboxList,
      });
    }
  }

  async checkboxSave() {
    this.props.loadingIcon("show");

    let permissionsObject = {};
    if (
      this.state.roleSelected.id == this.state.currentRole.id &&
      this.state.formData.length > 0
    ) {
      this.state.formData?.map((checkboxListItem) => {
        permissionsObject = {
          ...permissionsObject,
          [checkboxListItem.colunmName]: checkboxListItem.value,
        };
      });
    }

    const bodyRequest = {
      firstName: this.state.name,
      lastName: this.state.lastname,
      email: this.state.email,
      phone: this.state.phone,
      city: this.state.city,
      roleId: this.state.roleSelected.id,
      userId: this.props.userId,
      avatar: this.state.userImg,
      roleName: this.state.roleSelected.value,
      companyId: this.state.clientSelected.id,
      permissions: permissionsObject,
      currentRoleId: this.state.currentRole.id,
    };

    const usersDetails = await api
      .put(`/user/${this.props.userId}`, bodyRequest)
      .catch((err) => {
        this.setState({
          toast: {
            text: "Permissions were not updated successfully",
            type: "fail",
          },
        });
        console.log(err);
      });

    if (this.state.userImg !== "") {
      await api
        .post("/user/edit/avatar", {
          filePath: this.state.userImg,
          userId: this.props.userId,
        })
        .catch((err) => {
          this.setState({
            toast: {
              text: "Avatar was not updated successfully",
              type: "fail",
            },
          });
          console.log(err);
        });
    }

    if (usersDetails) {
      this.setState(
        {
          toast: {
            text: "Permissions updated successfully",
            type: "success",
          },
        },
        () => {
          // let userData = data.usersData;
          this.props.loadingIcon("hide");
          this.showEditAll(false);
          // this.userProfileData(userData);
        },
      );
    }
  }

  // Password Show / Hide
  toggleViewPassword(e) {
    e.preventDefault();
    const passwordInput = document.querySelector("input#password");
    const viewPasswordButton = document.querySelector(
      "input#password ~ button",
    );
    const viewPasswordIcon = viewPasswordButton.querySelector("i");

    if (passwordInput.type === "password") {
      // toggle to be text
      passwordInput.type = "text";
      viewPasswordButton.title = "Hide Password";
      viewPasswordIcon.innerHTML = "visibility_off";
    } else {
      // toggle to be password
      passwordInput.type = "password";
      viewPasswordButton.title = "Show Password";
      viewPasswordIcon.innerHTML = "visibility";
    }
  }

  handleRoleOnChange(e, ind) {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));
      this.setState({
        roleSelected: {
          id: eleValue.id,
          value: eleValue.value,
        },
      });

      this.state.addUserClientData.forEach((data, index) => {
        if (index === ind) {
          data.selectedRoleVal = {
            id: eleValue.id,
            value: eleValue.value,
          };
        }
      });
    }
  }

  handleClientOnChange(e, ind) {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      this.setState({
        clientSelected: {
          id: eleValue.id,
          value: eleValue.value,
        },
      });

      // filtering role_id's and name result to build the role filter drop down
      const rolesFiltered = this.props.rolesList.map((data) => {
        if (
          eleValue?.id?.toString() === data.company_id &&
          data !== undefined
        ) {
          return {
            id: data.id,
            value: data.name,
          };
        }
      });

      let noDuplicatesRoles = rolesFiltered.filter(
        (data) => data !== undefined,
      );

      // removing duplicates roles
      noDuplicatesRoles = noDuplicatesRoles.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );

      this.state.addUserClientData.forEach((data, index) => {
        if (index === ind) {
          data.rolesDropdownData = noDuplicatesRoles;
          data.selectedVal = {
            id: eleValue.id,
            value: eleValue.value,
          };
        }
      });
      this.setState({ isClientSelect: true });
    }
  }

  handleClient() {
    const clientValue = this.props?.userData?.companies?.filter(
      (company) => company?.company_id == this.props?.userData?.companyId,
    );

    if (clientValue?.length > 0) {
      this.setState({
        clientSelected: {
          id: clientValue[0]?.company_id ? clientValue[0]?.company_id : 0,
          value: clientValue[0]?.company_name
            ? clientValue[0]?.company_name
            : "",
        },
        clientName: clientValue[0]?.company_name
          ? clientValue[0]?.company_name
          : "",
      });
    }
  }

  selectClientUser(e) {
    const clientsDropdownData = {
      selectedVal: {},
      clientsDropdownData: this.state.clientsDropdown,
      rolesDropdownData: [],
      selectedRoleVal: {},
    };
    this.setState({
      addUserClientData: [...this.state.addUserClientData, clientsDropdownData],
    });
    this.setState({ showAddUser: false });
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
        <div className="new-user-container notifications roles">
          <div className="new-user-box">
            <div className="profile-edit-icons">
              {!this.state.editAll && (
                <button
                  className="editAll"
                  title="Edit All"
                  id="editall"
                  onClick={() => this.showEditAll(true)}
                >
                  <i className="material-icons-outlined" id="editall">
                    edit
                  </i>
                </button>
              )}
              {this.state.editAll && (
                <>
                  <button
                    className="editAll"
                    title="Save"
                    onClick={this.handleSave}
                  >
                    <i className="material-icons-outlined">save</i>
                  </button>
                  {this.props.userId !== "" && (
                    <button
                      className="editAll"
                      title="Cancel"
                      onClick={() => this.showEditAll(false)}
                    >
                      <i className="material-icons-outlined">close</i>
                    </button>
                  )}
                  {this.props.userId === "" && (
                    <button
                      className="editAll"
                      title="Cancel"
                      onClick={() => this.props.createNewUser(false)}
                    >
                      <i className="material-icons-outlined">close</i>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="user-form" id="user-area">
              <form className="profilePhoto" encType="mulitpart/form-data">
                {this.state.editAll && (
                  <>
                    <i
                      className="material-icons-outlined"
                      onClick={this.fileUploadAction}
                    >
                      camera_alt
                    </i>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      hidden
                      name="profilePhoto"
                      ref={this.inputReference}
                      onChange={this.fileUploadInputChange}
                    />
                  </>
                )}
                <img src={this.state.avatar ? `${this.state.avatar}` : ""} />
              </form>
              {!this.state.editAll && this.props.userId !== "" && (
                <div className="nameSection">
                  <h2 id="full-name" className="currentValue">
                    {this.state.name} {this.state.lastname}
                  </h2>
                </div>
              )}
              {this.state.editAll && (
                <>
                  <div className="wrap-field-label">
                    <div className="inputWrapper">
                      <label className="label-form">First Name</label>
                      <input
                        className="default-input-text"
                        maxLength="45"
                        type="text"
                        id="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                      />
                    </div>
                    <span className="validation-error" id="name-validation">
                      First Name cannot be blank.
                    </span>
                  </div>
                  <div className="wrap-field-label">
                    <div className="inputWrapper">
                      <label className="label-form">Last Name</label>
                      <input
                        className="default-input-text"
                        maxLength="45"
                        type="text"
                        id="lastname"
                        value={this.state.lastname}
                        onChange={this.handleChange}
                      />
                    </div>
                    <span className="validation-error" id="lastname-validation">
                      Last Name cannot be blank.
                    </span>
                  </div>
                </>
              )}
              {!this.state.editAll && this.props.userId !== "" && (
                <div className="display-flex w-100 align-items-center mb-3">
                  <i className="material-icons-outlined mr-2">email</i>
                  <div className="">
                    <p className="m-0 p-0">{this.state.email}</p>
                  </div>
                </div>
              )}
              {this.state.editAll && (
                <>
                  <div className="wrap-field-label inputWithIcon">
                    <i className="material-icons-outlined">email</i>
                    <div className="inputWrapper">
                      <label className="label-form">E-Mail</label>
                      <input
                        className="default-input-text"
                        maxLength="45"
                        type="text"
                        id="email"
                        onChange={this.handleChange}
                        onClick={this.handleIconChange}
                        value={this.state.email}
                      />
                    </div>
                  </div>
                  <span className="validation-error" id="email-validation">
                    {this.state.emailValidation}
                  </span>
                </>
              )}
              {this.state.editAll && this.props.userId === "" && (
                <>
                  <div className="wrap-field-label iconPlusInput password mb-0">
                    <i className="material-icons-outlined">lock</i>
                    <div className="input-group input-group-seamless password-field">
                      <label>
                        <span>Password *</span>
                        <input
                          required
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder=""
                          maxLength="32"
                          ref={this.passwordInputRef}
                          onChange={this.handleChange}
                          value={this.state.password}
                        />
                        <button
                          title="Show Password"
                          onClick={(e) => this.toggleViewPassword(e)}
                        >
                          <i className="material-icons-outlined">visibility</i>
                        </button>
                      </label>
                    </div>
                  </div>
                  <span className="validation-error" id="password-validation">
                    Please enter a password
                  </span>
                </>
              )}
              {!this.state.editAll && this.props.userId !== "" && (
                <div className="display-flex w-100 align-items-center mb-3">
                  <i className="material-icons-outlined mr-2">local_phone</i>
                  <div className="">
                    <p className="m-0 p-0">{this.state.phone}</p>
                  </div>
                </div>
              )}
              {this.state.editAll && (
                <>
                  <div className="wrap-field-label inputWithIcon">
                    <i className="material-icons-outlined">local_phone</i>
                    <div className="inputWrapper">
                      <label className="label-form">Phone Number</label>
                      <input
                        className="default-input-text"
                        maxLength="45"
                        type="text"
                        id="phone"
                        pattern="[0-9]*"
                        onChange={this.handleChange}
                        onClick={this.handleIconChange}
                        value={this.state.phone ? this.state.phone : ""}
                      />
                    </div>
                  </div>
                  <span className="validation-error" id="phone-validation">
                    Phone Number cannot be blank.
                  </span>
                </>
              )}
              {!this.state.editAll && (
                <div className="display-flex w-100 align-items-center mb-3">
                  <i className="material-icons-outlined mr-2">place</i>
                  <div className="">
                    <p className="m-0 p-0">{this.state.city}</p>
                  </div>
                </div>
              )}
              {this.state.editAll && (
                <>
                  <div className="wrap-field-label inputWithIcon">
                    <i className="material-icons-outlined">place</i>
                    <div className="inputWrapper">
                      <label className="label-form">City</label>
                      <input
                        className="default-input-text"
                        maxLength="45"
                        type="text"
                        id="city"
                        value={this.state.city ? this.state.city : ""}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <span className="validation-error" id="city-validation">
                    City cannot be blank.
                  </span>
                </>
              )}

              <h2 className="user-role-title mt-2 mb-0">Deanta Role</h2>
              <div className="container">
                <div className="row justify-content-end align-items-center">
                  <div className="d-flex col-6 m-0 p-0 justify-content-end">
                    <p className="m-0 p-0">Company Role</p>
                  </div>
                  <div className="col-6 m-0 pr-0">
                    {this.state.editAll && (
                      <Dropdown
                        label="Role"
                        name="roleFilter"
                        id="roleFilter"
                        value={
                          this.state.roleSelected?.value
                            ? this.state.roleSelected?.value
                            : ""
                        }
                        valuesDropdown={this.state.rolesDropdown}
                        handleOnChange={(e) => this.handleRoleOnChange(e)}
                        iconName="keyboard_arrow_down"
                        iconClassName="material-icons"
                      />
                    )}
                    {!this.state.editAll && (
                      <div className="">
                        <p className="m-0 p-0">{this.state.roleName}</p>
                      </div>
                    )}
                  </div>
                  {/* <div className="col-2">
                    {this.props.userId !== '' && (
                      <i className={'material-icons-outlined role-settings-icon ' +(this.state.activeSettings ? 'active' : '')} onClick={this.roleSettings}> settings
                      </i>
                    )}
                  </div> */}
                </div>
              </div>
              <span className="validation-error" id="roleSelected-validation">
                Please Select Role.
              </span>

              <h2 className="user-role-title mb-0 mt-2">Clients & Roles</h2>
              <div className="container pr-0">
                <div className="row justify-content-end align-items-center pr-4 select-client">
                  {this.state.editAll && (
                    <>
                      {/* Newly added data */}
                      {this.state.addUserClientData.length !== 0 &&
                        this.state.addUserClientData.length < 2 &&
                        this.state.addUserClientData.map((data, index) => (
                          <React.Fragment key={index}>
                            <div className="col-6 m-0 mt-3 p-0">
                              <Dropdown
                                // label={'Client'}
                                name="clientFilter"
                                id="clientFilter"
                                key={`${index}client`}
                                value={data.selectedVal?.value}
                                valuesDropdown={data.clientsDropdownData}
                                handleOnChange={(e) =>
                                  this.handleClientOnChange(e, index)
                                }
                                iconName="keyboard_arrow_down"
                                iconClassName="material-icons"
                                className="select-client"
                                placeholder="Select Client"
                              />
                            </div>
                            <div className="col-6 m-0 pr-0">
                              <div className="row">
                                {this.state.isClientSelect && (
                                  <div className="col-8 m-0 pr-0">
                                    <Dropdown
                                      label="Role"
                                      name="roleFilter"
                                      id="roleFilter"
                                      key={`${index}role`}
                                      value={data.selectedRoleVal?.value}
                                      valuesDropdown={data.rolesDropdownData}
                                      handleOnChange={(e) =>
                                        this.handleRoleOnChange(e, index)
                                      }
                                      iconName="keyboard_arrow_down"
                                      iconClassName="material-icons"
                                      placeholder="Select Role"
                                    />
                                  </div>
                                )}

                                {this.props.userId !== "" && (
                                  <>
                                    <div className="col-2 d-flex align-items-center m-0 p-0">
                                      <i
                                        className={`material-icons-outlined role-settings-icon ${
                                          this.state.activeSettings
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={this.roleSettings}
                                      >
                                        settings
                                      </i>
                                    </div>
                                    <div className="col-2 d-flex align-items-center m-0 p-0">
                                      <i
                                        className={`material-icons-outlined role-settings-icon ${
                                          this.state.activeSettings
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                    </>
                  )}
                  {!this.state.editAll && (
                    <>
                      {this.state.clientSelected?.value !== undefined ||
                      this.state.clientSelected?.value !== "" ? (
                        <>
                          <div className="d-flex col-6 m-0 p-0 justify-content-end">
                            <p className="m-0 p-0">
                              {this.state.clientSelected?.value
                                ? this.state.clientSelected?.value
                                : ""}
                            </p>
                          </div>
                          <div className="col-4 m-0 pr-0">
                            <p className="m-0 p-0">{this.state.roleName}</p>
                          </div>
                          {this.props.userId !== "" && (
                            <div className="col-2 d-flex align-items-center m-0 p-0">
                              <i
                                className={`material-icons-outlined role-settings-icon ${
                                  this.state.activeSettings ? "active" : ""
                                }`}
                                onClick={this.roleSettings}
                              >
                                settings
                              </i>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="">
                          <p className="m-0 p-0">No data</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {this.state.editAll && this.state.showAddUser && (
                  <div className="row col-12">
                    <span onClick={(e) => this.selectClientUser(e)}>
                      + Add User to Another Client
                    </span>
                  </div>
                )}
              </div>
              <span className="validation-error" id="roleSelected-validation">
                Please Select Role.
              </span>
            </div>
          </div>
          {this.state.activeSettings && (
            <>
              <div className="undefined">
                <h2 className="h2">Sections</h2>
                <NewMenuTabs
                  columnNumber="1"
                  listOfItems={this.state.permission}
                  itemClickFunction={this.itemClickFunction}
                  activeItem={this.state.activeItems[0]}
                />
              </div>
              {this.state.activeItems.length > 0 && (
                <div className="undefined">
                  <h2 className="h2">Modules</h2>
                  <NewMenuTabs
                    columnNumber="2"
                    listOfItems={this.state.modules}
                    itemClickFunction={this.itemClickFunction}
                    activeItem={this.state.activeItems[1]}
                  />
                </div>
              )}
              {this.state.activeItems.length > 1 && (
                <div className="undefined wider">
                  <h2 className="h2">Permissions</h2>
                  <div className="wrapper module-wrapper roleCheckbox">
                    {/* <h4 className="labels">{this.state.moduleTitle}</h4> */}
                    <form className="checkbox-wrapper" id="roles-form">
                      {this.state.checkboxList.length > 0 &&
                        this.state.checkboxList.map((checkbox, key) => {
                          const checkboxId = checkbox.column;
                          const checkboxLabel = checkbox.label;
                          const checkStatus = checkbox.checked;
                          return (
                            <div key={key} className="permission-checkboxes">
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
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
}

export default UserProfile;
