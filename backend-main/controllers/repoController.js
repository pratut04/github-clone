const mongoose = require("mongoose");

const Repository =
  require("../models/repoModel");

const User =
  require("../models/userModel");

const Issue =
  require("../models/issueModel");

const PullRequest =
  require("../models/pullRequestModel");

const Notification =
  require(
    "../models/notificationModel"
  );

const toggleStar =
  async (req, res) => {

    try {

      const {
        userId
      } = req.body;

      const repo =
        await Repository.findById(
          req.params.id
        );

      if (!repo) {

        return res.status(404)
          .json({
            message:
              "Repository not found"
          });

      }

      const alreadyStarred =
        repo.stars.includes(
          userId
        );

      if (alreadyStarred) {

        repo.stars =
          repo.stars.filter(
            id =>
              id.toString() !==
              userId
          );

      } else {

        repo.stars.push(
          userId
        );

        if (
          String(repo.owner) !==
          String(userId)
        ) {

          await Notification.create({

            recipient:
              repo.owner,

            sender:
              userId,

            message:
              `starred ${repo.name}`

          });

        }

      }

      await repo.save();

      res.json({

        stars:
          repo.stars.length,

        starred:
          !alreadyStarred

      });

    } catch (err) {

      res.status(500)
        .json({
          message:
            err.message
        });

    }

  };

/* =========================
   CREATE REPOSITORY
========================= */

