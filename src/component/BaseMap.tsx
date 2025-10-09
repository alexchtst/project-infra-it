/* eslint-disable @typescript-eslint/no-explicit-any */
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import { useIsMobile } from "../hook/useMobile";
import GeoSpatialKalimantanTimur from "../data/static-spatial.json";

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
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_TOKEN_MAP}`,
      center: [centerLong, centerLat],
      zoom: 10,
      interactive: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Tambahkan source untuk batas wilayah
      map.addSource("boundary", {
        type: "geojson",
        data: GeoSpatialKalimantanTimur as any,
      });

      map.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: "boundary",
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.15,
        },
      });

      // Layer untuk garis batas wilayah
      map.addLayer({
        id: "boundary-outline",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": "#0066cc",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });

      map.addLayer({
        id: "boundary-label",
        type: "symbol",
        source: "boundary",
        layout: {
          "text-field": ["get", "nm_dati2"],
          "text-size": 12,
          "text-font": ["Open Sans Regular"],
        },
        paint: {
          "text-color": "#0066cc",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      map.on("mouseenter", "boundary-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "boundary-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      // Tampilkan popup saat area wilayah diklik
      map.on("click", "boundary-fill", (e) => {
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties;
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 10px 10px 10px 10px;">
                <h3 style="margin: 5px 5px 5px 5px;">${properties?.nm_dati2 ?? "Wilayah"}</h3>
                <p style="margin: 10px;"><strong>Kode Provinsi:</strong> ${properties?.kd_propinsi ?? "-"}</p>
              </div>
            `)
            .addTo(map);
        }
      });
    });

    // Tambahkan markers untuk data point
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

    // Fit bounds berdasarkan data point
    const bounds = new maplibregl.LngLatBounds();
    data.forEach((item) => {
      const lat = parseFloat(String(item.LATITUDE));
      const long = parseFloat(String(item.LONGITUDE));
      if (!isNaN(lat) && !isNaN(long)) bounds.extend([long, lat]);
    });
    
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50 });
    }

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