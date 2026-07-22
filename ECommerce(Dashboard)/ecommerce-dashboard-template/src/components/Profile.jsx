import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User, Mail, Shield, Camera, Edit2 } from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="glass-panel p-8 relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold border border-primary/30 glow-primary">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "A"
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground">{user?.name || "Admin User"}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                <Shield size={12} /> {user?.role || "Admin"}
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mb-6">
              <Mail size={16} /> {user?.email || "admin@example.com"}
            </p>

            <button className="btn-secondary">
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm text-muted-foreground font-medium">Full Name</div>
              <div className="col-span-2 text-sm text-foreground">{user?.name || "Admin User"}</div>

              <div className="text-sm text-muted-foreground font-medium">Email Address</div>
              <div className="col-span-2 text-sm text-foreground">{user?.email || "admin@example.com"}</div>

              <div className="text-sm text-muted-foreground font-medium">Phone Number</div>
              <div className="col-span-2 text-sm text-foreground">{user?.phone || "Not provided"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Account Settings</h3>
            <div className="space-y-3">
              <button className="text-sm text-primary hover:underline block">Change Password</button>
              <button className="text-sm text-primary hover:underline block">Enable Two-Factor Authentication</button>
              <button className="text-sm text-primary hover:underline block">Manage Notification Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
