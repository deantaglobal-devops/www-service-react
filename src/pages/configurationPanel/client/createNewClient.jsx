import React from "react";
import { api } from "../../../services/api";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;
class CreateNewClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      unique: "",
      website: "",
      phone: "",
      clientImg: "",
      address1: "",
      address2: "",
      currency: "1",
      abbreviation: "",
      pageHeading: "Create New Client",
      validationMsg: "Name cannot be blank.",
      avatar: "",
      addressId: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.inputReference = React.createRef();
    this.fileUploadAction = this.fileUploadAction.bind(this);
    this.fileUploadInputChange = this.fileUploadInputChange.bind(this);
  }

  componentDidMount() {
    const { clientId } = this.props;
    if (clientId !== "") {
      const client = this.props.selectedClient;
      let updateImg = "";
      if (client.clientImage !== "") {
        updateImg = `${import.meta.env.VITE_URL_API_SERVICE}/file/src/?path=${
          client.clientImage
        }`;
      }
      this.setState({
        pageHeading: "Edit Client Information",
        name: client.company_name,
        website: client.company_url,
        abbreviation: client.abbrevation,
        unique: client.company_uniqueId,
        phone: client.phone,
        address1: client.address1,
        address2: client.address2,
        clientImg: client.clientImage,
        avatar: updateImg,
        addressId: client.address_id,
        currency: client.currency,
      });
    }
  }

  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const { id } = event.target;
    this.setState(
      {
        [id]: event.target.value,
        validationMsg: "Name cannot be blank.",
      },
      () => {
        // client name and abbreviation only mandatory in create or update client
        if (id === "name" || id === "abbreviation") {
          this.handleValidation(id);
        }
      },
    );
  }

  handleValidation(id) {
    const errorSpan = document.getElementById(`${id}-validation`);
    let elementVal = this.state[id];
    errorSpan.classList.remove("is-invalid");
    let res = true;
    if (id === "name") {
      let validationMsg = "Name cannot be blank.";
      // name blank space validation
      if (elementVal !== "" && elementVal.match(/^\s*$/g)) {
        elementVal = "";
        validationMsg = "Name id invalid.";
      }
      // min 3 char name validation
      if (elementVal.length > 0 && elementVal.length < 3) {
        elementVal = "";
        validationMsg = "Name is too short (minimum is 3 characters)";
      }
      this.setState({
        validationMsg,
      });
    }
    if (elementVal === "") {
      errorSpan.classList.add("is-invalid");
      res = false;
    }
    return res;
  }

  handleErrorValidation() {
    const errorSpan = document.getElementById("name-validation");
    errorSpan.classList.add("is-invalid");
    this.setState({
      validationMsg: "Name Already Exit.",
    });
  }

  async handleSave(action) {
    const nameValidation = this.handleValidation("name");
    const abbreviationValidation = this.handleValidation("abbreviation");
    if (nameValidation && abbreviationValidation) {
      this.props.loadingIcon("show");
      // call configuration client create/update API
      let response = null;
      if (this.props.clientId !== "") {
        response = await api
          .post("/configuration/update/client", {
            name: this.state.name,
            unique: this.state.unique,
            website: this.state.website,
            phone: this.state.phone,
            clientImg: this.state.clientImg,
            address1: this.state.address1,
            address2: this.state.address2,
            currency: this.state.currency,
            abbreviation: this.state.abbreviation,
            clientId: this.props.clientId,
            cityId: 1,
            addressId: this.state.addressId,
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        response = await api
          .post("/configuration/create/client", {
            name: this.state.name,
            unique: this.state.unique,
            website: this.state.website,
            phone: this.state.phone,
            clientImg: this.state.clientImg,
            address1: this.state.address1,
            address2: this.state.address2,
            currency: this.state.currency,
            abbreviation: this.state.abbreviation,
            clientId: this.props.clientId,
            cityId: 1,
            addressId: this.state.addressId,
          })
          .catch((err) => {
            console.log(err);
          });
      }

      const clientList = await api
        .post("/configuration/client/list", {
          userId: this.props.userId,
        })
        .catch((err) => {
          console.log(err);
        });

      response.data.clientList = clientList.data;

      this.props.loadingIcon("hide");
      if (response.data.status === "success") {
        let message = "Client has been updated successfully.";
        if (action === "New") {
          message = "Client has been created successfully.";
        }
        const list = response.data.clientList;
        window.showWarningToast({
          statusType: "success",
          statusIcon: "check",
          statusText: message,
        });
        this.props.showHideNewClient(false);
        this.props.updateClientList(list);
        if (this.props.clientId !== "") {
          const id = this.props.clientId;
          const selectedClient = list.filter(function (item) {
            return +item.company_id === +id;
          })[0];
          // updating client information.
          this.props.updateClientDetails(selectedClient);
        }
      }
      if (response.data.status === "error") {
        this.handleErrorValidation();
      }
    }
  }

  fileUploadAction(e) {
    e.preventDefault();
    this.inputReference.current.click();
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
                clientImg: response.filePath,
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

  render() {
    return (
      <div
        className="deanta-modal"
        id="deanta-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <div
          id="create-new-client"
          className="deanta-modal-dialog"
          role="document"
        >
          <div
            className="deanta-modal-content create-client-content"
            ref={this.setModalWrapper}
          >
            <div className="deanta-modal-header">
              <h5 className="deanta-modal-title" id="ModalLabel">
                {this.state.pageHeading}
              </h5>
              <button
                type="button"
                onClick={() => this.props.showHideNewClient(false)}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="deanta-modal-body">
              <div id="user-area">
                <form className="profilePhoto" encType="mulitpart/form-data">
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
                  <img src={this.state.avatar ? `${this.state.avatar}` : ""} />
                </form>
              </div>
              <div className="client-name-abb">
                <div className="wrap-field-label">
                  <div className="inputWrapper">
                    <label className="label-form">Name *</label>
                    <input
                      className="default-input-text"
                      type="text"
                      id="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <span className="validation-error" id="name-validation">
                    {this.state.validationMsg}
                  </span>
                </div>
                <div className="wrap-field-label ml-2">
                  <div className="inputWrapper">
                    <label className="label-form">Abbreviation *</label>
                    <input
                      className="default-input-text"
                      type="text"
                      id="abbreviation"
                      value={this.state.abbreviation}
                      onChange={this.handleChange}
                    />
                  </div>
                  <span
                    className="validation-error"
                    id="abbreviation-validation"
                  >
                    Abbreviation cannot be blank.
                  </span>
                </div>
              </div>
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Website</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="website"
                    value={this.state.website}
                    onChange={this.handleChange}
                  />
                </div>
                <span className="validation-error" id="website-validation">
                  Website cannot be blank.
                </span>
              </div>
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Phone Number</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                  />
                </div>
                <span className="validation-error" id="phone-validation">
                  Phone Number cannot be blank.
                </span>
              </div>
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Postal Address1</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="address1"
                    value={this.state.address1}
                    onChange={this.handleChange}
                  />
                </div>
                <span className="validation-error" id="address1-validation">
                  Postal Address1 cannot be blank.
                </span>
              </div>
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Postal Address2</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="address2"
                    value={this.state.address2}
                    onChange={this.handleChange}
                  />
                </div>
                <span className="validation-error" id="address2-validation">
                  Postal Address2 cannot be blank.
                </span>
              </div>
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Unique(RFC)</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="unique"
                    value={this.state.unique}
                    onChange={this.handleChange}
                  />
                </div>
                <span className="validation-error" id="unique-validation">
                  Unique cannot be blank.
                </span>
              </div>
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Default Currency </label>
                    <div className="styled-select">
                      <select
                        id="currency"
                        value={this.state.currency}
                        onChange={this.handleChange}
                      >
                        {this.props.currencyList.length > 0 &&
                          this.props.currencyList.map((data) => {
                            return (
                              <option key={data.id} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="createclient add-client-button mt-2">
                <button
                  type="button"
                  className="deanta-button deanta-button-outlined"
                  onClick={() => this.props.showHideNewClient(false)}
                >
                  Cancel
                </button>
                {this.props.clientId === "" && (
                  <button
                    type="button"
                    className="deanta-button deanta-button-outlined"
                    onClick={() => this.handleSave("New")}
                    id="new-client-btn"
                  >
                    Create New Client
                  </button>
                )}
                {this.props.clientId !== "" && (
                  <button
                    type="button"
                    className="deanta-button deanta-button-outlined"
                    onClick={() => this.handleSave()}
                    id="update-client-btn"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNewClient;
