import { useState } from "react";
import UnitModal from "../UnitModal/index";
import CreateDonationModal from "../CreateDonationModal/index";
import { useNavigate } from "react-router-dom";
import { PencilSimple, CheckCircle } from "phosphor-react";
import StatusBadge from "../StatusBadge/index";
import { useReverseGeocode } from "../../utils/geocoding";

interface SupportUnit {
  _id: string;
  name: string;
  status: string;
  validated: boolean;
  capacity: number;
  current_occupancy: number;
  location: { coordinates: number[] };
  services_available: string[];
  support_unit_user_id: string;
  contact: { email: string; phone: string };
}

interface UnitCardProps {
  unit: SupportUnit;
  role: string;
  isOwner?: boolean;
  onApprove?: (unitId: string) => void;
  onDelete?: (unitId: string) => void;
}

export default function UnitCard({
  unit,
  role,
  isOwner = false,
  onApprove,
  onDelete,
}: UnitCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { address, loading: addressLoading } = useReverseGeocode(
    unit.location?.coordinates[1] || 0,
    unit.location?.coordinates[0] || 0,
  );

  const renderButtons = () => {
    if (role === "volunteer") {
      return (
        <div className="flex items-center justify-center mt-auto gap-2">
          <button
            onClick={() => navigate(`/support-units/${unit._id}/donations`)}
            className="text-xs cursor-pointer border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Fazer uma Doação
          </button>
          <button
            onClick={() => navigate(`/support-units/${unit._id}/missions`)}
            className="text-xs cursor-pointer border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Missões de Ajuda
          </button>
        </div>
      );
    } else if (role === "victim") {
      return (
        <div className="flex justify-center mt-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Visualizar
          </button>
          <UnitModal
            unit={modalOpen ? unit : null}
            onClose={() => setModalOpen(false)}
          />
        </div>
      );
    } else if (role === "support_unit" && isOwner) {
      return (
        <>
          <div className="flex items-center justify-center mt-auto gap-2">
            <button
              onClick={() => setDonationModalOpen(true)}
              className="text-xs cursor-pointer border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Doação
            </button>
            <button
              onClick={() => navigate(`/support-units/${unit._id}/missions`)}
              className="text-xs cursor-pointer border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Missão
            </button>
            <button
              onClick={() => navigate(`/support-units/${unit._id}/edit`)}
              title="Editar unidade"
              className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <PencilSimple size={18} color="gray" />
            </button>
          </div>

          <CreateDonationModal
            isOpen={donationModalOpen}
            onClose={() => setDonationModalOpen(false)}
            unitId={unit._id}
          />
        </>
      );
    } else if (role === "support_unit" && !isOwner) {
      return (
        <div className="flex justify-center mt-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Visualizar
          </button>
          <UnitModal
            unit={modalOpen ? unit : null}
            onClose={() => setModalOpen(false)}
          />
        </div>
      );
    } else if (role === "admin") {
      return (
        <div className="flex items-center justify-center mt-auto gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs cursor-pointer border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Visualizar
          </button>
          <UnitModal
            unit={modalOpen ? unit : null}
            onClose={() => setModalOpen(false)}
          />
          {!unit.validated && onApprove && (
            <button
              onClick={() => onApprove(unit._id)}
              className="text-xs cursor-pointer border border-green-200 text-green-600 rounded-lg px-4 py-1.5 hover:bg-green-50 transition-colors"
            >
              Aprovar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(unit._id)}
              className="text-xs cursor-pointer border border-red-200 text-red-600 rounded-lg px-4 py-1.5 hover:bg-red-50 transition-colors"
            >
              Excluir
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`font-semibold text-gray-900 ${isOwner ? "" : "text-sm"}`}
        >
          {unit.name}
        </h3>
        <StatusBadge status={unit.status} />
      </div>

      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <div className="flex items-start gap-2">
          <img
            src="/icons/location.png"
            alt="Endereço"
            className="w-4 h-4 mt-0.5 shrink-0"
          />
          <span>{addressLoading ? "Carregando endereço..." : address}</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/icons/capacity.png"
            alt="Capacidade"
            className="w-4 h-4 shrink-0"
          />
          <span>
            Capacidade restante: {unit.capacity - unit.current_occupancy}
          </span>
        </div>
      </div>

      {renderButtons()}
    </div>
  );
}
