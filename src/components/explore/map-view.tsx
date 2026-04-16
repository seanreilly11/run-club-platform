"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useState } from "react";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

// Fix broken default marker icons (Leaflet + webpack asset issue)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;

const CITY_CENTERS: Record<string, [number, number]> = {
  sydney: [-33.8688, 151.2093],
  london: [51.5074, -0.1278],
  amsterdam: [52.3676, 4.9041],
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function createClubIcon(name: string): L.DivIcon {
  const initials = getInitials(name);
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#F43F5E;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;font-family:sans-serif;
      border:2px solid #fff;
      box-shadow:0 0 0 3px rgba(244,63,94,0.35),0 2px 6px rgba(0,0,0,0.18);
    ">${initials}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:#3B82F6;
      border:2px solid #fff;
      box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 4px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

interface MarkerCluster {
  getChildCount(): number;
}

function clusterIconCreateFunction(cluster: MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:#F43F5E;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:13px;font-weight:700;font-family:sans-serif;
      border:2px solid #fff;
      box-shadow:0 2px 8px rgba(244,63,94,0.4);
    ">${count}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

interface CityPannerProps {
  selectedCity: string;
}

function CityPanner({ selectedCity }: CityPannerProps) {
  const map = useMap();

  useEffect(() => {
    const key = selectedCity?.toLowerCase();
    const center = CITY_CENTERS[key];
    if (center) {
      map.setView(center, 13);
    }
  }, [map, selectedCity]);

  return null;
}

interface MapViewProps {
  clubs: ExploreClubRow[];
  selectedCity: string;
  onClose?: () => void;
}

export function MapView({ clubs, selectedCity, onClose }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  function requestUserLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Permission denied or unavailable — silently ignore
      },
    );
  }

  const cityKey = selectedCity?.toLowerCase();
  const defaultCenter: [number, number] =
    CITY_CENTERS[cityKey] ?? [20, 0];
  const defaultZoom = selectedCity ? 12 : 3;

  // Build valid markers — prefer meetingPoint coords, fall back to club coords
  const clubMarkers = clubs.flatMap((club) => {
    const lat = club.nextEvent?.meetingPointLat ?? club.locationLat;
    const lng = club.nextEvent?.meetingPointLng ?? club.locationLng;
    if (lat == null || lng == null) return [];
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return [];
    return [{ club, position: [latNum, lngNum] as [number, number] }];
  });

  return (
    <div
      className="
        fixed inset-0 z-50
        md:relative md:inset-auto md:z-auto
        md:h-[500px] md:w-full md:rounded-[14px] md:overflow-hidden
      "
    >
      {/* Back button — mobile only */}
      <button
        onClick={onClose}
        className="
          absolute left-3 top-3 z-[1000] md:hidden
          rounded-[10px] bg-white px-3 py-1.5 text-[13px] font-medium
          text-text shadow-md
        "
      >
        ← Back to list
      </button>

      {/* Near me button */}
      <button
        onClick={requestUserLocation}
        className="
          absolute bottom-4 right-3 z-[1000]
          rounded-[10px] bg-white px-3 py-1.5 text-[12px] font-medium
          text-text shadow-md
        "
      >
        Near me
      </button>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CityPanner selectedCity={selectedCity} />

        <MarkerClusterGroup iconCreateFunction={clusterIconCreateFunction}>
          {clubMarkers.map(({ club, position }) => (
            <Marker
              key={club.id}
              position={position}
              icon={createClubIcon(club.name)}
            >
              <Popup minWidth={280} maxWidth={280}>
                <div style={{ fontFamily: "sans-serif", padding: "4px 2px" }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      margin: "0 0 4px",
                    }}
                  >
                    {club.name}
                  </p>
                  {club.nextEvent && (
                    <>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#78716C",
                          margin: "0 0 2px",
                        }}
                      >
                        {club.nextEvent.meetingPointName}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#78716C",
                          margin: "0 0 4px",
                        }}
                      >
                        {formatEventDate(club.nextEvent.date)}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#F43F5E",
                          fontWeight: 600,
                          margin: "0 0 6px",
                        }}
                      >
                        {club.nextEvent.goingCount} going
                      </p>
                      {club.nextEvent.postRunVenueName && (
                        <div
                          style={{
                            background: "#FEF3C7",
                            color: "#B45309",
                            borderRadius: "7px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: 500,
                            marginBottom: "8px",
                          }}
                        >
                          Afters at {club.nextEvent.postRunVenueName}
                        </div>
                      )}
                    </>
                  )}
                  <a
                    href={`/${club.slug}`}
                    style={{
                      fontSize: "13px",
                      color: "#F43F5E",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    rel="noopener noreferrer"
                  >
                    View club →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {userLocation && (
          <Marker position={userLocation} icon={createUserLocationIcon()} />
        )}
      </MapContainer>
    </div>
  );
}
