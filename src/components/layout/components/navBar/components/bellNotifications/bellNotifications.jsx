import { useEffect } from "react";
import { api } from "../../../../../../services/api";
import { useAuth } from "../../../../../../hooks/Auth";

export default function BellNotifications() {
  const { user } = useAuth();

  let intervalID;
  useEffect(() => {
    if (user) {
      // get unread notifications count when first load
      getUnreadNotificationsCount();

      // And then also trigger every 30 seconds
      intervalID = setInterval(() => {
        getUnreadNotificationsCount();
      }, 30000);
    }

    return () => clearInterval(intervalID);
  }, [user]);

  const triggerNotificationBell = (count) => {
    document.querySelectorAll(".nav-link-icon__wrapper span")[0].innerText =
      count < 99 ? count : "99+";
  };

  const getUnreadNotificationsCount = async () => {
    // Don't get notifications if magic-code / Passkey is present (not a real user)
    const magicCode = window.localStorage.getItem("magic-code");
    if (magicCode) {
      return;
    }

    const userId = user.id;
    const companyId = user.realCompanyId;
    api
      .get(`/notifications/count/${companyId}/${userId}`)
      .then((response) => {
        const unreadNumber = response?.data[0]?.unread_notifications;
        if (unreadNumber > 0) {
          triggerNotificationBell(unreadNumber);
        }
      })
      .catch((err) => {});
  };

  return (
    <li className="nav-item border-right  notifications-dropdown">
      <a
        className="nav-link nav-link-icon text-center"
        href="/notification"
        role="button"
        id="notificationBellLink"
      >
        <div className="nav-link-icon__wrapper">
          <i className="material-icons-outlined" id="notificationIcon">
            notifications_active
          </i>
          <span className="badge badge-pill badge-danger" />
        </div>
      </a>
    </li>
  );
}
