import React from 'react';
import { ShieldAlert, ArrowLeft, Mail } from 'lucide-react'; // Using lucide-react for icons

const RoleConflictPage = () => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
        textAlign: 'center'
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        maxWidth: '450px',
        width: '100%'
    };

    const iconCircleStyle = {
        width: '80px',
        height: '80px',
        backgroundColor: '#fee2e2',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
    };

    const titleStyle = {
        color: '#1e293b',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px'
    };

    const textStyle = {
        color: '#64748b',
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '24px'
    };

    const highlightBox = {
        backgroundColor: '#f1f5f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '24px',
        borderLeft: '4px solid #ef4444',
        textAlign: 'left'
    };

    const buttonStyle = {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={iconCircleStyle}>
                    <ShieldAlert size={40} color="#ef4444" />
                </div>

                <h1 style={titleStyle}>Email Already in Use</h1>

                <p style={textStyle}>
                    It looks like you're trying to access the <strong>Owner Portal</strong>,
                    but this email is currently registered as a <strong>House Seeker</strong>.
                </p>

                <div style={highlightBox}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                        <strong>Security Rule:</strong> To maintain account integrity, you cannot use the same email for both Owner and Seeker roles.
                    </p>
                </div>

                <p style={{ ...textStyle, fontSize: '14px' }}>
                    Please use a different email address to register as a House Owner,
                    or log in to your existing Seeker account.
                </p>

                <button
                    style={buttonStyle}
                    onClick={() => window.history.back()}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>

                <div style={{ marginTop: '20px' }}>
                    <a href="/support" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
                        Need help merging accounts? Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RoleConflictPage;