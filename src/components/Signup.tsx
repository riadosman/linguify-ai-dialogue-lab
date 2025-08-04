import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, User, Key, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { register } from "./../Utils/Auth";

export const Signup = ({ setActiveView }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setToken, setUser } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    const res = await register(username, email, password);
    if (!res.userId) {
      setLoading(false);
      setMessage(res.message);
      alert(res.message);
    } else {
      setActiveView("chat");
      setToken(res.token);
      setUser(username);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1">
            Sign Up
          </Badge>
          <p className="mt-2 text-gray-600 text-sm">
            Join us and start your language journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full rounded-md border border-gray-300 px-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <UserPlus className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Email Address
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </label>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          {true && (
            <button
              type="button"
              onClick={() => {
                setUsername("testuser");
                setEmail("test@example.com");
                setPassword("123456");
                setConfirmPassword("123456");
              }}
            >
              Autofill Test Data
            </button>
          )}
        </form>
      </Card>
    </div>
  );
};
