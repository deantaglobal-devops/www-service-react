import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import UserPagination from "../../components/pagination/pagination";
import DashboardCard from "./components/Card/dashboardCard";
import DashboardFilter from "./components/Filter/dashboardFilter";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";

import "./styles/projectsDashboard.styles.css";

export function ProjectsDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterProjects, setFilterProjects] = useState([]);
  const [cardHovered, setCardHovered] = useState(0);
  const [filterValues, setFilterValues] = useState([]);
  const [projects, setProjects] = useState([]);

  const limit = 29;

  const { user, permissions } = useAuth();
  const { projectType } = useParams();

  useEffect(() => {
    document.title = `Lanstad — ${
      projectType === "books" ? "Books" : "Journals"
    }`;

    // fetching projects data
    handleProjectsData();
  }, [projectType]);

  const getFilterValues = (projects) => {
    // Removing duplicates clients of array
    const allClients = projects
      ?.filter(
        (project, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.clientId === project.clientId && t.client === project.client,
          ),
      )
      .map((project) => ({ id: project.clientId, value: project.client }));

    allClients?.unshift({ id: 0, value: "All Clients" });

    setFilterValues(allClients);
  };

  const handleProjectsData = async () => {
    let response;
    setIsLoading(true);
    if (projectType === "books") {
      response = await api.get("/project/books");
    } else {
      response = await api.get("/project/journals");
    }

    setProjects(response.data);
    setFilterProjects(response.data);
    getFilterValues(response.data);
    setIsLoading(false);
  };

  // Set the top cordinate to 0
  // make scrolling smooths
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // click on pagination button and getting pages
  const handleNextPage = (currentPage, pageClicked, _start, _limit) => {
    const defaultLimit = limit;
    let newStartPage = 0;
    // let newLimitPage = defaultLimit - 1;
    if (currentPage === pageClicked) {
      return true;
    }
    if (pageClicked > currentPage) {
      newStartPage = _start + (pageClicked - currentPage) * defaultLimit;
      // newLimitPage = _limit + defaultLimit * (pageClicked - currentPage);
    } else {
      newStartPage = _start - defaultLimit * (currentPage - pageClicked);
      // newLimitPage = pageClicked * defaultLimit - 1;
    }
    setStart(newStartPage);
    setCurrentPage(pageClicked);

    scrollToTop();
  };

  const handleProjectSelected = (e) => {
    // const valueSelected = JSON.parse(e);
    const valueSelected = e;

    // All the Books/Journals
    let projectsValues = projects;

    // If user selected any client
    if (valueSelected.id !== 0) {
      projectsValues = projectsValues.filter(
        (project) => project.clientId === valueSelected.id,
      );
    }

    setStart(0);
    setCurrentPage(1);
    setFilterProjects(projectsValues);
  };

  const handleHover = (id, status) => {
    if (status === "enter") {
      setCardHovered(id);
    } else {
      setCardHovered(0);
    }
  };

  return (
    <Layout
      iconActive={projectType === "books" ? "Books" : "Journals"}
      permissions={permissions}
      user={user}
    >
      {isLoading && <Loading loadingText="loading..." />}

      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
          <h3 className="page-title">
            {projectType === "books" ? "Books" : "Journals"}
            <span className="page-subtitle lanstad-subtitle">
              <span />
            </span>
          </h3>
        </div>

        <div className="col-4 col-sm-6 mr-auto align-items-right">
          <div
            className="mb-sm-0 mx-auto ml-sm-auto mr-sm-0"
            role="group"
            aria-label="Page actions"
          />
        </div>
      </div>
      {/* End Header */}

      <div className="d-flex mb-2 mt-2 buttons-project-dashboard-container">
        <div className="nav-tags p-0">
          <a
            href={
              projectType === "books"
                ? "/dashboard/books"
                : "/dashboard/journals"
            }
            className="active"
          >
            Active
          </a>
          <a href={projectType === "books" ? "/lst/books" : "/lst/journals"}>
            Report
          </a>
        </div>

        {filterValues && (
          <DashboardFilter
            values={filterValues}
            selectedProject={handleProjectSelected}
          />
        )}
      </div>

      <div className="row" id="projects-card-container">
        {filterProjects?.slice(start, start + limit).map((project) => (
          <DashboardCard
            project={project}
            permissions={permissions}
            handleHover={handleHover}
            key={project.id}
            cardHovered={cardHovered}
            isBook={projectType === "books"}
          />
        ))}

        {filterProjects?.length > limit && (
          <UserPagination
            dataLength={filterProjects.length}
            start={start}
            limit={limit}
            currentPage={currentPage}
            handleNextPage={handleNextPage}
          />
        )}
      </div>
    </Layout>
  );
}
