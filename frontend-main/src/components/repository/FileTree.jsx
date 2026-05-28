
import {
    useState
} from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import { getFileIcon } from "../../utils/fileIcons";

const TreeNode = ({
    nodeName,
    node,
    repositoryId,
    branch,
    currentPath = "",
}) => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const fullPath =
        currentPath
            ? `${currentPath}/${nodeName}`
            : nodeName;

    const [open,
        setOpen] =
        useState(
            location.pathname.includes(fullPath)
        );
    /* =========================
       FOLDER
    ========================= */

    if (

        node.type === "folder" ||

        Object.keys(
            node.children || {}
        ).length > 0
    ) {

        return (

            <div className="tree-node">

                <div
                    className={`tree-folder ${location.pathname.includes(fullPath)
                        ? "active-tree-folder"
                        : ""
                        }`}

                    onClick={() => {

                        setOpen(!open);

                        navigate(
                            `/repository/${repositoryId}/tree/${branch}/${encodeURIComponent(fullPath)}`
                        );
                    }}
                >

                    <span className="tree-icon">
                        {getFileIcon(nodeName, true, open)}
                    </span>

                    <>
                        <span className="folder-arrow">
                            {open ? "⌄" : "›"}
                        </span>

                        <span>
                            {nodeName}
                        </span>
                    </>

                </div>

                {
                    open && (

                        <div className="tree-children">

                            {
                                Object.entries(
                                    node.children
                                ).map(
                                    ([childName,
                                        childNode]) => (

                                        <TreeNode
                                            key={childName}

                                            nodeName={childName}

                                            node={childNode}

                                            repositoryId={repositoryId}

                                            branch={branch}

                                            currentPath={fullPath}
                                        />
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>
        );
    }

    /* =========================
       FILE
    ========================= */

    return (

        <div

            className={`tree-file ${location.pathname.includes(fullPath)
                ? "active-tree-file"
                : ""
                }`}

            onClick={() =>
                navigate(
                    `/repository/${repositoryId}/blob/${branch}/${encodeURIComponent(fullPath)}`
                )
            }
        >

            <span className="tree-icon">
                {getFileIcon(nodeName)}
            </span>

            <span>
                {nodeName}
            </span>

        </div>
    );
};

/* =========================
   FILE TREE ROOT
========================= */

const FileTree = ({
    tree,
    repositoryId,
    branch,
}) => {

    return (

        <div className="file-tree">

            {
                Object.entries(tree)
                    .map(
                        ([name, node]) => (

                            <TreeNode
                                key={name}

                                nodeName={name}

                                node={node}

                                repositoryId={repositoryId}

                                branch={branch}
                            />
                        )
                    )
            }

        </div>
    );
};

export default FileTree;