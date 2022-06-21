import { useState } from "react";

import ModalForm from "../../../../../components/ModalForm/modalForm";
import DatePicker from "../../../../../components/datePicker/datePicker";
import Input from "../../../../../components/input/input";
import Dropdown from "../../../../../components/dropdown/dropdown";
import Loading from "../../../../../components/loader/Loading";

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

export function NewIssue({ show, handleClose, project_id }) {
  const [data, setData] = useState({
    issue_image: "",
    volume_num: "",
    issue_num: "",
    issn: "",
    publish_month: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    project_id,
  });
  const [issueImageUpdated, setIssueImageUpdated] = useState("");
  const [issueImageFile, setIssueImageFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validateForm, setValidateForm] = useState({
    volume_num: false,
    issue_num: false,
  });

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

        if (name === "volume_num" || name === "issue_num" || name === "issn") {
          // Allow only numbers to be typed on input
          const re = /^[0-9\b]+$/;
          if (value === "" || re.test(value)) {
            setData((prevState) => ({
              ...prevState,
              [name]: value || "",
            }));
          }
        } else {
          setData((prevState) => ({
            ...prevState,
            [name]: value || "",
          }));
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(Object.values(validateForm).indexOf(true) > -1)) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("issue-coverimage", issueImageFile);
      formData.append("IssueCreatecoverFlag", issueImageUpdated ? 0 : 1);
      formData.append("Issues[project_id]", data?.project_id);
      formData.append("Issues[volume_num]", data?.volume_num);
      formData.append("Issues[issue_num]", data?.issue_num);
      formData.append("Issues[issn]", data?.issn);
      formData.append("Issues[publish_month]", data?.publish_month);
      formData.append("Issues[start_date]", data?.start_date);
      formData.append("Issues[end_date]", data?.end_date);
      formData.append("Issues[start_time]", data?.start_time);
      formData.append("Issues[end_time]", data?.end_time);

      const token = localStorage.getItem("lanstad-token");
      // For this endpoint we need to use fetch instead of axios.
      // Headers is not being created properly using axios
      await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/issue/create/submit`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Lanstad-Token": token,
          },
        },
      )
        .then((res) => res.json())
        .then(
          (response) => {
            if (response) {
              setIsLoading(false);
              window.location.reload();
            }
          },
          () => {
            setIsLoading(false);
          },
        );
    }
  };

  const handleIssueImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      setIssueImageUpdated(URL.createObjectURL(img));
      setIssueImageFile(img);
    }
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <ModalForm show={show}>
        <form
          action="#"
          className="general-forms"
          id="issue-createform"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="modal-header">
            <h5 className="modal-title">New Issue</h5>
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
                <div className="thumb-project" id="thumb-journal">
                  <img
                    alt="create issue"
                    className="profile-image"
                    id="CreateIssueImage"
                    src={issueImageUpdated !== "" ? issueImageUpdated : ""}
                  />
                  <i className="material-icons-outlined">add_photo_alternate</i>
                  <input
                    type="file"
                    className="image-file-input"
                    id="cover-createissue-image"
                    name="issue-coverimage"
                    onChange={handleIssueImage}
                  />
                </div>
                <div className="half-side">
                  {/* Volume */}
                  {/* Just number allowed */}
                  <Input
                    label="Volume *"
                    name="volume_num"
                    id="volumeNumUpdate"
                    value={data?.volume_num}
                    titleError="Please enter the Volume Number."
                    hasError={validateForm?.volume_num}
                    handleOnChange={(e) => handleOnChange(e)}
                  />

                  {/* Issue */}
                  {/* Just number allowed */}
                  <Input
                    label="Issue *"
                    name="issue_num"
                    id="issueNumUpdate"
                    value={data?.issue_num}
                    titleError="Please enter the Issue Number."
                    hasError={validateForm?.issue_num}
                    handleOnChange={(e) => handleOnChange(e)}
                  />

                  {/* ISSN */}
                  {/* Just number allowed */}
                  <Input
                    label="ISSN"
                    name="issn"
                    id="issueIssn"
                    value={data?.issn}
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
                  name="start_date"
                  id="issueReceiveDate"
                  label="Start Date"
                  defaultValue={data?.start_date}
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
                  value={data?.start_time}
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
                  value={data?.end_time}
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
              className="btn btn-outline-primary"
              onClick={() => handleClose()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-outline-primary">
              Create
            </button>
          </div>
        </form>
      </ModalForm>
    </>
  );
}
