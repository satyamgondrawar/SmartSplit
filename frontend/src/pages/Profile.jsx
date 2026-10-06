import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  Save,
  X,
  ShieldCheck,
  CalendarDays,
  Wallet,
  Users,
  CheckCircle2,
} from "lucide-react";

import {
  getMyProfile,
  createProfile,
  updateProfile,
} from "../services/userService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();
      console.log("Profile loaded:", data);

      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        id: data.id || "",
      });
      
    } catch (err) {
      if (err.message.includes("Profile not found")) {
        setEditing(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      let data;

      if (profile) {
        data = await updateProfile(formData);
        setMessage("Profile updated successfully!");
      } else {
        data = await createProfile(formData);
        setMessage("Profile created successfully!");
      }

      setProfile(data);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
      setEditing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
              SmartSplit Account
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your personal information and account preferences.
            </p>
          </div>

          {!editing && profile && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            <CheckCircle2 size={20} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* Left Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
            
            <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>

            <div className="px-6 pb-6">
              <div className="-mt-14 mb-5 flex items-end justify-between">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-900 bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold shadow-xl">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <button className="absolute bottom-1 right-1 rounded-full border-4 border-slate-900 bg-indigo-600 p-2 text-white hover:bg-indigo-500">
                    <Camera size={15} />
                  </button>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Active
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {formData.name || "Your Name"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                SmartSplit Member
              </p>

              <div className="mt-6 space-y-4 border-t border-slate-800 pt-6">

                <div className="flex items-center gap-3 text-sm">
                  <div className="rounded-lg bg-slate-800 p-2 text-indigo-400">
                    <Mail size={17} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="break-all text-slate-300">
                      {formData.email }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="rounded-lg bg-slate-800 p-2 text-indigo-400">
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Account Status</p>
                    <p className="text-slate-300">Verified Account</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Wallet size={20} />
                </div>
                <p className="text-sm text-slate-500">Total Expenses</p>
                <h3 className="mt-1 text-2xl font-bold">₹0</h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Users size={20} />
                </div>
                <p className="text-sm text-slate-500">Groups Joined</p>
                <h3 className="mt-1 text-2xl font-bold">0</h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CalendarDays size={20} />
                </div>
                <p className="text-sm text-slate-500">Member Since</p>
                <h3 className="mt-1 text-lg font-bold">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "Today"}
                </h3>
              </div>

            </div>

            {/* Personal Information */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your personal details and contact information.
                  </p>
                </div>

                <User className="text-slate-600" size={25} />
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-3.5 text-slate-500"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      About You
                    </label>

                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Write something about yourself..."
                      rows="4"
                      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <p className="mt-2 text-xs text-slate-600">
                      Keep your bio short and meaningful.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">

                    {profile && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
                      {saving ? "Saving..." : profile ? "Save Changes" : "Create Profile"}
                    </button>

                  </div>
                </form>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">

                  <div>
                    <p className="mb-2 text-sm text-slate-500">
                      Full Name
                    </p>
                    <p className="text-base font-medium text-slate-200">
                      {profile?.name || "Not added yet"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-slate-500">
                      Phone Number
                    </p>
                    <p className="text-base font-medium text-slate-200">
                      {profile?.phone || "Not added yet"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm text-slate-500">
                      About
                    </p>
                    <p className="leading-7 text-slate-300">
                      {profile?.bio || "Tell your SmartSplit friends something about yourself."}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Security Card */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:flex-row sm:items-center">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Your account is protected
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    SmartSplit uses secure authentication to protect your account information.
                  </p>
                </div>
              </div>

              <span className="whitespace-nowrap text-sm font-medium text-indigo-400">
                JWT Secured
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;