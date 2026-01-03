// HouseSearch.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./house-search.css";
const PROPERTY_TYPES = [
    "Guest House",
    "Hotel",
    "Apartment",
];
export default function HouseSearch({
    properties = [],
    onResults = () => { },
    onQuery = () => { },
    placeholder = "Search houses, city, type or amenity...",
    debounceMs = 300,
    externalTypeFilter = "all"
}) {
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState(externalTypeFilter);
    const [openTypes, setOpenTypes] = useState(false);
    const [results, setResults] = useState([]);

    const timerRef = useRef(null);
    const inputRef = useRef(null);
    const liveRef = useRef(null);

    /**
     * Build unique property types
     */
    // const types = useMemo(() => {
    //     const set = new Set(
    //         (properties || [])
    //             .map((p) => (p?.type || "").toLowerCase())
    //             .filter(Boolean)
    //     );
    //     return ["all", ...Array.from(set)];
    // }, [properties]);
    const types = useMemo(() => {
        const dbTypes = new Set(
            (properties || [])
                .map((p) => (p?.type || ""))
                .filter(Boolean)
        );

        const merged = new Set([
            ...PROPERTY_TYPES.map((t) => t),
            ...dbTypes
        ]);

        return ["all", ...Array.from(merged)];
    }, [properties]);

    /**
     * Core search logic
     */
    const runSearch = (q, t) => {
        const qclean = (q || "").trim().toLowerCase();

        const filtered = (properties || []).filter((p) => {
            if (!p) return false;

            // Type filter
            if (t !== "all" && (p.type || "").toLowerCase() !== t.toLowerCase()) {
                return false;
            }

            if (!qclean) return true;

            if ((p.title || "").toLowerCase().includes(qclean)) return true;

            const loc =
                p.location?.city ||
                p.location?.address ||
                "";

            if (loc.toLowerCase().includes(qclean)) return true;

            if ((p.type || "").toLowerCase().includes(qclean)) return true;

            if (Array.isArray(p.amenities)) {
                return p.amenities.some((a) =>
                    (a || "").toLowerCase().includes(qclean)
                );
            }

            return false;
        });

        setResults(filtered);
        onResults([...filtered]);

        if (liveRef.current) {
            liveRef.current.textContent = `${filtered.length} result${filtered.length !== 1 ? "s" : ""
                } found`;
        }
    };

    /**
     * Debounced search
     */
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            runSearch(query, typeFilter);
            onQuery(query.trim());
        }, debounceMs);

        return () => clearTimeout(timerRef.current);
    }, [query, typeFilter, properties, debounceMs]);

    /**
     * Sync external type filter
     */
    useEffect(() => {
        setTypeFilter(externalTypeFilter);
        runSearch(query, externalTypeFilter);
    }, [externalTypeFilter, properties]);

    /**
     * Escape key handling
     */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpenTypes(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="cd-search" role="search" aria-label="Search properties">
            <div className="cd-search__controls">
                <label
                    htmlFor="cd-search-input"
                    className="visually-hidden"
                >
                    Search properties
                </label>

                {/* Search Input */}
                <div className="cd-search__inputwrap">
                    <ion-icon
                        name="search-outline"
                        className="cd-search__icon"
                        aria-hidden="true"
                    />

                    <input
                        id="cd-search-input"
                        ref={inputRef}
                        className="cd-search__input"
                        type="search"
                        autoComplete="off"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search houses"
                    />

                    {query && (
                        <button
                            className="cd-search__clear"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                        >
                            <ion-icon name="close-circle" />
                        </button>
                    )}
                </div>

                {/* Type Filter */}
                <div className={`cd-search__types ${openTypes ? "open" : ""}`}>
                    <button
                        className="cd-search__types-toggle"
                        onClick={() => setOpenTypes((v) => !v)}
                        aria-haspopup="listbox"
                        aria-expanded={openTypes}
                    >
                        <span>
                            {typeFilter === "all"
                                ? "All types"
                                : typeFilter}
                        </span>
                        <ion-icon
                            name={`chevron-${openTypes ? "up" : "down"}`}
                        />
                    </button>

                    {openTypes && (
                        <div
                            className="cd-search__types-list"
                            role="listbox"
                        >
                            {types.map((t) => (
                                <div
                                    key={t}
                                    role="option"
                                    tabIndex={0}
                                    aria-selected={typeFilter === t}
                                    className={`cd-search__types-item ${typeFilter === t
                                        ? "is-active"
                                        : ""
                                        }`}
                                    onClick={() => {
                                        setTypeFilter(t);
                                        setOpenTypes(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
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

            {/* Results meta */}
            <div
                className="cd-search__meta"
                aria-live="polite"
                ref={liveRef}
            >
                {results.length} result
                {results.length !== 1 ? "s" : ""} found
            </div>
        </div>
    );
}
