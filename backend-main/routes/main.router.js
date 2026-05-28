const express =
  require("express");

const userRouter =
  require("./user.router");

const repoRouter =
  require("./repo.router");

const issueRouter =
  require("./issue.router");

const authRouter =
  require("./auth.router");

const mainRouter =
  express.Router();

mainRouter.use(authRouter);

mainRouter.use(userRouter);

mainRouter.use(repoRouter);

mainRouter.use(issueRouter);

mainRouter.get(
  "/",
  (req, res) => {

    res.send(
      "GitHub Clone API"
    );

  }
);

module.exports =
  mainRouter;