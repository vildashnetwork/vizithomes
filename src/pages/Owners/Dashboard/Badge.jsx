import React from "react";

const VerificationBadge = ({ size = 20, color = "#4CAF50", tooltip = "Verified" }) => {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: "help",
                verticalAlign: "middle"
            }}
            className="badge-container"
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* The Facebook "Starburst" Scalloped Shape */}
                <path
                    d="M12 2L13.85 3.32L16.12 2.92L17.26 4.92L19.46 5.56L19.7 7.84L21.6 9.16L20.84 11.32L22 13.4L20.46 15.12L20.34 17.4L18.06 17.9L16.66 19.72L14.44 19.12L12.56 20.44L10.68 19.12L8.46 19.72L7.06 18.9L4.78 18.4L4.66 16.12L3.12 14.4L4.28 12.32L3.52 10.16L5.42 8.84L5.66 6.56L7.86 5.92L9 3.92L11.27 4.32L12 2Z"
                    fill={color}
                />
                {/* The Checkmark */}
                <path
                    d="M8.5 12.5L10.5 14.5L15.5 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Tooltip */}
            {tooltip && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "140%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0, 0, 0, 0.85)",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        zIndex: 100
                    }}
                    className="verification-tooltip"
                >
                    {tooltip}
                </span>
            )}

            <style>
                {`
                    .badge-container:hover .verification-tooltip {
                        opacity: 1;
                        bottom: 155%;
                    }
                `}
            </style>
        </div>
    );
};

export default VerificationBadge;