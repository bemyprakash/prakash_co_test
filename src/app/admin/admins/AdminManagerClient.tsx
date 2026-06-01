"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export function AdminManagerClient({ initialAdmins, currentUserId }: { initialAdmins: Admin[], currentUserId: string }) {
  const router = useRouter();
  const [admins, setAdmins] = useState(initialAdmins);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");

      toast.success("Admin created successfully");
      setIsAdding(false);
      router.refresh(); // Refresh server component
      
      // Reset form
      setName(""); setEmail(""); setPassword(""); setRole("ADMIN");
      
      // Update local state temporarily
      setAdmins([{
        id: data.admin.id,
        name, email, role, isActive: true, createdAt: new Date()
      }, ...admins]);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      toast.success("Admin removed");
      setAdmins(admins.filter((a) => a.id !== id));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {/* Add Admin Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-[8px] shadow-sm border border-gray-100">
          <h3 className="font-serif font-bold text-lg mb-4">Create New Admin</h3>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="input-heritage w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="input-heritage w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input required minLength={6} value={password} onChange={e => setPassword(e.target.value)} type="password" className="input-heritage w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="input-heritage w-full">
                <option value="ADMIN">Admin (Manage Products, Orders)</option>
                <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button disabled={loading} type="submit" className="btn-primary py-2 px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-light/30 border-b border-gray-100 text-charcoal">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-charcoal">
                  {admin.name}
                  {admin.id === currentUserId && <span className="ml-2 text-[10px] bg-brand-light text-brand-primary px-2 py-0.5 rounded-full">You</span>}
                </td>
                <td className="px-6 py-4 text-muted">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm ${admin.role === 'SUPER_ADMIN' ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-muted'}`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {admin.id !== currentUserId && (
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                      title="Remove Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
