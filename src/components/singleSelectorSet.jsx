import React from "react";

class SingleSelectorSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsVisibility: false,
      optionSelected: "",
      optionSelectedId: null,
      isInvalid: this.props.isInvalid,
    };
    this.setListWrapper = this.setListWrapper.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.changeOptionsVisibility = this.changeOptionsVisibility.bind(this);
    this.updateOptionSelected = this.updateOptionSelected.bind(this);

    this.singleSelectRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isInvalid !== this.props.isInvalid) {
      this.setState({ isInvalid: this.props.isInvalid });
    }
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
      if (option.value === optionSelected.name) {
        if (
          !document.querySelector(`#${this.props.typeSelector}`).options[index]
            .selected
        ) {
          document.querySelector(`#${this.props.typeSelector}`).options[
            index
          ].selected = true;
          e.currentTarget.classList.add("selected");

          this.changeOptionsVisibility(false);
        } else {
          document.querySelector(`#${this.props.typeSelector}`).options[
            index
          ].selected = false;
          e.currentTarget.classList.remove("selected");
        }
      } else {
        if (
          document.querySelector(`#${this.props.typeSelector}`).options[index]
            .selected
        ) {
          document.querySelector(`#${this.props.typeSelector}`).options[
            index
          ].selected = false;
        }

        // we have to check that index-1 bc the first option in the native-select is a by-default that we do not have on the visual list
        if (
          index - 1 >= 0 &&
          [
            ...document.querySelectorAll(
              `.${this.props.typeSelector}-wrapper .deanta-selector-option`,
            ),
          ][index - 1].classList.contains("selected")
        ) {
          [
            ...document.querySelectorAll(
              `.${this.props.typeSelector}-wrapper .deanta-selector-option`,
            ),
          ][index - 1].classList.remove("selected");
        }
      }
    });

    this.updateOptionSelected();
  }

  updateOptionSelected() {
    let newOptionSelected = "";
    let newOptionId = null;
    const allOptions = document.querySelector(
      `#${this.props.typeSelector}`,
    ).options;
    [...allOptions].forEach((option) => {
      if (option.selected && option.value !== "") {
        newOptionSelected = option.value;
        newOptionId = option.id;
      }
    });

    this.setState({
      optionSelected: newOptionSelected,
      optionSelectedId: newOptionId,
      isInvalid: false,
    });
  }

  changeOptionsVisibility(bool) {
    this.setState({
      optionsVisibility:
        bool === undefined ? !this.state.optionsVisibility : bool,
    });
  }

  getOptionSelected() {
    return { name: this.state.optionSelected, id: this.state.optionSelectedId };
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
            ref={this.singleSelectRef}
            id={this.props.typeSelector}
            className="deanta-selector-hidden"
            name={this.props.typeSelector}
            multiple
            onChange={() => {
              this.updateOptionSelected();
            }}
          >
            <option value="">Choose {typeSelectorCapitalized}</option>
            {this.props.optionsList.map((option) => {
              return (
                <option id={option.id} value={option.name} key={option.id}>
                  {option.name}
                </option>
              );
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
                  this.state.optionSelected !== "")) && (
                <div className="deanta-selector">
                  {this.state.optionSelected}
                </div>
              )}
              {!this.state.optionsVisibility &&
                this.state.optionSelected === "" && (
                  <>
                    <input
                      placeholder={`Choose ${this.props.typeSelector}`}
                      className={`deanta-selector ${
                        this.state.isInvalid ? "is-invalid" : ""
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
                    key={option.id}
                    className="deanta-selector-option"
                    id={option.id}
                    onClick={(e) => {
                      this.selectUnselectOption(e, option);
                    }}
                  >
                    {option.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <span
          className={`validation-error ${
            this.state.isInvalid ? "is-invalid" : ""
          }`}
        >
          Please enter a {this.props.typeSelector}
        </span>
      </>
    );
  }
}

export default SingleSelectorSet;
