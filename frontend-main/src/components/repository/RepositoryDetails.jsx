import axios from "axios";
import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  toggleStar
} from "../../services/repoService";

import {
  toggleFollow
} from "../../services/userService";


import MergeConflictModal
  from "./MergeConflictModal";

import {
  forkRepository
}
  from "../../services/repoService";


import FileTree
  from "./FileTree";
import { getFileIcon } from "../../utils/fileIcons";

import buildFileTree
  from "../../utils/buildFileTree";
import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";

import Navbar from "../Navbar";

import RepositoryTabs
  from "./RepositoryTabs";

import CreateFileModal
  from "./CreateFileModal";

import {
  fetchRepositoryById,
  deleteRepository,
  fetchPullRequests,
  mergePullRequest,
  addReviewComment
} from "../../services/repoService";

import {
  fetchIssues,
  createIssue,
  closeIssue,
  deleteIssue,
} from "../../services/issueService";

import IssueList
  from "../issues/IssueList";

import CreateIssueModal
  from "../issues/CreateIssueModal";
import ReactMarkdown
  from "react-markdown";

import remarkBreaks
  from "remark-breaks";

import "./repository.css";

const RepositoryDetails = () => {

  const {
    id,
    branch,
    "*": currentPathParam
  } = useParams();

  const navigate =
    useNavigate();

  const API =
    import.meta.env.VITE_API_URL;

  const [showConflictModal,
    setShowConflictModal] =
    useState(false);

  const [conflictData,
    setConflictData] =
    useState(null);

  const location =
    useLocation();

  const currentPath =
    decodeURIComponent(
      currentPathParam || ""
    );
  const [repository,
    setRepository] =
    useState(null);

  const [
    starCount,
    setStarCount
  ] = useState(0);

  const [
    starred,
    setStarred
  ] = useState(false);

  const [loading,
    setLoading] =
    useState(true);

  const [activeTab,
    setActiveTab] =
    useState(
      location.state?.activeTab || "Code"
    );

  const [issues,
    setIssues] =
    useState([]);

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState(
    branch ||
    location.state?.branch ||
    "main"
  );

  const [pullRequests,
    setPullRequests] =
    useState([]);

  const [showIssueForm,
    setShowIssueForm] =
    useState(false);

  const [issueLoading,
    setIssueLoading] =
    useState(false);

  const [showFileModal,
    setShowFileModal] =
    useState(false);

  const [search,
    setSearch] =
    useState("");

  const [showSearch,
    setShowSearch] =
    useState(false);

  const [selectedIndex,
    setSelectedIndex] =
    useState(0);

  const [
    following,
    setFollowing
  ] = useState(false);

  const [
    followerCount,
    setFollowerCount
  ] = useState(0);


  const searchRef =
    useRef(null);

  useEffect(() => {

    getRepository();

  }, [id]);
  useEffect(() => {

    if (
      showSearch &&
      searchRef.current
    ) {

      searchRef.current.focus();
    }

  }, [showSearch]);

  useEffect(() => {

    setSelectedIndex(0);

  }, [search]);

  const currentBranch =
    repository?.branches?.find(

      (branch) =>
        branch.name === selectedBranch
    );

  const files =

    currentBranch?.files ||

    repository?.files ||

    [];





  const fileTree =
    buildFileTree(files);

  const allFiles =
    files.map(
      (file) =>
        file.path || file.name
    );
  const filteredFiles =
    allFiles.filter((file) =>
      file
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );



  useEffect(() => {

    const handleKeyDown =
      (e) => {

        if (
          e.ctrlKey &&
          e.key.toLowerCase() === "p"
        ) {

          e.preventDefault();

          setShowSearch(true);

          return;
        }

        if (
          e.key === "Escape"
        ) {

          setShowSearch(false);

          setSearch("");

          return;
        }

        if (
          !showSearch ||
          filteredFiles.length === 0
        ) {
          return;
        }

        if (
          e.key === "ArrowDown"
        ) {

          e.preventDefault();

          setSelectedIndex((prev) =>
            prev === filteredFiles.length - 1
              ? 0
              : prev + 1
          );
        }

        if (
          e.key === "ArrowUp"
        ) {

          e.preventDefault();

          setSelectedIndex((prev) =>
            prev === 0
              ? filteredFiles.length - 1
              : prev - 1
          );
        }

        if (
          e.key === "Enter"
        ) {

          const file =
            filteredFiles[selectedIndex];

          if (!file) {
            return;
          }

          navigate(
            `/repository/${id}/blob/${selectedBranch}/${encodeURIComponent(file)}`
          );

          setShowSearch(false);

          setSearch("");
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, [
    showSearch,
    filteredFiles,
    selectedIndex
  ]);

  useEffect(() => {

    if (
      activeTab === "Issues"
    ) {

      loadIssues();
    }

    if (
      activeTab === "Pull Requests"
    ) {

      loadPullRequests();
    }

    getRepository();
  }, [
    activeTab,
    location.pathname
  ]);

  const getRepository =
    async () => {

      try {

        const data =
          await fetchRepositoryById(id);

        console.log(
          "FULL REPO:",
          data
        );

        console.log(
          "FORKED FROM:",
          data.forkedFrom
        );
        setRepository(data);

        const currentUserId =
          localStorage.getItem(
            "userId"
          );

        setFollowing(

          data.owner.followers?.some(
            (id) =>
              id.toString() === currentUserId
          )

        );

        console.log(
          "OWNER FOLLOWERS:",
          data.owner.followers
        );

        setFollowerCount(

          data.owner.followers?.length || 0

        );

        const userId =
          localStorage.getItem(
            "userId"
          );

        setStarCount(
          data.stars?.length || 0
        );

        setStarred(

          data.stars?.some(
            (id) =>
              id.toString() ===
              userId
          )
        );

      } catch (err) {

        console.error(
          "Repository Fetch Error:",
          err
        );

      } finally {

        setLoading(false);

      }
    };


  const loadIssues =
    async () => {

      try {

        setIssueLoading(true);

        const data =
          await fetchIssues(id);

        setIssues(data);

      } catch (err) {

        console.error(
          "Issue Fetch Error:",
          err
        );

      } finally {

        setIssueLoading(false);

      }
    };

  const loadPullRequests =
    async () => {

      try {

        const data =
          await fetchPullRequests(id);

        console.log(
          "PR DATA:",
          data
        );

        setPullRequests(data);

      } catch (err) {

        console.error(
          "PR LOAD ERROR:",
          err
        );
      }
    };

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete repository?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await deleteRepository(id);

        navigate("/");

      } catch (err) {

        console.error(
          "Delete Error:",
          err
        );

      }
    };

  const handleCloseIssue =
    async (issueId) => {

      try {

        await closeIssue(issueId);

        loadIssues();

      } catch (err) {

        console.error(err);

      }
    };

  const handleDeleteIssue =
    async (issueId) => {

      try {

        await deleteIssue(issueId);

        loadIssues();

      } catch (err) {

        console.error(err);

      }
    };

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="repo-loading">

          Loading repository...

        </div>
      </>
    );
  }
  const currentUserId =
    localStorage.getItem(
      "userId"
    );
  const isOwner =

    repository?.owner?._id?.toString() ===

    currentUserId;
  console.log(
    "OWNER:",
    repository?.owner?._id
  );

  console.log(
    "CURRENT:",
    currentUserId
  );

  console.log(
    "IS OWNER:",
    isOwner
  );
  if (!repository) {

    return (
      <>
        <Navbar />

        <div className="repo-loading">

          Repository not found

        </div>
      </>
    );
  }


  const handleFollow =
    async () => {

      try {

        const currentUserId =
          localStorage.getItem(
            "userId"
          );

        const data =
          await toggleFollow(

            repository.owner._id,

            currentUserId

          );
        console.log("FOLLOW RESPONSE:", data);
        setFollowing(
          data.following
        );

        setFollowerCount(
          data.followers
        );

      } catch (err) {

        console.error(err);

      }

    };
  const handleStar =
    async () => {

      try {

        const userId =
          localStorage.getItem(
            "userId"
          );

        const data =
          await toggleStar(

            repository._id,

            userId
          );

        setStarCount(
          data.stars
        );

        setStarred(
          data.starred
        );

      } catch (err) {

        console.error(err);

      }
    };

  const getCurrentTree = () => {

    if (!currentPath) {
      return fileTree;
    }

    const parts =
      currentPath.split("/");

    let current =
      fileTree;

    for (const part of parts) {

      if (!current[part]) {
        return {};
      }

      current =
        current[part].children;
    }

    return current;
  };

  const currentTree =
    getCurrentTree();


  const readmeFile =
    files.find(

      (file) => {

        const fileName =
          (file.path || file.name || "")
            .toLowerCase()
            .trim();

        return (
          fileName === "readme.md" ||
          fileName.endsWith("/readme.md")
        );
      }
    );

  return (
    <>
      <Navbar />

      <div className="repository-page">

        {/* ================= HEADER ================= */}

        <div className="repository-header">

          <div>

            <h1 className="repo-title">

              {repository.owner?.username || "user"}

              <span>
                / {repository.name}
              </span>

            </h1>

            <p className="repo-description">

              {repository.description ||
                "No description"}

            </p>

            {
              repository.forkedFrom && (

                <p className="fork-info">

                  🍴 Forked from

                  {" "}

                  {repository.forkedFrom.owner?.username}

                  /

                  {repository.forkedFrom.name}

                </p>
              )
            }

          </div>

          <div className="repo-actions">


            {!isOwner && (
              <button
                className="follow-btn"
                onClick={handleFollow}
              >
                {following
                  ? "Following"
                  : "Follow"}
              </button>
            )}


            <button
              onClick={handleStar}
            >

              {
                starred
                  ? "⭐ Starred"
                  : "⭐ Star"
              }

              {" "}

              ({starCount})

            </button>


            {
              !isOwner && (

                <button

                  onClick={async () => {

                    try {

                      const response =
                        await forkRepository(

                          repository._id,

                          localStorage.getItem(
                            "userId"
                          )
                        );

                      navigate(
                        `/repository/${response.repository._id}`
                      );

                    } catch (err) {

                      console.error(err);

                    }
                  }}
                >
                  🍴 {repository?.forkCount || 0}
                </button>

              )
            }


            {
              isOwner && (

                <button
                  className="new-file-btn"
                  onClick={() =>
                    setShowFileModal(true)
                  }
                >
                  + Add File
                </button>

              )
            }
            <button
              className="edit-btn"
              onClick={() =>
                navigate(
                  `/repository/${id}/commits/${selectedBranch}`
                )
              }
            >
              🕘 Commits
            </button>

            {
              isOwner && (

                <button
                  className="delete-btn"
                  onClick={handleDelete}
                >
                  🗑 Delete
                </button>

              )
            }

          </div>

        </div>

        {/* ================= TABS ================= */}

        <RepositoryTabs
          isOwner={isOwner}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          issueCount={issues.length}
        />

        {/* ================= CODE TAB ================= */}

        {activeTab === "Code" && (

          <div className="github-layout">

            {/* ================= SIDEBAR ================= */}

            <div className="github-sidebar">

              <div className="sidebar-header">

                <h3>

                  {repository.owner?.username}
                  {" / "}
                  {repository.name}

                </h3>

              </div>

              <div className="sidebar-branch">

                <select

                  className="branch-selector"

                  value={selectedBranch}

                  onChange={(e) => {

                    const newBranch =
                      e.target.value;

                    setSelectedBranch(
                      newBranch
                    );

                    navigate(
                      `/repository/${id}/tree/${newBranch}`
                    );
                  }}
                >

                  {
                    repository?.branches?.map(
                      (branch) => (

                        <option
                          key={branch.name}
                          value={branch.name}
                        >
                          🌿 {branch.name}
                        </option>
                      )
                    )
                  }

                </select>

                {
                  isOwner && (

                    <button

                      className="create-branch-btn"

                      onClick={async () => {

                        const branchName =
                          prompt(
                            "Enter branch name"
                          );

                        if (!branchName) return;

                        await axios.post(

                          `${API}/repo/branch/${id}`,

                          {
                            branchName,
                          }
                        );

                        getRepository();
                      }}
                    >

                      + Branch

                    </button>

                  )
                }

              </div>

              <FileTree

                tree={fileTree}

                repositoryId={repository._id}

                branch={selectedBranch}
              />

            </div>

            {/* ================= MAIN CONTENT ================= */}

            <div className="github-main">

              <div className="repo-search-container">

                <input
                  type="text"
                  ref={searchRef}

                  placeholder="Search files... (Ctrl + P)"

                  value={search}

                  onFocus={() =>
                    setShowSearch(true)
                  }

                  onChange={(e) =>
                    setSearch(e.target.value)
                  }

                  className="repo-search-input"
                />

                {
                  showSearch &&
                  search && (

                    <div className="repo-search-dropdown">

                      {
                        filteredFiles.length > 0
                          ? filteredFiles
                            .slice(0, 8)
                            .map(
                              (file, index) => (

                                <div
                                  key={file}

                                  className={`repo-search-item ${selectedIndex === index
                                    ? "active-search-item"
                                    : ""
                                    }`}

                                  onClick={() => {

                                    navigate(
                                      `/repository/${id}/blob/${selectedBranch}/${encodeURIComponent(file)}`
                                    );

                                    setShowSearch(false);

                                    setSearch("");
                                  }}
                                >

                                  <span className="search-file-icon">

                                    {
                                      getFileIcon(file)
                                    }

                                  </span>

                                  <span>
                                    {file}
                                  </span>

                                </div>
                              )
                            )

                          : (

                            <div className="repo-search-empty">

                              No files found

                            </div>
                          )
                      }

                    </div>
                  )
                }

              </div>

              {/* =========================
       BREADCRUMB
    ========================= */}

              <div className="repo-breadcrumb">

                <span
                  className="breadcrumb-item"

                  onClick={() =>
                    navigate(
                      `/repository/${id}`
                    )
                  }
                >
                  root
                </span>

                {
                  currentPath &&
                  currentPath
                    .split("/")
                    .map((part, index, arr) => {

                      const path =
                        arr
                          .slice(0, index + 1)
                          .join("/");

                      return (

                        <span
                          key={path}
                        >

                          {" / "}

                          <span
                            className="breadcrumb-item"

                            onClick={() =>
                              navigate(
                                `/repository/${id}/tree/${selectedBranch}/${path}`
                              )
                            }
                          >
                            {part}
                          </span>

                        </span>
                      );
                    })
                }

              </div>

              {/* =========================FILE TABLE========================= */}

              <div className="repo-file-table">

                <div className="repo-file-header">

                  <div className="repo-file-header-left">

                    🌿 {selectedBranch}

                  </div>

                  <div className="repo-file-header-right">

                    Latest commit {
                      currentBranch?.commits?.length > 0
                        ? new Date(
                          currentBranch.commits[
                            currentBranch.commits.length - 1
                          ].committedAt
                        ).toLocaleString()
                        : "No commits yet"
                    }

                  </div>

                </div>

                <div className="repo-file-list">

                  {
                    Object.entries(currentTree)
                      .map(([name, node]) => {

                        const fullPath =
                          currentPath
                            ? `${currentPath}/${name}`
                            : name;

                        const isFolder =
                          node.type === "folder" ||

                          Object.keys(
                            node.children || {}
                          ).length > 0;

                        return (

                          <div
                            key={name}

                            className={`repo-file-row ${isFolder
                              ? "file-row-folder"
                              : "file-row-file"
                              }`}

                            onClick={() => {

                              if (isFolder) {

                                navigate(
                                  `/repository/${id}/tree/${selectedBranch}/${encodeURIComponent(fullPath)}`
                                );

                                return;
                              }

                              navigate(
                                `/repository/${id}/blob/${selectedBranch}/${encodeURIComponent(fullPath)}`
                              );
                            }}
                          >

                            <div className="repo-file-name">

                              <span className="file-icon">

                                {
                                  getFileIcon(
                                    name,
                                    isFolder
                                  )
                                }

                              </span>

                              <span>
                                {name}
                              </span>

                            </div>

                            <div className="repo-file-message">

                              {
                                currentBranch?.commits?.length > 0
                                  ? currentBranch.commits[
                                    currentBranch.commits.length - 1
                                  ].message
                                  : "Initial commit"
                              }

                            </div>

                            <div className="repo-file-time">

                              {
                                currentBranch?.commits?.length > 0
                                  ? new Date(
                                    currentBranch.commits[
                                      currentBranch.commits.length - 1
                                    ].committedAt
                                  ).toLocaleString()
                                  : "--"
                              }

                            </div>

                          </div>
                        );
                      })
                  }

                </div>

              </div>
              {/* ================= README ================= */}

              <div className="readme-section">

                <div className="readme-header">

                  <div>

                    📘 README.md

                  </div>

                  {
                    isOwner && (

                      <button
                        type="button"

                        className="edit-readme-btn"

                        disabled={!readmeFile}

                        onClick={(e) => {

                          e.preventDefault();

                          e.stopPropagation();

                          if (!readmeFile) {

                            console.log("README NOT FOUND");

                            return;
                          }

                          console.log(readmeFile);

                          navigate(
                            `/repository/${id}/edit/${selectedBranch}/${encodeURIComponent(
                              readmeFile.path || readmeFile.name
                            )}`
                          );
                        }}
                      >

                        ✏ Edit README

                      </button>
                    )
                  }

                </div>

                <div className="readme-content markdown-body">

                  <ReactMarkdown
                    remarkPlugins={[
                      remarkBreaks
                    ]}
                  >

                    {
                      readmeFile?.content ||

                      "# No README content"
                    }

                  </ReactMarkdown>

                </div>

              </div>

            </div>

            {/* ================= RIGHT PANEL ================= */}

            <div className="github-rightbar">

              <h3>About</h3>

              <p className="repo-description">
                {repository.description ||
                  "No description provided"}
              </p>

              {!isOwner && (

                <button
                  className="follow-btn"
                  onClick={handleFollow}
                >
                  {following
                    ? "Following"
                    : "Follow"}

                  {" "}
                 
                </button>

              )}

              <div className="about-divider"></div>

              <div className="about-item">
                👥 Followers
                <span>{followerCount}</span>
              </div>

              <div className="about-item">
                ⭐ Stars
                <span>{starCount}</span>
              </div>

              <div className="about-item">
                🍴 Forks
                <span>
                  {repository.forkCount || 0}
                </span>
              </div>

              <div className="about-item">
                🕒 Updated
                <span>
                  {new Date(
                    repository.updatedAt
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>
          </div>

        )}

        {/* ================= ISSUES ================= */}

        {activeTab === "Issues" && (

          <div className="issues-section">

            <div className="issues-header">

              <div>

                <h2>
                  Issues
                </h2>

                <p>
                  {issues.length}
                  {" "}
                  total issues
                </p>

              </div>

              <button
                className="new-issue-btn"
                onClick={() =>
                  setShowIssueForm(
                    !showIssueForm
                  )
                }
              >

                {showIssueForm
                  ? "Close"
                  : "New Issue"}

              </button>



            </div>

            {showIssueForm && (

              <CreateIssueModal
                repoId={id}
                onCreated={
                  loadIssues
                }
              />

            )}

            {issueLoading ? (

              <div className="tab-placeholder">

                Loading issues...

              </div>

            ) : (

              <IssueList
                issues={issues}
                onClose={
                  handleCloseIssue
                }
                onDelete={
                  handleDeleteIssue
                }
              />

            )}

          </div>

        )}

        {/* ================= PULL REQUESTS ================= */}

        {activeTab ===
          "Pull Requests" && (

            <div className="issues-section">

              <div className="issues-header">

                <div>

                  <h2>
                    Pull Requests
                  </h2>

                  <p>
                    {pullRequests.length}
                    {" "}
                    total pull requests
                  </p>

                </div>

              </div>

              {
                pullRequests.length === 0 ? (

                  <div className="tab-placeholder">

                    No pull requests yet.

                  </div>

                ) : (

                  [...pullRequests]



                    .sort(
                      (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    )

                    .map((pr) => (

                      <div
                        key={pr._id}

                        className="commit-card"
                      >

                        <h3>
                          {pr.title}
                        </h3>

                        <p>
                          {pr.filePath}
                        </p>

                        <small className="pr-subtitle">
                          Proposed changes waiting for merge
                        </small>

                        <small>
                          {
                            new Date(
                              pr.createdAt
                            ).toLocaleString()
                          }
                        </small>

                        <div
                          style={{
                            marginTop: "12px",
                          }}
                        >

                          Status:
                          {" "}

                          <span
                            style={{
                              color:
                                pr.status === "merged"
                                  ? "#3fb950"
                                  : "#58a6ff",
                            }}
                          >
                            {pr.status}
                          </span>

                        </div>
                        <div className="review-comments">

                          {
                            pr.reviewComments?.map(
                              (item, index) => (

                                <div
                                  key={index}
                                  className="review-comment"
                                >

                                  <strong>
                                    {item.username}
                                  </strong>

                                  <p>
                                    {item.comment}
                                  </p>

                                </div>
                              )
                            )
                          }

                        </div>

                        <div className="review-box">

                          <input
                            type="text"

                            placeholder=
                            "Add review comment and tap enter..."

                            onKeyDown={async (e) => {

                              if (
                                e.key === "Enter"
                              ) {

                                const response =
                                  await addReviewComment(

                                    pr._id,

                                    {
                                      username:
                                        localStorage.getItem(
                                          "username"
                                        ),

                                      comment:
                                        e.target.value,
                                    }
                                  );

                                setPullRequests((prev) =>

                                  prev.map((item) =>

                                    item._id === pr._id
                                      ? response.pr
                                      : item
                                  )
                                );

                                e.target.value = "";
                              }
                            }}
                          />

                        </div>
                        {
                          isOwner &&
                          pr.status !== "merged" && (

                            <button
                              className="save-btn"

                              style={{
                                marginTop: "16px",
                              }}

                              onClick={async (e) => {




                                try {

                                  await mergePullRequest(
                                    pr._id
                                  );

                                  loadPullRequests();

                                  getRepository();

                                } catch (err) {

                                  if (
                                    err.response?.status === 409
                                  ) {

                                    setConflictData(
                                      err.response.data
                                    );

                                    setShowConflictModal(true);

                                  } else {

                                    console.error(err);
                                  }
                                }

                              }}
                            >
                              Merge Pull Request
                            </button>
                          )
                        }

                      </div>
                    ))
                )
              }

            </div>

          )}

        {/* ================= ACTIONS ================= */}

        {activeTab ===
          "Actions" && (

            <div className="tab-placeholder">

              <h2>
                GitHub Actions
              </h2>

              <p>
                CI/CD pipelines
                coming soon.
              </p>

            </div>

          )}

        {/* ================= SETTINGS ================= */}

        {activeTab ===
          "Settings" && (

            <div className="tab-placeholder">

              <h2>
                Repository Settings
              </h2>

              <p>
                Manage repository
                settings here.
              </p>

            </div>

          )}

      </div>
      {
        showFileModal && (

          <CreateFileModal

            repositoryId={id}
            branch={selectedBranch}

            onClose={() =>
              setShowFileModal(false)
            }

            onCreated={() => {

              getRepository();

              setShowFileModal(false);

            }}
          />
        )
      }
      {
        isOwner &&
        showConflictModal &&
        conflictData && (

          <MergeConflictModal

            mainContent={
              conflictData.mainContent
            }

            featureContent={
              conflictData.featureContent
            }

            filePath={
              conflictData.filePath
            }

            onClose={() => {

              setShowConflictModal(false);

              setConflictData(null);
            }}

            onResolve={async (
              resolvedContent
            ) => {

              try {

                await axios.patch(

                  `${API}/repo/pr/resolve/${conflictData.prId}`,

                  {
                    resolvedContent,

                    filePath:
                      conflictData.filePath,
                  }
                );

                setShowConflictModal(false);

                setConflictData(null);

                loadPullRequests();

                getRepository();

                alert(
                  "Conflict resolved and PR merged!"
                );

              } catch (err) {

                console.error(err);
              }
            }}
          />
        )
      }

    </>
  );
};

export default RepositoryDetails;
