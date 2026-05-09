import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if ((user as any).avatar) {
        setAvatarPreview(
          `http://localhost:3000/uploads/${(user as any).avatar}`,
        );
      }
    }
  }, [user]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: { name?: string; email?: string; password?: string } = {};
      if (name !== user?.name) payload.name = name;
      if (email !== user?.email) payload.email = email;
      if (password.length >= 6) payload.password = password;

      if (Object.keys(payload).length > 0) {
        await api.put(`/users/${user?._id}`, payload);
      }

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const response = await api.post(
          `/users/${user?._id}/avatar`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        const updatedUser = response.data;
        const storedUser = JSON.parse(
          localStorage.getItem("@sos-connect:user") || "{}",
        );
        updateUser({ avatar: updatedUser.avatar });
        setAvatarFile(null);
      }

      if (Object.keys(payload).length === 0 && !avatarFile) {
        toast.info("Nenhuma alteração detectada.");
        setLoading(false);
        return;
      }
      updateUser({ name, email });
      toast.success("Configurações salvas com sucesso!");
      setPassword("");
    } catch {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-base font-semibold mb-6 text-gray-900">
        Configurações
      </h1>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div
            className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Adicionar foto de perfil
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Faça o upload da sua foto.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Escolher arquivo
            </button>
            {avatarFile && (
              <span className="text-xs text-gray-400 ml-2">
                {avatarFile.name}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white text-sm px-8 py-2.5 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
