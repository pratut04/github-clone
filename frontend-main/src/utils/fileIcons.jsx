import {
    FaReact,
    FaJs,
    FaCss3Alt,
    FaHtml5,
    FaFolder,
    FaFolderOpen,
    FaFileAlt
} from "react-icons/fa";

import {
    SiJson,
    SiTypescript
} from "react-icons/si";

import {
    VscFileCode
} from "react-icons/vsc";

export const getFileIcon = (
    fileName,
    isFolder = false,
    open = false
) => {

    if (isFolder) {

        return open
            ? <FaFolderOpen color="#dcb67a" />
            : <FaFolder color="#dcb67a" />;
    }

    const lower =
        fileName.toLowerCase();

    if (lower.endsWith(".jsx")) {

        return <FaReact color="#61dafb" />;
    }

    if (lower.endsWith(".js")) {

        return <FaJs color="#f7df1e" />;
    }

    if (lower.endsWith(".css")) {

        return <FaCss3Alt color="#264de4" />;
    }

    if (lower.endsWith(".html")) {

        return <FaHtml5 color="#e34c26" />;
    }

    if (lower.endsWith(".json")) {

        return <SiJson color="#f1c40f" />;
    }

    if (lower.endsWith(".ts")) {

        return <SiTypescript color="#3178c6" />;
    }

    if (
        lower === "package.json"
    ) {

        return <VscFileCode color="#8cc84b" />;
    }

    return <FaFileAlt color="#8b949e" />;
};