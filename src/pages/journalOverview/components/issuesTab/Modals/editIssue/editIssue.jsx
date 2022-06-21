import { useState } from "react";
import { api } from "../../../../../../services/api";
import Modal from "../../../../../../components/modal";
import BasicButtonsSet from "../../../../../../components/basicButtonsSet";
import DatePicker from "../../../../../../components/datePicker/datePicker";
import Input from "../../../../../../components/input/input";
import Dropdown from "../../../../../../components/dropdown/dropdown";
import ModalForm from "../../../../../../components/ModalForm/modalForm";
import Loading from "../../../../../../components/loader/Loading";

import "./styles/editIssue.styles.css";

const timeDropdown = [
  {
    id: 0,
    value: "24:00:00",
    labelDropdown: "12 midnight",
  },
  {
    id: 1,
    value: "01:00:00",
    labelDropdown: "1 am",
  },
  {
    id: 2,
    value: "02:00:00",
    labelDropdown: "2 am",
  },
  {
    id: 3,
    value: "03:00:00",
    labelDropdown: "3 am",
  },
  {
    id: 4,
    value: "04:00:00",
    labelDropdown: "4 am",
  },
  {
    id: 5,
    value: "05:00:00",
    labelDropdown: "5 am",
  },
  {
    id: 6,
    value: "06:00:00",
    labelDropdown: "6 am",
  },
  {
    id: 7,
    value: "07:00:00",
    labelDropdown: "7 am",
  },
  {
    id: 8,
    value: "08:00:00",
    labelDropdown: "8 am",
  },
  {
    id: 9,
    value: "09:00:00",
    labelDropdown: "9 am",
  },
  {
    id: 10,
    value: "10:00:00",
    labelDropdown: "10 am",
  },
  {
    id: 11,
    value: "11:00:00",
    labelDropdown: "11 am",
  },
  {
    id: 12,
    value: "12:00:00",
    labelDropdown: "12 noon",
  },
  {
    id: 13,
    value: "13:00:00",
    labelDropdown: "1 pm",
  },
  {
    id: 14,
    value: "14:00:00",
    labelDropdown: "2 pm",
  },
  {
    id: 15,
    value: "15:00:00",
    labelDropdown: "3 pm",
  },
  {
    id: 16,
    value: "16:00:00",
    labelDropdown: "4 pm",
  },
  {
    id: 17,
    value: "17:00:00",
    labelDropdown: "5 pm",
  },
  {
    id: 18,
    value: "18:00:00",
    labelDropdown: "6 pm",
  },
  {
    id: 19,
    value: "19:00:00",
    labelDropdown: "7 pm",
  },
  {
    id: 20,
    value: "20:00:00",
    labelDropdown: "8 pm",
  },
  {
    id: 21,
    value: "21:00:00",
    labelDropdown: "9 pm",
  },
  {
    id: 22,
    value: "22:00:00",
    labelDropdown: "10 pm",
  },
  {
    id: 23,
    value: "23:00:00",
    labelDropdown: "11 pm",
  },
];

