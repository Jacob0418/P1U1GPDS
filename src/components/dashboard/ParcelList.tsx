import { MapPin, Leaf, Trash2, Calendar } from "lucide-react";
import type { Parcel } from "../../types/parcel";

interface ParcelListProps {
    parcels: Parcel[];
    onDelete: (id: string) => void;
}

const ParcelList = ({ parcels, onDelete }: ParcelListProps) => {
    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (parcels.length === 0) {
        return (
            <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay parcelas registradas</p>
                <p className="text-sm text-gray-400 mt-1">Las parcelas aparecerán aquí cuando las crees</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-100 space-y-2">
            {parcels.map((parcel, index) => (
                <li
                    key={parcel.id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 transition-colors"
                >
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="font-semibold text-gray-800">
                                {parcel.name}
                            </div>
                            {/* ✅ Badge para indicar parcela reciente */}
                            {index < 2 && (
                                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                                    Nueva
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" /> 
                                {parcel.latitude?.toFixed(4) || 'N/A'}, {parcel.longitude?.toFixed(4) || 'N/A'}
                            </div>
                            
                            {parcel.crop && (
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Leaf className="w-4 h-4 mr-1 text-green-500" /> 
                                    {parcel.crop}
                                </div>
                            )}
                            
                            <div className="text-xs text-gray-400 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Creada: {formatDate(parcel.created_at)}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onDelete(parcel.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer ml-3"
                        title="Eliminar parcela"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ParcelList;