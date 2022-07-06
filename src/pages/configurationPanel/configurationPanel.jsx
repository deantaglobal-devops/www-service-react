import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import UserDetails from "./userDetails";
import ClientDetails from "./clientDetails";
import Loading from "../../components/loader/Loading";
import Layout from "../../components/layout/Layout";

import "../../styles/notification.css";
import "../../styles/milestones.css";
import "../../styles/configuration.css";
import "../../styles/Notifications.css";

export function ConfigurationPanel() {
  const [showClients, setShowClients] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showback, setShowBack] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [usersList, setUsersList] = useState(true);
  const [rolesList, setRolesList] = useState(true);
  const [clientList, setClientList] = useState(true);
  const [currencyList, setCurrencyList] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const userBackRef = useRef(null);
  const clientBackRef = useRef(null);

  const { user, permissions } = useAuth();
  const pageTitle = "Configuration Area";

  useEffect(() => {
    document.title = "Lanstad — Configuration Center";

    handleData();
  }, []);

  const handleData = async () => {
    setIsLoading(true);
    const promiseUsersList = api.post("/configuration/users/list", {
      userId: user.id,
    });
    const promiseRolesList = api.post("/configuration/roles/list", {
      userId: user.id,
      clientId: 28,
    });
    const promiseClientList = api.post("/configuration/client/list", {
      userId: user.id,
    });

    await Promise.all([promiseUsersList, promiseRolesList, promiseClientList])
      .then((response) => {
        setUsersList(response[0]?.data || []);
        setRolesList(response[1]?.data?.roles || []);
        setClientList(response[2]?.data?.companyList || []);
        setCurrencyList(response[2]?.data?.currencyList || []);

        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleBack = () => {
    if (showUsers) {
      userBackRef.current.handleBack();
    }
  };

  const loadingIcon = (action) => {
    if (action === "show") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const updateUserList = (data) => {
    setUsersList(data);
  };

  const showHideClientUser = (client, user, title) => {
    let showbackVariable = false;
    if ((client && !user) || (user && !client)) {
      showbackVariable = true;
    }
    setShowClients(client);
    setShowUsers(user);
    setShowBack(showbackVariable);
    setShowTitle(title);
  };

  const updateClientList = (list) => {
    setClientList(list);
  };

  return (
    <Layout iconActive="Configuration" permissions={permissions} user={user}>
      {isLoading && <Loading loadingText="loading..." />}
      {showTitle && (
        <div className="page-header client-menu">
          <h3 className="page-title">{pageTitle}</h3>
          {showback && (
            <div className="config-back-btn">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
      {showClients && clientList.length > 0 && (
        <div className="client-details">
          <ClientDetails
            showHideClientUser={showHideClientUser}
            clientList={clientList}
            currencyList={currencyList}
            ref={clientBackRef}
            pageTitle={pageTitle}
            loadingIcon={loadingIcon}
            updateClientList={updateClientList}
            updateUserList={updateUserList}
            usersList={usersList}
            rolesList={rolesList}
            permissions={permissions}
            user={user}
          />
        </div>
      )}
      {showUsers && usersList.length > 0 && (
        <div className="users-details">
          <UserDetails
            showHideClientUser={showHideClientUser}
            usersList={usersList}
            rolesList={rolesList}
            clientList={clientList}
            loadingIcon={loadingIcon}
            updateUserList={updateUserList}
            ref={userBackRef}
            permissions={permissions}
          />
        </div>
      )}
    </Layout>
  );
}
