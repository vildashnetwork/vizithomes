import React from "react";
import "./style/osner.css";

const GoogleLoginButton = ({ role }) => {

    const handleGoogleLogin = () => {
        // Direct link to your backend endpoint
        window.location.href = `https://auth.vizit.homes/auth/google?role=${role}`;
    };
    return (
        <button className="google-btn" onClick={handleGoogleLogin}>
            <div className="google-btn__icon">
                <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google Logo"
                />
            </div>
            <span className="google-btn__text">Continue with Google</span>
        </button>
    );
};

export default GoogleLoginButton;
