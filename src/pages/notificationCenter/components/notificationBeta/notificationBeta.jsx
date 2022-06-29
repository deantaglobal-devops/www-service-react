import React from "react";

import MenuTabsLanUI from "../menuTabsLanUI/menuTabsLanUI";
import MenuColumnLanUI from "../menuColumnLanUI/menuColumnLanUI";
import ButtonLanUI from "../buttonLanUI/buttonLanUI";
import ButtonGroupLanUI from "../buttonGroupLanUI/buttonGroupLanUI";

import "./styles/notificationBeta.styles.css";

class NotificationBeta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // default value is 0 - first item on the list
      activeItem: 0,
      activeItems: [],
      listOfItems: "",
      firstColumnSelected: {},
      secondColumnSelected: {},
    };
    this.itemClickFunction = this.itemClickFunction.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
    this.resetAll = this.resetAll.bind(this);

    this.sortNotifications = this.sortNotifications.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.markSingleAsRead = this.markSingleAsRead.bind(this);
    // this.listOfItems = this.listOfItems.bind(this);
  }

  resetAll() {
    this.setState({
      activeItems: [],
    });
  }

  markSingleAsRead(itemId, firstColumnName, secondColumnName) {
    this.props.markAllAsReadFunc([itemId], firstColumnName, secondColumnName);
  }

  markAllAsRead(itemsIds, firstColumnName, secondColumnName) {
    // This throws an error if no onClick function passed in
    // Runs props.onClick, if there is
    if (typeof this.props.markAllAsReadFunc !== "function") {
      console.error("You need to pass a markAllAsReadFunc function as a Prop.");
      return;
    }

    // Then run the function that's been passed in as a prop to mark as read in API
    // This is going to communicate with the API
    // Loop through an array of ID's?
    if (itemsIds.length > 0) {
      this.props.markAllAsReadFunc(itemsIds, firstColumnName, secondColumnName);
    }
  }

  dismissModal() {
    // WIP - needs to be hooked up
  }

  itemClickFunction(event, id, columnNumber, tabType) {
    // we are not going to mark as read unless the tabtype is notificationTab, so better not to call the function until that case
    if (tabType === "NotificationTab") {
      const firstColumnName = this.state.firstColumnSelected.menuTitle;
      const secondColumnName = this.state.secondColumnSelected
        ? this.state.secondColumnSelected.menuTitle
        : undefined;
      this.markSingleAsRead(id, firstColumnName, secondColumnName);
    }

    let newActiveItems = [...this.state.activeItems];
    newActiveItems[columnNumber - 1] = id;

    if (columnNumber === 1) {
      newActiveItems = [];
      newActiveItems[0] = id;

      const firstItemSelected = this.props.firstColumn.filter((item) => {
        return +item.menuId === +id;
      })[0];

      if (Object.keys(firstItemSelected.nextColumn).length > 0) {
        // Second Column, if Notifications

        // sort the notifications Read Then Unread
        const nextColumnReordered = this.sortNotifications(
          firstItemSelected.nextColumn,
        );

        // send the info to the front to update the column
        this.props.showSecondColumn(nextColumnReordered);

        this.setState({
          firstColumnSelected: firstItemSelected,
        });
      }
    } else if (columnNumber === 2) {
      newActiveItems.pop();
      newActiveItems[1] = id;

      const secondItemSelected = this.props.secondColumn.filter((item) => {
        return +item.menuId === +id;
      })[0];

      if (Object.keys(secondItemSelected.nextColumn).length > 0) {
        // Third column, if Notifications

        // Sort the notifications Read Then Unread
        const nextColumnReordered = this.sortNotifications(
          secondItemSelected.nextColumn,
        );

        // send the info to the front to update the column
        this.props.showThirdColumn(nextColumnReordered);

        this.setState({
          secondColumnSelected: secondItemSelected,
        });
      }
    }

    this.setState({
      activeItem: id,
      activeItems: newActiveItems,
    });
  }

  sortNotifications(notificationsList) {
    // Sort the notifications - unread first - then read
    // Split into two seperate Arrays - then mash together again

    const readItems = [];
    const unreadItems = [];

    Object.keys(notificationsList).map((tab) => {
      if (notificationsList[tab].seen === "0") {
        // This notification is unread

        // We were losing the key of the object, so needed to store as property
        const title = tab;
        notificationsList[tab].menuTitle = title;

        unreadItems.push(notificationsList[tab]);
      } else {
        // This notification is read

        // We were losing the key of the object, so needed to store as property
        const title = tab;
        notificationsList[tab].menuTitle = title;

        readItems.push(notificationsList[tab]);
      }
    });

    /// /
    ///
    // Combining the arrays together again
    const notificationsReordered = [...unreadItems, ...readItems];
    return notificationsReordered;
  }

  render() {
    return (
      <div className="notifications">
        {/* First column is always present | Doesn't need conditional */}
        <MenuColumnLanUI title="Notification Type">
          {/* {this.props.firstColumn.length === 0 && "Please pass in some data"}  */}
          {this.props.firstColumn.length > 0 ? (
            <MenuTabsLanUI
              columnNumber={1}
              listOfItems={this.props.firstColumn}
              itemClickFunction={this.itemClickFunction}
              activeItem={this.state.activeItems[0]}
            />
          ) : (
            <p
              className="no-notification"
              style={{ padding: 15, textAlign: "left" }}
            >
              No new notifications
            </p>
          )}
        </MenuColumnLanUI>

        {this.state.activeItems.length >= 1 &&
          this.props.secondColumn.length > 0 && (
            <MenuColumnLanUI
              title={this.state.firstColumnSelected.nextColumnTitle}
            >
              <MenuTabsLanUI
                // isNotifications={this.state.secondColumnSelected.nextColumn.length > 0 ? false : true}
                columnNumber={2}
                listOfItems={this.props.secondColumn}
                itemClickFunction={this.itemClickFunction}
                activeItem={this.state.activeItems[1]}
                isNotifications={
                  // If the next column is an array, then they're assumed to be notifications
                  Array.isArray(this.state.firstColumnSelected.nextColumn)
                }
              />

              <ButtonGroupLanUI>
                <ButtonLanUI
                  small
                  className="mark-as-read"
                  onClick={() =>
                    this.markAllAsRead(
                      this.props.secondColumnUnseenIds,
                      this.state.firstColumnSelected.menuTitle,
                      this.state.secondColumnSelected.menuTitle,
                    )
                  }
                  text="Mark all as read"
                />
              </ButtonGroupLanUI>
            </MenuColumnLanUI>
          )}

        {this.state.activeItems.length >= 2 &&
          this.props.thirdColumn.length > 0 && (
            <MenuColumnLanUI>
              <MenuTabsLanUI
                columnNumber={3}
                isNotifications={
                  // If the next column is an array, then they're assumed to be notifications
                  Array.isArray(this.state.secondColumnSelected.nextColumn)
                }
                listOfItems={this.props.thirdColumn}
                itemClickFunction={this.itemClickFunction}
                activeItem={this.state.activeItems[2]}
              />
              <ButtonGroupLanUI>
                <ButtonLanUI
                  small
                  className="mark-as-read"
                  onClick={() =>
                    this.markAllAsRead(
                      this.props.thirdColumnUnseenIds,
                      this.state.firstColumnSelected.menuTitle,
                      this.state.secondColumnSelected.menuTitle,
                    )
                  }
                  text="Mark all as read"
                />
              </ButtonGroupLanUI>
            </MenuColumnLanUI>
          )}
      </div>
    );
  }
}

export default NotificationBeta;
