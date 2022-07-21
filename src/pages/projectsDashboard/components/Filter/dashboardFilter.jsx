import { useState } from "react";
import Dropdown from "../../../../components/dropdown/dropdown";

import "./styles/dashboardFilter.styles.css";

export default function DashboardFilter({
  values,
  selectedProject = () => {},
  userId,
}) {
  const [clientSelected, setClientSelected] = useState({
    id: 0,
    value: "All Clients",
  });

  const handleOnChange = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      setClientSelected({ id: eleValue.id, value: eleValue.value });
      selectedProject(eleValue);
    }
  };

  return (
    <>
      {/* remove it after demo */}
      {userId === 15331 ? (
        <div className="filter-container">
          <div className="">
            <Dropdown
              label="Client"
              name="companyFilter"
              id="companyFilter"
              value={clientSelected?.value}
              valuesDropdown={values}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />
          </div>
        </div>
      ) : (
        <div className="col-3 w-full">
          <div className="">
            <Dropdown
              label="Client"
              name="companyFilter"
              id="companyFilter"
              value={clientSelected?.value}
              valuesDropdown={values}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />
          </div>
        </div>
      )}
    </>
  );
}
