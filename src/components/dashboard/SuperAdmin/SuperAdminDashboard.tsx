'use client';
import { useState } from "react";
import ListaAdmin from "./ListaAdmin";

const SuperAdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Administradores creados");

  const renderContent = () => {
    switch (selectedOption) {
      case "Administradores creados":
        return <ListaAdmin />;
      default:
        return <div>Seleccione una opción</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-mi-color-rgb text-white p-5">
        <h2 className="text-xl font-bold mb-4">Panel de Administrador</h2>
        <ul>
          {["Administradores creados"].map((option) => (
            <li
              key={option}
              className={`p-3 cursor-pointer rounded-lg hover:bg-gray-700 ${
                selectedOption === option ? "bg-gray-600" : ""
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-10 bg-celeste">{renderContent()}</div>
    </div>
  );
};

export default SuperAdminDashboard;
