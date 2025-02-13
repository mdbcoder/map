import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  LayersControl,
  CircleMarker,
  LayerGroup,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DriftMarker from "react-leaflet-drift-marker";
import { LOCATION } from "../assets";
import { CustomTimeline } from "../custom-timeline/custom-timeline";

// **Custom marker ikonkasi**
const customIcon = new L.Icon({
  iconUrl: LOCATION,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

// **GPS nuqtalari**
interface GPSPoint {
  lat: number;
  lng: number;
}

// **Odam yurish marshruti (simulyatsiya ma’lumotlari)**
const gpsData: GPSPoint[] = [
  { lat: 39.7684, lng: 64.4555 },
  { lat: 39.7695, lng: 64.4566 },
  { lat: 39.7708, lng: 64.4581 },
  { lat: 39.772, lng: 64.4595 },
  { lat: 39.7733, lng: 64.4608 },
];

const MapWithPlayback: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [path, setPath] = useState<GPSPoint[]>([]);
  const [position, setPosition] = useState<GPSPoint>(gpsData[0]);

  useEffect(() => {
    if (index < gpsData.length) {
      const timer = setTimeout(() => {
        setPath((prev) => [...prev, gpsData[index]]);
        setPosition(gpsData[index]); // Marker pozitsiyasini yangilash
        setIndex(index + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div className="mt-10 py-10">
      <MapContainer
        center={[39.7684, 64.4555]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <LayersControl position="topright" collapsed={false}>
          {/* Google Maps Hybrid Layer */}
          <LayersControl.BaseLayer name="Google Hybrid">
            <TileLayer url="https://mt.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
          </LayersControl.BaseLayer>

          {/* Carto Voyager Map */}
          <LayersControl.BaseLayer name="Carto Voyager Map">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>

          {/* OpenStreetMap Layer */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          {/* GPS Tracks Line */}
          <LayersControl.Overlay checked name="GPS Tracks lines">
            <Polyline
              positions={path.map((p) => [p.lat, p.lng])}
              color="red"
              weight={2}
            />
          </LayersControl.Overlay>

          {/* GPS Tracks Dots */}
          <LayersControl.Overlay checked name="GPS Tracks dots">
            <LayerGroup>
              {gpsData.map((p, i) => (
                <CircleMarker
                  key={i}
                  center={[p.lat, p.lng]}
                  radius={5}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.5,
                  }}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* **Harakatlanuvchi marker (animatsiya bilan)** */}
        <DriftMarker
          position={[position.lat, position.lng]}
          icon={customIcon}
          duration={1000} // Animatsiya davomiyligi
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </DriftMarker>
      </MapContainer>
      {/* time line */}
      <CustomTimeline />
    </div>
  );
};

export default MapWithPlayback;
