import {
  useEffect,
  useState
} from "react";

import Navbar from "../Navbar";

import DashboardHeader
  from "./DashboardHeader";

import RepositoryFeed
  from "./RepositoryFeed";

import SuggestedRepos
  from "./SuggestedRepos";

import EventsPanel
  from "./EventsPanel";

import {
  fetchAllRepositories,
  fetchUserRepositories
} from "../../services/repoService";

import "./dashboard.css";

const Dashboard = () => {

  const [
    repositories,
    setRepositories
  ] = useState([]);

  const [
    searchQuery,
    setSearchQuery
  ] = useState("");

  const [
    suggestedRepositories,
    setSuggestedRepositories
  ] = useState([]);

  const [
    searchResults,
    setSearchResults
  ] = useState([]);

  useEffect(() => {

    const userId =
      localStorage.getItem(
        "userId"
      );

    if (
      !userId ||
      userId === "null"
    ) {
      return;
    }

    getRepositories(userId);

    getSuggestedRepositories();

  }, []);

  const getRepositories =
    async (userId) => {

      try {

        const data =
          await fetchUserRepositories(
            userId
          );

        setRepositories(
          data.repositories || []
        );

        setSearchResults(
          data.repositories || []
        );

      } catch (err) {

        console.error(
          "Repository Fetch Error:",
          err
        );

      }
    };

  const getSuggestedRepositories =
    async () => {

      try {

        const data =
          await fetchAllRepositories();

        setSuggestedRepositories(
          data || []
        );

      } catch (err) {

        console.error(
          "Suggested Repo Error:",
          err
        );

      }
    };

  useEffect(() => {

    if (
      !searchQuery.trim()
    ) {

      setSearchResults(
        repositories
      );

      return;
    }

    const filteredRepos =
      repositories.filter(
        (repo) =>
          repo.name
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
      );

    setSearchResults(
      filteredRepos
    );

  }, [
    searchQuery,
    repositories
  ]);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <SuggestedRepos
          repositories={
            suggestedRepositories
          }
        />

        <main className="dashboard-main">

          <DashboardHeader
            searchQuery={
              searchQuery
            }
            setSearchQuery={
              setSearchQuery
            }
          />

          <RepositoryFeed
            repositories={
              searchResults
            }
          />

        </main>

        <EventsPanel />

      </div>
    </>
  );
};

export default Dashboard;