import { useState } from "react";

import {
    addFileToRepository
} from "../../services/repoService";

import "./repository.css";

const CreateFileModal = ({
    repositoryId,
    branch,
    onClose,
    onCreated,
}) =>{

    const [name, setName] =
        useState("");

    const [type, setType] =
        useState("file");

    const [content, setContent] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleCreate =
        async () => {

            if (!name.trim()) {
                return;
            }

            try {

                setLoading(true);

                const normalizedPath =
                    name
                        .split("/")
                        .map(
                            (part, index) => {

                                /* =========================
                                   KEEP FILE NAME SAME
                                ========================= */

                                const isFile =
                                    index ===
                                    name
                                        .split("/")
                                        .length - 1;

                                return isFile
                                    ? part
                                    : part.toLowerCase();
                            }
                        )
                        .join("/");

                await addFileToRepository(
                    repositoryId,
                    {
                        branch,
                        name:
                            name
                                .split("/")
                                .pop(),

                        type,

                        path: normalizedPath,

                        content,
                    }
                );
                onCreated();

                onClose();

            } catch (err) {

                console.error(
                    "Failed to create file:",
                    err
                );

            } finally {

                setLoading(false);

            }
        };

    return (

        <div className="modal-overlay">

            <div className="create-file-modal">

                <div className="modal-header">

                    <h2>
                        Create New
                        {type === "file"
                            ? " File"
                            : " Folder"}
                    </h2>

                    <button
                        className="close-modal-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="file-modal-group">

                    <label>
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) =>
                            setType(
                                e.target.value
                            )
                        }
                    >

                        <option value="file">
                            File
                        </option>

                        <option value="folder">
                            Folder
                        </option>

                    </select>

                </div>

                <div className="file-modal-group">

                    <label>
                        Path
                    </label>

                    <input
                        type="text"
                        placeholder={
                            type === "file"
                                ? "src/components/Navbar.jsx"
                                : "src/components"
                        }
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                    />

                </div>

                {type === "file" && (

                    <div className="file-modal-group">

                        <label>
                            Content
                        </label>

                        <textarea
                            placeholder="Write your file content..."
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                )}

                <div className="file-modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-btn"
                        onClick={handleCreate}
                        disabled={loading}
                    >

                        {loading
                            ? "Creating..."
                            : "Create"}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default CreateFileModal;