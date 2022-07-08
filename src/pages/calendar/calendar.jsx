import { useState, useEffect } from "react";

import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { createPopper } from "@popperjs/core";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import CalendarFilters from "./components/filter/calendarFilters";
import Modal from "../../components/Modal/modal";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";

import "../../styles/style-calendar.css";

export function Calendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    id: 0,
    value: "",
  });
  const [projectFilter, setProjectFilter] = useState([]);
  const [taskFilter, setTaskFilter] = useState([]);
  const [selectedTask, setSelectedTask] = useState({ id: 0, value: "" });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [modalChangeTaskDate, setModalChangeTaskDate] = useState({
    isOpen: false,
    message: "",
  });
  const [changeTaskDateData, setChangeTaskDateData] = useState({
    taskId: null,
    taskEndDate: "",
    info: null,
  });
  const [action, setAction] = useState("");
  const [taskId, setTaskId] = useState(0);
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { user, permissions } = useAuth();

  useEffect(() => {
    document.title = "Lanstad — Calendar";
  }, []);

  useEffect(() => {
    getDataFromApi();
  }, [startDate, endDate, selectedProject, selectedTask]);

  async function getDataFromApi() {
    const projectData = await getCalendarData(startDate, endDate);
    await getCalendarFiltersData(startDate, endDate);
    setCalendarData(projectData);
    setIsLoading(false);
  }

  function getCalendarFiltersData(startDate, endDate) {
    // if we don't get a date - just use today + | - a month

    const currentlyDate = new Date();

    const oneMonthAgo = new Date(
      currentlyDate.getFullYear(),
      currentlyDate.getMonth() - 1,
      currentlyDate.getDate(),
    );

    const oneMonthAhead = new Date(
      currentlyDate.getFullYear(),
      currentlyDate.getMonth() + 1,
      currentlyDate.getDate(),
    );

    const _start = startDate
      ? dateFormatter(startDate)
      : dateFormatter(oneMonthAgo);
    const _end = endDate
      ? dateFormatter(endDate)
      : dateFormatter(oneMonthAhead);

    const projectID = selectedProject.id > 0 ? selectedProject.id : 0;

    const taskID = selectedTask.id > 0 ? selectedTask.id : 0;

    if (_start && _end) {
      // Get all projects and tasks of the month selected
      api
        .get(`/task/0/0?startDate=${_start}&endDate=${_end}`)
        .then((response) => {
          if (response.data.length === 0 && selectedProject.id === 0) {
            setProjectFilter([]);
          }

          if (
            response.data.length === 0 &&
            selectedProject.id > 0 &&
            selectedTask.id === 0
          ) {
            setTaskFilter([]);
          }

          // filtering project_id's and title1 result to build the project filter drop down
          const projectsFiltered = response.data.map(
            ({ project_id, title1 }) => ({
              id: project_id,
              value: title1,
            }),
          );

          // removing duplicates projects
          const noDuplicatesProjects = projectsFiltered.filter(
            (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
          );

          if (noDuplicatesProjects.length > 0 || projectID > 0) {
            noDuplicatesProjects.unshift({ id: 0, value: "All Projects" });
            if (projectID === 0) {
              setProjectFilter(noDuplicatesProjects);
            } else {
              const selectedProjectAlreadyExists =
                noDuplicatesProjects.findIndex(
                  (t) => t.id === selectedProject.id,
                );

              if (selectedProjectAlreadyExists < 0) {
                noDuplicatesProjects.push(selectedProject);
              }
              setProjectFilter(noDuplicatesProjects);
            }
          }

          // filtering id's and description result to build the task filter drop down
          let filterOfTasks = response.data;
          if (selectedProject.id > 0) {
            filterOfTasks = response.data.filter(
              (project) => project.project_id === selectedProject.id,
            );
          }

          const tasksFiltered = filterOfTasks.map(({ id, description }) => ({
            id,
            value: description,
          }));

          // removing duplicates tasks
          const noDuplicatesTasks = tasksFiltered.filter(
            (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
          );

          if (noDuplicatesTasks.length > 0 || taskID > 0) {
            noDuplicatesTasks.unshift({ id: 0, value: "All Tasks" });
            if (taskID !== 0 && selectedTask.id !== 0) {
              const selectedTaskAlreadyExists = noDuplicatesTasks.findIndex(
                (t) => t.id === selectedTask.id,
              );

              if (selectedTaskAlreadyExists < 0) {
                noDuplicatesTasks.push(selectedTask);
              }
            }

            setTaskFilter(noDuplicatesTasks);
          }

          return response.data;
        })
        .catch((err) => console.log(err));
    }
  }

  function getCalendarData(startDate, endDate) {
    // if we don't get a date - just use today + | - a month

    // Add loader immediately
    setIsLoading(true);

    const currentlyDate = new Date();

    const oneMonthAgo = new Date(
      currentlyDate.getFullYear(),
      currentlyDate.getMonth() - 1,
      currentlyDate.getDate(),
    );

    const oneMonthAhead = new Date(
      currentlyDate.getFullYear(),
      currentlyDate.getMonth() + 1,
      currentlyDate.getDate(),
    );

    const _start = startDate
      ? dateFormatter(startDate)
      : dateFormatter(oneMonthAgo);
    const _end = endDate
      ? dateFormatter(endDate)
      : dateFormatter(oneMonthAhead);

    if (_start && _end) {
      return api
        .get(
          `/task/${selectedProject.id}/${selectedTask.id}?startDate=${_start}&endDate=${_end}`,
        )
        .then((response) => response.data)
        .catch((err) => console.log(err));
    }
  }

  function dateFormatter(date) {
    // format date to "YYYY-MM-DD";
    let dateFormatted = "";

    let month = date.getMonth();
    month += 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    dateFormatted = `${date.getFullYear()}-${month}-${day}`;
    return dateFormatted;
  }

  // save dates to state
  function handleDateEvents(date) {
    setStartDate(date.start);
    setEndDate(date.end);
  }

  // This function shows and hide pop ups on the events within calendar
  //* * Params: hideIt = true to hide the elem (called by onmouseleave)  / false = mouseEnter */
  function handleMouseEvents(jsEvent, hideIt, dataEvent) {
    if (!hideIt) {
      const element = jsEvent.target;
      const tooltip = document.getElementById("tooltip");

      let title = dataEvent.article_title
        ? dataEvent.article_title
        : dataEvent.title1;
      let { description } = dataEvent;

      tooltip.style.display = "block";
      document.getElementById("tooltip-title").textContent = "";
      document.getElementById("tooltip-description").textContent = "";

      if (title.length > 55) {
        title = `${title.substring(0, 55)}...`;
      }

      if (description.length > 55) {
        description = `${description.substring(0, 55)}...`;
      }

      document.getElementById("tooltip-title").textContent += title;
      document.getElementById("tooltip-description").textContent += description;

      createPopper(element, tooltip, {
        placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
        ],
      });
    } else {
      tooltip.style.display = "none";
    }
  }

  // save selected project in state
  function handleSelectedProject(selectedProject) {
    setSelectedProject(selectedProject);
  }

  // save selected task in state
  function handleSelectedTask(selectedTask) {
    setSelectedTask(selectedTask);
  }

  function checkValidation(taskId, taskEndDate, info) {
    api
      .post("/task/validation/date", { taskId, taskEndDate })
      .then((response) => {
        if (response.data.message !== "") {
          setModalChangeTaskDate({
            isOpen: true,
            message: response.data.message,
          });
        } else {
          changeTaskDate(taskId, taskEndDate, info);
        }
      })
      .catch((err) => {
        console.log(err);
        info.revert();
      });
  }

  // Change date when the user uses drag and drop in specific task
  function changeTaskDate(taskId, taskEndDate, info) {
    api
      .post("/task/change/date", { taskId, taskEndDate })
      .then(() => {})
      .catch((err) => {
        console.log(err);
        info.revert();
      });
  }

  function changeTaskStatus(_action, _taskId, _status) {
    // API call to update that task status
    api
      .post("/task/change/status", {
        action: _action,
        taskId: _taskId,
        status: _status,
      })
      .then(() => {
        selectModal();
      })
      .catch((err) => console.log(err));
  }

  const handleOnClick = (buttonText, id) => {
    if (buttonText === "Done") {
      setAction("done");
      setTaskId(id);
      setStatus(4);

      // Open Modal
      selectModal();
    }
  };

  function createStatusButton(buttonText, element, id) {
    const elemToBeAdd = element;

    // There's any button element already created inside the element
    if (elemToBeAdd.querySelector(`#buttons_wrapper${id}`) === null) {
      const span = document.createElement("span");
      span.setAttribute("class", "calendar_buttons_wrapper");
      span.setAttribute("id", `buttons_wrapper${id}`);

      const button = document.createElement("button");
      button.setAttribute("class", "btn calendar_button");
      button.onclick = () => {
        handleOnClick(buttonText, id);
      };
      button.setAttribute("id", `buttons_wrapper${id}`);
      button.innerHTML = buttonText;

      span.appendChild(button);
      elemToBeAdd.appendChild(span);
    }
  }

  function handleTaskStatus(info) {
    // We are Handling just to mark the task as done!

    if (
      info.event.extendedProps.task_type === 0 ||
      info.event.extendedProps.task_type === 1 ||
      info.event.extendedProps.task_type === 2
    ) {
      if (
        info.event.extendedProps.status_id === 1 &&
        info.event.extendedProps.invoiceType !== 1
      ) {
        // ... && if it's NOT an invoice

        // Start
        const startStatus = 6;
        if (info.el?.cells?.length > 0) {
          createStatusButton(
            "Start Task",
            info.el?.cells[2],
            info.event._def.publicId,
          );
        }
      }

      if (info.event.extendedProps.status_id === 4) {
        // Edit
        const editStatus = 6;
        if (info.el?.cells?.length > 0) {
          createStatusButton(
            "Edit Task",
            info.el?.cells[2],
            info.event._def.publicId,
          );
        }
      } else if (
        info.event.extendedProps.status_id === 6 ||
        info.event.extendedProps.status_id === 8
      ) {
        // Finish/Hold/Reject
        // const finishStatus = 4;
        // const holdStatus = 9;
        // const rejectStatus = 1;
      } else if (info.event.extendedProps.status_id === 9) {
        // Resume
        // const resumeStatus = 8;
        if (info.el?.cells?.length > 0) {
          createStatusButton(
            "Resume Task",
            info.el?.cells[2],
            info.event._def.publicId,
          );
        }
      }
    } else if (info.event.extendedProps.task_type === 3) {
      if (info.event.extendedProps.status_id === 1) {
        // Done Enabled
        if (info.el?.cells?.length > 0) {
          createStatusButton(
            "Done",
            info.el?.cells[2],
            info.event._def.publicId,
          );
        }
      }
    }
  }

  function selectModal() {
    setModal(!modal);
  }

  function selectModalChangeTaskDate() {
    setModalChangeTaskDate({
      ...modalChangeTaskDate,
      isOpen: !modalChangeTaskDate.isOpen,
    });

    changeTaskDateData?.info?.revert();
  }

  function handleButton1Modal() {
    changeTaskStatus(action, taskId, status);
  }

  function handleButton1ModalChangeTaskDate() {
    changeTaskDate(
      changeTaskDateData?.taskId,
      changeTaskDateData?.taskEndDate,
      changeTaskDateData?.info,
    );

    setModalChangeTaskDate({
      ...modalChangeTaskDate,
      isOpen: !modalChangeTaskDate.isOpen,
    });
  }

  return (
    <Layout iconActive="Calendar" permissions={permissions} user={user}>
      {isLoading && <Loading />}

      {modal && (
        <Modal
          displayModal={modal}
          closeModal={selectModal}
          title="Confirmation"
          body='Are you sure that you would like to mark this task as "Done"? Doing so will remove the task from the list.'
          button1Text="Cancel"
          handleButton1Modal={() => selectModal()}
          Button2Text="Confirm"
          handleButton2Modal={() => handleButton1Modal()}
        />
      )}
      {modalChangeTaskDate?.isOpen && (
        <Modal
          displayModal={modalChangeTaskDate?.isOpen}
          closeModal={selectModalChangeTaskDate}
          title="Confirmation"
          body={modalChangeTaskDate?.message}
          button1Text="Cancel"
          handleButton1Modal={() => selectModalChangeTaskDate()}
          Button2Text="Confirm"
          handleButton2Modal={() => handleButton1ModalChangeTaskDate()}
        />
      )}
      <div id="tooltip" style={{ display: "none", zIndex: 99999 }}>
        <p id="tooltip-title" />
        <span id="tooltip-description" />
        <div id="arrow" data-popper-arrow />
      </div>

      <div className="page-header row no-gutters pb-4 pt-2  d-flex align-items-center">
        <div className="col-8 col-sm-8 text-center text-sm-left mb-4 mb-sm-0">
          <h3 className="page-title">Calendar</h3>
        </div>

        {projectFilter && (
          <CalendarFilters
            projects={projectFilter}
            selectedProject={(selectedProject) =>
              handleSelectedProject(selectedProject)
            }
            tasks={taskFilter}
            selectedTask={(selectedTask) => handleSelectedTask(selectedTask)}
          />
        )}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        firstDay={1}
        events={calendarData}
        datesSet={(date) => {
          // putting time out because if we remove it we start getting an error
          // from React, saying it got the maximum rendering value for the component
          // https://github.com/fullcalendar/fullcalendar-react/issues/185
          setTimeout(() => {
            handleDateEvents(date);
          }, 50);
        }}
        headerToolbar={{
          left: "prev,next title",
          // center: 'title',
          right: "dayGridMonth,dayGridWeek,dayGridDay,listMonth",
        }}
        initialView="dayGridMonth"
        scrollTime="00:00:00"
        editable
        navLinks
        dayMaxEventRows
        dayPopoverFormat={{ month: "long", day: "numeric", weekday: "long" }}
        views={{
          agenda: {
            eventLimit: 11, // adjust to 6 only for agendaWeek/agendaDay
          },
          agendaDay: {
            eventDurationEditable: true,
          },
          agendaWeek: {
            eventDurationEditable: true,
          },
        }}
        eventMouseEnter={(event) => {
          if (event.view.type !== "listMonth") {
            handleMouseEvents(
              event.jsEvent,
              false,
              event.event._def.extendedProps,
            );
          } else {
            // Remove forced url in tag
            event.el.classList.remove("fc-event-forced-url");
          }
        }}
        eventMouseLeave={(event) => {
          if (event.view.type !== "listMonth") {
            handleMouseEvents(
              event.jsEvent,
              true,
              event.event._def.extendedProps,
            );
          }
        }}
        eventDrop={(info) => {
          checkValidation(info.event._def.publicId, info.event.startStr, info);
        }}
        eventDragStart={(info) => {
          handleMouseEvents(info.jsEvent, true, "");
        }}
        eventDidMount={function (info) {
          // List View
          if (info.view.type === "listMonth") {
            handleTaskStatus(info);
            info.el.style.backgroundColor = "white";
          }
        }}
      />
    </Layout>
  );
}
