import { useEffect, useState } from "react";
import NotificationCount from "../../../../components/NotificationCount/NotificationCount";
import SliderLoading from "../../../../components/sliderLoading";
import { api } from "../../../../services/api";

export function NotificationDashboard({ NOTIFICATION_CENTER_PROPS }) {
  const notificationsList = NOTIFICATION_CENTER_PROPS;
  const [notificationsData, setNotificationsData] = useState([]);
  const [notificationsDashboardItems, setNotificationsDashboardItems] =
    useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    normalizeNotifications(notificationsList);
  }, []);

  useEffect(() => {
    getProjectData();
  }, [notificationsDashboardItems]);

  function normalizeNotifications(notificationsList) {
    const notificationsDashboardItems = Object.keys(
      notificationsList.types,
    ).map((item) => {
      const projectsList =
        notificationsList.types[item].categories ||
        notificationsList.types[item].notifications;
      return projectsList;
    });
    setNotificationsDashboardItems(notificationsDashboardItems);
  }

  const getProjectData = async () => {
    setLoading(true);
    let arr = [];
    const getNotifications =
      notificationsDashboardItems
        ?.map((item) =>
          Object.keys(item).map((notification) => item[notification]),
        )
        .map((item) => item) || [];

    if (getNotifications.length > 0) {
      const projectRes = await Promise.all(
        getNotifications[0]?.map(async (notification) => {
          const res = await api.get(
            `/project/${notification.notifications[0].project_id}`,
          );
          return res.data;
        }),
      );

      const articleRes = await Promise.all(
        getNotifications[0]?.map(async (notification) => {
          const res =
            parseInt(notification.notifications[0].chapter_id) !== 0
              ? await api.get(
                  `/project/journal/${notification.notifications[0].project_id}/detail/${notification.notifications[0].chapter_id}`,
                )
              : "";
          return res.data;
        }),
      ).finally(() => {
        setLoading(false);
      });

      notificationsDashboardItems?.map((item) =>
        Object.keys(item).map((notification) => {
          const chapterNo = articleRes
            .filter(Boolean)
            .filter(
              (article) =>
                article.chapter_id ===
                item[notification].notifications[0].chapter_id,
            );
          const abbreviation = projectRes
            .filter(Boolean)
            .filter(
              (project) =>
                project.projectId ===
                parseInt(item[notification].notifications[0].project_id),
            );
          arr = [
            ...arr,
            {
              title: notification,
              id: item[notification].id,
              count: item[notification].count,
              chaptherId: item[notification].notifications[0].chapter_id,
              chapterNo: chapterNo[0]?.chapterNo || "",
              abbreviation: abbreviation[0]?.abbreviation || "",
            },
          ];
        }),
      );

      setNotificationsData(arr);
    }
  };

  return (
    <>
      <div className="d-flex">
        <h6 className="dashboard-box-head-line special">
          <a href="/notification" style={{ color: "unset" }}>
            Your Notifications
          </a>
        </h6>
      </div>
      {loading ? (
        <SliderLoading fitLoad />
      ) : notificationsDashboardItems.length === 0 ? (
        <p style={{ paddingLeft: `${28}px`, paddingTop: `${20}px` }}>
          No new notifications
        </p>
      ) : (
        <ul className="notifications">
          {
            (notificationsDashboardItems.map((item) => {
              if (Array.isArray(item)) {
                return item.map((notification, index) => (
                  <li key={index}>
                    <a href="/notification">
                      <p>{notification.title}</p>
                    </a>
                  </li>
                ));
              }
            }),
            notificationsData.map((item) => (
              <li key={item.id}>
                <a href={`/notification?project_id=${item.id}`}>
                  <p>
                    {item.chaptherId !== "0"
                      ? `${item.abbreviation} ${item.chapterNo}`
                      : item.title}
                  </p>
                  {item.count > 0 && (
                    <span className="counter">
                      <NotificationCount
                        text={item.count < 99 ? item.count : "99+"}
                      />
                    </span>
                  )}
                </a>
              </li>
            )))
          }
        </ul>
      )}
    </>
  );
}
