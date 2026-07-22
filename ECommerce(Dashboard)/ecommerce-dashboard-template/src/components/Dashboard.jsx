import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../store/slices/adminSlice";
import {
  Users, ShoppingBag, TrendingUp, Activity,
  AlertTriangle, Star, Package, Mail,
  Download, Calendar, X, Loader,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { axiosInstance } from "../lib/axiosInstance";
import StatCard from "./dashboard-components/StatCard";
import ChartTooltip from "./dashboard-components/ChartTooltip";
import { generateReportHTML } from "../utils/generateReportHTML";

//Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFrom, setReportFrom] = useState(() => {
    const d = new Date(); d.setDate(1);
    return d.toISOString().split("T")[0];
  });
  const [reportTo, setReportTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  //Chart data
  const revenueData = stats?.monthlySales?.map(item => ({
    name: item.month.split(' ')[0],
    total: item.total_sales,
  })) || [];

  const orderData = stats?.orderStatsCount ? [
    { name: "Processing", count: stats.orderStatsCount.Processing || 0, color: "hsl(38 92% 50%)" },
    { name: "Shipped",    count: stats.orderStatsCount.Shipped    || 0, color: "hsl(217 91% 60%)" },
    { name: "Delivered",  count: stats.orderStatsCount.Delivered  || 0, color: "hsl(160 84% 39%)" },
    { name: "Cancelled",  count: stats.orderStatsCount.Cancelled  || 0, color: "hsl(346 87% 60%)" },
  ] : [];

  const totalOrdersCalculated = stats?.orderStatsCount
    ? Object.values(stats.orderStatsCount).reduce((a, b) => a + b, 0)
    : 0;

  let todayGrowthRate = "0%";
  if (stats?.yesterdayRevenue > 0) {
    const rate = ((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue) * 100;
    todayGrowthRate = `${rate >= 0 ? "+" : ""}${rate.toFixed(2)}%`;
  } else if (stats?.todayRevenue > 0) {
    todayGrowthRate = "+100.00%";
  }

  // Report generation
  const handleDownloadReport = () => {
    setReportError("");
    setShowReportModal(true);
  };

  const handleGenerateReport = async () => {
    if (!reportFrom || !reportTo) { setReportError("Please select both dates."); return; }
    if (reportFrom > reportTo)    { setReportError("'From' date must be before 'To' date."); return; }

    setReportLoading(true);
    setReportError("");

    try {
      const { data } = await axiosInstance.get(`/admin/fetch/report?from=${reportFrom}&to=${reportTo}`);

      const fmt = (d) => new Date(d).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" });
      const fromLabel   = fmt(reportFrom);
      const toLabel     = fmt(reportTo);
      const generatedOn = fmt(new Date());

      const html = generateReportHTML(data, fromLabel, toLabel, generatedOn);
      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const win  = window.open(url, "_blank");

      if (!win) { alert("Please allow popups to download the report."); URL.revokeObjectURL(url); return; }
      win.onload = () => { win.print(); URL.revokeObjectURL(url); };
      setShowReportModal(false);
    } catch (err) {
      setReportError(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setReportLoading(false);
    }
  };

  //Loading state
  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  //Render
  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Here's what's happening with your store today.</p>
        </div>
        <button onClick={handleDownloadReport} className="btn-primary shrink-0">
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="sm:col-span-2">
          <StatCard
            title="All Time Revenue"
            value={<span className="flex items-center gap-1"><FaBangladeshiTakaSign size={28} className="text-primary opacity-80" />{(stats?.totalRevenue || 0).toLocaleString()}</span>}
            icon={<FaBangladeshiTakaSign size={22} />}
            trend={stats?.revenueGrowthRate}
            trendLabel="vs last period"
            colorClass="primary"
          />
        </div>
        <StatCard
          title="Today's Sales"
          value={<span className="flex items-center gap-1"><FaBangladeshiTakaSign size={22} className="text-emerald-400 opacity-80" />{(stats?.todayRevenue || 0).toLocaleString()}</span>}
          icon={<Activity size={22} />}
          trend={todayGrowthRate}
          trendLabel="vs yesterday"
          colorClass="emerald"
        />
        <StatCard
          title="Total Orders"
          value={totalOrdersCalculated.toLocaleString()}
          icon={<ShoppingBag size={22} />}
          colorClass="amber"
        />
        <div className="sm:col-span-2">
          <StatCard
            title="Total Users"
            value={(stats?.totalUsersCount || 0).toLocaleString()}
            icon={<Users size={22} />}
            trend={stats?.newUsersThisMonth}
            trendLabel="new this month"
            trendIsNumber
            colorClass="blue"
          />
        </div>
        <div className="sm:col-span-2">
          <StatCard
            title="Newsletter Subscribers"
            value={(stats?.newsletterSubscribers || 0).toLocaleString()}
            icon={<Mail size={22} />}
            colorClass="rose"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Area Chart */}
        <div className="glass-panel xl:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp size={22} className="text-primary" /> Revenue Analytics
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Monthly sales performance over time</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} dx={-10} />
                <Tooltip content={<ChartTooltip prefix="৳" />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Bar Chart */}
        <div className="glass-panel relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/10 transition-colors duration-700" />
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Order Status</h2>
            <p className="text-sm text-muted-foreground mt-1">Current distribution</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'hsl(var(--secondary)/0.5)' }} content={<ChartTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {orderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || 'hsl(var(--primary))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Top Selling Products */}
        <div className="glass-panel relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-50" />
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Star size={22} className="text-amber-400 fill-amber-400" /> Top Selling Products
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Products driving the most revenue</p>
          </div>
          {stats?.topSellingProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-secondary/40 rounded-2xl border border-border/50 hover:border-amber-500/30 hover:bg-secondary/60 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-background overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow">
                        {product.image_url
                          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center bg-secondary"><Package size={20} className="text-muted-foreground" /></div>
                        }
                      </div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-amber-400 transition-colors">{product.name}</p>
                      <span className="px-2 py-0.5 rounded-md bg-background border border-border/50 text-xs text-muted-foreground">{product.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-lg text-foreground">{product.total_sold}</p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Units sold</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><Star size={28} /></div>
              <p className="text-muted-foreground font-medium">No sales data available yet.</p>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600 opacity-50" />
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle size={22} className="text-rose-500" /> Low Stock Alerts
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Items that need immediate restocking</p>
          </div>
          {stats?.lowStockProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{product.name}</p>
                      <p className="text-xs text-rose-500/80 font-medium mt-1 uppercase tracking-wide">Restock Required</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-2xl text-rose-500">{product.stock}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-rose-500/70">Left in stock</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Package size={28} /></div>
              <p className="text-foreground font-semibold text-lg">Inventory is healthy!</p>
              <p className="text-sm text-muted-foreground">No low stock alerts currently.</p>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-7 relative animate-fade-in-up">
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Calendar size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">Generate Report</h2>
                <p className="text-xs text-muted-foreground">Select a date range for your report</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</label>
                  <input type="date" value={reportFrom} max={reportTo} onChange={(e) => setReportFrom(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</label>
                  <input type="date" value={reportTo} min={reportFrom} max={new Date().toISOString().split("T")[0]} onChange={(e) => setReportTo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Today",        days: 0  },
                  { label: "Last 7 days",  days: 7  },
                  { label: "Last 30 days", days: 30 },
                  { label: "This month",   days: -1 },
                ].map(({ label, days }) => (
                  <button key={label} type="button"
                    onClick={() => {
                      const today = new Date();
                      const to = today.toISOString().split("T")[0];
                      let from;
                      if (days === 0)       from = to;
                      else if (days === -1) from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
                      else                  { const d = new Date(today); d.setDate(d.getDate() - days); from = d.toISOString().split("T")[0]; }
                      setReportFrom(from); setReportTo(to);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                  >{label}</button>
                ))}
              </div>

              {reportError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{reportError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowReportModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleGenerateReport} disabled={reportLoading} className="btn-primary flex-1">
                  {reportLoading
                    ? <><Loader size={15} className="animate-spin" /> Generating...</>
                    : <><Download size={15} /> Download</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
