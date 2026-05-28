const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue =
  require("../models/issueModel");

/* =========================
   CREATE ISSUE
========================= */

async function createIssue(
  req,
  res
) {

  try {

    const {
      title,
      description,
      repository,
      creator,
    } = req.body;

    if (
      !title ||
      !repository ||
      !creator
    ) {

      return res.status(400)
        .json({
          error:
            "Missing required fields",
        });
    }

    const issue =
      await Issue.create({
        title,
        description,
        repository,
        creator,
      });

    const populatedIssue =
      await Issue.findById(
        issue._id
      )
        .populate("creator")
        .populate("repository");

    res.status(201).json(
      populatedIssue
    );

  } catch (err) {

    console.error(
      "Issue Creation Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to create issue",
    });

  }
}

/* =========================
   FETCH ISSUES
========================= */

async function fetchIssues(
  req,
  res
) {

  try {

    const { repoId } =
      req.params;

    const issues =
      await Issue.find({
        repository: repoId,
      })

        .populate(
          "creator"
        )

        .populate(
          "repository"
        )

        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      issues
    );

  } catch (err) {

    console.error(
      "Issue Fetch Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to fetch issues",
    });

  }
}

/* =========================
   FETCH ISSUE BY ID
========================= */

async function getIssueById(
  req,
  res
) {

  try {

    const issue =
      await Issue.findById(
        req.params.id
      )

        .populate(
          "creator"
        )

        .populate(
          "repository"
        );

    if (!issue) {

      return res.status(404)
        .json({
          error:
            "Issue not found",
        });
    }

    res.status(200).json(
      issue
    );

  } catch (err) {

    console.error(
      "Issue Fetch Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to fetch issue",
    });

  }
}

/* =========================
   UPDATE ISSUE
========================= */

async function updateIssueById(
  req,
  res
) {

  try {

    const issue =
      await Issue.findById(
        req.params.id
      );

    if (!issue) {

      return res.status(404)
        .json({
          error:
            "Issue not found",
        });
    }

    const {
      title,
      description,
      status,
    } = req.body;

    if (title)
      issue.title = title;

    if (description)
      issue.description =
        description;

    if (status)
      issue.status = status;

    await issue.save();

    res.status(200).json({
      message:
        "Issue updated successfully",
      issue,
    });

  } catch (err) {

    console.error(
      "Issue Update Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to update issue",
    });

  }
}

/* =========================
   CLOSE ISSUE
========================= */

async function closeIssue(
  req,
  res
) {

  try {

    const issue =
      await Issue.findById(
        req.params.id
      );

    if (!issue) {

      return res.status(404)
        .json({
          error:
            "Issue not found",
        });
    }

    issue.status =
      "closed";

    await issue.save();

    res.status(200).json({
      message:
        "Issue closed successfully",
      issue,
    });

  } catch (err) {

    console.error(
      "Close Issue Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to close issue",
    });

  }
}

/* =========================
   DELETE ISSUE
========================= */

async function deleteIssueById(
  req,
  res
) {

  try {

    const issue =
      await Issue.findByIdAndDelete(
        req.params.id
      );

    if (!issue) {

      return res.status(404)
        .json({
          error:
            "Issue not found",
        });
    }

    res.status(200).json({
      message:
        "Issue deleted successfully",
    });

  } catch (err) {

    console.error(
      "Delete Issue Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to delete issue",
    });

  }
}

module.exports = {
  createIssue,
  fetchIssues,
  getIssueById,
  updateIssueById,
  closeIssue,
  deleteIssueById,
};