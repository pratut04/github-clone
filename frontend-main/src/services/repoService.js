import axios from "axios";

const API =
  import.meta.env.VITE_API_URL;

export const fetchUserRepositories =
  async (userId) => {

    const response =
      await axios.get(
        `${API}/repo/user/${userId}`
      );

    return response.data;
  };

export const fetchAllRepositories =
  async () => {

    const response =
      await axios.get(
        `${API}/repo/all`
      );

    return response.data;
  };

export const createRepository =
  async (repoData) => {

    const response =
      await axios.post(
        `${API}/repo/create`,
        repoData
      );

    return response.data;
  };


export const fetchRepositoryById =
  async (id) => {

    const response =
      await axios.get(
        `${API}/repo/${id}`
      );

    return response.data;
  };

export const deleteRepository =
  async (id) => {

    const response =
      await axios.delete(
        `${API}/repo/delete/${id}`
      );

    return response.data;
  };

export const addFileToRepository =
  async (
    repositoryId,
    data
  ) => {

    const response =
      await axios.post(

        `${API}/repo/file/${repositoryId}`,

        data
      );

    return response.data;
  };


  export const updateRepositoryFile =
  async (id, data) => {

    const response =
      await axios.put(

        `${API}/repo/file/update/${id}`,

        data
      );

    return response.data;
  };

  export const restoreCommit =
  async (
    repositoryId,
    commitId,
    branch
  ) => {

    const response =
      await axios.patch(

        `${API}/repo/restore/${repositoryId}/${commitId}`,

        {
          branch,
        }
      );

    return response.data;
  };

  export const createPullRequest =
  async (data) => {

    const response =
      await axios.post(

        `${API}/repo/pr/create`,

        data
      );

    return response.data;
  };

export const mergePullRequest =
  async (prId) => {

    const response =
      await axios.patch(

        `${API}/repo/pr/merge/${prId}`
      );

    return response.data;
  };

  export const fetchPullRequests =
  async (repositoryId) => {

    const response =
      await axios.get(
        `${API}/repo/pr/${repositoryId}`
      );

    return response.data;
};

export const addReviewComment =
  async (prId, data) => {

    const response =
      await axios.post(

        `${API}/repo/pr/comment/${prId}`,

        data
      );

    return response.data;
  };