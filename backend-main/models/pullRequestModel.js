const mongoose =
    require("mongoose");

const PullRequestSchema =
    new mongoose.Schema({

        repositoryId: {
            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Repository",
        },

        title: String,

        description: String,

        changedFiles: [
            {
                filePath: String,

                oldContent: String,

                newContent: String,
            }
        ],

        status: {
            type: String,

            enum: [
                "open",
                "merged",
                "closed"
            ],

            default: "open",
        },

        createdAt: {
            type: Date,

            default: Date.now,
        },

        reviewComments: [
            {
                username: String,

                comment: String,

                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        branch: {
            type: String,
            default: "main",
        },
    });

module.exports =
    mongoose.model(
        "PullRequest",
        PullRequestSchema
    );