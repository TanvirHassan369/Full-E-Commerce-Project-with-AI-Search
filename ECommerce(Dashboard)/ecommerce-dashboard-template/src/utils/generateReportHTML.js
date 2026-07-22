export const generateReportHTML = (data, fromLabel, toLabel, generatedOn) => {
  const dailyRows = (data.dailySales || []).map(d => `
    <tr>
      <td>${d.day}</td>
      <td style="text-align:right;">৳ ${Number(d.revenue).toLocaleString()}</td>
    </tr>`).join("") || '<tr><td colspan="2" style="text-align:center;color:#9ca3af;">No paid sales in this period</td></tr>';

  const topProductRows = (data.topProducts || []).map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td style="text-align:right;">${p.total_sold}</td>
      <td style="text-align:right;">৳ ${Number(p.total_revenue).toLocaleString()}</td>
    </tr>`).join("") || '<tr><td colspan="5" style="text-align:center;color:#9ca3af;">No data</td></tr>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Sales Report — Daily Bazar</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; color:#111827; background:#fff; padding:40px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:20px; border-bottom:3px solid #7c3aed; }
    .brand { font-size:28px; font-weight:800; color:#7c3aed; }
    .brand span { color:#111827; }
    .report-meta h2 { font-size:18px; font-weight:700; color:#7c3aed; text-align:right; }
    .report-meta p { font-size:13px; color:#6b7280; text-align:right; margin-top:2px; }
    .date-range { display:inline-block; background:#f3f0ff; color:#7c3aed; padding:4px 14px; border-radius:20px; font-size:13px; font-weight:600; margin-top:6px; }
    .stats-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:32px; }
    .stat-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:16px; text-align:center; }
    .stat-box .label { font-size:11px; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
    .stat-box .value { font-size:22px; font-weight:800; color:#7c3aed; }
    h3 { font-size:15px; font-weight:700; color:#111827; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid #e5e7eb; }
    table { width:100%; border-collapse:collapse; margin-bottom:28px; font-size:13px; }
    thead tr { background:#7c3aed; color:#fff; }
    thead th { padding:10px 12px; text-align:left; font-weight:600; font-size:12px; text-transform:uppercase; }
    tbody tr:nth-child(even) { background:#f9fafb; }
    tbody td { padding:9px 12px; border-bottom:1px solid #f3f4f6; color:#374151; }
    .section { margin-bottom:32px; }
    .footer { margin-top:40px; padding-top:16px; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#9ca3af; }
    @media print { body { padding:20px; } @page { margin:15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Daily <span>Bazar</span></div>
      <p style="font-size:13px;color:#6b7280;margin-top:4px;">Admin Sales Report</p>
      <div class="date-range">📅 ${fromLabel} — ${toLabel}</div>
    </div>
    <div class="report-meta">
      <h2>SALES REPORT</h2>
      <p>Generated: ${generatedOn}</p>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-box"><div class="label">Total Revenue</div><div class="value">৳ ${Number(data.totalRevenue).toLocaleString()}</div></div>
    <div class="stat-box"><div class="label">Total Orders</div><div class="value">${data.totalOrders}</div></div>
    <div class="stat-box"><div class="label">New Users</div><div class="value">${data.newUsers}</div></div>
    <div class="stat-box"><div class="label">Delivered</div><div class="value">${data.orderStatusBreakdown?.Delivered || 0}</div></div>
    <div class="stat-box"><div class="label">Returns</div><div class="value">${data.returnStats?.total || 0}</div></div>
  </div>

  <div class="section">
    <h3>Order Status Breakdown</h3>
    <table>
      <thead><tr><th>Status</th><th>Count</th></tr></thead>
      <tbody>
        <tr><td>Processing</td><td>${data.orderStatusBreakdown?.Processing || 0}</td></tr>
        <tr><td>Shipped</td><td>${data.orderStatusBreakdown?.Shipped || 0}</td></tr>
        <tr><td>Delivered</td><td>${data.orderStatusBreakdown?.Delivered || 0}</td></tr>
        <tr><td>Cancelled</td><td>${data.orderStatusBreakdown?.Cancelled || 0}</td></tr>
        <tr><td>Returned</td><td>${data.orderStatusBreakdown?.Returned || 0}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Daily Sales (Paid Orders)</h3>
    <table>
      <thead><tr><th>Date</th><th style="text-align:right;">Revenue (৳)</th></tr></thead>
      <tbody>${dailyRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h3>Top Selling Products</h3>
    <table>
      <thead><tr><th>#</th><th>Product</th><th>Category</th><th style="text-align:right;">Units Sold</th><th style="text-align:right;">Revenue</th></tr></thead>
      <tbody>${topProductRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h3>Return Requests</h3>
    <table>
      <thead><tr><th>Status</th><th style="text-align:right;">Count</th></tr></thead>
      <tbody>
        <tr><td>Total Returns</td><td style="text-align:right;font-weight:600;">${data.returnStats?.total || 0}</td></tr>
        <tr><td>Approved</td><td style="text-align:right;color:#10b981;font-weight:600;">${data.returnStats?.approved || 0}</td></tr>
        <tr><td>Pending</td><td style="text-align:right;color:#f59e0b;font-weight:600;">${data.returnStats?.pending || 0}</td></tr>
        <tr><td>Rejected</td><td style="text-align:right;color:#ef4444;font-weight:600;">${data.returnStats?.rejected || 0}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Daily Bazar — Sales Report | ${fromLabel} to ${toLabel} | Generated on ${generatedOn}</p>
  </div>
</body>
</html>`;
};