async function createRepository(
  req,
  res
) {

  const {
    owner,
    name,
    issues,
    description,
    visibility,
  } = req.body;

  try {

    if (!name) {

      return res.status(400)
        .json({
          error:
            "Repository name is required!",
        });

    }

    if (
      !mongoose.Types.ObjectId
        .isValid(owner)
    ) {

      return res.status(400)
        .json({
          error:
            "Invalid User ID!",
        });

    }

    const newRepository =
      new Repository({

        name,

        description,

        visibility,

        owner,

        branches: [
          {
            name: "main",

            files: [

              {
                name: "README.md",

                type: "file",

                path: "README.md",

                content:
                  `# ${name}

${description}
`,
              },

              {
                name: "src",

                type: "folder",

                path: "src",
              },

              {
                name: "public",

                type: "folder",

                path: "public",
              },
            ],

            commits: [],
          },
        ],

        issues,
      });

    const result =
      await newRepository.save();

    res.status(201).json({

      message:
        "Repository created!",

      repositoryID:
        result._id,

      repository:
        result,
    });

  } catch (err) {

    console.error(
      "Error during repository creation:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   GET ALL REPOSITORIES
========================= */

async function getAllRepositories(
  req,
  res
) {

  try {

    const {
      search
    } = req.query;

    const repositories =
      await Repository.find({

        visibility: true,

        name: {
          $regex:
            search || "",
          $options: "i"
        }

      })
        .populate("owner")
        .populate("issues");

    res.json(
      repositories
    );

  } catch (err) {

    console.error(
      "Error during fetching repositories:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   FETCH REPOSITORY BY ID
========================= */

async function fetchRepositoryById(
  req,
  res
) {

  const { id } =
    req.params;

  try {

    const repository =
      await Repository.findById(id)

        .populate("owner")

        .populate("issues")

        .populate({
          path: "forkedFrom",
          populate: {
            path: "owner"
          }
        });

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found!",
        });

    }

    const forkCount =
      await Repository.countDocuments({

        forkedFrom:
          repository._id

      });

    console.log(
      "REPO:",
      repository.name
    );

    console.log(
      "FORK COUNT:",
      forkCount
    );

    res.status(200).json({

      ...repository.toObject(),

      forkCount

    });

  } catch (err) {

    console.error(
      "Error during fetching repository:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}
/* =========================
   FETCH REPOSITORY BY NAME
========================= */

async function fetchRepositoryByName(
  req,
  res
) {

  const { name } =
    req.params;

  try {

    const repository =
      await Repository.find({
        name,
      })
        .populate("owner")
        .populate("issues");

    res.json(repository);

  } catch (err) {

    console.error(
      "Error during fetching repository:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   FETCH USER REPOSITORIES
========================= */

async function fetchRepositoriesForCurrentUser(
  req,
  res
) {

  const { userID } =
    req.params;

  try {

    const repositories =
      await Repository.find({

        owner:
          new mongoose.Types.ObjectId(
            userID
          ),

      });

    return res.status(200)
      .json({

        message:
          "Repositories fetched successfully!",

        repositories:
          repositories || [],
      });

  } catch (err) {

    console.error(
      "Error during fetching user repositories:",
      err.message
    );

    return res.status(500)
      .json({
        error:
          "Server error",
      });

  }
}

/* =========================
   UPDATE REPOSITORY
========================= */

async function updateRepositoryById(
  req,
  res
) {

  const { id } =
    req.params;

  const {
    description,
  } = req.body;

  try {

    const repository =
      await Repository.findById(id);

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found!",
        });

    }

    repository.description =
      description;

    const updatedRepository =
      await repository.save();

    res.json({

      message:
        "Repository updated successfully!",

      repository:
        updatedRepository,
    });

  } catch (err) {

    console.error(
      "Error during updating repository:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   TOGGLE VISIBILITY
========================= */

async function toggleVisibilityById(
  req,
  res
) {

  const { id } =
    req.params;

  try {

    const repository =
      await Repository.findById(id);

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found!",
        });

    }

    repository.visibility =
      !repository.visibility;

    const updatedRepository =
      await repository.save();

    res.json({

      message:
        "Repository visibility toggled successfully!",

      repository:
        updatedRepository,
    });

  } catch (err) {

    console.error(
      "Error during toggling visibility:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   DELETE REPOSITORY
========================= */

async function deleteRepositoryById(
  req,
  res
) {

  const { id } =
    req.params;

  try {

    const repository =
      await Repository.findByIdAndDelete(
        id
      );

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found!",
        });

    }

    res.json({

      message:
        "Repository deleted successfully!",
    });

  } catch (err) {

    console.error(
      "Error during deleting repository:",
      err.message
    );

    res.status(500).send(
      "Server error"
    );

  }
}

/* =========================
   ADD FILE TO REPOSITORY
========================= */

async function addFileToRepository(
  req,
  res
) {

  try {

    const {
      name,
      type,
      path,
      content,
      branch = "main",
    } = req.body;

    const repository =
      await Repository.findById(
        req.params.id
      );

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found",
        });

    }

    const currentBranch =
      repository.branches.find(
        (b) =>
          b.name === branch
      );

    currentBranch.files.push({

      name,

      type,

      path,

      content,
    });



    repository.markModified(
      "branches"
    );

    await repository.save();

    res.status(200).json({

      message:
        "File added",

      repository,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed to add file",
    });

  }
}

async function updateRepositoryFile(
  req,
  res
) {

  try {

    const repository =
      await Repository.findById(
        req.params.id
      );
    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "PARAMS:",
      req.params
    );
    if (!repository) {

      return res.status(404).json({
        error:
          "Repository not found",
      });

    }

    const branchName =
      req.body.branch || "main";

    const currentBranch =
      repository.branches.find(
        (b) =>
          b.name === branchName
      );

    console.log(
      "BRANCH RECEIVED:",
      req.body.branch
    );

    console.log(
      "ALL BRANCHES:",
      repository.branches.map(
        (b) => b.name
      )
    );

    if (!currentBranch) {

      return res.status(404).json({
        error: "Branch not found",
      });
    }

    const decodedPath =
      decodeURIComponent(
        req.body.filePath
      );

    const fileIndex =
      currentBranch.files.findIndex(
        (f) =>

          (f.path || f.name) ===
          decodedPath
      );

    if (fileIndex === -1) {

      return res.status(404).json({
        error: "File not found",
      });
    }

    const oldContent =
      currentBranch.files[fileIndex].content;

    /* CREATE NEW FILE OBJECT */
    currentBranch.files[fileIndex].content =
      req.body.content;
    /* ADD COMMIT */


    repository.markModified(
      "branches"
    );
    currentBranch.commits.push({

      message:
        req.body.message,

      filePath:
        req.body.filePath,

      oldContent,

      newContent:
        req.body.content,

      committedAt:
        new Date(),
    });

    console.log(
      currentBranch.commits
    );

    await repository.save();

    console.log(
      "FILE UPDATED SUCCESSFULLY"
    );

    res.status(200).json({

      message:
        "File updated",

      repository,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed to update file",
    });

  }
}
async function restoreCommit(
  req,
  res
) {

  try {

    const repository =
      await Repository.findById(
        req.params.id
      );

    if (!repository) {

      return res.status(404)
        .json({
          error:
            "Repository not found",
        });
    }

    const mainBranch =
      repository.branches.find(
        (b) =>
          b.name === "main"
      );

    const currentBranch =
      repository.branches.find(
        (b) =>
          b.name === req.body.branch
      );

    const commit =
      currentBranch.commits.find(
        (c) =>
          c._id.toString() ===
          req.params.commitId
      );

    if (!commit) {

      return res.status(404)
        .json({
          error:
            "Commit not found",
        });
    }

    const file =
      mainBranch.files.find(
        (f) =>

          (f.path || f.name) ===
          commit.filePath
      );

    if (!file) {

      return res.status(404)
        .json({
          error:
            "File not found",
        });
    }

    file.content =
      commit.oldContent;

    mainBranch.commits.push({

      message:
        `Restored ${commit.filePath}`,

      filePath:
        commit.filePath,

      oldContent:
        commit.newContent,

      newContent:
        commit.oldContent,
    });

    repository.markModified(
      "branches"
    );

    await repository.save();

    res.status(200).json({

      message:
        "Version restored successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed to restore version",
    });
  }
}
async function createPullRequest(
  req,
  res
) {

  try {

    const {
      repositoryId,
      title,
      description,
      changedFiles,
      branch,
    } = req.body;

    const repository =
      await Repository.findById(
        repositoryId
      );

    const currentBranch =
      repository.branches.find(
        (b) =>
          b.name === branch
      );


    const allBranchFiles =
      req.body.changedFiles || [];

    const pr =
      await PullRequest.create({

        repositoryId,

        branch,

        title,

        description,

        changedFiles:
          allBranchFiles,
      });

    console.log(
      "PR CREATED"
    );
    console.log(req.body);

    return res.status(201)
      .json(pr);

  } catch (err) {

    console.error(err);

    res.status(500)
      .json({
        error:
          "Failed to create PR"
      });
  }
}

async function mergePullRequest(
  req,
  res
) {

  try {

    const { prId } =
      req.params;

    const pr =
      await PullRequest.findById(prId);

    if (!pr) {

      return res.status(404)
        .json({
          error:
            "PR not found"
        });
    }

    const repository =
      await Repository.findById(
        pr.repositoryId
      );

    const mainBranch =
      repository.branches.find(
        (b) =>
          b.name === "main"
      );


    for (const changedFile of pr.changedFiles) {

      const existingFile =
        mainBranch.files.find(
          (f) =>
            f.path === changedFile.filePath
        );

      /* =========================
         NEW FILE
      ========================= */

      if (!existingFile) {

        mainBranch.files.push({

          name:
            changedFile.filePath
              .split("/")
              .pop(),

          path:
            changedFile.filePath,

          type:
            "file",

          content:
            changedFile.newContent,
        });

        continue;
      }

      /* =========================
         CONFLICT DETECTION
      ========================= */

      const currentMainContent =
        existingFile.content || "";

      const featureBaseContent =
        changedFile.baseContent || "";

      const featureNewContent =
        changedFile.newContent || "";

      /*
         Conflict means:
         main changed AFTER branch created
      */

      const hasConflict =

        currentMainContent !== featureBaseContent &&

        currentMainContent !== featureNewContent;

      if (hasConflict) {

        return res.status(409).json({

          conflict: true,

          filePath:
            changedFile.filePath,

          mainContent:
            currentMainContent,

          featureContent:
            featureNewContent,

          prId:
            pr._id,
        });
      }

      /* =========================
         SAFE MERGE
      ========================= */

      existingFile.content =
        featureNewContent;
    }


    mainBranch.commits.push({

      message:
        `Merged PR: ${pr.title}`,

      filePath:
        "Multiple Files",

      oldContent:
        "",

      newContent:
        "Merged feature branch",

      committedAt:
        new Date(),
    });



    repository.markModified(
      "branches"
    );

    await repository.save();

    pr.status =
      "merged";

    await pr.save();

    res.json({
      message:
        "PR merged!"
    });

  } catch (err) {

    console.error(err);

    res.status(500)
      .json({
        error:
          "Merge failed"
      });
  }
}
async function getPullRequests(
  req,
  res
) {

  try {

    const prs =
      await PullRequest.find({

        repositoryId:
          req.params.repositoryId,
      });

    res.json(prs);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed to fetch PRs",
    });
  }
}

