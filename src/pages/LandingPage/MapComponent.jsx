import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// import sampleImg from "../../assets/images/header-image.png";
//icons

import ApartmentIcon from '@mui/icons-material/Apartment';

import  icon  from  '../../assets/icons/red-maker.png'

const customIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [40, 40], // width and height
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});


export function MapComponent( {center,locations,zoom,customStyles}) {
 const defaultStyle = customStyles? customStyles : { height: '500px', width: '100%',borderRadius:"0px"  } 
  return (
<MapContainer center={center} zoom={zoom} style={defaultStyle}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {locations.map((location,index)=>{
    return (
  <Marker  key = {index} position={location.position}  icon={customIcon} >
    <Popup style={{backgroundColor:"red"}}>
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
