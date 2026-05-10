import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "phosphor-react";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  showBack?: boolean;
  showGreeting?: boolean;
}

export default function Header({ showBack = false, showGreeting = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const roleLabel: Record<string, string> = {
    victim: "Usuário Comum",
    volunteer: "Voluntário(a)",
    support_unit: "Instituição",
    admin: "Administrador",
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-card flex items-center justify-between px-8 py-4 border-b border-gray-100">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-[14.5px] transition-colors"
          style={{ color: '#276CF6' }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      ) : showGreeting ? (
        <p className="text-sm font-semibold text-gray-900">
          Bem-vindo(a), {user?.name}!
        </p>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-2">
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
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-400">{roleLabel[user?.role || ""]}</p>
        </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex cursor-pointer items-center justify-center transition-colors ml-5"
            title="Sair"
          >
            <img src="/icons/sair 2.png" alt="Sair" className="w-5 h-5" />
          </button>
      </div>
    </header>
  );
}