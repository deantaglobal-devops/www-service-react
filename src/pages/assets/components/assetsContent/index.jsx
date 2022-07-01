import { useState } from "react";

// Sections
import ListAssets from "../ListAssets";

export default function AssetsContent(props) {
  const [step, setStep] = useState(1);
  const [crumb, setCrumb] = useState(["Assets", "", ""]);
  const [selectTask, setSelectTask] = useState("");
  const [selectMilestone, setSelectMilestone] = useState("");

  const crumbUpdate = (index, newCrumb) => {
    const newCrumbs = [...crumb];
    newCrumbs[index] = newCrumb;
    setCrumb(newCrumbs);
  };

  return (
    <div className="row mt-4">
      <div className="col-lg-12">
        <ListAssets props={props.props} selectTask={selectTask} />
      </div>
    </div>
  );
}
