const mongoose =
  require("mongoose");

const { Schema } =
  mongoose;

/* =========================
   FILE SCHEMA
========================= */

const FileSchema =
  new Schema({

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,

      enum: [
        "file",
        "folder",
      ],

      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

  });

/* =========================
   COMMIT SCHEMA
========================= */

const CommitSchema =
  new Schema({

    message: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    oldContent: {
      type: String,
      default: "",
    },

    newContent: {
      type: String,
      default: "",
    },

    committedAt: {
      type: Date,
      default: Date.now,
    },

  });

/* =========================
   BRANCH SCHEMA
========================= */

const BranchSchema =
  new Schema({

    name: {
      type: String,
      required: true,
    },

    files: [FileSchema],

    commits: [CommitSchema],

    createdAt: {
      type: Date,
      default: Date.now,
    },

  });

/* =========================
   REPOSITORY SCHEMA
========================= */

const RepositorySchema =
  new Schema({

    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    files: [FileSchema],

    commits: [CommitSchema],

    branches: [BranchSchema],

    visibility: {
      type: Boolean,
      default: true,
    },

    owner: {
      type:
        Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    issues: [
      {
        type:
          Schema.Types.ObjectId,

        ref: "Issue",
      },
    ],

  },
  {
    timestamps: true,
  });

module.exports =
  mongoose.models.Repository ||

  mongoose.model(
    "Repository",
    RepositorySchema
  );