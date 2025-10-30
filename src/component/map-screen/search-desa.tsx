import React from "react";
import KutaiTimurGeoJSON from "@/data/map-geojson/id6404_kutai_timur.json"
import { NamaDaereahInterface } from "@/context-provider/data-flow-provider";

export interface FeatureProps {
    type: string,
    properties: {
        country_code: string;
        country: string;
        province_code: string;
        province: string;
        regency_code: string;
        regency: string;
        district_code: string;
        district: string;
        village_code: string;
        village: string;
        source: string;
        date: string;
        valid_on: string;
    };
}

export default function SearchDesa(
    { name, setter }: { name: NamaDaereahInterface, setter: (d: NamaDaereahInterface) => void }
) {

    const [query, setQuery] = React.useState(name.tobedisplayed);
    const [showSuggestion, setShowSuggestion] = React.useState(false);
    const [results, setResults] = React.useState<FeatureProps[]>([]);

    const allFeatures = KutaiTimurGeoJSON.features as FeatureProps[];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 0) {
            const filtered = allFeatures.filter((feature) => {
                const desa = feature.properties.village?.toLowerCase() || "";
                const kec = feature.properties.district?.toLowerCase() || "";
                return (
                    desa.includes(value.toLowerCase()) ||
                    kec.includes(value.toLowerCase())
                );
            });

            setResults(filtered.slice(0, 5));
            setShowSuggestion(true);
        } else {
            setShowSuggestion(false);
        }
    }

    function handleBlur() {
        setTimeout(() => setShowSuggestion(false), 150);
    }

    function handleFocus() {
        if (query.trim().length > 0) {
            setShowSuggestion(true);
        }
    }

    function handleSelect(feature: FeatureProps) {
        const { village, district } = feature.properties;
        setter({
            district: district,
            village: village,
            tobedisplayed: `${village}-${district}`
        });
        setQuery(`${village}-${district}`);
        setShowSuggestion(false);
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Nama desa / kecamatan"
            />

            {showSuggestion && results.length > 0 && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {results.map((feature, i) => {
                        const { village, district } = feature.properties;
                        return (
                            <p
                                key={i}
                                onMouseDown={() => handleSelect(feature)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <span className="font-medium">{district}</span>{" "}
                                <span className="text-gray-500 text-xs">
                                    ({village})
                                </span>
                            </p>
                        );
                    })}
                </div>
            )}

            {showSuggestion && results.length === 0 && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 text-sm text-gray-500">
                    Tidak ditemukan hasil
                </div>
            )}
        </div>
    );
}