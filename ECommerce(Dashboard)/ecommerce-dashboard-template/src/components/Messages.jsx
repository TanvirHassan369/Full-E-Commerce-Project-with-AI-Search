import { useEffect, useState } from "react";
import { MessageSquare, Trash2, Eye, EyeOff, Mail, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "react-toastify";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"

  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.get("/contact/admin/all");
      setMessages(data.messages || []);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await axiosInstance.put(`/contact/admin/${id}/read`);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch {
      toast.error("Failed to mark as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/contact/admin/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto mark as read when opened
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.is_read && expandedId !== id) {
      handleMarkRead(id);
    }
  };

  const filtered = messages.filter(m => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read")   return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-primary" />
            </div>
            Contact Messages
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Messages from the Contact Us form.</p>
        </div>
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "read"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
              filter === f
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="glass-panel p-0 overflow-hidden animate-fade-in-up">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading messages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <MessageSquare size={28} className="opacity-40" />
            </div>
            <p className="font-medium">No messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((msg) => (
              <div key={msg.id} className={`transition-colors ${!msg.is_read ? "bg-primary/5" : ""}`}>
                {/* Message row */}
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    {!msg.is_read
                      ? <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                      : <span className="w-2.5 h-2.5 rounded-full bg-transparent block" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${!msg.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                          {msg.subject}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail size={11} /> {msg.name} — {msg.email}
                          </span>
                          {msg.phone && (
                            <span className="text-xs text-muted-foreground">📞 {msg.phone}</span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={11} />
                            {new Date(msg.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!msg.is_read && (
                          <button onClick={() => handleMarkRead(msg.id)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        <button onClick={() => handleExpand(msg.id)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="View message"
                        >
                          {expandedId === msg.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <button onClick={() => handleDelete(msg.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded message */}
                {expandedId === msg.id && (
                  <div className="px-5 pb-5 animate-fade-in-up">
                    <div className="bg-background/60 rounded-2xl p-4 border border-border ml-6">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span><span className="font-semibold text-foreground">From:</span> {msg.name}</span>
                        <span><span className="font-semibold text-foreground">Email:</span> {msg.email}</span>
                        {msg.phone && <span><span className="font-semibold text-foreground">Phone:</span> {msg.phone}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