export default function EditIssue({
  issueData,
  handleClose,
  show,
  handleDeleteIssue,
  updateIssue,
}) {
  const [data, setData] = useState(issueData);
  const [modal, setModal] = useState(false);
  const [issueImageUpdated, setIssueImageUpdated] = useState("");
  const [issueImageFile, setIssueImageFile] = useState("");
  const [validateForm, setValidateForm] = useState({
    volume_num: false,
    issue_num: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (name === "volume_num") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, volume_num: true });
          } else {
            setValidateForm({ ...validateForm, volume_num: false });
          }
        } else if (name === "issue_num") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, issue_num: true });
          } else {
            setValidateForm({ ...validateForm, issue_num: false });
          }
        }

        setData((prevState) => ({
          ...prevState,
          [name]: value || "",
        }));
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = e.target.getAttribute("data-value");

        setData((prevState) => ({
          ...prevState,
          [eleName]: eleValue || "",
        }));
      }
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  const deleteIssue = async () => {
    // const formData = new FormData();
    // formData.append("projectId", data?.project_id);
    // formData.append("issueId", data?.issue_id);

    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: formData,
    //   mode: "no-cors",
    // };

    const bodyRequest = {
      projectId: data?.project_id,
      issueId: data?.issue_id,
    };

    await api
      .post("/issue/delete", bodyRequest)
      .then((response) => {
        if (response.data) {
          handleDeleteIssue(data?.issue_id);
          setModal(false);
          handleClose();
        }
      })
      .catch(() => {
        setModal(false);
        handleClose();
      });
  };

  const handleIssueImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      setIssueImageUpdated(URL.createObjectURL(img));
      setIssueImageFile(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // No errors - Check if validaForm has some value = true
    if (!(Object.values(validateForm).indexOf(true) > -1)) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("issue-cover-image", issueImageFile);
      formData.append("IssuecoverFlag", issueImageUpdated ? 0 : 1);
      formData.append("Issue[project_id]", data?.project_id);
      formData.append("Issue[volume_num_update]", data?.volume_num);
      formData.append("Issue[issueId]", data?.issue_id);
      formData.append("Issue[issue_num_update]", data?.issue_num);
      formData.append("Issue[ISSN_update]", data?.ISSN);
      formData.append("Issue[publish_month_update]", data?.publish_month);
      formData.append("Issue[start_date_update]", data?.receive_date);
      formData.append("Issue[end_date_update]", data?.end_date);
      formData.append("Issue[start_time_update]", data?.start_time);
      formData.append("Issue[end_time_update]", data?.end_time);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
        mode: "no-cors",
      };
      const response = await fetch("/call/issue/update/submit", requestOptions);
      const responseData = await response.json();

      responseData.data = {
        ...data,
        issue_image: issueImageFile.name,
      };

      if (responseData) {
        updateIssue(responseData.data);
        setModal(false);
        setIsLoading(false);
        handleClose();
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      {modal && (
        <Modal
          modalInSlider
          title="Are you sure you want to delete Issue?"
          footer={
            <BasicButtonsSet
              loadingButtonAction={false}
              disableButtonAction={false}
              cancelButtonAction={() => closeModal()}
              buttonAction={() => deleteIssue()}
              actionText="Delete Issue"
            />
          }
          closeModal={() => closeModal()}
        />
      )}

      <ModalForm show={show}>
        <form
          className="general-forms"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="modal-header">
            <h5 className="modal-title">Edit Issue</h5>
            <button
              type="button"
              className="close"
              onClick={() => handleClose()}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="modal-body">
            <h3>Information</h3>
            <div className="general-info">
              <div className="left-side flex-side">
                <div className="thumb-project" id="thumb-issue-cover">
                  {issueImageUpdated === "" ? (
                    <img
                      alt="Issue Cover"
                      className="profile-image"
                      id="IssuecoverImage"
                      src={
                        data?.issue_image
                          ? `${
                              import.meta.env.VITE_URL_API_SERVICE
                            }/file/src/?path=/epublishing/${
                              data?.project_id
                            }/projectAssets/${data?.issue_image}&storage=blob`
                          : "/assets/images/covers/generic.png"
                      }
                    />
                  ) : (
                    <img
                      alt="Issue Cover"
                      className="profile-image"
                      id="IssuecoverImage"
                      src={issueImageUpdated}
                    />
                  )}

                  <i className="material-icons-outlined">add_photo_alternate</i>
                  <input
                    type="file"
                    className="image-file-input"
                    id="cover-issue-image"
                    name="issue-cover-image"
                    onChange={handleIssueImage}
                  />
                </div>
                <div className="half-side">
                  {/* Volume */}
                  <Input
                    label="Volume *"
                    name="volume_num"
                    id="volumeNumUpdate"
                    value={data.volume_num}
                    titleError="Please enter the Volume Number."
                    hasError={validateForm?.volume_num}
                    handleOnChange={(e) => handleOnChange(e)}
                  />

                  {/* Issue */}
                  <Input
                    label="Issue *"
                    name="issue_num"
                    id="issueNumUpdate"
                    value={data.issue_num}
                    titleError="Please enter the Issue Number."
                    hasError={validateForm?.issue_num}
                    handleOnChange={(e) => handleOnChange(e)}
                  />

                  {/* ISSN */}
                  <Input
                    label="ISSN"
                    name="ISSN"
                    id="issueIssn"
                    value={data.ISSN}
                    maxLength="255"
                    handleOnChange={(e) => handleOnChange(e)}
                  />

                  {/* Publish Month */}
                  <DatePicker
                    type="month"
                    name="publish_month"
                    id="issuePublishmonth"
                    label="Publish month"
                    defaultValue={new Date(data?.publish_month)}
                    getSelectedDate={(event) => handleOnChange(event)}
                  />
                </div>
              </div>
              <div className="right-side">
                {/* Start date */}
                <DatePicker
                  type="date"
                  name="receive_date"
                  id="issueReceiveDateUpdate"
                  label="Start Date"
                  defaultValue={data?.receive_date}
                  getSelectedDate={(event) => handleOnChange(event)}
                />

                {/* End Date */}
                <DatePicker
                  type="date"
                  name="end_date"
                  id="issueEndDate"
                  label="End date"
                  defaultValue={data?.end_date}
                  getSelectedDate={(event) => handleOnChange(event)}
                />

                {/* Start time */}
                <Dropdown
                  label="Start time"
                  name="start_time"
                  id="selectedStartTime"
                  value={data.start_time}
                  valuesDropdown={timeDropdown}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="timer"
                  iconClassName="material-icons"
                />

                {/* End Time */}
                <Dropdown
                  label="End time"
                  name="end_time"
                  id="selectedEndTime"
                  value={data.end_time}
                  valuesDropdown={timeDropdown}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="timer"
                  iconClassName="material-icons"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer cta-right">
            <button
              type="button"
              className="btn btn-outline-primary danger"
              onClick={() => setModal(true)}
            >
              Delete Issue
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleClose()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-outline-primary">
              Update
            </button>
          </div>
        </form>
      </ModalForm>
    </>
  );
}
