import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
export function MapComponent() {

  return (
<MapContainer center={[4.0511, 9.7679]} zoom={13} style={{ height: '500px', width: '100%',borderRadius:"30px" ,zIndex:-2 }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[4.057, 9.768]}>
    <Popup>Verified Zone</Popup>
  </Marker>
</MapContainer>
  );
}
