import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  User,
  Shield,
  UserPlus,
  Trash2,
  X,
  Link,
  Copy,
  Check,
} from "lucide-react";
const GROUP_API_URL = "http://localhost";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invite states
  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  // =========================
  // FETCH GROUP MEMBERS
  // =========================

  async function fetchGroup() {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

    // 1. Fetch actual group details
    const groupResponse = await fetch(
      `${GROUP_API_URL}/groups/${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const groupData = await groupResponse.json();

    if (!groupResponse.ok) {
      throw new Error(
        groupData.detail || "Failed to fetch group"
      );
    }

    // Set actual group data
    setGroup(groupData);

    // 2. Fetch group members
    const membersResponse = await fetch(
      `${GROUP_API_URL}/groups/${groupId}/members`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const membersData = await membersResponse.json();
    console.log("GROUP MEMBERS:", membersData);

    if (!membersResponse.ok) {
      throw new Error(
        membersData.detail || "Failed to fetch group members"
      );
    }

    setMembers(membersData);

  } catch (err) {
    console.error("Group details error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  // =========================
// DELETE GROUP
// =========================

  async function handleDeleteGroup() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${GROUP_API_URL}/groups/${groupId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete group"
        );
      }

      // Go back to dashboard after deletion
      navigate("/dashboard");

    } catch (err) {
      console.error("Delete group error:", err);
      alert(err.message);
    }
  }

  // =========================
  // CREATE INVITE
  // =========================

  async function createInviteLink() {
    try {
      setCreatingInvite(true);
      setInviteError("");
      setInviteLink("");
      setCopied(false);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${GROUP_API_URL}/groups/${groupId}/invites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expires_in_days: 7,
            max_uses: 20,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create invite"
        );
      }

      const link = `${window.location.origin}/join/${data.token}`;

      setInviteLink(link);
    } catch (err) {
      console.error("Create invite error:", err);
      setInviteError(err.message);
    } finally {
      setCreatingInvite(false);
    }
  }

  // =========================
  // COPY INVITE LINK
  // =========================

  async function copyInviteLink() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  // =========================
  // OPEN INVITE MODAL
  // =========================

  function openInviteModal() {
    setShowAddMember(true);
    setInviteLink("");
    setInviteError("");
    setCopied(false);

    createInviteLink();
  }

  // =========================
  // CLOSE INVITE MODAL
  // =========================

  function closeInviteModal() {
    setShowAddMember(false);
    setInviteLink("");
    setInviteError("");
    setCopied(false);
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">
          Loading group...
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* =========================
          GROUP HEADER
      ========================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Group information */}

          <div>
            <h1 className="text-3xl font-bold">
              {group?.name}
            </h1>

            {group?.description && (
              <p className="text-slate-400 mt-2">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Add Member */}
            <button
              onClick={openInviteModal}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl font-medium transition"
            >
              <UserPlus size={18} />
              Add Member
            </button>

            {/* Delete Group */}
            <button
              onClick={handleDeleteGroup}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2.5 rounded-xl font-medium transition"
            >
              <Trash2 size={18} />
              Delete Group
            </button>

          </div>

        </div>
      </div>

      {/* =========================
          MEMBERS
      ========================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        {/* Members header */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Group Members
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {members.length} member
              {members.length !== 1 ? "s" : ""}
            </p>
          </div>

          <User className="text-indigo-400" />

        </div>

        {/* Members list */}

        <div className="space-y-3">

          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl p-4"
            >

              {/* User */}

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User size={20} />
                </div>

                <div>
                  <p className="font-medium">
                    {member.full_name ||
                      member.name || `User ${member.user_id}`}
                  </p>

                  <p className="text-sm text-slate-400">
                    {member.email || "No email provided"}
                  </p>
                </div>

              </div>

              {/* Role */}

              {member.role && (
                <div className="flex items-center gap-1 text-sm text-indigo-400">

                  {member.role === "admin" && (
                    <Shield size={15} />
                  )}

                  {member.role}

                </div>
              )}

            </div>
          ))}

        </div>

        {/* Empty */}

        {members.length === 0 && (
          <p className="text-slate-400 text-center py-8">
            No members found.
          </p>
        )}

      </div>

      {/* ==================================================
          INVITE MEMBER MODAL
      ================================================== */}

      {showAddMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">

            {/* =========================
                MODAL HEADER
            ========================= */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Add Member
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Invite someone to join this group
                </p>
              </div>

              <button
                onClick={closeInviteModal}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={22} />
              </button>

            </div>

            {/* =========================
                INVITE LINK
            ========================= */}

            <div className="bg-slate-800 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-3">

                <Link
                  size={18}
                  className="text-indigo-400"
                />

                <h3 className="font-medium">
                  Invite Link
                </h3>

              </div>

              {/* Loading */}

              {creatingInvite && (
                <div className="text-sm text-slate-400 py-3">
                  Generating invite link...
                </div>
              )}

              {/* Link */}

              {!creatingInvite && inviteLink && (
                <>
                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none"
                    />

                    <button
                      onClick={copyInviteLink}
                      className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                      title="Copy invite link"
                    >
                      {copied ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>

                  </div>

                  {copied && (
                    <p className="text-green-400 text-sm mt-2">
                      Link copied!
                    </p>
                  )}
                </>
              )}

              {/* Error */}

              {inviteError && (
                <p className="text-red-400 text-sm mt-3">
                  {inviteError}
                </p>
              )}

            </div>

            {/* =========================
                QR CODE
            ========================= */}

            {inviteLink && !creatingInvite && (
              <div className="mt-5 bg-slate-800 rounded-xl p-5">

                <div className="flex items-center justify-center">

                  <div className="bg-white p-4 rounded-2xl shadow-lg">

                    <QRCodeCanvas
                      value={inviteLink}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      includeMargin={true}
                    />

                  </div>

                </div>

                <p className="text-sm text-slate-400 text-center mt-4">
                  Scan this QR code to join the group
                </p>

              </div>
            )}

            {/* =========================
                INVITE INFORMATION
            ========================= */}

            <div className="mt-4 bg-slate-800/50 rounded-xl p-4">

              <p className="text-sm text-slate-400">
                Anyone with this link can join this group
                while the invitation is active.
              </p>

              <div className="flex justify-between mt-3 text-xs text-slate-500">
                <span>
                  Expires in 7 days
                </span>

                <span>
                  Maximum 20 uses
                </span>
              </div>

            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={closeInviteModal}
                className="flex-1 bg-slate-800 hover:bg-slate-700 rounded-xl py-3 font-medium transition"
              >
                Close
              </button>

              {inviteLink && (
                <button
                  type="button"
                  onClick={copyInviteLink}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
                >

                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy Link
                    </>
                  )}

                </button>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}