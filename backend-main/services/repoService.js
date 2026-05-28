const Repository =
  require("../models/repoModel");

const getRepositoriesByUser =
  async (userId) => {

    return await Repository.find({
      owner: userId
    });

  };

const createRepository =
  async (repoData) => {

    return await Repository.create(
      repoData
    );

  };

module.exports = {
  getRepositoriesByUser,
  createRepository
};