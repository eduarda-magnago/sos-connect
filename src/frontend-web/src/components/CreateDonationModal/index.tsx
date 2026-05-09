import { useState, type ChangeEvent } from "react";
import { X } from "phosphor-react";
import api from "../../services/api";

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
}

interface DonationForm {
  item_name: string;
  quantity_needed: string;
  priority: "low" | "medium" | "high" | "critical";
}

const initialFormState: DonationForm = {
  item_name: "",
  quantity_needed: "",
  priority: "medium",
};

export default function CreateDonationModal({
  isOpen,
  onClose,
  unitId,
}: CreateDonationModalProps) {
  const [form, setForm] = useState<DonationForm>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.item_name.trim()) {
      setError("Por favor, informe o nome do item.");
      return;
    }

    const quantity = Number(form.quantity_needed);
    if (!quantity || quantity <= 0) {
      setError("A quantidade necessária deve ser um número maior que zero.");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/support-units/${unitId}/donation-needs`, {
        item_name: form.item_name.trim(),
        quantity_needed: quantity,
        priority: form.priority,
      });
      setForm(initialFormState);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        "Não foi possível criar a necessidade. Verifique sua conexão ou tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Crie uma necessidade de doação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed -mt-2">
          Informe o item e a quantidade necessária para que a unidade possa
          receber doações corretamente.
        </p>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Field label="Item">
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="Ex: Cobertor"
              className={inputClass}
            />
          </Field>

          <Field label="Quantidade necessária">
            <input
              name="quantity_needed"
              value={form.quantity_needed}
              onChange={handleChange}
              placeholder="Digite a quantidade necessária"
              type="number"
              min={1}
              className={inputClass}
            />
          </Field>

          <Field label="Prioridade">
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </Field>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white text-sm font-medium rounded-xl py-3 mt-1 hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Criando..." : "Criar necessidade"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full text-xs border border-gray-200 rounded-lg px-3 py-2 placeholder-gray-300 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 transition";
