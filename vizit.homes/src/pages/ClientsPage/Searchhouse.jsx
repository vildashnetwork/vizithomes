// HouseSearch.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import "./house-search.css";

export default function HouseSearch({
    properties = [],
    onResults = () => { },
    onQuery = () => { },
    placeholder = "Search houses, city, type or amenity...",
    debounceMs = 300,
    externalTypeFilter = "all" // optional controlled type filter
}) {
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState(externalTypeFilter);
    const [openTypes, setOpenTypes] = useState(false);
    const [results, setResults] = useState(properties);
    const timerRef = useRef(null);
    const inputRef = useRef(null);
    const liveRef = useRef(null);

    const types = useMemo(() => {
        const set = new Set(
            properties.map((p) => (p.type || "").toLowerCase()).filter(Boolean)
        );
        return ["all", ...Array.from(set)];
    }, [properties]);

    const runSearch = (q, t) => {
        const qclean = (q || "").trim().toLowerCase();
        const out = properties.filter((p) => {
            if (t && t !== "all" && (p.type || "").toLowerCase() !== t.toLowerCase())
                return false;

            if (!qclean) return true;

            if ((p.title || "").toLowerCase().includes(qclean)) return true;
            const loc = p.location?.city || p.location?.address || "";
            if (loc.toLowerCase().includes(qclean)) return true;
            if ((p.type || "").toLowerCase().includes(qclean)) return true;
            if (Array.isArray(p.amenities)) {
                for (let a of p.amenities) {
                    if ((a || "").toLowerCase().includes(qclean)) return true;
                }
            }
            return false;
        });

        setResults(out);
        onResults([...out]);

        if (liveRef.current) {
            liveRef.current.textContent = `${out.length} result${out.length !== 1 ? "s" : ""} found.`;
        }
    };

    // Debounce typing
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            runSearch(query, typeFilter);
            onQuery(query.trim());
        }, debounceMs);
        return () => clearTimeout(timerRef.current);
    }, [query, typeFilter, properties, debounceMs]);

    // Immediate search when properties or external filter changes
    useEffect(() => {
        setTypeFilter(externalTypeFilter);
        runSearch(query, externalTypeFilter);
    }, [properties, externalTypeFilter]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                setOpenTypes(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div className="cd-search" role="search" aria-label="Search properties">
            <div className="cd-search__controls">
                <label htmlFor="cd-search-input" className="cd-search__label visually-hidden">
                    Search properties
                </label>
                <div className="cd-search__inputwrap">
                    <ion-icon name="search-outline" className="cd-search__icon" aria-hidden="true" />
                    <input
                        id="cd-search-input"
                        ref={inputRef}
                        className="cd-search__input"
                        type="search"
                        inputMode="search"
                        autoComplete="off"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search houses by title, city, type or amenity"
                    />
                    {query && (
                        <button
                            className="cd-search__clear"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                        >
                            <ion-icon name="close-circle" />
                        </button>
                    )}
                </div>

                <div className={`cd-search__types ${openTypes ? "open" : ""}`}>
                    <button
                        className="cd-search__types-toggle"
                        aria-haspopup="listbox"
                        aria-expanded={openTypes}
                        onClick={() => setOpenTypes((s) => !s)}
                    >
                        <span className="cd-search__types-selected">
                            {typeFilter === "all" ? "All types" : typeFilter}
                        </span>
                        <ion-icon name={`chevron-${openTypes ? "up" : "down"}`} />
                    </button>

                    {openTypes && (
                        <div className="cd-search__types-list" role="listbox" aria-label="Filter by property type" tabIndex={-1}>
                            {types.map((t) => (
                                <div
                                    key={t}
                                    role="option"
                                    aria-selected={typeFilter === t}
                                    tabIndex={0}
                                    className={`cd-search__types-item ${typeFilter === t ? "is-active" : ""}`}
                                    onClick={() => {
                                        setTypeFilter(t);
                                        setOpenTypes(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setTypeFilter(t);
                                            setOpenTypes(false);
                                        }
                                    }}
                                >
                                    {t === "all" ? "All types" : t}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="cd-search__meta" aria-live="polite" ref={liveRef}>
                {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
        </div>
    );
}
