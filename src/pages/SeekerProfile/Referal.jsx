import React, { useState } from "react";
import { Share2, Copy, CheckCircle, Wallet } from "lucide-react"; 
import WithdrawComponent from "./Withdraw";

const ReferralInterface = ({ user }) => {
    const [copied, setCopied] = useState(false);
    const [withdraw, setwithdraw] = useState(false);

    // Actual frontend URL
    const referralLink = `https://vizit.homes/owner/login?ref=${user?._id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Share2 size={24} color="#059669" />
                <h3 style={styles.title}>Refer & Earn</h3>
            </div>

            <p style={styles.description}>
                Invite property owners to VIZIT. You get <strong>50 frs</strong> credited to your wallet 
                once their business verification (KYC) is <strong>approved</strong>.
            </p>

            <div style={styles.walletCard}>
                <Wallet size={20} />
                <span>Current Earnings: <strong>{user?.referalbalance || 0} frs</strong></span>
            </div>

            <div style={styles.linkWrapper}>
                <input 
                    readOnly 
                    value={referralLink} 
                    style={styles.linkInput} 
                />
                <button 
                    onClick={handleCopy} 
                    style={copied ? styles.copyBtnSuccess : styles.copyBtn}
                >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy Link"}
                </button>
            </div>
            
            <p style={styles.footerNote}>
                * Rewards are only paid for unique, valid owner registrations.
            </p>

            {/* Centered Withdraw Button Section */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        backgroundColor: "#111827", 
                        color: "#ffffff",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        width: "100%", 
                        maxWidth: "200px"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
                    onClick={() => setwithdraw(!withdraw)}
                >
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                    {withdraw ? "Close" : "Withdraw"}
                </button>
            </div>

            {withdraw && (
                <div style={{ marginTop: "20px" }}>
                    <WithdrawComponent user={user} />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        maxWidth: "500px",
        margin: "20px auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
    },
    title: {
        margin: 0,
        fontSize: "1.25rem",
        color: "#111827",
    },
    description: {
        fontSize: "0.95rem",
        color: "#4b5563",
        lineHeight: "1.5",
        marginBottom: "20px",
    },
    walletCard: {
        background: "#f0fdf4",
        color: "#166534",
        padding: "12px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "20px",
        border: "1px solid #dcfce7",
    },
    linkWrapper: {
        display: "flex",
        gap: "8px",
        background: "#f9fafb",
        padding: "8px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
    },
    linkInput: {
        flex: 1,
        border: "none",
        background: "transparent",
        outline: "none",
        fontSize: "0.85rem",
        color: "#6b7280",
        padding: "5px",
    },
    copyBtn: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: "#059669",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
    },
    copyBtnSuccess: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: "#10b981",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    footerNote: {
        fontSize: "0.75rem",
        color: "#9ca3af",
        marginTop: "15px",
        textAlign: "center",
    }
};

export default ReferralInterface;