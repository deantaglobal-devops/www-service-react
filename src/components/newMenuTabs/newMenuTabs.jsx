import React from "react";

class NewMenuTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        {this.props.listOfItems.length > 0 && (
          <ul className="undefined">
            {this.props.listOfItems.map((list, key) => {
              return (
                <li
                  className="hoveredit"
                  data-id={list.menuId}
                  key={`li${key}`}
                  onClick={(e) =>
                    this.props.itemClickFunction(
                      list.menuId,
                      this.props.columnNumber,
                    )
                  }
                >
                  <button
                    className={
                      this.props.activeItem === list.menuId
                        ? "icon-text-bold active"
                        : "icon-text"
                    }
                  >
                    <span>{list.menuTitle}</span>
                  </button>
                  {this.props.enableEdit && (
                    <span className="templateedit">
                      <i
                        className={`material-icons-outlined nameEdit ${
                          this.props.activeItem === list.menuId ? "active" : ""
                        }`}
                        onClick={(e) =>
                          this.props.editItem(
                            list.menuId,
                            list.menuTitle,
                            this.props.columnNumber,
                          )
                        }
                      >
                        edit
                      </i>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
}

export default NewMenuTabs;
