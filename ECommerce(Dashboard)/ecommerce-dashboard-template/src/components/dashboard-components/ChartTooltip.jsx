const ChartTooltip = ({ active, payload, label, prefix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-3 rounded-xl border border-border/50 shadow-2xl backdrop-blur-xl">
        <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">{label}</p>
        <p className="text-foreground text-lg font-bold flex items-center gap-1">
          {prefix}{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
