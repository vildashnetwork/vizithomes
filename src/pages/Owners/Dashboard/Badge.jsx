import React from "react";

const VerificationBadge = ({ size = 24, color = "#4CAF50", tooltip = "Verified" }) => {
    return (
        <div style={{ display: "inline-block", position: "relative" }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="12" fill={color} />
                <path
                    d="M9 12.5L11 14.5L15 10.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {/* Tooltip */}
            {tooltip && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "125%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#333",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.2s",
                    }}
                    className="verification-tooltip"
                >
                    {tooltip}
                </span>
            )}
            <style>
                {`
                    div:hover .verification-tooltip {
                        opacity: 1;
                    }
                `}
            </style>
        </div>
    );
};

export default VerificationBadge;
