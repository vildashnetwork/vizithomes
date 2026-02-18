

import React, { useState } from "react";
import axios from "axios";

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000
    },

    modal: {
        background: "#fff",
        width: "100%",
        maxWidth: "420px",
        borderRadius: "18px",
        padding: "30px 25px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        position: "relative"
    },

    closeContainer: {
        position: "absolute",
        top: "15px",
        right: "15px"
    },

    closeBtn: {
        border: "none",
        background: "transparent",
        fontSize: "18px",
        cursor: "pointer"
    },

    stepIndicator: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
    },

    step: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "green",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },

    activeStep: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "grey",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },

    line: {
        width: "40px",
        height: "2px",
        background: "#ccc"
    },

    title: {
        textAlign: "center",
        marginBottom: "10px"
    },

    description: {
        textAlign: "center",
        fontSize: "14px",
        marginBottom: "20px",
        color: "#555"
    },

    totalBox: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "25px",
        fontSize: "16px"
    },

    counterContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px"
    },

    counterBtn: {
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        background: "#f5f5f5",
        fontSize: "20px",
        cursor: "pointer"
    },

    counterValue: {
        fontSize: "16px",
        fontWeight: "600"
    },

    summaryBox: {
        background: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
    },

    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px"
    },

    primaryButton: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        background: "green",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer"
    },

    payButton: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        background: "#198754",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer"
    }
};
const VerifyModal = ({ open, setOpen, email, refreshUser }) => {
    const [step, setStep] = useState(1);
    const [months, setMonths] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const verificationFee = 50;
    const pricePerMonth = 50;
    const monthlyTotal = months * pricePerMonth;
    const grandTotal = verificationFee + monthlyTotal;

    const increase = () => setMonths(prev => prev + 1);
    const decrease = () => months > 1 && setMonths(prev => prev - 1);

    const closeModal = () => {
        setStep(1);
        setMonths(1);
        setError("");
        setOpen(false);
    };

    const handleActivateVerification = async () => {
        try {

            setLoading(true);
            setError("");

            const res = await axios.post(
                `https://vizit-backend-hubw.onrender.com/api/activate-verification/${email}`,
                {
                    months,
                    verificationFee,
                    monthlyTotal,
                    totalAmount: grandTotal
                }
            );

            if (res.status === 200) {
                alert("Verification activated successfully ✅");

                // Optional: refresh user state globally
                if (refreshUser) await refreshUser();

                closeModal();
            }

        } catch (err) {
            console.error("Verification error:", err.response?.data || err.message);

            setError(
                err.response?.data?.message ||
                "Verification failed. Please check your balance."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.closeContainer}>
                    <button onClick={closeModal} style={styles.closeBtn}>✕</button>
                </div>

                {/* STEP INDICATOR */}
                <div style={styles.stepIndicator}>
                    <div style={step === 1 ? styles.activeStep : styles.step}>1</div>
                    <div style={styles.line}></div>
                    <div style={step === 2 ? styles.activeStep : styles.step}>2</div>
                </div>

                {error && (
                    <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h2 style={styles.title}>Verification Fee</h2>
                        <p style={styles.description}>
                            A one-time activation fee of <strong>5000 FCFA</strong>
                            will be deducted from your wallet.
                        </p>

                        <div style={styles.totalBox}>
                            <span>Verification Fee:</span>
                            <strong>{verificationFee} FCFA</strong>
                        </div>

                        <button
                            style={styles.primaryButton}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <h2 style={styles.title}>Choose Duration</h2>

                        <div style={styles.counterContainer}>
                            <button onClick={decrease} style={styles.counterBtn}>−</button>
                            <span style={styles.counterValue}>
                                {months} Month{months > 1 ? "s" : ""}
                            </span>
                            <button onClick={increase} style={styles.counterBtn}>+</button>
                        </div>

                        <div style={styles.summaryBox}>
                            <div style={styles.summaryRow}>
                                <span>Verification Fee:</span>
                                <span>{verificationFee} FCFA</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Monthly Total:</span>
                                <span>{monthlyTotal} FCFA</span>
                            </div>
                            <hr />
                            <div style={styles.summaryRow}>
                                <strong>Grand Total:</strong>
                                <strong>{grandTotal} FCFA</strong>
                            </div>
                        </div>

                        <button
                            style={styles.payButton}
                            onClick={handleActivateVerification}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Pay ${grandTotal} FCFA`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyModal;
