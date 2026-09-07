import api from "./axiosapis";

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password }); 
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const register = async (username, password, roleId) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      password,
      type_user: roleId,
    });
    return response.data;   
    } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  } 
};

