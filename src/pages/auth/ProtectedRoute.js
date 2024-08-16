import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const ProtectedRoute = ({ roles, children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRoles = user.roles || [];
    const hasPermission = roles.some(role => userRoles.includes(role));

    if (!hasPermission) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
