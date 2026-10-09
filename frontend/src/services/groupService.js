import { API_BASE_URL } from "./apiConfig";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
};


// ==========================================
// CREATE GROUP
// ==========================================

export const createGroup = (groupData) =>
  request("/groups/", {
    method: "POST",
    body: JSON.stringify(groupData),
  });


// ==========================================
// GET MY GROUPS
// ==========================================

export const getMyGroups = () =>
  request("/groups/my");


// ==========================================
// GET SINGLE GROUP
// ==========================================

export const getGroups = (groupId) =>
  request(`/groups/${groupId}`);


// ==========================================
// UPDATE GROUP
// ==========================================

export const updateGroup = (groupId, groupData) =>
  request(`/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(groupData),
  });


// ==========================================
// DELETE GROUP
// ==========================================

export const deleteGroup = (groupId) =>
  request(`/groups/${groupId}`, {
    method: "DELETE",
  });


// ==========================================
// GET GROUP MEMBERS
// ==========================================

export const getMembers = (groupId) =>
  request(`/groups/${groupId}/members`);


// ==========================================
// ADD MEMBER
// ==========================================

export const addMember = (groupId, userId) =>
  request(`/groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
    }),
  });


// ==========================================
// REMOVE MEMBER
// ==========================================

export const removeMember = (groupId, userId) =>
  request(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
