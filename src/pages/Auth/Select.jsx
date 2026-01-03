import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options = [], value, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="dropdown" ref={dropdownRef}>
            {label && <label className="dropdown__label">{label}</label>}
            <div
                className={`dropdown__header ${open ? "open" : ""}`}
                onClick={() => setOpen((prev) => !prev)}
            >
                {selectedOption ? selectedOption.label : placeholder || "Select..."}
                <ion-icon
                    name="chevron-down-outline"
                    class={`dropdown__icon ${open ? "rotate" : ""}`}
                ></ion-icon>
            </div>
            {open && (
                <div className="dropdown__list">
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            className="dropdown__item"
                            onClick={() => handleSelect(opt)}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
