import { useState } from "react";
import Dropdown from "../../../../components/dropdown/dropdown";

export default function CalendarFilters({
  projects,
  selectedProject = () => {},
  tasks,
  selectedTask = () => {},
}) {
  const [projectSelected, setProjectSelected] = useState({
    id: 0,
    value: "All Projects",
  });

  const [taskSelected, setTaskSelected] = useState({
    id: 0,
    value: "All Tasks",
  });

  const handleProjectOnChange = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      setProjectSelected({ id: eleValue.id, value: eleValue.value });
      selectedProject(eleValue);
    }
  };

  const handleTaskOnChange = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      setTaskSelected({ id: eleValue.id, value: eleValue.value });
      selectedTask(eleValue);
    }
  };

  return (
    <div className="col-4 w-full ">
      <div className="d-flex align-items-start ">
        <div className="w-50">
          <Dropdown
            label="Project"
            name="projectFilter"
            id="projectFilter"
            value={projectSelected?.value}
            valuesDropdown={projects}
            handleOnChange={(e) => handleProjectOnChange(e)}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />
        </div>
        <div className="ml-1 w-50">
          <Dropdown
            label="Task"
            name="taskFilter"
            id="taskFilter"
            value={taskSelected?.value}
            valuesDropdown={tasks}
            handleOnChange={(e) => handleTaskOnChange(e)}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />
        </div>
      </div>
    </div>
  );
}
