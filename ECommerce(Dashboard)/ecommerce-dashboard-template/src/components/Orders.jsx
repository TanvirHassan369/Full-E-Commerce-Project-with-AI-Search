import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../store/slices/orderSlice";
import { fetchProducts } from "../store/slices/productsSlice";
import { Package, Search, ChevronDown, ChevronUp, Check, Trash2, MapPin, Eye } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import DeleteModal from "../modals/DeleteModal";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleUpdateStatus = async (id, status) => {
    const result = await dispatch(updateOrderStatus({ id, status }));
    setStatusMenuOpen(null);

    if (updateOrderStatus.fulfilled.match(result)) {
      // Refresh products so stock changes (cancel restores, etc.) reflect immediately
      dispatch(fetchProducts());

      const messages = {
        Cancelled: "Order cancelled — stock restored.",
        Shipped: "Order marked as Shipped.",
        Delivered: "Order marked as Delivered.",
        Processing: "Order set to Processing.",
        Returned: "Order marked as Returned.",
      };
      toast.success(messages[status] || "Order status updated.");
    } else {
      toast.error("Failed to update order status.");
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await dispatch(deleteOrder(deleteModal.id)).unwrap();
        setDeleteModal({ isOpen: false, id: null });
      } catch {
        setDeleteModal({ isOpen: false, id: null });
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'returned': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-secondary text-foreground border-border';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id?.toString().includes(searchTerm) || 
    o.shipping_info?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping_info?.phone?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage customer orders and fulfillments.</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-border bg-card/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, name..."
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
              <p className="text-sm text-muted-foreground animate-pulse">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <Package size={28} className="opacity-50" />
              </div>
              <p className="font-medium">No orders found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-primary">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground text-sm">{order.shipping_info?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{order.shipping_info?.phone || "No phone"}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">
                        <span className="flex items-center gap-1 text-sm"><FaBangladeshiTakaSign size={12} />{order.total_price}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          order.payment_status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : order.payment_status === 'Refunded'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {order.payment_status || (order.paid_at ? "Paid" : "Pending")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button 
                            onClick={() => order.order_status !== 'Returned' && setStatusMenuOpen(statusMenuOpen === order.id ? null : order.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${getStatusColor(order.order_status)} ${order.order_status === 'Returned' ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                          >
                            {order.order_status || "Processing"} {order.order_status !== 'Returned' && <ChevronDown size={12} />}
                          </button>
                          
                          {statusMenuOpen === order.id && order.order_status !== 'Returned' && (
                            <div className="absolute top-full left-0 mt-1 w-36 bg-popover border border-border rounded-xl shadow-2xl shadow-black/30 py-1.5 z-10 animate-fade-in-up">
                              {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                <button 
                                  key={status}
                                  onClick={() => handleUpdateStatus(order.id, status)}
                                  className="w-full text-left px-3.5 py-2 text-sm text-foreground hover:bg-secondary flex items-center justify-between transition-colors"
                                >
                                  {status}
                                  {order.order_status === status && <Check size={13} className="text-primary" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} 
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="View Details"
                          >
                            {expandedOrder === order.id ? <ChevronUp size={15} /> : <Eye size={15} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(order.id)} 
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {expandedOrder === order.id && (
                      <tr className="bg-secondary/10">
                        <td colSpan="6" className="px-5 py-5 border-b border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up">
                            <div className="bg-background/60 rounded-2xl p-5 border border-border">
                              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                                <MapPin size={15} className="text-primary" /> Shipping Address
                              </h3>
                              {order.shipping_info ? (
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <p><span className="font-semibold text-foreground">Name:</span> {order.shipping_info.full_name}</p>
                                  <p><span className="font-semibold text-foreground">Phone:</span> {order.shipping_info.phone}</p>
                                  <p><span className="font-semibold text-foreground">Address:</span> {order.shipping_info.address}</p>
                                  <p><span className="font-semibold text-foreground">City:</span> {order.shipping_info.city}, {order.shipping_info.state}</p>
                                  <p><span className="font-semibold text-foreground">Postal:</span> {order.shipping_info.pincode}</p>
                                  <p><span className="font-semibold text-foreground">Country:</span> {order.shipping_info.country}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No shipping details provided.</p>
                              )}
                            </div>

                            <div className="bg-background/60 rounded-2xl p-5 border border-border">
                              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                                <Package size={15} className="text-primary" /> Ordered Items
                              </h3>
                              {order.order_items?.length > 0 ? (
                                <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 scrollbar-hide">
                                  {order.order_items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2.5 bg-secondary/40 rounded-xl border border-border/50">
                                      <div className="w-11 h-11 rounded-lg bg-secondary flex-shrink-0 overflow-hidden border border-border">
                                        {item.image ? (
                                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground"><Package size={14} /></div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground flex gap-2 flex-wrap mt-0.5">
                                          {item.size && <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">Size: {item.size}</span>}
                                          <span>Qty: {item.quantity}</span>
                                          <span className="flex items-center gap-0.5"><FaBangladeshiTakaSign size={9} />{item.price}</span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No items found.</p>
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
      
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={confirmDelete} 
        title="Delete Order" 
        message="Are you sure you want to delete this order? This action cannot be undone." 
      />
    </div>
  );
};

export default Orders;
