import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost";

export default function JoinGroup() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvite();
  }, [token]);

  async function loadInvite() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/groups/invites/${token}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid invitation"
        );
      }

      setInvite(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    const accessToken =
      localStorage.getItem("access_token");

    if (!accessToken) {
      // Save invitation so we can continue after login
      localStorage.setItem(
        "pending_invite_token",
        token
      );

      navigate("/login");
      return;
    }

    try {
      setJoining(true);
      setError("");

      const response = await fetch(
        `${API_URL}/groups/invites/${token}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to join group"
        );
      }

      // Invitation completed
      localStorage.removeItem(
        "pending_invite_token"
      );

      navigate(`/groups/${data.group_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading invitation...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900">
            Invitation unavailable
          </h1>

          <p className="text-red-500 mt-3">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        <div className="text-5xl mb-4">
          👥
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          You're invited!
        </h1>

        <p className="text-gray-500 mt-2">
          You've been invited to join
        </p>

        <h2 className="text-xl font-semibold mt-3">
          {invite.group_name}
        </h2>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p>
            Invitation uses:{" "}
            <strong>
              {invite.used_count} / {invite.max_uses}
            </strong>
          </p>
        </div>

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
        >
          {joining ? "Joining..." : "Join Group"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Secure invitation powered by SmartSplit
        </p>
      </div>
    </div>
  );
}