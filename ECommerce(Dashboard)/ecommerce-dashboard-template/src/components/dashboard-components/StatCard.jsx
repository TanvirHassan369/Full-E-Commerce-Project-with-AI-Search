import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, icon, trend, trendLabel, trendIsNumber, colorClass = "primary" }) => {
  const isPositive = trendIsNumber ? trend > 0 : trend?.toString().startsWith('+');

  const colorMap = {
    primary: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/20", glow: "bg-primary" },
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500" },
    blue:    { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/20",    glow: "bg-blue-500" },
    amber:   { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/20",   glow: "bg-amber-500" },
    rose:    { bg: "bg-rose-500/15",    text: "text-rose-400",    border: "border-rose-500/20",    glow: "bg-rose-500" },
  };
  const c = colorMap[colorClass] || colorMap.primary;

  return (
    <div className="glass-card flex flex-col p-6 group cursor-default relative overflow-hidden animate-fade-in-up h-full">
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-500 ${c.glow}`} />

      <div className="flex justify-between items-start mb-5 relative z-10 gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0 ${c.bg} ${c.text} ${c.border}`}>
          {icon}
        </div>

        {trend !== undefined && trend !== null && trend !== "0%" && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trendIsNumber && trend > 0 ? '+' : ''}{trend}
            </div>
            {trendLabel && (
              <span className={`text-[10px] font-medium whitespace-nowrap ${isPositive ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.text} opacity-80`}>{title}</p>
        <div className="text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
