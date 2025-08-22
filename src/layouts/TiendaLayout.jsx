import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";

const TiendaLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            {/* Footer */}
        </div>
    )
}

export default TiendaLayout;