import React from 'react';
import { ShieldAlert, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';

const RoleConflictPage = () => {
    // Use a green, white, red, and black palette
    const colors = {
        primaryGreen: '#16a34a', // Success/Brand Green
        deepGreen: '#14532d',
        alertRed: '#dc2626',    // Alert/Warning Red
        softRed: '#fef2f2',
        pureWhite: '#ffffff',
        textBlack: '#000000',
        lightGray: '#f3f4f6',
        borderGray: '#e5e7eb'
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: colors.lightGray,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        margin: 0,
        padding: '20px',
        boxSizing: 'border-box',
    };

    const cardStyle = {
        backgroundColor: colors.pureWhite,
        padding: 'clamp(24px, 5vw, 48px)', // Responsive padding
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        maxWidth: '550px',
        width: '100%',
        border: `1px solid ${colors.borderGray}`,
        textAlign: 'center',
    };

    const iconCircleStyle = {
        width: '90px',
        height: '90px',
        backgroundColor: colors.softRed,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 28px',
        border: `2px solid ${colors.alertRed}`,
    };

    const titleStyle = {
        color: colors.textBlack,
        fontSize: 'clamp(20px, 4vw, 28px)',
        fontWeight: '800',
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '-0.5px',
    };

    const textStyle = {
        color: '#4b5563',
        fontSize: '17px',
        lineHeight: '1.6',
        marginBottom: '28px',
    };

    const highlightBox = {
        backgroundColor: colors.lightGray,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '32px',
        borderLeft: `6px solid ${colors.primaryGreen}`,
        textAlign: 'left',
    };

    const buttonStyle = {
        backgroundColor: colors.textBlack, // Clean Black Button
        color: colors.pureWhite,
        padding: '16px 32px',
        borderRadius: '12px',
        border: 'none',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    };

    const footerLink = {
        color: colors.primaryGreen,
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        borderBottom: `2px solid transparent`,
        transition: 'border-color 0.3s',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={iconCircleStyle}>
                    <ShieldAlert size={48} color={colors.alertRed} />
                </div>

                <h1 style={titleStyle}>Access Denied</h1>

                <p style={textStyle}>
                    You are currently signed in as a <strong style={{ color: colors.primaryGreen }}>House Seeker</strong>.
                    To protect the security of our marketplace, you cannot use the same email to register as a <strong>House Owner</strong>.
                </p>

                <div style={highlightBox}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <AlertTriangle size={24} color={colors.primaryGreen} />
                        <p style={{ margin: 0, fontSize: '15px', color: colors.textBlack, fontWeight: '500' }}>
                            <strong>The Rule:</strong> One email, One role. This ensures clear communication and prevents data conflicts between seekers and owners.
                        </p>
                    </div>
                </div>

                <p style={{ ...textStyle, fontSize: '14px', marginBottom: '32px' }}>
                    Please use a <span style={{ color: colors.alertRed, fontWeight: 'bold' }}>different email</span> to create an Owner account,
                    or continue using your current Seeker profile.
                </p>

                <button
                    style={buttonStyle}
                    onClick={() => window.history.back()}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primaryGreen;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = colors.textBlack;
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <ArrowLeft size={20} />
                    Return to Portal
                </button>

                <div style={{ marginTop: '28px' }}>
                    <a
                        href="/support"
                        style={footerLink}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = colors.primaryGreen}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                        Switch Accounts or Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RoleConflictPage;