async function addReviewComment(
  req,
  res
) {

  try {

    const { prId } =
      req.params;

    const {
      username,
      comment,
    } = req.body;

    const pr =
      await PullRequest.findById(
        prId
      );

    if (!pr) {

      return res.status(404)
        .json({
          error:
            "PR not found",
        });
    }

    pr.reviewComments.push({

      username,

      comment,
    });

    await pr.save();

    res.json({
      message:
        "Comment added",
      pr,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed to add comment",
    });
  }
}

async function createBranch(
  req,
  res
) {

  try {

    const repository =
      await Repository.findById(
        req.params.id
      );

    const {
      branchName,
    } = req.body;

    const mainBranch =
      repository.branches.find(
        (b) =>
          b.name === "main"
      );

    repository.branches.push({

      name: branchName,

      files:
        JSON.parse(
          JSON.stringify(
            mainBranch.files
          )
        ),

      commits: [],
    });
    repository.markModified(
      "branches"
    );

    await repository.save();

    res.json({
      success: true,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
}


async function updatePullRequest(
  req,
  res
) {

  try {

    const pr =
      await PullRequest.findById(
        req.params.prId
      );

    if (!pr) {

      return res.status(404)
        .json({
          error:
            "PR not found",
        });
    }

    pr.changedFiles =
      req.body.changedFiles;

    await pr.save();

    res.json(pr);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed to update PR",
    });
  }
}

async function resolveMergeConflict(
  req,
  res
) {

  try {

    const pr =
      await PullRequest.findById(
        req.params.prId
      );

    if (!pr) {

      return res.status(404)
        .json({
          error:
            "PR not found",
        });
    }

    const repository =
      await Repository.findById(
        pr.repositoryId
      );

    const mainBranch =
      repository.branches.find(
        (b) =>
          b.name === "main"
      );

    const {
      resolvedContent,
      filePath,
    } = req.body;

    const existingFile =
      mainBranch.files.find(
        (f) =>
          f.path === filePath
      );

    /* =========================
       UPDATE FILE
    ========================= */

    if (existingFile) {

      existingFile.content =
        resolvedContent;

    } else {

      mainBranch.files.push({

        name:
          filePath
            .split("/")
            .pop(),

        path:
          filePath,

        type:
          "file",

        content:
          resolvedContent,
      });
    }

    /* =========================
       COMMIT
    ========================= */

    mainBranch.commits.push({

      message:
        `Resolved conflict: ${pr.title}`,

      filePath,

      oldContent:
        "",

      newContent:
        resolvedContent,

      committedAt:
        new Date(),
    });

    /* =========================
       CLOSE PR
    ========================= */

    pr.status =
      "merged";

    repository.markModified(
      "branches"
    );

    await repository.save();

    await pr.save();

    res.json({

      success: true,

      message:
        "Conflict resolved successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500)
      .json({
        error:
          "Failed to resolve conflict",
      });
  }
}

async function forkRepository(
  req,
  res
) {

  try {

    const {
      owner
    } = req.body;

    const originalRepo =
      await Repository.findById(
        req.params.id
      );

    if (!originalRepo) {

      return res.status(404)
        .json({
          error:
            "Repository not found"
        });
    }

    const forkedRepo =

    new Repository({

      name:
        originalRepo.name,

      description:
        originalRepo.description,

      visibility:
        originalRepo.visibility,

      owner,

      forkedFrom:
        originalRepo._id,

      files:
        JSON.parse(
          JSON.stringify(
            originalRepo.files
          )
        ),

      commits:
        JSON.parse(
          JSON.stringify(
            originalRepo.commits
          )
        ),

      branches:
        JSON.parse(
          JSON.stringify(
            originalRepo.branches
          )
        ),

      issues: [],
    });

    await forkedRepo.save();

    if (
      String(originalRepo.owner) !==
      String(owner)
    ) {

      await Notification.create({

        recipient:
          originalRepo.owner,

        sender:
          owner,

        message:
          `forked ${originalRepo.name}`

      });

    }

    res.status(201).json({

      message:
        "Repository forked successfully",

      repository:
        forkedRepo,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed to fork repository",
    });
  }
}
async function getProfileStats(
  req,
  res
) {

  try {

    const {
      userId
    } = req.params;

    const repositories =
      await Repository.find({
        owner: userId
      });

    const repoCount =
      repositories.length;

    const starsReceived =
      repositories.reduce(
        (total, repo) =>
          total +
          (repo.stars?.length || 0),
        0
      );

    const forksReceived =
      await Repository.countDocuments({
        forkedFrom: {
          $in:
            repositories.map(
              repo => repo._id
            )
        }
      });

    const pullRequestsCreated =
      await PullRequest.countDocuments({
        createdBy: userId
      });

    res.json({

      repositories:
        repoCount,

      stars:
        starsReceived,

      forks:
        forksReceived,

      commits:
        pullRequestsCreated

    });
  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed to fetch stats"
    });

  }

}



module.exports = {

  createRepository,

  getAllRepositories,

  fetchRepositoryById,

  fetchRepositoryByName,

  fetchRepositoriesForCurrentUser,

  updateRepositoryById,

  toggleVisibilityById,

  deleteRepositoryById,

  addFileToRepository,

  updateRepositoryFile,
  restoreCommit,
  createPullRequest,
  mergePullRequest,
  getPullRequests,
  addReviewComment,
  createBranch,
  updatePullRequest,
  resolveMergeConflict,
  forkRepository,
  toggleStar,
  getProfileStats,
};
