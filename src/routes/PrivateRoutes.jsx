import { Outlet, Navigate } from "react-router-dom";
import { PATHS } from "../../paths";
import { useSelector } from 'react-redux';
import Layout from "../components/Layout/Layout";

const PrivateRoutes = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    
    return (
        <Layout>
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <Navigate to={PATHS.LOGIN} />
            )}
        </Layout>
    );
};

export default PrivateRoutes;