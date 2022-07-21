import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import UserPagination from "../../components/pagination/pagination";
import DashboardCard from "./components/Card/dashboardCard";
import DashboardFilter from "./components/Filter/dashboardFilter";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";

// remove it after demo
import AddBookModal from "./components/addBookModal/addBookModal";
import testBook from "../../assets/testBook.jpg";

import "./styles/projectsDashboard.styles.css";

export function ProjectsDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterProjects, setFilterProjects] = useState([]);
  const [cardHovered, setCardHovered] = useState(0);
  const [filterValues, setFilterValues] = useState([]);
  const [projects, setProjects] = useState([]);

  // remove it after demo
  const [openAddBookModal, setOpenAddBookModal] = useState(false);

  const limit = 29;

  const { user, permissions } = useAuth();
  const { projectType } = useParams();

  useEffect(() => {
    document.title = `Lanstad — ${
      projectType === "books" ? "Books" : "Journals"
    }`;

    const booksForDemo = [
      {
        author:
          "Martin Locret-Collet, Simon Springer, Jennifer Mateer, and Maleea Acker",
        bookcode: "INEM",
        client: "Bloomsbury",
        clientId: 9,
        endDate: "31-08-2022",
        id: 248166,
        indexer: "",
        isbn: "567547567865891321535",
        milestones: [
          {
            id: 156380,
            percentage: 0,
            milestoneTitle: "Project analysis and scheduling",
            milestoneStart: "30-06-2022",
            milestoneEnd: "02-07-2022",
          },
          {
            id: 156381,
            percentage: 0,
            milestoneTitle: "Copy editing",
            milestoneStart: "04-07-2022",
            milestoneEnd: "09-08-2022",
          },
        ],
        percent: 26,
        productionEditor: "Jaffar",
        projectImage:
          "https://images.unsplash.com/photo-1639690283395-b62444cf9a76?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        projectManager: "Tech Support Deanta",
        projectType: "LXE",
        startDate: "30-06-2022",
        template: "",
        title: "New field books",
      },
      {
        author:
          "Martin Locret-Collet, Simon Springer, Jennifer Mateer, and Maleea Acker",
        bookcode: "INEM",
        client: "Rowman and Littlefield",
        clientId: 12,
        endDate: "23-09-2022",
        id: 248165,
        indexer: "",
        isbn: "9781538159100",
        milestones: [
          {
            id: 156360,
            percentage: 0,
            milestoneTitle: "Project analysis and scheduling",
            milestoneStart: "23-06-2022",
            milestoneEnd: "27-06-2022",
          },
          {
            id: 156361,
            percentage: 0,
            milestoneTitle: "Copy-Editing",
            milestoneStart: "28-06-2022",
            milestoneEnd: "06-07-2022",
          },
        ],
        percent: 40,
        productionEditor: "Mary Wheelehan",
        projectImage:
          "https://images.unsplash.com/photo-1621827979802-6d778e161b28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        projectManager: "Tech Support Deanta",
        projectType: "LXE",
        startDate: "23-06-2022",
        template: "RL_Rowman 01_6x9_v2_BA_for_typecoded_324x520.7",
        title: "Locret-Collet  et al_9781538159100",
      },
      {
        author: "Lisa LaMonica",
        bookcode: "WIPR",
        client: "Rowman and Littlefield",
        clientId: 12,
        endDate: "23-09-2022",
        id: 248164,
        indexer: "",
        isbn: "9789354401572",
        milestones: [
          {
            id: 156352,
            percentage: 0,
            milestoneTitle: "Project analysis and scheduling",
            milestoneStart: "23-06-2022",
            milestoneEnd: "27-06-2022",
          },
          {
            id: 156353,
            percentage: 0,
            milestoneTitle: "Copy-Editing",
            milestoneStart: "28-06-2022",
            milestoneEnd: "06-07-2022",
          },
        ],
        percent: 20,
        productionEditor: "Jehanne Schweitzer",
        projectImage:
          "https://images.unsplash.com/photo-1612541831162-96d8fe7558f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        projectManager: "Tech Support Deanta",
        projectType: "LXE",
        startDate: "23-06-2022",
        template: "RL_Rowman 01_6x9_v2_BA_for_typecoded_324x520.7",
        title: "DST book project",
      },
    ];

    // remove it after demo
    if (user?.id === 15331) {
      setFilterProjects(booksForDemo);
      getFilterValues(booksForDemo);
    } else {
      // fetching projects data
      handleProjectsData();
    }
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

  const handleAddBook = () => {
    setOpenAddBookModal(true);
  };

  const handleOnCloseAddBookModal = () => {
    setOpenAddBookModal(false);
  };

  return (
    <Layout
      iconActive={projectType === "books" ? "Books" : "Journals"}
      permissions={permissions}
      user={user}
    >
      {isLoading && <Loading loadingText="loading..." />}

      {/* remove it after demo
        remove AddBookModal
      */}
      {openAddBookModal && (
        <AddBookModal
          openAddBookModal={openAddBookModal}
          handleOnCloseAddBookModal={() => handleOnCloseAddBookModal()}
          // handleAddNewProject={(projectCode, category, file) =>
          //   handleAddNewProject(projectCode, category, file)
          // }
        />
      )}

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

      <div className="d-flex align-items-center row mb-2 mt-2">
        <div className="nav-tags col-9 pl-0">
          <Link
            to={
              projectType === "books"
                ? "/dashboard/books"
                : "/dashboard/journals"
            }
            className="active"
          >
            Active
          </Link>
          <Link
            to={projectType === "books" ? "/lst/books" : "/lst/journals"}
            style={{ color: "unset" }}
          >
            Report
          </Link>
        </div>

        {/* user for demo purpose
          remove it after demo
        */}
        {user?.id === 15331 && (
          <button
            type="button"
            className="btn btn-outline-primary add-book mt-3 mr-3"
            onClick={() => handleAddBook()}
          >
            Add Book
          </button>
        )}

        {filterValues && (
          <DashboardFilter
            values={filterValues}
            selectedProject={handleProjectSelected}
            userId={user?.id}
          />
        )}
      </div>

      <div className="row" id="projects-card-container">
        {filterProjects?.slice(start, start + limit).map((project) => (
          // remove it after demo
          // remove userId
          <DashboardCard
            project={project}
            permissions={permissions}
            handleHover={handleHover}
            key={project.id}
            cardHovered={cardHovered}
            isBook={projectType === "books"}
            userId={user?.id}
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
