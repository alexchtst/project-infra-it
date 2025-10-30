/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import KutaiTimurGeoJson from "@/data/map-geojson/id6404_kutai_timur.json";
import { useIsMobile } from "@/hook/useMobile";
import { ModalContext, ModalKindEnum } from "@/context-provider/modal-provider";
import { CONFIG_SVG, GLOBE_SVG, MAP_SVG, STATISTIC_SVG } from "@/component/map-screen/svg-constant";
import { DataFlowContext, maptype } from "@/context-provider/data-flow-provider";

export function BaseMapComponent() {
    const isMobile = useIsMobile();
    const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
    const mapRef = React.useRef<maplibregl.Map | null>(null);
    const { setModalKind } = React.useContext(ModalContext);
    const { mapType, setMapType } = React.useContext(DataFlowContext);

    React.useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/${mapType}/style.json?key=${process.env.NEXT_PUBLIC_TOKEN_MAP}`,
            center: [117.5, -0.5],
            zoom: 12,
        });

        mapRef.current = map;

        const navControl = new maplibregl.NavigationControl();
        map.addControl(navControl, "top-right");

        const geoControl = new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
        });
        map.addControl(geoControl, "top-right");

        // open street map type controller
        const openStreetMapController = document.createElement("div");
        openStreetMapController.className = "maplibregl-ctrl maplibregl-ctrl-group text-center p-[3px] cursor-pointer hover:bg-gray-300";
        openStreetMapController.title = "Open Street Map";
        openStreetMapController.innerHTML = MAP_SVG;
        openStreetMapController.onclick = () => {
            setMapType(maptype.streets);
        };
        map.addControl({
            onAdd: () => openStreetMapController,
            onRemove: () => openStreetMapController.remove(),
        }, "top-right");

        // open street map type controller
        const satelliteMapController = document.createElement("div");
        satelliteMapController.className = "maplibregl-ctrl maplibregl-ctrl-group text-center p-[3px] cursor-pointer hover:bg-gray-300";
        satelliteMapController.title = "Satellite Map";
        satelliteMapController.innerHTML = GLOBE_SVG;
        satelliteMapController.onclick = () => {
            setMapType(maptype.satellite);
        };
        map.addControl({
            onAdd: () => satelliteMapController,
            onRemove: () => satelliteMapController.remove(),
        }, "top-right");

        // config controller
        const mapConfigControlContainer = document.createElement("div");
        mapConfigControlContainer.className = "maplibregl-ctrl maplibregl-ctrl-group text-center p-[3px] cursor-pointer hover:bg-gray-300";
        mapConfigControlContainer.title = "Configurasi";
        mapConfigControlContainer.innerHTML = CONFIG_SVG;
        mapConfigControlContainer.onclick = () => {
            setModalKind(ModalKindEnum.option);
        };
        map.addControl({
            onAdd: () => mapConfigControlContainer,
            onRemove: () => mapConfigControlContainer.remove(),
        }, "top-right");

        const mapStatisticControlContainer = document.createElement("div");
        mapStatisticControlContainer.className = "maplibregl-ctrl maplibregl-ctrl-group text-center p-[3px] cursor-pointer hover:bg-gray-300";
        mapStatisticControlContainer.title = "Statistic";
        mapStatisticControlContainer.innerHTML = STATISTIC_SVG;
        mapStatisticControlContainer.onclick = () => {
            setModalKind(ModalKindEnum.statistic);
        };
        map.addControl({
            onAdd: () => mapStatisticControlContainer,
            onRemove: () => mapStatisticControlContainer.remove(),
        }, "top-right");

        map.on("load", () => {
            map.addSource("kutai-timur", {
                type: "geojson",
                data: KutaiTimurGeoJson as GeoJSON.FeatureCollection,
            });

            map.addLayer({
                id: "kutai-fill",
                type: "fill",
                source: "kutai-timur",
                paint: {
                    "fill-color": "#2196F3",
                    "fill-opacity": 0.2,
                },
            });

            map.addLayer({
                id: "kutai-border",
                type: "line",
                source: "kutai-timur",
                paint: {
                    "line-color": "#333",
                    "line-width": 1,
                },
            });

            const bounds = new maplibregl.LngLatBounds();
            (KutaiTimurGeoJson as GeoJSON.FeatureCollection).features.forEach((feature) => {
                const coordinates =
                    feature.geometry.type === "Polygon"
                        ? feature.geometry.coordinates[0]
                        : feature.geometry.type === "MultiPolygon"
                            ? feature.geometry.coordinates[0][0]
                            : null;

                if (coordinates) {
                    coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
                }
            });
            map.fitBounds(bounds, { padding: 30 });
        });

        return () => map.remove();
    }, [mapType]);

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
