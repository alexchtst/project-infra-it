import React from "react";

export default function SearchDesa() {
    const [query, setQuery] = React.useState("");
    const [showSuggestion, setShowSuggestion] = React.useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);
        setShowSuggestion(value.trim().length > 0);
    }

    function handleBlur() {
        setTimeout(() => setShowSuggestion(false), 150);
    }

    function handleFocus() {
        if (query.trim().length > 0) {
            setShowSuggestion(true);
        }
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

            {showSuggestion && (
                <div
                    className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                    {["Hallo world", "Desa Suka Makmur", "Kecamatan Muara Ancalong"].map((item) => (
                        <p
                            key={item}
                            onMouseDown={() => {
                                // gunakan onMouseDown agar tidak tertutup sebelum klik selesai
                                setQuery(item);
                                setShowSuggestion(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            {item}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
