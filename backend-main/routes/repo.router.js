const express = require("express");

const repoRouter =
  express.Router();

const repoController =
  require("../controllers/repoController");

/* =========================
   CREATE REPOSITORY
========================= */

repoRouter.post(
  "/repo/create",
  repoController.createRepository
);

repoRouter.post(
  "/repo/file/:id",
  repoController.addFileToRepository
);
repoRouter.put(
  "/repo/file/:id",
  repoController.updateRepositoryFile
);
repoRouter.put(
  "/repo/file/update/:id",
  repoController.updateRepositoryFile
);

repoRouter.patch(
  "/repo/toggle/:id",
  repoController.toggleVisibilityById
);

repoRouter.patch(
  "/repo/restore/:id/:commitId",
  repoController.restoreCommit
);

repoRouter.post(
  "/repo/pr/create",
  repoController.createPullRequest
);

repoRouter.patch(
  "/repo/pr/merge/:prId",
  repoController.mergePullRequest
);
repoRouter.get(
  "/repo/pr/:repositoryId",
  repoController.getPullRequests
);
repoRouter.post(
  "/repo/pr/comment/:prId",
  repoController.addReviewComment
);

repoRouter.post(
  "/repo/branch/:id",
  repoController.createBranch
);

repoRouter.put(
  "/repo/pr/update/:prId",
  repoController.updatePullRequest
);
/* =========================
   GET ALL REPOSITORIES
========================= */

repoRouter.get(
  "/repo/all",
  repoController.getAllRepositories
);

/* =========================
   GET USER REPOSITORIES
========================= */

repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoriesForCurrentUser
);

/* =========================
   GET REPOSITORY BY NAME
========================= */

repoRouter.get(
  "/repo/name/:name",
  repoController.fetchRepositoryByName
);

/* =========================
   GET REPOSITORY BY ID
========================= */

repoRouter.get(
  "/repo/:id",
  repoController.fetchRepositoryById
);

/* =========================
   UPDATE REPOSITORY
========================= */

repoRouter.put(
  "/repo/update/:id",
  repoController.updateRepositoryById
);

/* =========================
   DELETE REPOSITORY
========================= */

repoRouter.delete(
  "/repo/delete/:id",
  repoController.deleteRepositoryById
);

/* =========================
   TOGGLE VISIBILITY
========================= */

repoRouter.patch(
  "/repo/toggle/:id",
  repoController.toggleVisibilityById
);

module.exports =
  repoRouter;