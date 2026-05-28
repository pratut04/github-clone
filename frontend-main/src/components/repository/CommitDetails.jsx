import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import DiffViewer
    from "react-diff-viewer-continued";

import Navbar
    from "../Navbar";

import {
    fetchRepositoryById
} from "../../services/repoService";

import "./repository.css";

const CommitDetails = () => {

    const {
        id,
        branch,
        commitId
    } = useParams();

    const navigate =
        useNavigate();

    const [commit,
        setCommit] =
        useState(null);

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        loadCommit();

    }, []);

    const loadCommit =
        async () => {

            try {

                const repo =
                    await fetchRepositoryById(id);

                const currentBranch =
                    repo.branches.find(
                        (b) =>
                            b.name === branch
                    );

                const foundCommit =
                    currentBranch?.commits.find(
                        (c) =>
                            c._id.toString() ===
                            commitId
                    );

                setCommit(foundCommit);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="repo-loading">

                    Loading commit...

                </div>
            </>
        );
    }

    if (!commit) {

        return (
            <>
                <Navbar />

                <div className="repo-loading">

                    Commit not found

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="commit-details-page">

                <div className="commit-details-header">

                    <button
                        className="back-btn"

                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back
                    </button>

                    <h1>
                        {commit.message}
                    </h1>

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

                </div>

                <div className="diff-container">

                    <DiffViewer

                        oldValue={
                            commit.oldContent || ""
                        }

                        newValue={
                            commit.newContent || ""
                        }

                        splitView={true}

                        showDiffOnly={false}
                    />

                </div>

            </div>
        </>
    );
};

export default CommitDetails;