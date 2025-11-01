/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import KutaiTimurGeoJson from "@/data/map-geojson/id6404_kutai_timur.json";
import { ModalContext, ModalKindEnum } from "@/context-provider/modal-provider";
import { CONFIG_SVG, NETWORK_SVG, SCHOOL_SVG, STATISTIC_SVG } from "@/component/map-screen/svg-constant";
import { DataFlowContext, mapdataproperty } from "@/context-provider/data-flow-provider";
import { KebutuhanListrikDataSelector, NetworkDataSelector, SekolahDataSelector } from "@/helper/marker-selector";

export function BaseMapComponent() {
    const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
    const mapRef = React.useRef<maplibregl.Map | null>(null);
    const { setModalKind } = React.useContext(ModalContext);
    const { namadesaConfig, setNamadesaConfig, configvalueManagement } = React.useContext(DataFlowContext);
    const [hoverProp, setHoverProp] = React.useState({
        desa: "",
        kecamatan: ""
    });
    const [villageHoverTemp, setVillageHoverTemp] = React.useState("-1")

    // initial use-effect [LOAD MAP, SETUP FILL, AND SETUP KUTAI-TIMUR OVERLAY]
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
                    "fill-opacity": 0.2,
                },
            });
            map.addLayer({
                id: "district-highlight",
                type: "fill",
                source: "kutai-timur",
                paint: {
                    "fill-color": "#2196F3",
                    "fill-opacity": 0.4,
                },
                filter: ["==", "district", ""],
            });
            map.addLayer({
                id: "village-outline",
                type: "line",
                source: "kutai-timur",
                paint: {
                    "line-color": "#1976D2",
                    "line-width": 1,
                },
                filter: ["==", "village", ""],
            });
            map.addLayer({
                id: "village-highlight",
                type: "fill",
                source: "kutai-timur",
                paint: {
                    "fill-color": "#f54242",
                    "fill-opacity": 0.5,
                },
                filter: ["==", "village", ""],
            });
        });

        map.on("click", "kutai-fill", (e) => {
            e.preventDefault()
            if (e.features!.length > 0) {
                const clickedFeature = e.features![0];
                setNamadesaConfig({
                    district: clickedFeature.properties.district,
                    village: clickedFeature.properties.village,
                    tobedisplayed: `${clickedFeature.properties.village}-${clickedFeature.properties.district}`
                })
            }
        })

        map.on("mousemove", "district-highlight", (e) => {
            if (e.features!.length > 0) {
                const clickedFeature = e.features![0];
                if (hoverProp.desa !== villageHoverTemp) {
                    setHoverProp({
                        desa: clickedFeature.properties.village,
                        kecamatan: clickedFeature.properties.district,
                    });
                    setVillageHoverTemp(clickedFeature.properties.village);
                }
            }
        })

        map.on("mouseleave", "district-highlight", () => {
            setHoverProp({ desa: "", kecamatan: "" });
        });

        return () => map.remove();
    }, []);

    // selected or focused region use-effect [SET SPECIFIC REGION IN KUTAI TIMUR]
    React.useEffect(() => {
        if (!mapRef.current || !mapRef.current.getLayer("kutai-fill")) return;
        const map = mapRef.current;
        const { district } = namadesaConfig;

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

        if (district) {
            const filter = ["==", ["get", "district"], district] as maplibregl.FilterSpecification;
            const unfilterKutaiKutilang = ["!=", ["get", "district"], district] as maplibregl.FilterSpecification;
            setFilter("district-highlight", filter);
            setFilter("kutai-fill", unfilterKutaiKutilang);

            const feature = KutaiTimurGeoJson.features.find(
                (f: any) => f.properties?.district === district
            );
            if (feature) zoomToFeature(feature);
        } else {
            setFilter("district-highlight", ["==", "district", ""] as maplibregl.FilterSpecification);
        }

    }, [namadesaConfig]);

    // data distribution use-effect [DATA SHOWED UP DISTRIBUTION]
    React.useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        const markers: maplibregl.Marker[] = [];

        if (configvalueManagement.data.includes(mapdataproperty.g2)) {

            const networkData = NetworkDataSelector(
                namadesaConfig.district,
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

        if (configvalueManagement.data.includes(mapdataproperty.sekolah)) {

            const sekolahData = SekolahDataSelector(
                namadesaConfig.district,
            );

            sekolahData.forEach((item) => {
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
                el.innerHTML = SCHOOL_SVG;

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
                        <strong>${item.name}</strong><br>
                        <span>${item.district}</span><br>
                    </div>
                `);

                const marker = new maplibregl.Marker({
                    element: el,
                    anchor: "center",
                })
                    .setLngLat([item.latitude, item.longitude])
                    .setPopup(popup)
                    .addTo(map);

                markers.push(marker);
            });
        }

        return () => {
            markers.forEach((marker) => marker.remove());
        };
    }, [configvalueManagement.data, namadesaConfig]);

    React.useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        let popup: maplibregl.Popup | null = null;

        if (configvalueManagement.data.includes(mapdataproperty.listrik)) {
            const retreivedData = KebutuhanListrikDataSelector(hoverProp.desa);
            const info = retreivedData.length !== 0 ? retreivedData[0].info : "Tidak diketahui"
            const kec = retreivedData.length !== 0 ? retreivedData[0].district : hoverProp.kecamatan
            const desa = retreivedData.length !== 0 ? retreivedData[0].village : hoverProp.desa
            const jumlahpenduduk = retreivedData.length !== 0 ? retreivedData[0].citizens : "Tidak diketahui"
            const type = retreivedData.length !== 0 ? retreivedData[0].type : -1;
            const color = type === 0 ? "#d60202" : type === 1 ? "#14d602" : type === 2 ? "#426ff5" : "#9b9e9b";

            const setFilter = (id: string, filter: maplibregl.FilterSpecification | null) => {
                if (map.getLayer(id)) {
                    map.setFilter(id, filter)
                    map.setPaintProperty(id, "fill-color", color);
                };
            };
            const feature = KutaiTimurGeoJson.features.find(
                (f: any) => f.properties.village === hoverProp.desa
            );

            if (feature) {
                const coords = feature.geometry.coordinates.flat(Infinity) as any[];
                const nums: number[] = coords.map((c) => Number(c)).filter((n) => !Number.isNaN(n));
                const longs: number[] = [];
                const lats: number[] = [];

                for (let i = 0; i < nums.length; i += 2) {
                    const lng = nums[i];
                    const lat = nums[i + 1];
                    if (typeof lng === "number" && typeof lat === "number") {
                        longs.push(lng);
                        lats.push(lat);
                    }
                }

                const centerLng = longs.length ? longs.reduce((a, b) => a + b, 0) / longs.length : 0;
                const centerLat = lats.length ? lats.reduce((a, b) => a + b, 0) / lats.length : 0;

                popup = new maplibregl.Popup({
                    offset: 25,
                    closeButton: false,
                })
                    .setLngLat([centerLng, centerLat])
                    .setHTML(`
                        <div style="font-size: 12px; width: fit">
                            <span>Informasi Listrik dan Penduduk <strong>${kec}-${desa}</strong></span><br>
                            <span>Jumlah Penduduk: <strong>${jumlahpenduduk}</strong></</span><br>
                            <span>Informasi Ketersediaan Listrik: <strong>${info}</strong></span><br>
                        </div>
                    `)
                    .addTo(map);
            }

            const filter = ["==", ["get", "village"], hoverProp.desa] as maplibregl.FilterSpecification;
            setFilter("village-highlight", filter);
        } else {
            const setFilter = (id: string, filter: maplibregl.FilterSpecification | null) => {
                if (map.getLayer(id)) map.setFilter(id, filter);
            };
            setFilter("village-highlight", ["==", "village", ""]);
        }

        return () => {
            if (popup) popup.remove();
        }
    }, [villageHoverTemp])

    return (
        <div className="h-screen w-screen flex">
            <div ref={mapContainerRef} className="flex-1 h-full w-full" />
        </div>
    );
}
