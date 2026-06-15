import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  House,
  Buildings,
  Plus,
  ClipboardText,
  Gear,
  Medal,
} from "phosphor-react";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

const menuByRole: Record<string, MenuItem[]> = {
  victim: [
    { icon: House, label: "Dashboard", path: "/home" },
    { icon: Buildings, label: "Unidades de Apoio", path: "/support-units" },
  ],
  volunteer: [
    { icon: House, label: "Dashboard", path: "/home" },
    { icon: Buildings, label: "Unidades de Apoio", path: "/support-units" },
    { icon: ClipboardText, label: "Candidaturas", path: "/candidatures" },
    { icon: Medal, label: "Certificados", path: "/certificates" },
  ],
  support_unit: [
    { icon: House, label: "Dashboard", path: "/home" },
    { icon: Buildings, label: "Unidades de Apoio", path: "/support-units" },
    { icon: Plus, label: "Criar nova Unidade", path: "/support-units/new" },
    { icon: ClipboardText, label: "Candidaturas", path: "/candidatures-institution" },
  ],
  admin: [
    { icon: House, label: "Dashboard", path: "/home" },
    { icon: Buildings, label: "Unidades de Apoio", path: "/support-units" },
    { icon: Medal, label: "Certificados", path: "/certificates" },
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = user ? menuByRole[user.role] || [] : [];


  return (
    <aside className="w-[220px] bg-sidebar text-white flex flex-col">
      {/* LOGO */}
      <div className="flex items-center justify-center h-40 ">
        <img
          src="/Logo.png"
          alt="SOS Connect"
          className="w-50 object-contain"
        />
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors  cursor-pointer ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-gray-400 to-sidebar-hover hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="p-3 space-y-1 mb-5">
        <button
          onClick={() => navigate("/settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
            location.pathname === "/settings"
              ? "bg-white/20 text-white"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Gear size={18} />
          Configurações
        </button>
        
      </div>
    </aside>
  );
}
