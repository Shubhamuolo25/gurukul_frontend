import network from "./network";

// Remove all Authorization header logic, rely only on httpOnly cookie

async function serverLogout() {
  try {
    await network.post("/auth/logout"); // Backend should clear the cookie
  } catch (e) {}
}

export const getUsers = async (page, limit) => {
  try {
    return await network.get(`/users?page=${page}&limit=${limit}`);
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      await serverLogout();
    }
    throw err;
  }
};

export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    return await network.get(
      `/users/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      await serverLogout();
    }
    throw err;
  }
};

export const deleteUserById = async (id) => {
  try {
    return await network.delete(`/users/${id}`);
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      await serverLogout();
    }
    throw err;
  }
};

export const createUser = async (formData) => {
  try {
    const res = await network.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      await serverLogout();
    }
    throw err;
  }
};