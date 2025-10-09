/* eslint-disable @typescript-eslint/no-explicit-any */
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import { useIsMobile } from "../hook/useMobile";

interface MapData {
  LATITUDE: number | string;
  LONGITUDE: number | string;
  [key: string]: any;
}

export function BaseMap({ data }: { data: MapData[] }) {
  const isMobile = useIsMobile();
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainerRef.current || !data || data.length === 0) return;

    if (mapRef.current && typeof mapRef.current.remove === "function") {
      try {
        mapRef.current.remove();
      } catch {
        console.warn("Map already destroyed, skip remove()");
      }
      mapRef.current = null;
    }

    const first = data[0];
    const centerLong = parseFloat(String(first?.LONGITUDE ?? 110.3689));
    const centerLat = parseFloat(String(first?.LATITUDE ?? -7.76363));

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_TOKEN_MAP}`,
      center: [centerLong, centerLat],
      zoom: 10,
      interactive: true,
    });

    mapRef.current = map;

    fetch("/kutai_timur.json")
    .then((response) => response.json())
    .then((geojson) => {
      // Add the GeoJSON source
      map.addSource("kutai-timur", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "kutai-timur-fill",
        type: "fill",
        source: "kutai-timur",
        paint: {
          "fill-color": "#00BFA5",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: "kutai-timur-outline",
        type: "line",
        source: "kutai-timur",
        paint: {
          "line-color": "#00796B",
          "line-width": 2,
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      geojson.features.forEach((feature: any) => {
        feature.geometry.coordinates.flat(2).forEach((coord: any) => {
          bounds.extend(coord as [number, number]);
        });
      });
      map.fitBounds(bounds, { padding: 40 });
    })
    .catch((err) => console.error("Failed to load Kutai Timur GeoJSON:", err));

    data.forEach((item) => {
      const lat = parseFloat(String(item.LATITUDE));
      const long = parseFloat(String(item.LONGITUDE));
      if (!isNaN(lat) && !isNaN(long)) {
        new maplibregl.Marker({ color: "#e63946" })
          .setLngLat([long, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div>
                <strong>${item["DES/KEL"] ?? "Tidak diketahui"}</strong><br/>
                ${item.KEC ?? ""}, ${item["KAB/KOT"] ?? ""}<br/>
                <small>(${lat.toFixed(5)}, ${long.toFixed(5)})</small>
              </div>
            `)
          )
          .addTo(map);
      }
    });

    const bounds = new maplibregl.LngLatBounds();
    data.forEach((item) => {
      const lat = parseFloat(String(item.LATITUDE));
      const long = parseFloat(String(item.LONGITUDE));
      if (!isNaN(lat) && !isNaN(long)) bounds.extend([long, lat]);
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 50 });

    return () => {
      if (mapRef.current && typeof mapRef.current.remove === "function") {
        try {
          mapRef.current.remove();
        } catch {
          console.warn("Cleanup skip — map already destroyed");
        }
        mapRef.current = null;
      }
    };
  }, [data]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: isMobile ? "500px" : "600px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
