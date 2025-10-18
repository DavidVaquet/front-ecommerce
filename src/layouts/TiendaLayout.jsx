import React from "react";
import { Outlet } from "react-router";
import { NavbarEcommerce } from "../components/Ecommerce/NavbarEcommerce";
import { FooterEcommerce } from "../components/Ecommerce/Footer";

const TiendaLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarEcommerce />
            <main className="flex-1">
                <Outlet />
            </main>
            {/* Footer */}
            {/* <FooterEcommerce /> */}
        </div>
    )
}

export default TiendaLayout;