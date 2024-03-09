import { Outlet, Navigate } from "react-router-dom";
import { PATHS } from "../../paths"
import { useSelector } from 'react-redux';
import Navbar from "../components/Navbar";

const RestrictedRoutes = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <div>
            {isAuthenticated ? (
                <>
                
                <Navigate to={PATHS.HOME} />
                </>
            ) : (
                <>
                
                <Outlet />
                </>
            )}
        </div>
    );
};

export default RestrictedRoutes;