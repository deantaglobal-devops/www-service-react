import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";
import NotificationBeta from "./components/notificationBeta/notificationBeta";
import { dateTimeFunction } from "../../utils/reusableFunctionality";

import "../../styles/notification.css";

export function Notification() {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsList, setNotificationsList] = useState({});
  const [firstColumn, setFirstColumn] = useState([]);
  const [secondColumn, setSecondColumn] = useState([]);
  const [thirdColumn, setThirdColumn] = useState(false);
  const [secondColumnUnseenIds, setSecondColumnUnseenIds] = useState([]);
  const [thirdColumnUnseenIds, setThirdColumnUnseenIds] = useState([]);

  const { user, permissions } = useAuth();
  const { projectId } = useParams();
  const notificationHeader = "Notification Center";

  useEffect(() => {
    document.title = "Lanstad — Notification Center";

    // fetching notification data
    handleNotificationData();
  }, []);

  useEffect(() => {
    if (Object.keys(notificationsList).length > 0) {
      activeNotificationBtn();

      // generate the firstColumn data
      showFirstColumn();

      updateBellCount();
    }
  }, [notificationsList]);

  const handleNotificationData = async () => {
    setIsLoading(true);
    await api
      .get(`/notifications/${user.realCompanyId}/${user.id}`)
      .then((response) => {
        setNotificationsList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  const getNotificationsUpdated = (firstColumnName, secondColumnName) => {
    api
      .get(`/notifications/${user.companyId}/${user.id}`)
      .then(async (response) => {
        if (response.data.types) {
          setNotificationsList(response.data);

          await showFirstColumn();

          const firstColumnSelected = [...firstColumn].filter(
            (columnTab) => columnTab.menuTitle === firstColumnName,
          );

          await showSecondColumn(firstColumnSelected[0].nextColumn);

          // if the mark as read is triggered on the second column directly,
          // there is no project selected (secondColumnName)
          if (secondColumnName) {
            const secondColumnSelected = [...secondColumn].filter(
              (columnTab) => columnTab.menuTitle === secondColumnName,
            );
            if (secondColumnSelected[0].nextColumn) {
              await showThirdColumn(secondColumnSelected[0].nextColumn);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const activeNotificationBtn = () => {
    document.getElementById("notificationIcon")?.classList?.add("active");
  };

  const showFirstColumn = () => {
    const types = notificationsList.types ? { ...notificationsList }.types : {};
    const firstColumnData = Object.keys(types).map((item) => ({
      menuTitle: item,
      notificationCount: types[item].count,
      menuId: types[item].id,
      nextColumn: types[item].categories
        ? types[item].categories
        : types[item].notifications,
      nextColumnTitle: types[item].categories ? "Projects" : "",
    }));

    setFirstColumn(firstColumnData);

    if (projectId) {
      const keys = Object.keys(firstColumnData[0]?.nextColumn);
      const values = Object.values(firstColumnData[0]?.nextColumn);

      const valuesKeys = values.map((value, index) => ({
        ...value,
        menuTitle: keys[index],
      }));

      showSecondColumn(valuesKeys);

      // Added timeout because the element is not in the DOM
      // So, i needed to make it.
      setTimeout(() => {
        if (document.readyState === "complete") {
          const communicationButton = document.getElementsByClassName(
            "undefined icon-text",
          );

          communicationButton[0]?.click();
        } else {
          window.addEventListener("load", () => {
            const communicationButton = document.getElementsByClassName(
              "undefined icon-text",
            );
            communicationButton[0]?.click();
          });
        }
      }, 100);

      const selectedProject = values.filter((value) => value.id == projectId);

      showThirdColumn(selectedProject[0]?.notifications);

      // Added timeout because the element is not in the DOM
      // So, i needed to make it.
      setTimeout(() => {
        if (document.readyState === "complete") {
          const element = document.querySelector(`[data-id="${projectId}"]`);

          if (element) {
            element?.scrollIntoView();
            const projectButton = element?.getElementsByClassName(
              "undefined icon-text",
            );
            projectButton[0]?.click();
          }
        } else {
          window.addEventListener("load", () => {
            const element = document.querySelector(`[data-id="${projectId}"]`);
            if (element) {
              element?.scrollIntoView();
              const projectButton = element?.getElementsByClassName(
                "undefined icon-text",
              );
              projectButton[0]?.click();
            }
          });
        }
      }, 100);
    }
    return true;
  };

  const showSecondColumn = (nextColumnReordered) => {
    let nextColumn = [];
    // we are going to create an array of unseen ids
    const unseenNotificationsIds = [];

    // This needs refactor, as sometimes we receive an array
    // and sometimes an object with diff formatting
    if (Array.isArray(nextColumnReordered)) {
      nextColumn = nextColumnReordered.map((tab) => {
        const notificationsOnThisObject = tab.notifications || [];

        if (notificationsOnThisObject.length > 0) {
          notificationsOnThisObject.forEach((notification) => {
            if (+notification.seen === 0) {
              // if the notification is not seen, we add it into the global
              // array of unseen notifications for this column
              unseenNotificationsIds.push(notification.id);
            }
          });
        } else if (+tab.seen === 0) {
          // if the notification is not seen, we add it into the global
          // array of unseen notifications for this column
          unseenNotificationsIds.push(tab.id);
        }

        return {
          menuTitle: tab.menuTitle ? tab.menuTitle : tab,
          text: tab.description,
          date: dateTimeFunction(tab.update_date, "date"),
          time: dateTimeFunction(tab.update_date, "time"),

          read: Number(tab.seen),
          link: tab.link,

          notificationCount: tab.count,
          menuId: tab.id,
          nextColumn: notificationsOnThisObject,
          nextColumnTitle: "",
        };
      });
    } else {
      nextColumn = Object.keys(nextColumnReordered).map((tab) => {
        const notificationsOnThisObject =
          nextColumnReordered[tab].notifications || [];

        if (notificationsOnThisObject.length > 0) {
          notificationsOnThisObject.forEach((notification) => {
            if (+notification.seen === 0) {
              // if the notification is not seen, we add it into the global
              // array of unseen notifications for this column
              unseenNotificationsIds.push(notification.id);
            }
          });
        } else if (+nextColumnReordered[tab].seen === 0) {
          // if the notification is not seen, we add it into the global
          // array of unseen notifications for this column
          unseenNotificationsIds.push(nextColumnReordered[tab].id);
        }

        return {
          menuTitle: nextColumnReordered[tab].menuTitle
            ? nextColumnReordered[tab].menuTitle
            : tab,
          text: nextColumnReordered[tab].description,
          date: dateTimeFunction(
            nextColumnReordered[tab].creation_date,
            "date",
          ),
          time: dateTimeFunction(
            nextColumnReordered[tab].creation_date,
            "time",
          ),

          read: Number(nextColumnReordered[tab].seen),
          link: nextColumnReordered[tab].link,

          notificationCount: nextColumnReordered[tab].count,
          menuId: nextColumnReordered[tab].id,
          nextColumn: notificationsOnThisObject,
          nextColumnTitle: "",
        };
      });
    }

    setSecondColumn(nextColumn);
    setSecondColumnUnseenIds(unseenNotificationsIds);

    return true;
  };

  const showThirdColumn = (nextColumnReordered) => {
    // Loop through all nextColumn items - make an array or objects
    //  and extract the unseen notifications
    const unseenNotificationsIds = [];

    const nextColumn = Object.keys(nextColumnReordered).map((tab) => {
      const notificationOnThisObject = nextColumnReordered[tab];

      if (+notificationOnThisObject.seen === 0) {
        // if the notification is not seen, we add it into the global
        // array of unseen notifications for this column
        unseenNotificationsIds.push(notificationOnThisObject.id);
      }

      return {
        // not sure why we have this as menuTitle in the third column
        menuTitle: "sd",
        text: nextColumnReordered[tab].description,
        date: dateTimeFunction(nextColumnReordered[tab].creation_date, "date"),
        time: dateTimeFunction(nextColumnReordered[tab].creation_date, "time"),
        read: Number(nextColumnReordered[tab].seen),
        link: nextColumnReordered[tab].link,

        //
        notificationCount: nextColumnReordered[tab].count,
        menuId: nextColumnReordered[tab].id,
        nextColumn: notificationOnThisObject,
        nextColumnTitle: "",
      };
    });

    setThirdColumn(nextColumn);
    setThirdColumnUnseenIds(unseenNotificationsIds);

    return true;
  };

  const updateBellCount = () => {
    // Triggered when mark as Read is clicked.
    let count = null;
    Object.entries(notificationsList?.types).forEach(([key, info]) => {
      // Loop through all the types and add the counts up
      count += Number(info.count);
    });

    // grab the bell's count container
    const bellCountEl = document.querySelector(
      "#notificationBellLink #notificationIcon + .badge",
    );
    // only try do this if the element exists - causes errors otherwise
    if (bellCountEl) {
      if (count === 0) {
        // Don't want to display a notification of 0
        count = "";
      }
      bellCountEl.innerHTML = count;
    }
  };

  const markAllAsRead = (items, firstColumnName, secondColumnName) => {
    items.forEach((id) => {
      api
        .post("/notifications/seen", { notificationId: id, userId: user.id })
        .then((response) => {
          if (response.data.status === "success") {
            // call api to get notifications updated
            getNotificationsUpdated(firstColumnName, secondColumnName);
          } else {
            // We have to settle which response errors might be and how to manage them.
          }
        })
        .catch((err) => {
          console.log(err);
          // We have to settle which response errors might be and how to manage them.
        });
    });
  };

  return (
    <Layout permissions={permissions} user={user}>
      {isLoading && <Loading loadingText="loading..." />}

      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
          <h3 className="page-title">
            <span />
          </h3>
        </div>

        <div className="col-4 col-sm-6 mr-auto align-items-right">
          <div
            className="mb-sm-0 mx-auto ml-sm-auto mr-sm-0"
            role="group"
            aria-label="Page actions"
          />
        </div>
      </div>

      {/* End Header */}

      <div className="notification-container" id="notification">
        <h1 className="notification-header">
          <Link to="/notification" className="w-100 mr-0">
            {notificationHeader}
          </Link>
        </h1>
        <NotificationBeta
          firstColumn={firstColumn}
          secondColumn={secondColumn}
          secondColumnUnseenIds={secondColumnUnseenIds}
          showSecondColumn={showSecondColumn}
          thirdColumn={thirdColumn}
          thirdColumnUnseenIds={thirdColumnUnseenIds}
          showThirdColumn={showThirdColumn}
          markAllAsReadFunc={markAllAsRead}
        />
      </div>
    </Layout>
  );
}
