import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { User, Lock, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    aadharNumber: user?.aadharNumber || "",
    preferredLanguage: user?.preferredLanguage || "en",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
    },
  });

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [tab, setTab] = useState<"profile" | "security">("profile");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", profile);
      updateUser(data);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("New passwords do not match");
    if (passwords.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* Avatar + role */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-saffron-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="inline-block mt-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["profile", "security"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}>
            {t === "profile" ? <User size={14} /> : <Lock size={14} />}
            {t === "profile" ? "Profile & Language" : "Change Password"}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <form onSubmit={handleProfileSave} className="card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
              <input className="input" required value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Phone</label>
              <input className="input" value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Aadhar Number</label>
              <input className="input" value={profile.aadharNumber} maxLength={12}
                onChange={(e) => setProfile({ ...profile, aadharNumber: e.target.value })} placeholder="XXXX XXXX XXXX" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5">
                <Globe size={13} /> Preferred Language
              </label>
              <select className="input" value={profile.preferredLanguage}
                onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-300 mb-3">Address</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-400 mb-1.5 block">Street</label>
                <input className="input" value={profile.address.street}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
                  placeholder="House no., Street name" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">City</label>
                <input className="input" value={profile.address.city}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">State</label>
                <input className="input" value={profile.address.state}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Pincode</label>
                <input className="input" value={profile.address.pincode} maxLength={6}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, pincode: e.target.value } })} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={savingProfile}
            className="btn-saffron disabled:opacity-50">
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange} className="card space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Current Password</label>
            <input type="password" className="input" required value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">New Password</label>
            <input type="password" className="input" required minLength={6} value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Confirm New Password</label>
            <input type="password" className="input" required value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="Repeat new password" />
          </div>
          <button type="submit" disabled={savingPassword}
            className="btn-primary disabled:opacity-50">
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      )}
    </div>
  );
}
