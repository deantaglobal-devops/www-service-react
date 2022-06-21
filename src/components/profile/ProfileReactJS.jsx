import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import SideSlider from "../sideSlider/SideSlider";
import SliderLoading from "../sliderLoading/SliderLoading";
import Toast from "../toast/toast";

import "../../styles/profile.css";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export function Profile(props) {
  const [tokenUser, setTokenUser] = useState(props?.TOKEN_PROPS);
  const [isEditAllAvailable, setIsEditAllAvailable] = useState(false);
  const [editAll, setEditAll] = useState(false);
  const [accountManager, setAccountManager] = useState(false);
  const [projectManager, setProjectManager] = useState(false);
  const [isPhotoEditable, setIsPhotoEditable] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [editName, setEditName] = useState(false);
  const [isCompanyEditable, setIsCompanyEditable] = useState(false);
  const [editCompany, setEditCompany] = useState(false);
  const [isRoleEditable, setIsRoleEditable] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [isLocationEditable, setIsLocationEditable] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [roles, setRoles] = useState([
    "Author",
    "Editor",
    "Project Manager",
    "Account Manager",
  ]);
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [SIDESLIDER_PROPS, setSIDESLIDER_PROPS] = useState({
    SliderHeader: "",
    SliderWidth: "small",
    SliderStatus: true,
  });
  const [toast, setToast] = useState({
    text: "",
    type: "",
  });

  const inputReference = useRef();
  const emailReference = useRef();
  const phoneReference = useRef();
  const loaderReference = useRef();

  const { updateUserByToken } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const userId = tokenUser.id;
      const response = await api.get(`/user/${userId}`);
      const userData = response.data.data;
      getCompany(userData, tokenUser);
    };
    getUser();
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { id } = event.target;

    let newNumber = "";
    let newEmail = "";

    console.log("id", id);
    switch (id) {
      case "phone":
        newNumber = event.target.value
          .replace(/[^0-9-+ ()]/g, "")
          .replace("  ", " ")
          .replace("--", "-");

        setPhone(newNumber);
        break;
      case "email":
        newEmail = event.target.value.replace(
          /[^[A-Z0-9._ %+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$]/g,
          "",
        );
        setEmail(newEmail);
        break;
      case "name":
        setName(event.target.value);
        break;
      case "lastname":
        setLastname(event.target.value);
        break;
      case "role":
        setRole(event.target.value);
        break;
      default:
        return "";
    }
  };

  const handleIconChange = (e) => {
    e.preventDefault();
    const valueToEdit = e.currentTarget.id;
    if (valueToEdit === "phone") {
      setEditPhone(true);
    } else if (valueToEdit === "email") {
      setEditEmail(true);
    }
  };

  const handleSave = (e, id) => {
    e.preventDefault();

    emailReference.current.classList.remove("is-invalid");
    phoneReference.current.classList.remove("is-invalid");

    let isEmailValid = true;
    const isPhoneValid = true;

    if (id === "email") {
      isEmailValid = validateEmail();
    }

    if (isEmailValid && isPhoneValid) {
      // console.log("Saving");
      loaderReference.current.classList.remove("saved");
      loaderReference.current.classList.add("saving");

      let newData = {};
      switch (id) {
        case "phone":
          newData = { ...data, phone };
          setData(newData);
          updateUserData(id);
          break;
        case "email":
          newData = { ...data, email };
          setData(newData);
          updateUserData(id);
          break;
        default:
          return "";
      }
    } else {
      [`${id}Reference`].current.classList.add("is-invalid");
      // setTimeout( ()=>{this[`${id}Reference`].current.classList.remove('is-invalid') }, 600);
    }
  };

  function showToast(message, type) {
    setToast({
      text: message,
      type,
    });
  }

  const handleToastOnClick = () => {
    setToast({
      text: "",
      type: "",
    });
  };

  const handleRestore = (e, id) => {
    e.preventDefault();
    const val = data[id];
    if (id === "phone") {
      setPhone(val);
      setEditPhone(false);
    } else if (id === "email") {
      setEmail(val);
      setEditEmail(false);
    }
    emailReference.current.classList.remove("is-invalid");
    phoneReference.current.classList.remove("is-invalid");
    document
      .querySelector(".iconPlusInput.email ~ .validation-error")
      .classList.remove("is-invalid");
  };

  const handleSaveName = (e, action) => {
    e.preventDefault();

    if (action === "remove") {
      setEditName(false);
      setName(data.name);
      setLastname(data.lastname);
    } else {
      loaderReference.current.classList.remove("saved");
      loaderReference.current.classList.add("saving");

      const newData = {
        ...data,
        name,
        lastname,
      };

      setData(newData);
      updateUserData("name");
    }
  };

  const handleAllUpdate = (e) => {
    e.preventDefault();
    let isEmailValid = true;
    if (editEmail) {
      isEmailValid = validateEmail();
    }

    if (isEmailValid) {
      loaderReference.current.classList.remove("saved");
      loaderReference.current.classList.add("saving");

      const newData = {
        ...data,
        name,
        lastname,
        role,
        email,
        phone,
      };
      setData(newData);
      updateUserData("all");
    } else {
      emailReference.current.classList.add("is-invalid");
      document
        .querySelector(".iconPlusInput.email ~ .validation-error")
        .classList.add("is-invalid");
    }
  };

  const getCompany = async (userData, tokenDecoded) => {
    await api.get(`/user/${userData.info.id}/company`).then((response) => {
      const rolToken = tokenDecoded.permissions.rol;
      const dataNormalized = {
        ...userData.info,
        role: rolToken,
        client: response?.data[0]?.name,
      };
      const permissionsToken =
        tokenDecoded?.permissions?.permissionsMapped?.frontend?.profile?.self;
      const permissionsTokenWithoutView = {
        ...permissionsToken,
        view: null,
      };
      const isEditableTrue =
        Object.values(permissionsTokenWithoutView).indexOf("1") > -1;

      setIsEditAllAvailable(isEditableTrue);
      setAccountManager(rolToken === "Account Manager");
      setProjectManager(rolToken === "Project Manager");
      setIsPhotoEditable(!!+permissionsToken.edit_photo);
      setIsNameEditable(!!+permissionsToken.edit_name);
      setIsCompanyEditable(rolToken === "Account Manager");
      setIsRoleEditable(rolToken === "Account Manager");
      setIsPhoneEditable(!!+permissionsToken.edit_phone);
      setIsEmailEditable(!!+permissionsToken.edit_email);
      setIsLocationEditable(!!+permissionsToken.edit_location);
      setUserId(userData.info.id);
      setData(dataNormalized);
      setName(userData.info.name);
      setLastname(userData.info.lastname);
      setRole(rolToken);
      setEmail(userData.info.email);
      setPhone(userData.info.phone);
    });
  };

  const updateUserData = (id) => {
    const newUserData = {
      userName: name,
      userLastname: lastname,
      userEmail: email,
      userPhone: phone || "",
      userRole: role,
    };

    api
      .put(`/user/edit/${userId}`, newUserData)
      .then(() => {
        loaderReference.current.classList.remove("saving");
        loaderReference.current.classList.add("saved");

        setToast({
          text: "User updated successfully",
          type: "success",
        });

        if (id === "name") {
          setEditName(false);
        } else if (id === "phone") {
          setEditPhone(false);
        } else if (id === "email") {
          setEditEmail(false);
        } else if (id === "all") {
          setEditAll(false);
          setEditName(false);
          setEditPhone(false);
          setEditCompany(false);
          setEditRole(false);
          setEditPhone(false);
          setEditEmail(false);
          setEditLocation(false);
        }
      })
      .catch(() => {
        setToast({
          text: "User can not be updated successfully",
          type: "fail",
        });
      });
  };

  const validateEmail = () => {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailReference.current.value.match(mailFormat)) {
      document
        .querySelector(".iconPlusInput.email ~ .validation-error")
        .classList.remove("is-invalid");

      return true;
    }
    document
      .querySelector(".iconPlusInput.email ~ .validation-error")
      .classList.add("is-invalid");
    return false;
  };

  const fileUploadAction = () => {
    inputReference.current.click();
  };

  const updateUserPhoto = async (filePath) => {
    await api.post("/user/edit/avatar", { filePath, userId }).then(() => {
      const newData = { ...data, avatar: filePath };

      setData(newData);
      setAvatar(filePath);
      const userAvatarDiv = document.querySelector(".avatar-task");
      const userAvatar = userAvatarDiv.querySelector("img");
      userAvatar.src = `${
        import.meta.env.VITE_URL_API_SERVICE
      }/file/src/?path=${filePath}`;
      loaderReference.current.classList.remove("saving");
      loaderReference.current.classList.add("saved");
    });

    const newTokenResponse = await api.post("/token/update", { userId });

    await updateUserByToken(newTokenResponse.data.token);
  };

  const fileUploadInputChange = async (e) => {
    const areFilesSelected = e.target.files && e.target.files[0];

    if (
      areFilesSelected &&
      e.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      showToast(
        `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
        "fail",
      );
    } else if (areFilesSelected) {
      loaderReference.current.classList.add("saving");
      loaderReference.current.classList.remove("saved");
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
            if (response?.filePath) {
              updateUserPhoto(response?.filePath);
            }
          },
          (error) => {
            console.log(error);
          },
        );
    }
  };

  const showEditAll = (e) => {
    e.preventDefault();
    setEditAll(true);
    setEditName(isNameEditable);
    setEditPhone(isPhotoEditable);
    setEditCompany(isCompanyEditable);
    setEditRole(isRoleEditable);
    setEditEmail(isEmailEditable);
    setEditLocation(isLocationEditable);
  };

  const hideEditAll = (e) => {
    e.preventDefault();

    setEditAll(false);
    setEditName(false);
    setEditPhoto(false);
    setEditCompany(false);
    setEditRole(false);
    setEditPhone(false);
    setEditEmail(false);
    setEditLocation(false);
    setName(data?.name);
    setLastname(data?.lastname);
    setRole(data.role);
    setEmail(data.email);
    setPhone(data.phone);

    emailReference.current.classList.remove("is-invalid");
    phoneReference.current.classList.remove("is-invalid");
  };

  const editShowHideName = (e) => {
    e.preventDefault();
    setEditName(!editName);
  };

  const showSlider = () => {
    setSIDESLIDER_PROPS({
      ...SIDESLIDER_PROPS,
      SliderStatus: false,
    });

    props.handleCloseModal();
  };

  return (
    <SideSlider SIDESLIDER_PROPS={SIDESLIDER_PROPS} showSlider={showSlider}>
      {toast?.text !== "" && (
        <Toast
          type={toast?.type}
          text={toast?.text}
          handleToastOnClick={handleToastOnClick}
        />
      )}
      {data.client ? (
        <div id="profile-area">
          <div className="top">
            {isEditAllAvailable && !editAll && !editName && (
              <button
                type="button"
                className="editAll"
                title="Edit All"
                id="editall"
                onClick={(e) => showEditAll(e)}
              >
                <i className="material-icons-outlined" id="editall">
                  edit
                </i>
              </button>
            )}

            {editAll && (
              <>
                <button
                  type="button"
                  className="editallSave UpdateAll"
                  title="Save"
                  onClick={(e) => handleAllUpdate(e, "save")}
                >
                  <i className="material-icons-outlined">save</i>
                </button>
                <button
                  type="button"
                  className="editallRemove UpdateAll"
                  title="Cancel"
                  onClick={(e) => hideEditAll(e)}
                >
                  <i className="material-icons-outlined">close</i>
                </button>
              </>
            )}

            <form className="profilePhoto" encType="mulitpart/form-data">
              {isPhotoEditable && (
                <>
                  <i
                    className="material-icons-outlined"
                    onClick={fileUploadAction}
                  >
                    camera_alt
                  </i>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    hidden
                    name="profilePhoto"
                    ref={inputReference}
                    onChange={fileUploadInputChange}
                  />
                </>
              )}

              <img
                alt={`${data.name}'s Profile`}
                src={
                  data.avatar !== ""
                    ? `${import.meta.env.VITE_URL_API_SERVICE}/file/src/?path=${
                        data.avatar
                      }`
                    : `https://eu.ui-avatars.com/api/?bold=true&color=fff&background=999&size=35&name=${data.name}+${data.lastname}`
                }
              />
            </form>

            <form className="general-forms editable-hidden">
              <div className="nameSection">
                {((editName === false && editAll === false) ||
                  (editAll && editName === false)) && (
                  <h2 id="full-name" className="currentValue">
                    {data.name} {data.lastname}
                    <button type="button" title="Edit">
                      {isNameEditable && (
                        <i
                          className="material-icons-outlined"
                          onClick={(e) => editShowHideName(e)}
                        >
                          edit
                        </i>
                      )}
                    </button>
                  </h2>
                )}

                {editName && (
                  <div
                    className="iconPlusInput editNameReveal"
                    id="profile-name"
                  >
                    <div className="wrap-field-label">
                      <div className="inputWrapper">
                        <label className="label-form">First Name</label>
                        <input
                          className="default-input-text"
                          maxLength="45"
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="inputWrapper">
                        <label className="label-form">Last Name</label>
                        <input
                          className="default-input-text"
                          maxLength="45"
                          type="text"
                          id="lastname"
                          value={lastname}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                    {editAll === true && (
                      <div className="wrap-field-separator" />
                    )}
                    {!editAll && (
                      <div className="saveCloseIcons" id="name-section">
                        <button
                          type="button"
                          title="Save"
                          onClick={(e) => handleSaveName(e, "save")}
                        >
                          <i className="material-icons-outlined">save</i>
                        </button>
                        <button
                          type="button"
                          title="Cancel"
                          onClick={(e) => handleSaveName(e, "remove")}
                        >
                          <i className="material-icons-outlined">close</i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {(editAll === false ||
                (editAll &&
                  accountManager === false &&
                  projectManager === false)) && (
                <div className="companySection">{data.client}</div>
              )}
              {editAll && (accountManager || projectManager) && (
                <fieldset className="chooseRole dropdown">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Client</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        value={data.client}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value={data.client}>{data.client}</option>
                      </select>
                    </div>
                  </div>
                </fieldset>
              )}
              {(editAll === false || (editAll && accountManager === false)) && (
                <div className="companySection">{data.role}</div>
              )}
              {editAll && accountManager && (
                <fieldset className="chooseRole dropdown">
                  <div className="DdWrapper">
                    <label htmlFor="roleSelect">Role</label>
                    <div className="styled-select">
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value={data.role}>{data.role}</option>
                        {roles.map((rol) => {
                          if (rol !== data.role) {
                            return <option value={rol}>{rol}</option>;
                          }
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              )}
            </form>
          </div>
          {/* end top */}

          <div className="bottom">
            <form className="general-forms editable-hidden">
              <div className="iconPlusInput email">
                <i className="material-icons-outlined">email</i>
                <div
                  className={
                    editAll && isEmailEditable
                      ? "wrap-field-label editAllActive"
                      : "wrap-field-label"
                  }
                >
                  {(editAll === false ||
                    (editAll && isEmailEditable === false)) && (
                    <p className="currentValue">{data.email}</p>
                  )}
                  {isEmailEditable && (
                    <div className="inputWrapper">
                      <label className="label-form">Email</label>
                      <input
                        ref={emailReference}
                        maxLength="45"
                        className="default-input-text"
                        type="text"
                        id="email"
                        onChange={(e) => handleChange(e)}
                        onClick={handleIconChange}
                        value={email}
                      />

                      {editAll === false && editEmail && (
                        <div className="saveCloseIcons textboxIcon">
                          <button
                            type="button"
                            title="Save"
                            onClick={(e) => handleSave(e, "email")}
                          >
                            <i className="material-icons-outlined">save</i>
                          </button>
                          <button
                            type="button"
                            title="Cancel"
                            onClick={(e) => handleRestore(e, "email")}
                          >
                            <i className="material-icons-outlined">close</i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <span className="validation-error">
                Please enter a valid email adress
              </span>
              <div className="iconPlusInput">
                <i className="material-icons-outlined">local_phone</i>
                <div
                  className={
                    editAll && isPhoneEditable
                      ? "wrap-field-label editAllActive"
                      : "wrap-field-label"
                  }
                >
                  {(editAll === false ||
                    (editAll && isPhoneEditable === false)) && (
                    <p className="currentValue">{data.phone}</p>
                  )}
                  {isPhoneEditable && (
                    <div className="inputWrapper">
                      <label className="label-form">Phone Number</label>
                      <input
                        ref={phoneReference}
                        maxLength="30"
                        className="default-input-text"
                        type="tel"
                        id="phone"
                        pattern="[0-9]*"
                        onChange={(e) => handleChange(e)}
                        onClick={handleIconChange}
                        value={phone}
                      />

                      {editAll === false && editPhone && (
                        <div className="saveCloseIcons textboxIcon">
                          <button
                            type="button"
                            title="Save"
                            onClick={(e) => handleSave(e, "phone")}
                          >
                            <i className="material-icons-outlined">save</i>
                          </button>
                          <button
                            type="button"
                            title="Cancel"
                            onClick={(e) => handleRestore(e, "phone")}
                          >
                            <i className="material-icons-outlined">close</i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {(editAll === true || (editAll && isPhoneEditable === true)) && (
                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={(e) => hideEditAll(e)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={(e) => handleAllUpdate(e, "save")}
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>

          <span ref={loaderReference} className="spinner" />
          {/* end bottom */}
        </div>
      ) : (
        <SliderLoading />
      )}
    </SideSlider>
  );
}
