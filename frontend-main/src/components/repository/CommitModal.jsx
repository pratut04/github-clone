import {
    useState
} from "react";

import "./repository.css";

const CommitModal = ({
    onClose,
    onCommit,
}) => {

    const [message,
        setMessage] =
        useState("");

    return (

        <div className="modal-overlay">

            <div className="commit-modal">

                <h2>
                    Commit Changes
                </h2>

                <textarea
                    placeholder="Describe your changes..."
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                />

                <div className="commit-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="create-btn"
                        onClick={() =>
                            onCommit(message)
                        }
                    >
                        Commit
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CommitModal;