import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("https://vizit-backend-hubw.onrender.com/api/resetpass/request-reset", { email });
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        try {
            const res = await axios.post("https://vizit-backend-hubw.onrender.com/api/resetpass/verify-reset", {
                email,
                otpCode: otp,
                newPassword
            });

            if (res.status === 200) {
                toast.success("Success! Redirecting...");

                // Check user type to redirect to correct login
                const userRes = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/me/${email}`);
                if (userRes.data.role === "owner") {
                    navigate("/owner/login");
                } else {
                    navigate("/user/login");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid code or error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <h2 style={styles.title}>Vizit</h2>
                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progressLine, width: `${(step / 3) * 100}%` }}></div>
                    </div>
                </div>

                {/* STEP 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp} style={styles.form}>
                        <h3 style={styles.stepTitle}>Forgot Password?</h3>
                        <p style={styles.text}>Enter your email to receive a secure 6-digit reset code.</p>
                        <div style={styles.inputWrapper}>
                            <ion-icon name="mail-outline" style={styles.iconLeft}></ion-icon>
                            <input
                                type="email"
                                placeholder="Email Address"
                                style={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button disabled={loading} style={styles.button}>
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                    <form onSubmit={() => setStep(3)} style={styles.form}>
                        <h3 style={styles.stepTitle}>Verify Email</h3>
                        <p style={styles.text}>A code was sent to <br /><b>{email}</b></p>
                        <div style={styles.inputWrapper}>
                            <ion-icon name="keypad-outline" style={styles.iconLeft}></ion-icon>
                            <input
                                type="text"
                                placeholder="6-Digit Code"
                                style={styles.input}
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button style={styles.button}>Verify & Continue</button>
                        <button type="button" onClick={() => setStep(1)} style={styles.linkBtn}>Change Email</button>
                    </form>
                )}

                {/* STEP 3: Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} style={styles.form}>
                        <h3 style={styles.stepTitle}>New Password</h3>
                        <p style={styles.text}>Set a strong password for your account.</p>

                        <div style={styles.inputWrapper}>
                            <ion-icon name="lock-closed-outline" style={styles.iconLeft}></ion-icon>
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="New Password"
                                style={styles.input}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <ion-icon
                                name={showPass ? "eye-off-outline" : "eye-outline"}
                                style={styles.iconRight}
                                onClick={() => setShowPass(!showPass)}
                            ></ion-icon>
                        </div>

                        <div style={styles.inputWrapper}>
                            <ion-icon name="shield-checkmark-outline" style={styles.iconLeft}></ion-icon>
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Confirm New Password"
                                style={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button disabled={loading} style={styles.button}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4f1 0%, #d9e2dc 100%)",
        padding: "20px"
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "40px 30px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(36, 69, 49, 0.08)",
        textAlign: "center"
    },
    logoArea: { marginBottom: "30px" },
    title: {
        color: "#244531",
        fontSize: "2.4rem",
        marginBottom: "15px",
        fontWeight: "800",
        letterSpacing: "-1px"
    },
    progressBar: { width: "100%", height: "4px", background: "#eee", borderRadius: "10px", overflow: "hidden" },
    progressLine: { height: "100%", background: "#244531", transition: "0.4s ease" },
    stepTitle: { color: "#333", fontSize: "1.2rem", marginBottom: "8px" },
    text: { color: "#777", fontSize: "0.95rem", marginBottom: "25px", lineHeight: "1.5" },
    form: { display: "flex", flexDirection: "column" },
    inputWrapper: { position: "relative", marginBottom: "18px", width: "100%" },
    iconLeft: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem", color: "#244531" },
    iconRight: { position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem", color: "#244531", cursor: "pointer" },
    input: {
        width: "100%",
        padding: "14px 45px",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        fontSize: "1rem",
        outline: "none",
        transition: "border 0.3s ease",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "15px",
        background: "#244531",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "1rem",
        marginTop: "10px",
        transition: "transform 0.2s ease, background 0.3s ease",
        boxShadow: "0 4px 12px rgba(36, 69, 49, 0.2)"
    },
    linkBtn: {
        background: "none",
        border: "none",
        color: "#244531",
        marginTop: "20px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: "500"
    }
};

export default ResetPassword;