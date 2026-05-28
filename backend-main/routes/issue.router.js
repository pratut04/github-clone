const express =
  require("express");

const issueRouter =
  express.Router();

const issueController =
  require(
    "../controllers/issueController"
  );

/* =========================
   CREATE ISSUE
========================= */

issueRouter.post(
  "/issue/create",
  issueController.createIssue
);

/* =========================
   FETCH REPOSITORY ISSUES
========================= */

issueRouter.get(
  "/issue/repository/:repoId",
  issueController.fetchIssues
);

/* =========================
   FETCH ISSUE BY ID
========================= */

issueRouter.get(
  "/issue/:id",
  issueController.getIssueById
);

/* =========================
   UPDATE ISSUE
========================= */

issueRouter.put(
  "/issue/update/:id",
  issueController.updateIssueById
);

/* =========================
   CLOSE ISSUE
========================= */

issueRouter.patch(
  "/issue/close/:id",
  issueController.closeIssue
);

/* =========================
   DELETE ISSUE
========================= */

issueRouter.delete(
  "/issue/delete/:id",
  issueController.deleteIssueById
);

module.exports =
  issueRouter;