import React from "react";
import { Outlet } from "react-router";
import { NavbarEcommerce } from "../components/Ecommerce/NavbarEcommerce";

const TiendaLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarEcommerce />
            <main className="flex-1">
                <Outlet />
            </main>
            {/* Footer */}
        </div>
    )
}

export default TiendaLayout;