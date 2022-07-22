import NotificationCount from "../../../../components/NotificationCount/NotificationCount";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import MenuTabLanUI from "../menuTabLanUI/menuTabLanUI";
import NotificationTab from "../notificationTab/notificationTab";

import "./styles/menuTabsLanUI.styles.css";

export default function MenuTabsLanUI({ ...props }) {
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
    <ul className="menuTabs undefined MenuTabs_menuTabs">
      {props.listOfItems.map((item, i) => {
        return (
          <li key={item.menuId} data-id={item.menuId}>
            {props.isNotifications ? (
              <NotificationTab
                onClick={(event) =>
                  onClick(
                    event,
                    item.menuId,
                    props.columnNumber,
                    "NotificationTab",
                  )
                }
                title={item.text}
                date={item.date}
                time={item.time}
                read={item.read}
                link={item.link}
                id={item.menuId}
                listofItems={item.nextColumn}
              />
            ) : (
              <MenuTabLanUI
                text={item.menuTitle}
                id={item.menuId}
                secondColumn={
                  item.notificationCount !== undefined &&
                  Number(item.notificationCount) > 0 && (
                    <NotificationCount text={item.notificationCount} />
                  )
                }
                titleProject={item.titleProject}
                active={props.activeItem === item.menuId && true}
                onClick={(event) =>
                  onClick(event, item.menuId, props.columnNumber, "MenuTab")
                }
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
