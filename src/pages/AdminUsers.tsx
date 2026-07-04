import { useEffect, useState } from "react";
import { Users, Shield, UserCog, User, Trash2 } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface UserRow {
  _id: string; name: string; email: string;
  role: "citizen" | "officer" | "admin";
  phone?: string; createdAt: string;
}

const ROLE_ICONS = { admin: Shield, officer: UserCog, citizen: User };
const ROLE_COLORS = { admin: "text-red-400 bg-red-500/10 border-red-500/30", officer: "text-blue-400 bg-blue-500/10 border-blue-500/30", citizen: "text-green-400 bg-green-500/10 border-green-500/30" };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const params: any = { limit: 50 };
    if (roleFilter) params.role = roleFilter;
    api.get("/auth/users", { params })
      .then(({ data }) => { setUsers(data.users); setTotal(data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const { data } = await api.put(`/auth/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.role } : u)));
      toast.success(`Role updated to ${role}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={22} /> User Management
        </h1>
        <p className="text-gray-500 text-sm">{total} total users</p>
      </div>

      {/* Role filter */}
      <div className="flex gap-2">
        {["", "citizen", "officer", "admin"].map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              roleFilter === r ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}>
            {r || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 font-medium px-5 py-3">User</th>
                <th className="text-left text-gray-500 font-medium px-5 py-3">Phone</th>
                <th className="text-left text-gray-500 font-medium px-5 py-3">Joined</th>
                <th className="text-left text-gray-500 font-medium px-5 py-3">Role</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => {
                const RoleIcon = ROLE_ICONS[u.role];
                return (
                  <tr key={u._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center text-saffron-500 font-bold text-sm">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{u.phone || "—"}</td>
                    <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3">
                      {u._id === me?._id ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border capitalize ${ROLE_COLORS[u.role]}`}>
                          <RoleIcon size={11} /> {u.role}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer capitalize ${ROLE_COLORS[u.role]}`}
                        >
                          <option value="citizen">citizen</option>
                          <option value="officer">officer</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u._id !== me?._id && (
                        <button onClick={() => handleDelete(u._id, u.name)}
                          className="text-gray-600 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>
      )}
    </div>
  );
}
