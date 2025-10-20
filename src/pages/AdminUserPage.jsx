import React from "react";
import { Navbar } from "../features/navigation/components/Navbar";
import { AdminUser } from "../features/admin/components/AdminUser";

export const AdminUserPage = () => {
    return (
        <>
            <Navbar />
            <AdminUser />
        </>
    );
};
