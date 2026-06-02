import {
    useEffect,
    useState
} from "react";


import {
    useParams,
    useNavigate
} from "react-router-dom";

import Navbar from "../Navbar";

import {
    fetchRepositoryById,
    restoreCommit
} from "../../services/repoService";

import "./repository.css";

const CommitHistory = () => {

    const {
        id,
        branch = "main"
    } = useParams();

    const navigate = useNavigate();

    const [commits,
        setCommits] =
        useState([]);

    useEffect(() => {

        loadCommits();

    }, [branch]);

    const loadCommits =
        async () => {

            try {

                const repo =
                    await fetchRepositoryById(id);

                const currentBranch =
                    repo?.branches?.find(
                        (b) =>
                            b.name === branch
                    );

                setCommits(
                    currentBranch?.commits || []
                );

            } catch (err) {

                console.error(err);

            }
        };

    return (
        <>
            <Navbar />

            <div className="commit-page">

                <h1>
                    Commit History
                </h1>

                {
                    commits
                        .slice()
                        .reverse()
                        .map((commit, index) => (

                            <div
                                key={index}

                                className="commit-card"

                                onClick={() =>
                                    navigate(
                                        `/repository/${id}/commit/${branch}/${commit._id}`
                                    )
                                }
                            >

                                <h3>
                                    {commit.message}
                                </h3>

                                <span className="commit-open-hint">
                                    Open Diff
                                </span>

                                <p>
                                    {commit.filePath}
                                </p>

                                <small>

                                    {
                                        new Date(
                                            commit.committedAt
                                        ).toLocaleString()
                                    }
                                </small>

                                <button
                                    className="save-btn"

                                    onClick={async () => {

                                        try {

                                            await restoreCommit(
                                                id,
                                                commit._id,
                                                branch
                                            );

                                            alert(
                                                "Version restored!"
                                            );

                                            window.location.href =
                                                `/repository/${id}`;

                                        } catch (err) {

                                            console.error(err);

                                        }
                                    }}
                                >
                                    Restore Version
                                </button>

                            </div>
                        ))
                }

            </div>
        </>
    );
};

export default CommitHistory;
