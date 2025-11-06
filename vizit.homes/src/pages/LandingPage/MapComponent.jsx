import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


// import sampleImg from "../../assets/images/header-image.png";




export function MapComponent( {center,locations,zoom}) {

  return (
<MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%',borderRadius:"30px"  }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {locations.map((location,index)=>{
    return (
  <Marker  key = {index} position={location.position}  >
    <Popup >
      <h3>{location.title}</h3>
      <br />
      <img src={location.images[0]} alt="" width={300} style={{objectFit:"contain"}} />
    </Popup>
  </Marker>
    )
  })}


</MapContainer >
  );
}
