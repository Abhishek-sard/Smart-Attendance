import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin bypass: Admins can access all protected routes
    if (user?.role === 'admin') {
        return <Outlet />;
    }

    console.log(`Checking access for role: ${user?.role}. Allowed: ${allowedRoles}`);

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        console.warn(`Access denied for role: ${user?.role}`);
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
