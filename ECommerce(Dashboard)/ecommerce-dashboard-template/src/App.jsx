import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./store/slices/authSlice";
import { fetchAllReturnRequests } from "./store/slices/orderSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Users from "./components/Users";
import Subscribers from "./components/Subscribers";
import Returns from "./components/Returns";
import Messages from "./components/Messages";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const AdminLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllReturnRequests());
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideBar />
      <div className="flex-1 flex flex-col relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="returns" element={<Returns />} />
          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
