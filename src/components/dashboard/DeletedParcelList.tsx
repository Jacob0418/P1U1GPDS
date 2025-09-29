import { MapPin, Leaf, User } from "lucide-react";

const DeletedParcelList = ({ deletedParcels }) => (
    <ul className="divide-y divide-gray-100">
        {deletedParcels.map((parcel) => (
            <li key={parcel.id} className="py-4">
                <div className="font-semibold text-gray-800">
                    {parcel.name}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> {parcel.location}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                    <Leaf className="w-4 h-4 mr-1" /> {parcel.crop}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                    <User className="w-4 h-4 mr-1" /> {parcel.manager}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    Eliminada: {parcel.deletedAt}
                </div>
            </li>
        ))}
    </ul>
);

export default DeletedParcelList;