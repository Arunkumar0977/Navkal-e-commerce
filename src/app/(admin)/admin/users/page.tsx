"use client";
import { useState, useEffect } from "react";
import { Search, Shield, ShieldOff, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface User {
  id: string; name: string | null; email: string; role: string;
  image: string | null; phone: string | null; createdAt: string;
  _count?: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/users").then(r => r.json()).then(d => {
      setUsers(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Make this user ${newRole}?`)) return;
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) { toast.success(`Role updated to ${newRole}`); load(); }
    else toast.error("Update failed");
  };

  const filtered = users.filter(u =>
    !search ||
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Users</h1>
          <p className="text-brown-light text-sm">{users.length} registered users</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-light" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-soft pl-10 w-full max-w-sm py-2 text-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr>
                {["User", "Email", "Role", "Orders", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-brown-light uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="py-4 px-4"><div className="h-4 rounded skeleton" /></td>
                ))}</tr>
              )) : filtered.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }} className="hover:bg-cream/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blush-light flex items-center justify-center text-sm font-medium text-blush-dark flex-shrink-0">
                        {user.image
                          ? <img src={user.image} className="w-full h-full rounded-full object-cover" alt="" />
                          : (user.name?.[0] || user.email[0]).toUpperCase()}
                      </div>
                      <span className="font-medium text-brown">{user.name || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-brown-light">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge text-[10px] ${user.role === "ADMIN" ? "bg-blush-dark text-white" : "bg-green-100 text-green-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-brown-light">{user._count?.orders ?? 0}</td>
                  <td className="py-3 px-4 text-brown-light text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggleRole(user.id, user.role)}
                        title={user.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${user.role === "ADMIN" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                        {user.role === "ADMIN" ? <ShieldOff size={13} /> : <Shield size={13} />}
                      </button>
                      <a href={`mailto:${user.email}`}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100">
                        <Mail size={13} />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <p className="text-center py-10 text-brown-light">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
