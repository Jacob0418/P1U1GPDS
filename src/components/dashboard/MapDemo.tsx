import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const sensoresCoords = [
    { lat: 17.941229, lon: -92.963229, tipo: "Temperatura" },
    { lat: 17.939237, lon: -92.896933, tipo: "Temperatura" },
    { lat: 18.017229, lon: -92.916334, tipo: "Humedad" },
    { lat: 18.022092, lon: -92.960518, tipo: "Radiación Solar" },
];

const MapDemo = () => (
    <MapContainer
        center={[18.0, -92.95]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sensoresCoords.map((sensor, idx) => (
            <Marker key={idx} position={[sensor.lat, sensor.lon]}>
                <Popup>
                    <strong>{sensor.tipo}</strong>
                    <br />
                    Lat: {sensor.lat}
                    <br />
                    Lon: {sensor.lon}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
);

export default MapDemo;