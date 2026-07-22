import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReturnRequests, updateReturnRequest } from "../store/slices/orderSlice";
import { RotateCcw, Check, X, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const REASONS = [
  "Damaged product",
  "Wrong item received",
  "Not as described",
  "Changed mind",
  "Other",
];

const Returns = () => {
  const dispatch = useDispatch();
  const { returnRequests, returnsLoading } = useSelector((state) => state.order);
  const [expandedId, setExpandedId] = useState(null);
  const [noteModal, setNoteModal] = useState({ open: false, returnId: null, status: null });
  const [adminNote, setAdminNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllReturnRequests());
  }, [dispatch]);

  const handleAction = (returnId, status) => {
    setAdminNote("");
    setNoteModal({ open: true, returnId, status });
  };

  const confirmAction = async () => {
    await dispatch(updateReturnRequest({
      returnId: noteModal.returnId,
      status: noteModal.status,
      admin_note: adminNote,
    }));
    setNoteModal({ open: false, returnId: null, status: null });
    setAdminNote("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap"><Clock size={11} /> Pending</span>;
      case "Approved":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap"><CheckCircle size={11} /> Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 whitespace-nowrap"><XCircle size={11} /> Rejected</span>;
      default:
        return null;
    }
  };

  const filtered = returnRequests.filter(r => statusFilter === "all" || r.status === statusFilter);
  const pendingCount = returnRequests.filter(r => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <RotateCcw size={16} className="text-primary" />
            </div>
            Return Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and manage customer return requests.</p>
        </div>
        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400">{pendingCount} pending</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === f
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f}
            {f === "all" && returnRequests.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">{returnRequests.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="glass-panel p-0 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto min-h-[300px]">
          {returnsLoading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading return requests...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <RotateCcw size={28} className="opacity-40" />
              </div>
              <p className="font-medium">No return requests found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((req) => (
                  <React.Fragment key={req.id}>
                    <tr className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground text-sm">{req.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{req.buyer_email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-primary">#{req.order_id?.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <FaBangladeshiTakaSign size={9} />{Number(req.total_price || 0).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs font-medium text-muted-foreground whitespace-nowrap">
                          {req.reason}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(req.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleAction(req.id, "Approved")}
                                className="p-2 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                title="Approve"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={() => handleAction(req.id, "Rejected")}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                title="Reject"
                              >
                                <X size={15} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Details"
                          >
                            {expandedId === req.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === req.id && (
                      <tr className="bg-secondary/10">
                        <td colSpan="6" className="px-5 py-5 border-b border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                            <div className="bg-background/60 rounded-2xl p-4 border border-border space-y-2">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Customer Details</p>
                              <p className="text-sm"><span className="font-semibold text-foreground">Name:</span> <span className="text-muted-foreground">{req.full_name || req.buyer_name}</span></p>
                              <p className="text-sm"><span className="font-semibold text-foreground">Phone:</span> <span className="text-muted-foreground">{req.phone || "—"}</span></p>
                              <p className="text-sm"><span className="font-semibold text-foreground">Address:</span> <span className="text-muted-foreground">{req.address ? `${req.address}, ${req.city}` : "—"}</span></p>
                            </div>
                            <div className="bg-background/60 rounded-2xl p-4 border border-border space-y-2">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Return Details</p>
                              <p className="text-sm"><span className="font-semibold text-foreground">Reason:</span> <span className="text-muted-foreground">{req.reason}</span></p>
                              {req.description && (
                                <p className="text-sm"><span className="font-semibold text-foreground">Description:</span> <span className="text-muted-foreground">{req.description}</span></p>
                              )}
                              {req.admin_note && (
                                <p className="text-sm"><span className="font-semibold text-foreground">Admin Note:</span> <span className="text-muted-foreground">{req.admin_note}</span></p>
                              )}
                              {req.resolved_at && (
                                <p className="text-sm"><span className="font-semibold text-foreground">Resolved:</span> <span className="text-muted-foreground">{new Date(req.resolved_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span></p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approve/Reject confirmation modal */}
      {noteModal.open && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-sm p-7 relative animate-fade-in-up">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto border ${
              noteModal.status === "Approved"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}>
              {noteModal.status === "Approved" ? <Check size={22} /> : <X size={22} />}
            </div>
            <h2 className="text-lg font-extrabold text-foreground text-center mb-1">
              {noteModal.status === "Approved" ? "Approve Return" : "Reject Return"}
            </h2>
            <p className="text-xs text-muted-foreground text-center mb-5">
              {noteModal.status === "Approved"
                ? "Stock will be restored and payment marked as Refunded."
                : "The customer will be notified that their request was rejected."}
            </p>
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Note (optional)</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note for the customer..."
                rows={3}
                className="w-full px-3 py-2.5 bg-input/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setNoteModal({ open: false, returnId: null, status: null })} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  noteModal.status === "Approved"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-destructive hover:bg-destructive/90 text-white"
                }`}
              >
                {noteModal.status === "Approved" ? <><Check size={15} /> Approve</> : <><X size={15} /> Reject</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
