import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import { NotificationDashboard } from "./components/NotificationDashboard/NotificationDashboard";
import { SummaryCard } from "./components/SummaryCard/SummaryCar";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";
import Toast from "../../components/toast/toast";

import "../../styles/notification.css";
import "../../styles/dashboard.css";

export function MainDashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const [notificationsData, setNotificationsData] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [timeDay, setTimeDay] = useState("");
  const [backgroundChecked, setBackgroundChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    text: "",
    type: "",
  });

  const { user, permissions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Dashboard";
    // fetching data to display it on dashboard page
    handleData();

    checkTime();
    onToggleBackground(false);

    // Need to check if it's working when user change the password.
    // I just rewrote the old code.
    passwordJustResetNotification();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("bodyBackground", backgroundChecked);

    // removing class bodyBackground form the body tag
    return () => document.body.classList.remove("bodyBackground");
  }, [backgroundChecked]);

  const dateFormatter = (date) => {
    // format date to "YYYY-MM-DD";
    let dateFormatted = "";

    let month = date.getMonth();
    month += 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    dateFormatted = `${date.getFullYear()}-${month}-${day}`;
    return dateFormatted;
  };

  const handleData = async () => {
    setIsLoading(true);
    const date = dateFormatter(new Date());

    const promiseDashboard = api.get("/user/dashboard");
    const promiseNotification = api.get(
      `/notifications/${user?.realCompanyId}/${user?.id}`,
    );
    const promiseCalendar = api.get(
      `/task/0/0?startDate=${date}&endDate=${date}`,
    );

    Promise.all([promiseDashboard, promiseNotification, promiseCalendar])
      .then((response) => {
        setDashboardData(response[0]?.data || []);
        setNotificationsData(response[1]?.data || []);

        // getting only the first 3 activities for today
        setCalendarData(response[2]?.data.slice(0, 3));

        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleOnClickButton = (e, type) => {
    if (type === "book") {
      navigate("/dashboard/books");
    } else if (type === "journal") {
      navigate("/dashboard/journals");
    } else {
      navigate("/calendar");
    }
  };

  function showWarningToast(message) {
    setToast({
      text: message.statusText,
      type: message.statusType,
    });

    // Set it to false on page load so it doesn't appear on page refresh
    window.localStorage.setItem("passwordJustReset", "false");
  }

  const passwordJustResetNotification = () => {
    const passwordJustReset = localStorage.getItem("passwordJustReset");

    if (passwordJustReset === "true") {
      const messageObject = {
        statusText: "You’ve successfully changed your password.",
        statusType: "success",
        statusIcon: "check",
      };

      showWarningToast(messageObject);
    }
  };

  const checkTime = () => {
    const hour = new Date().getHours(); // 0-23

    if (hour >= 0 && hour <= 12) {
      setTimeDay("Good morning");
    } else if (hour > 12 && hour <= 18) {
      setTimeDay("Good afternoon");
    } else {
      setTimeDay("Good evening");
    }
  };

  const onToggleBackground = (toggle) => {
    const checkedLocalStorage = window.localStorage.getItem(
      "dashboardBackground",
    );

    if (toggle) {
      if (checkedLocalStorage === "true") {
        setBackgroundChecked(false);
        window.localStorage.setItem("dashboardBackground", "false");
      } else {
        setBackgroundChecked(true);
        window.localStorage.setItem("dashboardBackground", "true");
      }
    } else if (checkedLocalStorage === "true") {
      setBackgroundChecked(true);
    } else {
      setBackgroundChecked(false);
    }
  };

  const handleToastOnClick = () => {
    setToast({
      text: "",
      type: "",
    });
  };

  return (
    <>
      {isLoading && <Loading />}
      {toast?.text !== "" && (
        <Toast
          type={toast?.type}
          text={toast?.text}
          handleToastOnClick={handleToastOnClick}
        />
      )}
      {calendarData &&
        Object.keys(dashboardData)?.length > 0 &&
        Object.keys(notificationsData)?.length > 0 && (
          <Layout iconActive="Dashboard" permissions={permissions} user={user}>
            <div className="deanta-toast-alert hidden">
              <i className="material-icons-outlined hidden" />
              <p className="deanta-toast-text" />
              <button type="button" className="deanta-toast-close">
                <i className="material-icons-outlined">close</i>
              </button>
            </div>

            {/* Header */}
            <div className="page-header row no-gutters pt-4 dashboard-header">
              <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
                <h3 className="page-title">
                  <span>{timeDay}</span>, {user?.name}{" "}
                </h3>
              </div>

              <div className="col-4 col-sm-6 mr-auto align-items-right">
                <div
                  className="mb-sm-0 mx-auto ml-sm-auto mr-sm-0"
                  role="group"
                  aria-label="Page actions"
                >
                  <label
                    htmlFor="backgroundDashboard"
                    className="form-switch bg_toggle"
                  >
                    <span className="label">Toggle Background Image</span>
                    <input
                      type="checkbox"
                      id="backgroundDashboard"
                      onChange={() => onToggleBackground(true)}
                      checked={backgroundChecked}
                    />
                    <i />
                  </label>
                </div>
              </div>
            </div>
            {/* End Header */}

            {/* Dashboard */}
            <h2 className="title-section">
              <i className="material-icons-outlined">dashboard</i> My Dashboard
            </h2>

            <div className="flex-block-dashboard">
              {/* Notifications */}
              {Object.keys(notificationsData).length > 0 && (
                <div className="dashboard-box notifications">
                  <NotificationDashboard />
                </div>
              )}

              {/* Books */}
              {permissions?.books?.view && (
                <SummaryCard
                  title="Summary of Books in Progress"
                  projects={dashboardData?.books?.projects}
                  type="book"
                  milestones={dashboardData?.books?.milestones}
                  tasks={dashboardData?.books?.tasks}
                  permissions={permissions}
                  buttonLabel="My Active Books"
                  handleOnClickButton={(e, type) =>
                    handleOnClickButton(e, type)
                  }
                />
              )}

              {/* Journals */}
              {permissions?.journals?.view && (
                <SummaryCard
                  title="Summary of Journals in Progress"
                  projects={dashboardData?.journals?.projects}
                  type="journal"
                  milestones={dashboardData?.journals?.milestones}
                  tasks={dashboardData?.journals?.tasks}
                  permissions={permissions}
                  buttonLabel="My Active Journals"
                  handleOnClickButton={(e, type) =>
                    handleOnClickButton(e, type)
                  }
                />
              )}

              {/* Calendar */}
              <SummaryCard
                title="Summary of Today's Activities"
                type="calendar"
                calendar={calendarData}
                buttonLabel="My Calendar"
                handleOnClickButton={(e, type) => handleOnClickButton(e, type)}
              />
            </div>
          </Layout>
        )}
    </>
  );
}
