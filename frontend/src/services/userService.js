import { API_BASE_URL } from "./apiConfig";

// Get authentication headers
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Handle API responses
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

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

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// Get logged-in user's profile
export async function getMyProfile() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

// Create user profile
export async function createProfile(profileData) {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      full_name: profileData.full_name,
      phone: profileData.phone || "",
      bio: profileData.bio || "",
    }),
  });

  return handleResponse(response);
}

// Update user profile
export async function updateProfile(profileData) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      full_name: profileData.full_name,
      phone: profileData.phone,
      bio: profileData.bio,
    }),
  });

  return handleResponse(response);
}

// Ensure the logged-in user has a profile
export async function ensureMyProfile(profileData = {}) {
  try {
    return await getMyProfile();
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }

    if (!profileData.full_name?.trim()) {
      throw new Error(
        "Profile not found. Please provide your full name to create one."
      );
    }

    return await createProfile({
      full_name: profileData.full_name.trim(),
      phone: profileData.phone || "",
      bio: profileData.bio || "",
    });
  }
}
