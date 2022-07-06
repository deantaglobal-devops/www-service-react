import React from 'react';
class UserPagination extends React.Component {
  constructor(props) {
    super(props);
  }

  getAllButton() {
    let defaultLimit = this.props.limit;
    let dataLength = this.props.dataLength;
    if (dataLength > 30) {
      let numberOfButtons = Math.round(dataLength / defaultLimit);
      let buttonArray = [],
        i = 0;
      let currentPage = this.props.currentPage;
      let start = this.props.start;
      let limit = this.props.limit;
      for (i = 1; i <= numberOfButtons; i++) {
        buttonArray.push(i);
      }
      var elements = buttonArray.map((i, key) => {
        let btnClass =
          i == currentPage ? 'deanta-button-full' : 'deanta-button-outlined';
        //if we have less than 6 buttons, we don't need the three dots
        if (numberOfButtons < 6) {
          return (
            <button
              key={key}
              type="button"
              className={'deanta-button ml-2 ' + btnClass}
              onClick={() =>
                this.props.handleNextPage(currentPage, i, start, limit)
              }
            >
              {i == 1 ? 'Page 1' : i}
            </button>
          );
        } else {
          //if we have 6 buttons or more, we are going to need to paint the three dots instead of the buttons in some places
          switch (true) {
            //if we are at the 5th page or ahead, we are going to need the three dots after the Page 1 button
            case currentPage > 4 && i === 1:
              return (
                <React.Fragment key={key}>
                  <button
                    type="button"
                    className={'deanta-button deanta-button-outlined ml-2'}
                    onClick={() =>
                      this.props.handleNextPage(currentPage, i, start, limit)
                    }
                  >
                    {i == 1 ? 'Page 1' : i}
                  </button>
                  <span className="deanta-more-buttons-dots" title="More pages">
                    ...
                  </span>
                </React.Fragment>
              );
              break;
            //if we are before the 5th page, we are NOT going to need the three dots after the Page 1 button
            case currentPage <= 4 && i === 1:
              return (
                <button
                  key={key}
                  type="button"
                  className={'deanta-button ml-2 ' + btnClass}
                  onClick={() =>
                    this.props.handleNextPage(currentPage, i, start, limit)
                  }
                >
                  {i == 1 ? 'Page 1' : i}
                </button>
              );
              break;
            case i == numberOfButtons:
              //we are NOT going to need the three dots if the current page is the last button, or two before that last button
              if (
                currentPage == numberOfButtons ||
                currentPage + 2 == numberOfButtons ||
                currentPage + 1 == numberOfButtons
              ) {
                return (
                  <button
                    key={key}
                    type="button"
                    className={'deanta-button ml-2 ' + btnClass}
                    onClick={() =>
                      this.props.handleNextPage(currentPage, i, start, limit)
                    }
                  >
                    {i == 1 ? 'Page 1' : i}
                  </button>
                );
              } else {
                //we are going to need the three dots otherwise
                return (
                  <React.Fragment key={key}>
                    <span
                      className="deanta-more-buttons-dots"
                      title="More pages"
                    >
                      ...
                    </span>
                    <button
                      type="button"
                      className={'deanta-button ml-2 ' + btnClass}
                      onClick={() =>
                        this.props.handleNextPage(currentPage, i, start, limit)
                      }
                    >
                      {i == 1 ? 'Page 1' : i}
                    </button>
                  </React.Fragment>
                );
              }
              break;
            case currentPage > 4:
              //for the rest of buttons, if we are ahead the forth page
              switch (true) {
                case currentPage - 2 == i || currentPage - 1 == i:
                  //going to paint those buttons that are up to two pages before the current page
                  return (
                    <button
                      key={key}
                      type="button"
                      className={'deanta-button ml-2 ' + btnClass}
                      onClick={() =>
                        this.props.handleNextPage(currentPage, i, start, limit)
                      }
                    >
                      {i == 1 ? 'Page 1' : i}
                    </button>
                  );
                  break;
                case currentPage + 1 == i:
                  //going to paint those buttons that are up to one page after the current page
                  return (
                    <button
                      key={key}
                      type="button"
                      className={'deanta-button ml-2 ' + btnClass}
                      onClick={() =>
                        this.props.handleNextPage(currentPage, i, start, limit)
                      }
                    >
                      {i == 1 ? 'Page 1' : i}
                    </button>
                  );
                  break;
                case currentPage == i:
                  //if we are in the current page button
                  return (
                    <button
                      key={key}
                      type="button"
                      className="deanta-button deanta-button-full ml-2"
                      onClick={() =>
                        this.props.handleNextPage(currentPage, i, start, limit)
                      }
                    >
                      {i == 1 ? 'Page 1' : i}
                    </button>
                  );
                  break;
              }
              break;
            case currentPage <= 4 && i <= 5:
              //for the buttons before the sixth one, if we are in or before the forth page
              return (
                <button
                  key={key}
                  type="button"
                  className={'deanta-button ml-2 ' + btnClass}
                  onClick={() =>
                    this.props.handleNextPage(currentPage, i, start, limit)
                  }
                >
                  {i == 1 ? 'Page 1' : i}
                </button>
              );
              break;
          }
        }
      });
      return elements;
    }
  }

  render() {
    return (
      <div className="deanta-button-container">
        {/* Getting Pagination buttons here. */}
        {this.getAllButton()}
      </div>
    );
  }
}
export default UserPagination;
