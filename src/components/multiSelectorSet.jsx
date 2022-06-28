import React from "react";

class MultiSelectorSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsVisibility: false,
      optionsSelected: [],
    };
    this.setListWrapper = this.setListWrapper.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.changeOptionsVisibility = this.changeOptionsVisibility.bind(this);
    this.updateOptionsArray = this.updateOptionsArray.bind(this);

    this.multiSelectRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  setListWrapper(node) {
    this.listWrapper = node;
  }

  handleClickOutside(event) {
    if (this.listWrapper && !this.listWrapper.contains(event.target)) {
      this.changeOptionsVisibility(false);
    }
  }

  selectUnselectOption(e, optionSelected) {
    e.preventDefault();
    e.stopPropagation();
    const { options } = document.querySelector(`#${this.props.typeSelector}`);
    [...options].forEach((option, index) => {
      if (option.value === optionSelected) {
        if (
          !document.querySelector(`#${this.props.typeSelector}`).options[index]
            .selected
        ) {
          document.querySelector(`#${this.props.typeSelector}`).options[
            index
          ].selected = true;

          if (e.currentTarget.matches(".deanta-selector-option")) {
            e.currentTarget.classList.add("selected");
          }
        } else {
          document.querySelector(`#${this.props.typeSelector}`).options[
            index
          ].selected = false;

          if (e.currentTarget.matches(".deanta-selector-option")) {
            e.currentTarget.classList.remove("selected");
          } else {
            const allOptions = document.querySelectorAll(
              ".deanta-selector-options .deanta-selector-option",
            );

            [...allOptions].forEach((option) => {
              if (option.id === optionSelected) {
                option.classList.remove("selected");
              }
            });
          }
        }
      }
    });

    this.updateOptionsArray();
  }

  updateOptionsArray() {
    const newOptionsSelectedArray = [];
    const allOptions = document.querySelector(
      `#${this.props.typeSelector}`,
    ).options;
    [...allOptions].forEach((option) => {
      if (option.selected && option.value !== "") {
        newOptionsSelectedArray.push(option.value);
      }
    });

    this.setState({
      optionsSelected: newOptionsSelectedArray,
    });
  }

  changeOptionsVisibility(bool) {
    this.setState({
      optionsVisibility:
        bool === undefined ? !this.state.optionsVisibility : bool,
    });
  }

  getOptionsSelected() {
    return this.state.optionsSelected;
  }

  render() {
    const typeSelectorCapitalized =
      this.props.typeSelector.charAt(0).toUpperCase() +
      this.props.typeSelector.slice(1);
    return (
      <>
        <label htmlFor={this.props.typeSelector}>
          {typeSelectorCapitalized}
        </label>
        <div className={`${this.props.typeSelector}-wrapper`}>
          <select
            ref={this.multiSelectRef}
            id={this.props.typeSelector}
            className="deanta-selector-hidden"
            name={this.props.typeSelector}
            multiple
            onChange={() => {
              this.updateOptionsArray();
            }}
          >
            <option value="">Choose {typeSelectorCapitalized}(s)</option>
            {this.props.optionsList.map((option) => {
              return <option value={option}>{option}</option>;
            })}
          </select>

          <div
            className="deanta-selector-wrapper"
            ref={this.setListWrapper}
            aria-hidden
          >
            <div onClick={() => this.changeOptionsVisibility()}>
              {(this.state.optionsVisibility ||
                (!this.state.optionsVisibility &&
                  this.state.optionsSelected.length !== 0)) && (
                <div className="deanta-selector">
                  {this.state.optionsSelected.map((option) => {
                    return (
                      <div className="deanta-selector-box">
                        {option}
                        <button
                          className="deanta-button"
                          onClick={(e) => this.selectUnselectOption(e, option)}
                        >
                          <i className="material-icons">close</i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {!this.state.optionsVisibility &&
                this.state.optionsSelected.length === 0 && (
                  <>
                    <input
                      placeholder={`Choose ${this.props.typeSelector}(s)`}
                      className={`deanta-selector ${
                        this.props.isInvalid ? "is-invalid" : ""
                      }`}
                      contentEditable="false"
                      type="text"
                    />
                    <span className="material-icons">keyboard_arrow_down</span>
                  </>
                )}
            </div>
            <div
              className={`deanta-selector-options ${
                this.state.optionsVisibility ? "visible" : ""
              }`}
            >
              {this.props.optionsList.map((option) => {
                return (
                  <div
                    className="deanta-selector-option"
                    id={option}
                    onClick={(e) => {
                      this.selectUnselectOption(e, option);
                    }}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <span
          className={`validation-error ${
            this.props.isInvalid ? "is-invalid" : ""
          }`}
        >
          Please select at least one {this.props.typeSelector}
        </span>
      </>
    );
  }
}

export default MultiSelectorSet;
