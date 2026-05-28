import {
    useEffect,
    useState
} from "react";


import {
    fetchRepositoryById,
    createPullRequest
} from "../../services/repoService";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import {
    Prism as SyntaxHighlighter
} from "react-syntax-highlighter";

import {
    vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
    useParams
} from "react-router-dom";

import Navbar
    from "../Navbar";

import "./repository.css";

const FileViewer = () => {

    const {
        id,
        branch,
        "*": filePath
    } = useParams();

    const navigate =
        useNavigate();
    const location =
        useLocation();
    const [loading,
        setLoading] =
        useState(true);

    const [file,
        setFile] =
        useState(null);


    const getLanguage =
        (filename) => {

            if (
                filename?.endsWith(".js")
            )
                return "javascript";

            if (
                filename?.endsWith(".jsx")
            )
                return "jsx";

            if (
                filename?.endsWith(".ts")
            )
                return "typescript";

            if (
                filename?.endsWith(".tsx")
            )
                return "tsx";

            if (
                filename?.endsWith(".css")
            )
                return "css";

            if (
                filename?.endsWith(".html")
            )
                return "html";

            if (
                filename?.endsWith(".json")
            )
                return "json";

            if (
                filename?.endsWith(".md")
            )
                return "markdown";

            return "text";
        };

    useEffect(() => {

        loadFile();

    }, [id, branch, filePath]);

    const loadFile =
        async () => {

            try {

                setLoading(true);

                const repository =
                    await fetchRepositoryById(id);
                const currentBranch =
                    repository.branches.find(
                        (b) =>
                            b.name === branch
                    );
                const branchFiles =
                    currentBranch?.files ||
                    repository.files ||
                    [];

                const foundFile =
                    branchFiles.find(
                        (f) =>

                            (f.path || f.name) ===
                            filePath
                    );

                setFile(foundFile);

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

                    Loading file...

                </div>
            </>
        );
    }

    if (!file) {

        return (
            <>
                <Navbar />

                <div className="repo-loading">

                    File not found

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="file-viewer-page">

                <div className="file-viewer-header">

                    <div className="file-breadcrumb">

                        <span
                            className="breadcrumb-link"

                            onClick={() =>
                                navigate(`/repository/${id}`)
                            }
                        >
                            root
                        </span>

                        {
                            filePath
                                .split("/")
                                .map((part, index, arr) => {

                                    const path =
                                        arr
                                            .slice(0, index + 1)
                                            .join("/");

                                    const isLast =
                                        index === arr.length - 1;

                                    return (

                                        <span key={path}>

                                            {" / "}

                                            {
                                                isLast ? (

                                                    <span className="breadcrumb-current">
                                                        {part}
                                                    </span>

                                                ) : (

                                                    <span
                                                        className="breadcrumb-link"

                                                        onClick={() =>
                                                            navigate(
                                                                `/repository/${id}/tree/${branch}/${path}`
                                                            )
                                                        }
                                                    >
                                                        {part}
                                                    </span>
                                                )
                                            }

                                        </span>
                                    );
                                })
                        }

                    </div>

                    <button
                        className="edit-btn"
                        onClick={() =>
                            navigate(
                                `/repository/${id}/edit/${branch}/${encodeURIComponent(
                                    file.path || file.name
                                )}`
                            )
                        }
                    >
                        Edit File
                    </button>

                </div>

                {
                    location.state?.showPRBanner && (

                        <div className="pr-banner">

                            <div>

                                <h3>
                                    ✅ Changes committed
                                </h3>

                                <p>
                                    These changes are not merged yet.
                                    Open a Pull Request to apply them.
                                </p>

                            </div>

                            <button
                                className="open-pr-btn"

                                onClick={() => {

                                    navigate(
                                        `/repository/${id}`,
                                        {
                                            state: {
                                                activeTab: "Pull Requests",
                                                branch,
                                            }
                                        }
                                    );
                                }}
                            >
                                Open Pull Request
                            </button>

                        </div>
                    )
                }

                <div className="file-viewer-content">

                    <SyntaxHighlighter

                        language={getLanguage(file.name)}

                        style={vscDarkPlus}

                        showLineNumbers={true}

                        customStyle={{

                            margin: 0,

                            borderRadius: "12px",

                            fontSize: "14px",

                            background: "#0d1117",

                            padding: "24px",
                        }}
                    >

                        {file.content || "Empty file"}

                    </SyntaxHighlighter>

                </div>

            </div>
        </>
    );
};

export default FileViewer;