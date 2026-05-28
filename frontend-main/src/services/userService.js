import axios from "axios";

const API =
  import.meta.env.VITE_API_URL;

export const fetchUserProfile =
  async (userId) => {

    const response =
      await axios.get(
        `${API}/userProfile/${userId}`
      );

    return response.data;
  };

export const updateProfile =
  async (userId, data) => {

    const response =
      await axios.put(
        `${API}/updateProfile/${userId}`,
        data
      );

    return response.data;
  };

export const deleteProfile =
  async (userId) => {

    const response =
      await axios.delete(
        `${API}/deleteProfile/${userId}`
      );

    return response.data;
  };