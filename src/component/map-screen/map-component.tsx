/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import KutaiTimurGeoJson from "@/data/map-geojson/id6404_kutai_timur.json";
import { ModalContext, ModalKindEnum } from "@/context-provider/modal-provider";
import { CONFIG_SVG, NETWORK_SVG, STATISTIC_SVG } from "@/component/map-screen/svg-constant";
import { DataFlowContext, mapdataproperty } from "@/context-provider/data-flow-provider";
import { NetworkDataSelector } from "@/helper/marker-selector";

export function BaseMapComponent() {
    const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
    const mapRef = React.useRef<maplibregl.Map | null>(null);
    const { setModalKind } = React.useContext(ModalContext);
    const { namadesaConfig, configvalueManagement } = React.useContext(DataFlowContext);

    React.useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_TOKEN_MAP}`,
            center: [117.29933710582266, 1.0127282820201768],
            zoom: 8,
        });

        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        const createControl = (title: string, svg: string, onClick: () => void) => {
            const el = document.createElement("div");
            el.className =
                "maplibregl-ctrl maplibregl-ctrl-group text-center p-[3px] cursor-pointer hover:bg-gray-300";
            el.title = title;
            el.innerHTML = svg;
            el.onclick = onClick;
            return {
                onAdd: () => el,
                onRemove: () => el.remove(),
            };
        };

        map.addControl(
            createControl("Configurasi", CONFIG_SVG, () => setModalKind(ModalKindEnum.option)),
            "top-right"
        );
        map.addControl(
            createControl("Statistic", STATISTIC_SVG, () => setModalKind(ModalKindEnum.statistic)),
            "top-right"
        );

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
                    "fill-opacity": 0.1,
                },
            });

            map.addLayer({
                id: "kutai-highlight",
                type: "fill",
                source: "kutai-timur",
                paint: {
                    "fill-color": "#2196F3",
                    "fill-opacity": 0.4,
                },
                filter: ["==", "village", ""],
            });

            map.addLayer({
                id: "kutai-outline",
                type: "line",
                source: "kutai-timur",
                paint: {
                    "line-color": "#1976D2",
                    "line-width": 2,
                },
                filter: ["==", "village", ""],
            });
        });

        return () => map.remove();
    }, []);

    React.useEffect(() => {
        if (!mapRef.current || !mapRef.current.getLayer("kutai-fill")) return;
        const map = mapRef.current;
        const { district, village } = namadesaConfig;

        const setFilter = (id: string, filter: maplibregl.FilterSpecification | null) => {
            if (map.getLayer(id)) map.setFilter(id, filter);
        };

        const zoomToFeature = (feature: any) => {
            const bounds = new maplibregl.LngLatBounds();

            const addCoords = (coords: any) => {
                if (typeof coords[0] === "number") {
                    bounds.extend(coords as [number, number]);
                } else {
                    coords.forEach(addCoords);
                }
            };

            addCoords(feature.geometry.coordinates);

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 40, duration: 800, maxZoom: 13 });
            }
        };

        if (village) {
            const filter = ["==", ["get", "village"], village] as maplibregl.FilterSpecification;
            setFilter("kutai-highlight", filter);
            setFilter("kutai-outline", filter);

            const feature = KutaiTimurGeoJson.features.find(
                (f: any) => f.properties?.village === village
            );
            if (feature) zoomToFeature(feature);
        } else if (district) {
            const filter = ["==", ["get", "district"], district] as maplibregl.FilterSpecification;
            setFilter("kutai-highlight", filter);
            setFilter("kutai-outline", filter);

            const feature = KutaiTimurGeoJson.features.find(
                (f: any) => f.properties?.district === district
            );
            if (feature) zoomToFeature(feature);
        } else {
            setFilter("kutai-highlight", ["==", "village", ""] as maplibregl.FilterSpecification);
            setFilter("kutai-outline", ["==", "village", ""] as maplibregl.FilterSpecification);
        }

    }, [namadesaConfig]);

    React.useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        const markers: maplibregl.Marker[] = [];

        if (configvalueManagement.data.includes(mapdataproperty.g2)) {

            const networkData = NetworkDataSelector(
                namadesaConfig.district,
                namadesaConfig.village,
                mapdataproperty.g2
            );

            networkData.forEach((item) => {
                const el = document.createElement("div");
                el.style.width = "30px";
                el.style.height = "30px";
                el.style.borderRadius = "50%";
                el.style.backgroundColor = "white";
                el.style.display = "flex";
                el.style.alignItems = "center";
                el.style.justifyContent = "center";
                el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
                el.style.cursor = "pointer";
                el.style.contain = "content";
                el.innerHTML = NETWORK_SVG;

                const svg = el.querySelector("svg");
                if (svg) {
                    svg.style.width = "16px";
                    svg.style.height = "16px";
                    svg.style.fill = "green";
                }

                const popup = new maplibregl.Popup({
                    offset: 25,
                    closeButton: false,
                }).setHTML(`
                    <div style="font-size: 14px;">
                        <strong>Network Info</strong><br>
                        <span>${item.village} - ${item.district}</span><br>
                        <span>Jenis: <span style="color:"green";">2G</span></span>
                    </div>
                `);

                const marker = new maplibregl.Marker({
                    element: el,
                    anchor: "center",
                })
                    .setLngLat([item.long, item.lat])
                    .setPopup(popup)
                    .addTo(map);

                markers.push(marker);
            });
        }

        if (configvalueManagement.data.includes(mapdataproperty.g4)) {

            const networkData = NetworkDataSelector(
                namadesaConfig.district,
                namadesaConfig.village,
                mapdataproperty.g4
            );

            networkData.forEach((item) => {
                const el = document.createElement("div");
                el.style.width = "30px";
                el.style.height = "30px";
                el.style.borderRadius = "50%";
                el.style.backgroundColor = "white";
                el.style.display = "flex";
                el.style.alignItems = "center";
                el.style.justifyContent = "center";
                el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
                el.style.cursor = "pointer";
                el.style.contain = "content";
                el.innerHTML = NETWORK_SVG;

                const svg = el.querySelector("svg");
                if (svg) {
                    svg.style.width = "16px";
                    svg.style.height = "16px";
                    svg.style.fill = "blue";
                }

                const popup = new maplibregl.Popup({
                    offset: 25,
                    closeButton: false,
                }).setHTML(`
                    <div style="font-size: 14px;">
                        <strong>Network Info</strong><br>
                        <span>${item.village} - ${item.district}</span><br>
                        <span>Jenis: <span style="color:"blue";">4G</span></span>
                    </div>
                `);

                const marker = new maplibregl.Marker({
                    element: el,
                    anchor: "center",
                })
                    .setLngLat([item.long, item.lat])
                    .setPopup(popup)
                    .addTo(map);

                markers.push(marker);
            });
        }

        return () => {
            markers.forEach((marker) => marker.remove());
        };
    }, [configvalueManagement.data, namadesaConfig]);


    return (
        <div className="h-screen w-screen flex">
            <div ref={mapContainerRef} className="flex-1 h-full w-full" />
        </div>
    );
}
