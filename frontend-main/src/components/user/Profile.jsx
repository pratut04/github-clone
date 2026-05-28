import {
  useEffect,
  useState
} from "react";

import Navbar from "../Navbar";

import HeatMapProfile
  from "./HeatMap";

import ProfileHeader
  from "./ProfileHeader";

import ProfileSidebar
  from "./ProfileSidebar";

import ProfileRepositories
  from "./ProfileRepositories";

import ProfileTabs
  from "./ProfileTabs";

import {
  fetchUserProfile
} from "../../services/userService";

import {
  fetchUserRepositories
} from "../../services/repoService";

import "./profile.css";

const Profile = () => {

  const [
    userDetails,
    setUserDetails
  ] = useState({});

  const [
    repositories,
    setRepositories
  ] = useState([]);

  const [
    activeTab,
    setActiveTab
  ] = useState("Overview");

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {

    loadProfileData();

  }, []);

  const loadProfileData =
    async () => {

      try {

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

        const userData =
          await fetchUserProfile(
            userId
          );

        setUserDetails(
          userData
        );

        const repoData =
          await fetchUserRepositories(
            userId
          );

        setRepositories(
          repoData.repositories || []
        );

      } catch (err) {

        console.error(
          "Profile Fetch Error:",
          err
        );

      } finally {

        setLoading(false);

      }
    };

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="profile-loading">

          Loading Profile...

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">

        {/* LEFT SIDEBAR */}

        <aside className="profile-left">

          <ProfileHeader
            username={
              userDetails.username
            }
            email={
              userDetails.email
            }
          />

          <button
            className="profile-follow-btn"
          >
            Follow
          </button>

          <div className="profile-stats">

            <span>
              120 Followers
            </span>

            <span>
              44 Following
            </span>

          </div>

          <ProfileSidebar />

        </aside>

        {/* MAIN CONTENT */}

        <main className="profile-main">

          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={
              setActiveTab
            }
          />

          {/* OVERVIEW TAB */}

          {
            activeTab ===
              "Overview" && (

              <>
                <div className="heatmap-wrapper">

                  <HeatMapProfile />

                </div>

                <div className="profile-overview-card">

                  <h3>
                    Contribution Activity
                  </h3>

                  <p>
                    Active contributor
                    across repositories.
                  </p>

                </div>
              </>
            )
          }

          {/* REPOSITORIES TAB */}

          {
            activeTab ===
              "Repositories" && (

              <div className="profile-repo-section">

                <h2>
                  Repositories
                </h2>

                <ProfileRepositories
                  repositories={
                    repositories
                  }
                />

              </div>
            )
          }

          {/* STARS TAB */}

          {
            activeTab ===
              "Stars" && (

              <div className="profile-placeholder">

                <h2>
                  Starred Repositories
                </h2>

                <p>
                  No starred repositories yet.
                </p>

              </div>
            )
          }

          {/* FOLLOWERS TAB */}

          {
            activeTab ===
              "Followers" && (

              <div className="profile-placeholder">

                <h2>
                  Followers
                </h2>

                <p>
                  120 followers
                </p>

              </div>
            )
          }

        </main>

      </div>
    </>
  );
};

export default Profile;