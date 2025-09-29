import { MapPin, Leaf, Trash2 } from "lucide-react";
import type { Parcel } from "../../types/parcel";

const ParcelList = ({ parcels, onDelete } : { parcels: Parcel[], onDelete: (id: string) => void }) => (
    <ul className="divide-y divide-gray-100">
        {parcels.map((parcel) => (
            <li
                key={parcel.id}
                className="py-4 flex items-center justify-between ">
                <div>
                    <div className="font-semibold text-gray-800">
                        {parcel.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {parcel.latitude}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                        <Leaf className="w-4 h-4 mr-1" /> {parcel.crop}
                    </div>
                </div>
                <button
                    onClick={() => onDelete(parcel.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </li>
        ))}
    </ul>
);

export default ParcelList;