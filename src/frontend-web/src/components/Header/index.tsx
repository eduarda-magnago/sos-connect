import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "phosphor-react";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleLabel: Record<string, string> = {
    victim: "Usuário Comum",
    volunteer: "Voluntário(a)",
    support_unit: "Instituição",
    admin: "Administrador",
  };

  return (
    <header className=" bg-card flex items-center justify-between px-8 py-4 border-b border-gray-100">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-4 text-sm transition-colors ${
            showBack ? "text-gray-500 hover:text-gray-900" : "invisible"
          }`}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-4 ">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-400">{roleLabel[user?.role || ""]}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {(user as any)?.avatar ? (
            <img
              src={`http://localhost:3000/uploads/${(user as any).avatar}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={18} className="text-gray-500" />
          )}
        </div>
      </div>
    </header>
  );
}
