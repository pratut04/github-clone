const buildFileTree =
    (files) => {

        const root = {};

        files.forEach((file) => {

            const parts =
                (file.path || file.name)
                    .split("/");

            let current = root;

            parts.forEach(
                (part, index) => {

                    const isLast =
                        index ===
                        parts.length - 1;

                    const isFolder =
                        file.type === "folder";

                    if (!current[part]) {

                        current[part] = {

                            type:
                                isLast
                                    ? file.type
                                    : "folder",

                            children: {},

                            fileData:
                                isLast
                                    ? file
                                    : null,
                        };
                    }

                    /* =========================
                       MOVE INSIDE FOLDER
                    ========================= */

                    if (
                        current[part].type ===
                        "folder"
                    ) {

                        current =
                            current[part]
                                .children;
                    }
                }
            );
        });

        return root;
    };

export default buildFileTree;