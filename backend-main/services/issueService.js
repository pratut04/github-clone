const Issue =
  require("../models/issueModel");

const getAllIssues =
  async () => {

    return await Issue.find();

  };

module.exports = {
  getAllIssues
};