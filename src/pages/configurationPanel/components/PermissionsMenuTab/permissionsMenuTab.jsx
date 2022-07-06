import { useState, useEffect } from "react";
import NotificationCount from "../../../../components/NotificationCount/NotificationCount";
import MenuTab from "../MenuTab/menuTab";

import "./styles/permissionsMenuTab.styles.css";

export default function PermissionsMenuTab({ ...props }) {
  const [permissionData, setPermissionData] = useState(props.listOfItems);

  useEffect(() => {
    if (props.listOfItems?.length > 0) {
      setPermissionData(props.listOfItems);
    }
  }, [props.listOfItems]);

  function onClick(event, id, columnNumber = null, tabType) {
    // columnNumber is null by default unless specified
    // Pass Functionality back up to Parent
    props.itemClickFunction(event, id, columnNumber, tabType);
  }

  // Check if a list has been passed in
  if (props.listOfItems === undefined) {
    console.error("Pass in an object of items to be rendered.");
    return null;
  }

  return (
    <ul className="menuTabs MenuTabs_menuTabs">
      {permissionData?.map((item) => {
        return (
          <li key={item.menuId + item.menuTitle} data-id={item.menuId}>
            <MenuTab
              text={item.menuTitle}
              id={item.menuId}
              secondColumn={
                item.notificationCount !== undefined &&
                Number(item.notificationCount) > 0 && (
                  <NotificationCount text={item.notificationCount} />
                )
              }
              active={props.activeItem === item.menuId && true}
              onClick={(event) =>
                onClick(event, item.menuId, props.columnNumber, "MenuTab")
              }
              columnNumber={props.columnNumber}
              handleDeleteRole={(e, id) => props.handleDeleteRole(e, id)}
              handleDuplicateButton={(e, title, id) =>
                props.handleDuplicateButton(e, title, id)
              }
              permissionData={permissionData}
              handleSaveEditRole={(e, value, id) =>
                props.handleSaveEditRole(e, value, id)
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
