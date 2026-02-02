import React, { useEffect, useState } from "react";
import axios from "axios";


const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },
    container: {
        position: "relative",
        maxWidth: "90%",
        maxHeight: "90%",
        background: "#000",
        padding: "10px",
        borderRadius: "8px"
    },
    image: {
        maxWidth: "100%",
        maxHeight: "80vh",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
    },
    controls: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
        gap: "15px",
        color: "#fff"
    },
    btn: {
        background: "transparent",
        border: "1px solid #fff",
        color: "#fff",
        fontSize: "20px",
        padding: "4px 12px",
        cursor: "pointer"
    },
    count: {
        fontSize: "14px"
    },
    close: {
        position: "absolute",
        top: "6px",
        right: "10px",
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: "22px",
        cursor: "pointer"
    },
    loading: {
        color: "#fff",
        padding: "40px",
        textAlign: "center"
    }
};

function ChatImageGallery({ chatId, userId, onClose }) {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chatId || !userId) return;

        const fetchImages = async () => {
            try {
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/messages/${chatId}`,
                    { params: { myId: userId } }
                );

                if (Array.isArray(res.data)) {
                    const imgs = res.data
                        .filter(m => m.image)
                        .map(m => m.image);

                    setImages(imgs);
                    setIndex(0); // always start from first image
                }
            } catch (err) {
                console.error("Image gallery load failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [chatId, userId]);

    if (!chatId) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.container} onClick={e => e.stopPropagation()}>
                {loading ? (
                    <div style={styles.loading}>Loading images...</div>
                ) : images.length === 0 ? (
                    <div style={styles.loading}>No images in this chat</div>
                ) : (
                    <>
                        <img
                            src={images[index]}
                            alt="Chat"
                            style={styles.image}
                        />

                        <div style={styles.controls}>
                            <button
                                style={styles.btn}
                                disabled={index === 0}
                                onClick={() => setIndex(i => i - 1)}
                            >
                                ‹
                            </button>

                            <span style={styles.count}>
                                {index + 1} / {images.length}
                            </span>

                            <button
                                style={styles.btn}
                                disabled={index === images.length - 1}
                                onClick={() => setIndex(i => i + 1)}
                            >
                                ›
                            </button>
                        </div>

                        <button style={styles.close} onClick={onClose}>✕</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ChatImageGallery;
