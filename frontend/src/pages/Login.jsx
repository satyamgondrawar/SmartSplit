import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(
        formData.email,
        formData.password
      );

      localStorage.setItem("access_token", response.access_token);

      const pendingInviteToken =
        localStorage.getItem("pending_invite_token");

      if (pendingInviteToken) {
        navigate(`/join/${pendingInviteToken}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-0 sm:p-4 lg:p-8">

      <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 bg-white lg:rounded-3xl shadow-2xl overflow-hidden">

        {/* Desktop Branding */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-12 flex-col justify-between overflow-hidden">

          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                S
              </div>

              <h1 className="text-2xl font-bold tracking-wide">
                SmartSplit
              </h1>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Split expenses.
              <br />
              Keep friendships.
            </h2>

            <p className="mt-6 text-indigo-100 text-lg leading-relaxed max-w-md">
              Manage shared expenses with friends, roommates, and groups
              without complicated calculations.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} />
              <p className="text-indigo-100 text-sm">
                Track expenses effortlessly and settle payments easily.
              </p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="px-5 py-8 sm:px-8 sm:py-12 lg:p-14 flex flex-col justify-center min-h-screen lg:min-h-0">

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-200">
              S
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              Smart<span className="text-indigo-600">Split</span>
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage expenses smarter
            </p>
          </div>

          <div className="max-w-md mx-auto w-full">

            <div className="mb-8">
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Welcome back
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Sign in to your account
              </h2>

              <p className="text-gray-500 mt-3">
                Continue managing your shared expenses.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                </div>
                <div className="mt-3 flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-indigo-600"
                />

                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-bold hover:text-purple-600"
              >
                Create an account
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-8">
              © 2026 SmartSplit
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;