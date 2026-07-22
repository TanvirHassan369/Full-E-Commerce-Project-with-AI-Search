import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubscribers, clearAdminError } from "../store/slices/adminSlice";
import { Mail, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const Subscribers = () => {
  const dispatch = useDispatch();
  const { subscribers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllSubscribers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  if (loading && subscribers.length === 0) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
              <Mail className="text-rose-400" size={16} />
            </div>
            Subscribers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Users who have subscribed to your newsletter.</p>
        </div>
        {subscribers?.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-semibold text-rose-400">{subscribers.length} subscribers</span>
          </div>
        )}
      </div>

      <div className="glass-panel overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Subscriber Email</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {subscribers && subscribers.length > 0 ? (
                subscribers.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-5 py-4 text-sm text-muted-foreground font-medium w-12">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 font-bold text-sm shrink-0">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <Calendar size={13} className="opacity-60" />
                        {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                        <Mail size={24} className="opacity-30" />
                      </div>
                      <p className="font-medium">No subscribers yet.</p>
                      <p className="text-xs opacity-60">Subscribers will appear here once users sign up.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
