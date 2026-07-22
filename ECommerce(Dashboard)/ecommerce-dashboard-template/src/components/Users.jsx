import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../store/slices/adminSlice";
import { Users as UsersIcon, Search, Trash2, Shield, User } from "lucide-react";
import { toast } from "react-toastify";
import DeleteModal from "../modals/DeleteModal";

// Resolve avatar URL — handles local /uploads/ paths and full Cloudinary URLs
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL.replace("/api/v1", "")
  : "http://localhost:4000";

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  const url = typeof avatar === "string" ? avatar : avatar.url || avatar.secure_url || "";
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await dispatch(deleteUser(deleteModal.id)).unwrap();
        setDeleteModal({ isOpen: false, id: null });
      } catch (err) {
        toast.error(err || "Failed to delete user");
        setDeleteModal({ isOpen: false, id: null });
      }
    }
  };

  const filteredUsers = (users || []).filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage customer accounts and administrative access.</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-border bg-card/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-input/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 w-full transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <UsersIcon size={28} className="opacity-50" />
              </div>
              <p className="font-medium">No users found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20 shrink-0">
                          {getAvatarUrl(user.avatar) ? (
                            <img
                              src={getAvatarUrl(user.avatar)}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                          ) : null}
                          <span style={{ display: getAvatarUrl(user.avatar) ? "none" : "flex" }} className="w-full h-full items-center justify-center text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.role === 'Admin' 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-secondary text-muted-foreground border-border'
                      }`}>
                        {user.role === 'Admin' ? <Shield size={11} /> : <User size={11} />}
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {user.role !== 'Admin' && (
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={confirmDelete} 
        title="Delete User" 
        message="Are you sure you want to delete this user account? This action cannot be undone." 
      />
    </div>
  );
};

export default Users;
