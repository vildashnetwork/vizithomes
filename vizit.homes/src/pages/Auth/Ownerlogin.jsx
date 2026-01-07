import React, { useState, useRef, useEffect } from "react";
import "./style/osner.css";
import GoogleLoginButton from "./GoogleLoginButton";
import Dropdown from "./Select";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function OwnerAuthLanding() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [view, notview] = useState(true)
    const [companyname, setcompanyname] = useState("")
    const [bio, setbio] = useState("")
    const [location, setlocation] = useState("")
    // login fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [idno, setidno] = useState("")
    // register fields
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const firstInputRef = useRef(null);

    useEffect(() => {
        // focus first input when mode changes
        const el = firstInputRef.current;
        if (el) el.focus();
        setMessage({ type: "", text: "" });
    }, [mode]);

    // basic validators
    const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
    const resetForm = () => {
        setEmail(""); setPassword("");
        setFullName(""); setPhone(""); setRegEmail(""); setRegPassword(""); setConfirmPassword("");
    };
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault();
        setMessage({ type: "", text: "" });


        if (!email) return setMessage({ type: "error", text: "Enter your email." });
        if (!isEmail(email)) return setMessage({ type: "error", text: "Enter a valid email." });
        if (!password) return setMessage({ type: "error", text: "Enter your password." });

        const logindata = { identifier: email, password: password }

        try {
            setLoading(true);
            const res = await axios.post("https://vizit-backend-hubw.onrender.com/api/owner/login",

                logindata

            );

            if (res.status === 200) {
                setMessage({ type: "success", text: res.data.message });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", "owner");
                navigate("/dashboard")
            } else {
                setMessage({ type: "error", text: res.data.message });
            }

        } catch (error) {
            console.log('====================================');
            console.log(error);
            setMessage({ type: "error", text: error?.message });
            console.log('====================================');
        } finally {
            setLoading(false)
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!fullName) return setMessage({ type: "error", text: "Please enter your full name." });
        if (!phone) return setMessage({ type: "error", text: "Please enter your phone number." });
        if (!regEmail) return setMessage({ type: "error", text: "Please enter your email." });
        if (!isEmail(regEmail)) return setMessage({ type: "error", text: "Enter a valid email address." });
        if (!regPassword || regPassword.length < 6) return setMessage({ type: "error", text: "Password must be at least 6 characters." });
        if (regPassword !== confirmPassword) return setMessage({ type: "error", text: "Passwords do not match." });

        try {
            setLoading(true);
            const playload = {
                name: fullName,
                email: regEmail,
                location: location,
                password: regPassword,
                companyname: companyname,
                phone: phone,
                interest: role,
                IDno: idno,
                bio: bio
            }
            const res = await axios.post("https://vizit-backend-hubw.onrender.com/api/owner/register",

                playload

            );



            localStorage.setItem("token", res.data.token);
            if (res.status === 201) {

                alert(res.data.message);
                localStorage.setItem("role", "owner");
                setMessage({ type: "success", text: "Account created — role saved." });
                navigate("/dashboard")

            } else {

                setMessage({ type: "success", text: res.data.message });
                console.log(res.data.message)

            }






        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        } finally {
            setLoading(false);
        }


    }











    const roles = [
        { value: "owner", label: "Rent A House" },
        { value: "client", label: "Real Estate" },
        { value: "agent", label: "Hotels" },
        { value: "unique", label: "Guest Houses" },
        { value: "motels", label: "Motels" },

    ];
    const [role, setRole] = useState("");

    return (
        <div className="landing">
            <div className="left-background" aria-hidden={false}>
                {/* embed simple Google Maps search/center for Cameroon — replace q param if you want a specific location */}
                <div className="left-background__map-wrap" role="img" aria-label="Map of Cameroon">
                    <iframe
                        title="Map of Cameroon"
                        src="https://www.google.com/maps?q=Cameroon&z=6&output=embed"
                        allowFullScreen
                        loading="lazy"
                    />
                    {/* dotted points overlay (SVG) */}
                    <svg className="left-background__dots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>

                        <circle cx="55" cy="38" r="1.6" className="dot" />
                        <circle cx="62" cy="45" r="1.6" className="dot" />
                        <circle cx="48" cy="52" r="1.6" className="dot" />
                    </svg>

                    {/* Floating message bubble — you can edit text */}
                    <div className="left-background__bubble" role="note" aria-label="Housing message">
                        <strong>The future of housing in Cameroon</strong>
                        <p>Connecting owners and tenants with smarter listings, payments & local support.</p>
                    </div>
                </div>
            </div>
            <div className="landing__card fade-in" role="region" aria-label="Owner Authentication">
                <div className="landing__header">
                    <div className="landing__icon" aria-hidden>
                        <ion-icon name="home-outline" />
                    </div>
                    <h1 className="landing__title">Vizit.Homes</h1>
                    <p className="landing__subtitle">List, manage and rent your properties across Cameroon</p>
                </div>

                <div className="auth-toggle" role="tablist" aria-label="Auth toggle">
                    <button
                        role="tab"
                        aria-selected={mode === "login"}
                        className={`auth-tab ${mode === "login" ? "is-active" : ""}`}
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                    <button
                        role="tab"
                        aria-selected={mode === "register"}
                        className={`auth-tab ${mode === "register" ? "is-active" : ""}`}
                        onClick={() => setMode("register")}
                    >
                        Register
                    </button>
                </div>

                {mode === "login" ? (
                    <form className="landing__form" onSubmit={handleLogin} noValidate>
                        <div className="form-row">
                            <label htmlFor="login-email" className="form-label">Email</label>
                            <div className="input-wrap">
                                <ion-icon name="mail-outline" class="input-icon" />
                                <input
                                    ref={firstInputRef}
                                    id="login-email"
                                    type="email"
                                    className="form-input"
                                    placeholder="you@company.cm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="login-password" className="form-label">Password</label>
                            <div className="input-wrap">
                                <ion-icon name="lock-closed-outline" class="input-icon" />
                                <input
                                    id="login-password"
                                    type={view ? "password" : "text"}
                                    className="form-input"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />

                                {view ?
                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-off-outline"></ion-icon>
                                    </a> :

                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                    </a>
                                }
                            </div>
                            <label htmlFor="login-password" className="form-label" style={{
                                display: "flex",
                                textAlign: "left",
                                justifyContent: "end",
                                float: "left", color: "#333", cursor: "pointer"
                            }}>Reset Password</label>

                        </div>

                        {message.text && (
                            <div className={`form-message ${message.type === "error" ? "form-error" : "form-success"}`} role={message.type === "error" ? "alert" : "status"}>
                                {message.text}
                            </div>
                        )}

                        <button className="btn btn--owner" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Login as Property Owner"}
                        </button>
                    </form>
                ) : (
                    <form className="landing__form" onSubmit={handleRegister} noValidate>
                        <div className="form-row">
                            <label htmlFor="reg-name" className="form-label">Full name</label>
                            <div className="input-wrap">
                                <ion-icon name="person-outline" class="input-icon" />
                                <input
                                    ref={firstInputRef}
                                    id="reg-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="reg-name" className="form-label">Company's Name</label>
                            <div className="input-wrap">
                                <ion-icon name="person-outline" class="input-icon" />
                                <input
                                    ref={firstInputRef}
                                    id="reg-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="Company LTD"
                                    value={companyname}
                                    onChange={(e) => setcompanyname(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <label htmlFor="reg-name" className="form-label">Company's BIO</label>
                            <div className="input-wrap">
                                {/* <ion-icon name="albums-outline" ></ion-icon> */}
                                <textarea
                                    rows={5}
                                    ref={firstInputRef}
                                    id="reg-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="About Your Company"
                                    value={bio}
                                    onChange={(e) => setbio(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="reg-phone" className="form-label">Phone</label>
                            <div className="input-wrap">
                                <ion-icon name="call-outline" class="input-icon" />
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="+237 6xx xxx xxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="reg-email" className="form-label">Email</label>
                            <div className="input-wrap">
                                <ion-icon name="mail-outline" class="input-icon" />
                                <input
                                    id="reg-email"
                                    type="email"
                                    className="form-input"
                                    placeholder="you@company.cm"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <label htmlFor="reg-email" className="form-label">What's Your Interest?</label>
                            <Dropdown
                                label=""
                                options={roles}
                                value={role}
                                onChange={setRole}
                                placeholder="Click Here To Choose your Interest"
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="reg-name" className="form-label">Company's Location</label>
                            <div className="input-wrap">
                                <ion-icon name="location-outline"></ion-icon>
                                <input
                                    ref={firstInputRef}
                                    id="reg-name"
                                    type="location"
                                    className="form-input"
                                    placeholder="xxxxxx Cameroon"
                                    value={location}
                                    onChange={(e) => setlocation(e.target.value)}
                                    autoComplete="location"
                                />
                            </div>
                        </div>


                        <div className="form-row">
                            <label htmlFor="reg-name" className="form-label">ID Card Number</label>
                            <div className="input-wrap">
                                <ion-icon name="document-lock-outline"></ion-icon>
                                <input
                                    ref={firstInputRef}
                                    id="reg-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="xxxxxxxxxxxxxx"
                                    value={idno}
                                    onChange={(e) => setidno(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <label htmlFor="reg-password" className="form-label">Password</label>
                            <div className="input-wrap">
                                <ion-icon name="lock-closed-outline" class="input-icon" />
                                <input
                                    id="reg-password"
                                    type={view ? "password" : "text"}
                                    className="form-input"
                                    placeholder="Create a password"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                {view ?
                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-off-outline"></ion-icon>
                                    </a> :

                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                    </a>
                                }

                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="reg-confirm" className="form-label">Confirm password</label>
                            <div className="input-wrap">
                                <ion-icon name="lock-closed-outline" class="input-icon" />
                                <input
                                    id="reg-confirm"
                                    type={view ? "password" : "text"}
                                    className="form-input"
                                    placeholder="Repeat password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                {view ?
                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-off-outline"></ion-icon>
                                    </a> :

                                    <a onClick={() => notview(!view)} style={{ cursor: "pointer" }}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                    </a>
                                }

                            </div>
                        </div>

                        {message.text && (
                            <div className={`form-message ${message.type === "error" ? "form-error" : "form-success"}`} role={message.type === "error" ? "alert" : "status"}>
                                {message.text}
                            </div>
                        )}

                        <button className="btn btn--owner" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create Owner Account"}
                        </button>
                    </form>
                )}
                <br />

                <GoogleLoginButton />
                <div className="landing__footer">
                    <p> Vizit.Homes Cameroon</p>
                </div>
            </div>

        </div>
    );
}
