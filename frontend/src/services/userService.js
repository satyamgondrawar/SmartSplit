
const token = localStorage.getItem("access_token");
const AUTH_API_URL = "http://localhost";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  console.log("User Service Response:", response.status, data);

  if (!response.ok) {
    let message = "Request failed";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail
        .map((error) => error.msg || JSON.stringify(error))
        .join(", ");
    } else if (data.detail) {
      message = JSON.stringify(data.detail);
    } else if (data.message) {
      message = data.message;
    }

    throw new Error(message);
  }

  return data;
}

// Get logged-in user's profile
export async function getMyProfile() {
  // const response = await fetch(`${USER_SERVICE_URL}/users/me`, {
  //   method: "GET",
  //   headers: getAuthHeaders(),
  // });
  const response = await fetch(`${AUTH_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

// Create user profile
export async function createProfile(profileData) {
  const response = await fetch(`${AUTH_API_URL}/auth/profile`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return handleResponse(response);
}

// Update user profile
export async function updateProfile(profileData) {
  const response = await fetch(`${AUTH_API_URL}/auth/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return handleResponse(response);
}

// Delete user profile
export async function deleteProfile() {
  const response = await fetch(`${AUTH_API_URL}/auth/profile`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}