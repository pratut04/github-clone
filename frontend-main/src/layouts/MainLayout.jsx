import TopNavbar from "./TopNavbar";

import LeftSidebar from "./LeftSidebar";

import RightSidebar from "./RightSidebar";

import "./layout.css";

const MainLayout = ({
  children,
}) => {
  return (
    <>
      <TopNavbar />

      <div className="main-layout">

        <LeftSidebar />

        <main className="layout-content">
          {children}
        </main>

        <RightSidebar />

      </div>
    </>
  );
};

export default MainLayout;