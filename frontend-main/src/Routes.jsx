import { useEffect } from "react";

import EditFile
    from "./components/repository/EditFile";

import CommitDetails
    from "./components/repository/CommitDetails";

import {
    useNavigate,
    useRoutes,
    useLocation,
} from "react-router-dom";
import RepositoryDetails
    from "./components/repository/RepositoryDetails";

import Dashboard
    from "./components/dashboard/Dashboard";

import FileViewer
    from "./components/repository/FileViewer";

import Profile
    from "./components/user/Profile";

import Login
    from "./components/auth/Login";

import Signup
    from "./components/auth/Signup";

import CreateRepository
    from "./components/repository/CreateRepository";

import { useAuth }
    from "./authContext";

import CommitHistory
    from "./components/repository/CommitHistory";

const ProjectRoutes = () => {

    const {
        currentUser,
        setCurrentUser,
    } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {

        const userId =
            localStorage.getItem(
                "userId"
            );

        const publicRoutes = [
            "/auth",
            "/signup",
        ];



        /* NOT LOGGED IN */
        if (
            !userId &&
            !publicRoutes.includes(
                location.pathname
            )
        ) {

            navigate("/auth");

            return;
        }

        /* ALREADY LOGGED IN */
        if (
            userId &&
            publicRoutes.includes(
                location.pathname
            )
        ) {

            navigate("/");

        }

    }, []);

    const element = useRoutes([
        {
            path: "/",
            element: <Dashboard />,
        },
        {
            path: "/auth",
            element: <Login />,
        },
        {
            path: "/signup",
            element: <Signup />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },
        {
            path: "/create",
            element: <CreateRepository />,
        },
        {
            path: "/repository/:id",
            element: <RepositoryDetails />
        },
        {
            path: "/repository/:id/tree/:branch/*",
            element: <RepositoryDetails />
        },
        {
            path:
                "/repository/:id/blob/:branch/*",

            element:
                <FileViewer />
        },

        {
            path:
                "/repository/:id/edit/:branch/*",

            element:
                <EditFile />
        },
        {
            path:
                "/repository/:id/commits/:branch",

            element:
                <CommitHistory />
        },
        {
            path:
                "/repository/:id/commit/:branch/:commitId",

            element:
                <CommitDetails />
        },
    ]);

    return element;
};

export default ProjectRoutes;