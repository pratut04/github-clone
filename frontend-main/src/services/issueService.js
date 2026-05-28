import axios from "axios";

const API =
  import.meta.env.VITE_API_URL;

/* =========================
   CREATE ISSUE
========================= */

export const createIssue =
  async (data) => {

    const response =
      await axios.post(
        `${API}/issue/create`,
        data
      );

    return response.data;
  };

/* =========================
   FETCH REPOSITORY ISSUES
========================= */

export const fetchIssues =
  async (repoId) => {

    const response =
      await axios.get(
        `${API}/issue/repository/${repoId}`
      );

    return response.data;
  };

/* =========================
   UPDATE ISSUE
========================= */

export const updateIssue =
  async (id, data) => {

    const response =
      await axios.put(
        `${API}/issue/update/${id}`,
        data
      );

    return response.data;
  };

/* =========================
   CLOSE ISSUE
========================= */

export const closeIssue =
  async (id) => {

    const response =
      await axios.patch(
        `${API}/issue/close/${id}`
      );

    return response.data;
  };

/* =========================
   DELETE ISSUE
========================= */

export const deleteIssue =
  async (id) => {

    const response =
      await axios.delete(
        `${API}/issue/delete/${id}`
      );

    return response.data;
  };