import { Navigate, Outlet } from "react-router-dom"
import { useAppData } from "../context/AppContext"

const PublicRoute = () => {
  const { isAuth, loading } = useAppData()
  if (loading) return <span className="text-red-500" >Loading from public route</span>;
  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoute;

