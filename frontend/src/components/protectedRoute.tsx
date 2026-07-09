import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext"
import Navbar from "./navbar";


const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData()
  const location = useLocation()
  // console.log(user)
  if (loading) return <span className="text-4xl" >Loaing from protected route...</span>;
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />
  }
  if (user?.role !== null && location.pathname === "/select-role") {
    return <Navigate to="/" replace />
  }
  return <>
    <Navbar />
    <Outlet />
  </>
}
export default ProtectedRoute;