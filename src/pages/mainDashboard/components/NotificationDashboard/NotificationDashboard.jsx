import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/Auth";
import NotificationCount from "../../../../components/NotificationCount/NotificationCount";
import SliderLoading from "../../../../components/sliderLoading/SliderLoading";
import { api } from "../../../../services/api";

export function NotificationDashboard() {
  const { user } = useAuth();
  const [notificationsData, setNotificationsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotifications();
  }, [user]);

  const getNotifications = () => {
    setLoading(true);
    api
      .get(`/notifications/${user?.realCompanyId}/${user?.id}`)
      .then((res) => {
        const notificationsDashboardItems = Object.keys(res.data.types).map(
          (item) => {
            const projectsList =
              res.data.types[item].categories ||
              res.data.types[item].notifications;
            return projectsList;
          },
        );
        setNotificationsData(notificationsDashboardItems);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="d-flex">
        <h6 className="dashboard-box-head-line special">
          <Link to="/notification" style={{ color: "unset" }}>
            Your Notifications
          </Link>
        </h6>
      </div>
      {loading ? (
        <SliderLoading fitLoad />
      ) : notificationsData.length === 0 ? (
        <div className="empty-msg">
          <span className="material-icons-outlined icon">notifications</span>
          <span>No new notifications</span>
        </div>
      ) : (
        <ul className="notifications">
          {notificationsData.map((item) => {
            if (Array.isArray(item)) {
              return item.map((notification, index) => (
                <li key={index}>
                  <Link to="/notification">
                    <p>{notification.title}</p>
                  </Link>
                </li>
              ));
            }
            return Object.keys(item).map((notification) => (
              <li key={item[notification].id}>
                <Link to={`/notification?project_id=${item[notification].id}`}>
                  {item[notification].notifications[0]?.chapter_id !== "0" ? (
                    <p>
                      {item[notification].notifications[0]?.abbreviation} -{" "}
                      {item[notification].notifications[0]?.chapterNo}
                    </p>
                  ) : (
                    <p>{notification}</p>
                  )}
                  {item[notification].count > 0 && (
                    <span className="counter">
                      <NotificationCount
                        text={
                          item[notification].count < 99
                            ? item[notification].count
                            : "99+"
                        }
                      />
                    </span>
                  )}
                </Link>
              </li>
            ));
          })}
        </ul>
      )}
    </>
  );
}
