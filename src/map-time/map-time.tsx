import React, { useEffect, useState, useRef } from "react";
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
import { DataSet, Timeline, TimelineOptions } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { LOCATION } from "../assets";

// **Custom marker ikonkasi**
const customIcon = new L.Icon({
  iconUrl: LOCATION,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

// **GPS nuqtalari va ularning vaqt belgilari**
interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

// **GPS ma’lumotlari (simulyatsiya)**
const gpsData: GPSPoint[] = [
  { lat: 39.7684, lng: 64.4555, timestamp: 1738608360000 },
  { lat: 39.7695, lng: 64.4566, timestamp: 1738611060000 },
  { lat: 39.7708, lng: 64.4581, timestamp: 1738613400000 },
  { lat: 39.772, lng: 64.4595, timestamp: 1738622820000 },
  { lat: 39.7733, lng: 64.4608, timestamp: 1738628760000 },
];

const MapWithPlayback: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [path, setPath] = useState<GPSPoint[]>([]);
  const [position, setPosition] = useState<GPSPoint>(gpsData[0]);

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<Timeline | null>(null);

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

  useEffect(() => {
    if (!timelineRef.current) return;
    const container = timelineRef.current;
    const startTime = new Date(gpsData[0].timestamp);
    const endTime = new Date(gpsData[gpsData.length - 1].timestamp);

    const timelineData = new DataSet([
      { id: 1, content: "GPS harakati", start: startTime, end: endTime },
    ]);

    const options: TimelineOptions = {
      showCurrentTime: true,
      start: startTime,
      end: endTime,
      editable: false,
      height: "120px",
      snap: function (date: Date) {
        return new Date(Math.round(date.getTime() / 60000) * 60000);
      },
    };

    timeline.current = new Timeline(container, timelineData, options);

    timeline.current.addCustomTime(startTime, "customTimeBar");

    timeline.current.on("timechange", function (properties) {
      const newTime = properties.time.getTime();
      console.log("Vaqt o‘zgardi:", newTime);

      // GPS vaqtiga yaqin bo‘lgan nuqtani topish
      const closestPoint = gpsData.reduce((prev, curr) => {
        return Math.abs(curr.timestamp - newTime) <
          Math.abs(prev.timestamp - newTime)
          ? curr
          : prev;
      });

      setPosition(closestPoint);
    });

    return () => {
      if (timeline.current) {
        timeline.current.destroy();
      }
    };
  }, []);

  return (
    <div className="mt-10 py-10">
      {/* **Xarita** */}
      <MapContainer
        center={[39.7684, 64.4555]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <LayersControl position="topright" collapsed={false}>
          <LayersControl.BaseLayer name="Google Hybrid">
            <TileLayer url="https://mt.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Carto Voyager Map">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="GPS Tracks lines">
            <Polyline
              positions={path.map((p) => [p.lat, p.lng])}
              color="red"
              weight={2}
            />
          </LayersControl.Overlay>

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

        {/* **Harakatlanuvchi marker** */}
        <DriftMarker
          position={[position.lat, position.lng]}
          icon={customIcon}
          duration={1000}
        >
          <Popup>
            Hozirgi joylashuv: {position.lat}, {position.lng}
          </Popup>
        </DriftMarker>
      </MapContainer>
      {/* **Timeline** */}
      <div ref={timelineRef} style={{ height: "300px" }}></div>
    </div>
  );
};

export default MapWithPlayback;
