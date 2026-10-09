import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Wallet,
  Users,
  Receipt,
  ArrowRight,
  X,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  createGroup,
  getMyGroups,
} from "../services/groupService";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  // Group states
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const [error, setError] = useState("");

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  const loadGroups = useCallback(async () => {
    try {
      setLoadingGroups(true);
      setError("");

      const data = await getMyGroups();

      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
      setError(error.message);
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  // Fetch groups when dashboard loads
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setCreatingGroup(true);
      setError("");

      await createGroup({
        name: groupName.trim(),
        description: groupDescription.trim() || null,
      });

      setGroupName("");
      setGroupDescription("");
      setShowCreateGroup(false);

      await loadGroups();
    } catch (error) {
      console.error("Failed to create group:", error);
      setError(error.message);
    } finally {
      setCreatingGroup(false);
    }
  };

  const closeModal = () => {
    if (creatingGroup) return;

    setShowCreateGroup(false);
    setGroupName("");
    setGroupDescription("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-500/20">
              S
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Smart<span className="text-indigo-400">Split</span>
            </h1>
          </button>

          {/* Right Section */}
          <div className="relative flex items-center gap-4">

            {/* User Name */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">
                SmartSplit Member
              </p>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 p-1.5 pr-3 transition hover:border-indigo-500"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white">
                {initial}
              </div>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

                {/* Dropdown Header */}
                <div className="border-b border-slate-800 p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {displayName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user?.email || "Your account"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="p-2">

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <User size={18} className="text-indigo-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <Settings size={18} className="text-slate-400" />
                    Settings
                  </button>

                  <div className="my-2 border-t border-slate-800"></div>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                </div>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">

        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
              Dashboard
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {displayName} 👋
            </h2>

            <p className="mt-2 text-slate-400">
              Manage your expenses, groups, and settlements in one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-medium text-slate-200 transition hover:border-indigo-500 hover:bg-slate-800"
          >
            <User size={18} />
            View Profile
            <ArrowRight size={16} />
          </button>

        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Wallet size={22} />
            </div>

            <p className="text-sm text-slate-500">
              Total Balance
            </p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              ₹0.00
            </h3>

            <p className="mt-3 text-xs text-slate-500">
              Across all your groups
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Receipt size={22} />
            </div>

            <p className="text-sm text-slate-500">
              You Owe
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-400">
              ₹0.00
            </h3>

            <p className="mt-3 text-xs text-slate-500">
              Pending payments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={22} />
            </div>

            <p className="text-sm text-slate-500">
              You Are Owed
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-400">
              ₹0.00
            </h3>

            <p className="mt-3 text-xs text-slate-500">
              Money others owe you
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-10">

          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Get things done faster.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Create Group */}
            <button
              onClick={() => {
                setShowCreateGroup(true);
                setError("");
              }}
              className="group rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-indigo-500/20"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Users size={22} />
              </div>

              <h3 className="text-lg font-semibold">
                Create Group
              </h3>

              <p className="mt-2 text-sm text-indigo-100">
                Start a new expense-sharing group.
              </p>

              <ArrowRight
                size={18}
                className="mt-5 transition group-hover:translate-x-1"
              />
            </button>

            {/* Add Expense */}
            <button
              onClick={() => navigate("/expenses/create")}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl transition hover:-translate-y-1 hover:border-indigo-500/50"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Receipt size={22} />
              </div>

              <h3 className="text-lg font-semibold">
                Add Expense
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Record and split a new expense.
              </p>

              <ArrowRight
                size={18}
                className="mt-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400"
              />
            </button>

            {/* Settlements */}
            <button
              onClick={() => navigate("/settlements")}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl transition hover:-translate-y-1 hover:border-indigo-500/50"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet size={22} />
              </div>

              <h3 className="text-lg font-semibold">
                View Settlements
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                See who owes whom money.
              </p>

              <ArrowRight
                size={18}
                className="mt-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-400"
              />
            </button>

          </div>
        </div>

        {/* My Groups */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                My Groups
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your expense-sharing groups.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadGroups}
                disabled={loadingGroups}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400 disabled:opacity-50"
                title="Refresh groups"
              >
                <RefreshCw
                  size={17}
                  className={loadingGroups ? "animate-spin" : ""}
                />
              </button>

              <span className="rounded-lg bg-indigo-500/10 px-3 py-1 text-sm text-indigo-400">
                {groups.length} Groups
              </span>
            </div>
          </div>

          {loadingGroups ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
              Loading groups...
            </div>
          ) : groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">

              <Users
                className="mx-auto mb-4 text-slate-600"
                size={40}
              />

              <p className="font-medium text-slate-400">
                No groups yet
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Create your first group to start splitting expenses.
              </p>

              <button
                onClick={() => setShowCreateGroup(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Create Group
              </button>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition hover:border-indigo-500/50"
                >
                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Users size={22} />
                    </div>

                    <span className="text-xs text-slate-600">
                      #{group.id}
                    </span>

                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {group.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm text-slate-500">
                    {group.description || "No description added"}
                  </p>

                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Open Group
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}

            </div>
          )}

          {/* API Error */}
          {error && !showCreateGroup && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

        </div>

        {/* Recent Activity */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest expense activity will appear here.
              </p>
            </div>

            <Receipt className="text-slate-700" size={26} />
          </div>

          <div className="py-16 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-600">
              <Receipt size={28} />
            </div>

            <p className="font-medium text-slate-400">
              No expenses yet
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Start by creating a group or adding an expense.
            </p>

          </div>

        </div>

      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Create New Group
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Start sharing expenses with friends.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateGroup}
              className="space-y-4"
            >

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Group Name
                </label>

                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Goa Trip"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="What is this group for?"
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingGroup}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingGroup ? "Creating..." : "Create Group"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
