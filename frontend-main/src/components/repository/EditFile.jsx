import {
    useEffect,
    useState,
} from "react";
import Editor
    from "@monaco-editor/react";
import CommitModal
    from "./CommitModal";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import Navbar from "../Navbar";

import {
    fetchRepositoryById,
    updateRepositoryFile,
    fetchPullRequests,
    createPullRequest
} from "../../services/repoService";

import "./repository.css";

const EditFile = () => {

    const {
        id,
        branch,
        "*": rawFilePath
    } = useParams();
    const [showCommitModal,
        setShowCommitModal] =
        useState(false);

    const filePath =
        decodeURIComponent(
            rawFilePath || ""
        ).replace(/^\/+/, "");

    const navigate =
        useNavigate();

    const [loading,
        setLoading] =
        useState(true);

    const [file,
        setFile] =
        useState(null);

    const [content,
        setContent] =
        useState("");

    useEffect(() => {

        loadFile();

    }, [id, branch, filePath]);

    const loadFile =
        async () => {

            try {

                setLoading(true);

                const repo =
                    await fetchRepositoryById(id);

                const currentBranch =
                    repo.branches.find(
                        (b) =>
                            b.name === branch
                    );
                const branchFiles =
                    currentBranch?.files ||
                    repo.files ||
                    [];

                const foundFile =
                    branchFiles.find(
                        (f) =>

                            (f.path || f.name) ===
                            filePath
                    );

                setFile({
                    ...foundFile
                });

                setContent(
                    foundFile?.content || ""
                );

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        };
    const handleSave =
        async (message) => {

            try {



                await updateRepositoryFile(
                    id,
                    {
                        filePath,
                        content,
                        message,
                        branch,
                    }
                );

                if (branch !== "main") {

                    await createPullRequest({

                        repositoryId: id,

                        branch,

                        title: message,

                        description:
                            "New Pull Request",
                    });
                }

                navigate(
                    `/repository/${id}/blob/${branch}/${encodeURIComponent(filePath)}`,
                    {
                        state: {
                            showPRBanner:
                                branch !== "main",
                        }
                    }
                );

            } catch (err) {

                console.error(
                    "SAVE ERROR:",
                    err.response?.data ||
                    err.message
                );
            }
        };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="repo-loading">

                    Loading editor...

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


    const getLanguage = () => {

        const filename =
            file?.name?.toLowerCase() || "";

        if (
            filename.endsWith(".js")
        ) {
            return "javascript";
        }

        if (
            filename.endsWith(".jsx")
        ) {
            return "javascript";
        }

        if (
            filename.endsWith(".ts")
        ) {
            return "typescript";
        }

        if (
            filename.endsWith(".tsx")
        ) {
            return "typescript";
        }

        if (
            filename.endsWith(".css")
        ) {
            return "css";
        }

        if (
            filename.endsWith(".html")
        ) {
            return "html";
        }

        if (
            filename.endsWith(".json")
        ) {
            return "json";
        }

        if (
            filename.endsWith(".md")
        ) {
            return "markdown";
        }

        return "plaintext";
    };

    return (
        <>
            <Navbar />

            <div className="editor-page">

                <div className="editor-header">

                    <h1>
                        Edit {file.name}
                    </h1>

                    <button
                        className="save-btn"
                        onClick={() =>
                            setShowCommitModal(true)
                        }
                    >
                        Save File
                    </button>

                </div>

                <div className="editor-tabs">

                    <div className="editor-tab">

                        <span>
                            📄
                        </span>

                        {file.name}

                    </div>

                </div>

                <div className="editor-container">

                    <Editor

                        height="85vh"

                        theme="vs-dark"

                        language={getLanguage()}

                        value={content}

                        onChange={(value) =>
                            setContent(value || "")
                        }

                        options={{

                            fontSize: 14,

                            minimap: {
                                enabled: true,
                            },

                            automaticLayout: true,

                            wordWrap: "on",

                            scrollBeyondLastLine: false,

                            roundedSelection: true,

                            padding: {
                                top: 20,
                            },
                        }}
                    />

                </div>

            </div>
            {
                showCommitModal && (

                    <CommitModal

                        onClose={() =>
                            setShowCommitModal(false)
                        }

                        onCommit={async (message) => {

                            setShowCommitModal(false);

                            await handleSave(message);
                        }}
                    />
                )
            }
        </>
    );
};

export default EditFile;