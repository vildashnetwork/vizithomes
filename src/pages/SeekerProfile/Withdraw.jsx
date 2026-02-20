import React, { useState } from "react";
// import axios from "axios";
import { Banknote, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";

const WithdrawComponent = ({ user }) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [number, setnumber] = useState("");

    // Force balance to a number to prevent "disabled" button bugs
    const balance = Number(user?.referalbalance);

 const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // 1. Frontend Validations
    if (!number || number.length < 9) {
        return setMessage({ type: "error", text: "Provide a valid phone number (e.g., 237...)" });
    }

    if (Number(amount) < 25) {
        return setMessage({ type: "error", text: "Minimum withdrawal is 25 frs" });
    }
    
    if (Number(amount) > balance) {
        return setMessage({ type: "error", text: "Insufficient balance" });
    }

    setLoading(true);

    try {
        // Fetch equivalent of axios.post
        const response = await fetch(`https://vizit-backend-hubw.onrender.com/api/referal/payments/${user._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // If you use a token, add it here:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                amount: Number(amount),
                phone: number
            }),
        });

        const data = await response.json();

        // 2. Handle Response
        if (response.ok) { // Check for status 200-299
            setMessage({ 
                type: "success", 
                text: "Withdrawal successful! Your balance has been updated." 
            });
            setAmount("");
            setnumber("");
        } else {
            // Handle specific backend error messages
            const errorMsg = data.error?.message || data.message || data.error || "Withdrawal failed";
            throw new Error(errorMsg);
        }

    } catch (err) {
        setMessage({ type: "error", text: err.message });
    } finally {
        setLoading(false);
    }
};
    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <Banknote color="#059669" size={24} />
                <h3 style={styles.title}>Withdraw Earnings</h3>
            </div>

            <div style={styles.balanceBox}>
                <small style={{ opacity: 0.9 }}>Available Balance</small>
                <h2 style={styles.balanceText}>{balance} <span style={{ fontSize: '1rem' }}>frs</span></h2>
            </div>

            <form onSubmit={handleWithdraw} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number (include 237)</label>
                    <input 
                        type="text" 
                        value={number}
                        onChange={(e) => setnumber(e.target.value)}
                        placeholder="2376XXXXXXXX"
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Amount (frs)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Min 25"
                        style={styles.input}
                        required
                    />
                </div>

                {message.text && (
                    <div style={message.type === "error" ? styles.errorMsg : styles.successMsg}>
                        {message.type === "error" ? <AlertCircle size={16} /> : null}
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button 
                        type="submit" 
                        disabled={loading || balance < 25} 
                        style={loading || balance < 25 ? styles.btnDisabled : styles.btn}
                    >
                        {loading ? (
                            <Loader2 className="spinner" size={20} />
                        ) : (
                            <>
                                <ArrowUpRight size={18} /> 
                                Request Payout
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    card: {
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        maxWidth: "400px",
        margin: "10px auto",
        border: "1px solid #f0fdf4"
    },
    header: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
    title: { margin: 0, fontSize: "1.2rem", color: "#111827" },
    balanceBox: {
        background: "linear-gradient(135deg, #059669, #10b981)",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        textAlign: "center",
        marginBottom: "20px"
    },
    balanceText: { margin: "5px 0 0 0", fontSize: "2rem", fontWeight: "700" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
    label: { fontSize: "0.85rem", fontWeight: "600", color: "#4b5563" },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "1rem"
    },
    btn: {
        background: "#111827",
        color: "#fff",
        padding: "14px 24px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
    },
    btnDisabled: {
        background: "#9ca3af",
        color: "#fff",
        padding: "14px 24px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "bold",
        cursor: "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
    },
    errorMsg: { color: "#dc2626", background: "#fef2f2", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", display: 'flex', alignItems: 'center', gap: '8px' },
    successMsg: { color: "#16a34a", background: "#f0fdf4", padding: "12px", borderRadius: "8px", fontSize: "0.85rem" }
};

export default WithdrawComponent;