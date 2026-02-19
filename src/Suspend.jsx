import React, { useEffect } from 'react';
import { Lock, AlertOctagon, Mail, ShieldAlert, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountBlocked = ({ reason, nav }) => {

    const navigate = useNavigate()


    useEffect(() => {
        if (nav === "active") {

            navigate("/", { replace: true });
            return;
        }

    }, [nav])

    const styles = {
        page: {
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000', // Solid Black - No white space
            backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 99999,
            overflow: 'auto'
        },
        overlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.05,
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
            pointerEvents: 'none',

        },
        content: {
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '800px',
            width: '90%',
            padding: '40px',
            marginTop: "130px"

        },
        glitchHeader: {
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: '900',
            color: '#ff4d4d',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            margin: '0 0 10px 0',
            textShadow: '0 0 20px rgba(255, 77, 77, 0.5)'
        },
        subHeader: {
            fontSize: '18px',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '40px'
        },
        reasonBox: {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'left',
            backdropFilter: 'blur(10px)',
            marginBottom: '40px'
        },
        reasonTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ff4d4d',
            fontWeight: '700',
            marginBottom: '15px',
            fontSize: '20px'
        },
        list: {
            color: '#cccccc',
            lineHeight: '1.8',
            fontSize: '16px',
            margin: 0,
            paddingLeft: '20px'
        },
        button: {
            backgroundColor: '#ff4d4d',
            color: '#ffffff',
            padding: '18px 45px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(255, 77, 77, 0.3)'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.overlay}></div>

            <div style={styles.content}>
                <AlertOctagon size={80} color="#ff4d4d" strokeWidth={1.5} style={{ marginBottom: '20px' }} />

                <h1 style={styles.glitchHeader}>Account Suspended</h1>
                <div style={styles.subHeader}>Security Protocol Violation</div>

                <div style={styles.reasonBox}>
                    <div style={styles.reasonTitle}>
                        <Gavel size={24} />
                        Reason for Suspension:
                    </div>
                    <ul style={styles.list}>
                        <li>{reason}</li>
                    </ul>
                </div>

                <p style={{ color: '#666', marginBottom: '40px', fontSize: '14px' }}>
                    If you believe this is a mistake, you must submit a formal appeal within 48 hours.
                    Your data is currently encrypted and locked.
                </p>

                <button
                    style={styles.button}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = '#ff3333';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#ff4d4d';
                    }}
                    onClick={() => {
                        const subject = encodeURIComponent("Appeal: Account Suspension");
                        const body = encodeURIComponent("Hello Vizit Team, my account has been suspended and I would like to appeal...");
                        window.location.href = `mailto:info@vizit.homes?subject=${subject}&body=${body}`;
                    }}
                >
                    <Mail size={20} />
                    Contact Compliance Team
                </button>
            </div>

            <div style={{ position: 'absolute', bottom: '40px', color: '#333', fontSize: '12px', letterSpacing: '1px' }}>
                VIZIT HOMES SECURE CORE v2.0.4
            </div>
        </div>
    );
};

export default AccountBlocked;