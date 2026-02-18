import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PayToViewModal = ({ isOpen, onClose, onRefreshUser }) => {
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const pricePerMonth = 50; 

  const handlePayment = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post("https://vizit-backend-hubw.onrender.com/api/subscribe-to-view", {
        userId,
        months: parseInt(months),
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        onRefreshUser(); // Trigger data refresh in parent
        onClose(); // Close modal
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Payment failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3> Unlock Property Details</h3>
        <p>You need an active subscription to view full property details and contacts.</p>
        
        <div className="subscription-options">
          <label>Select Duration:</label>
          <select 
            value={months} 
            onChange={(e) => setMonths(e.target.value)}
            disabled={loading}
          >
            <option value={1}>1 Month (50 XAF)</option>
            <option value={3}>3 Months (150 XAF)</option>
            <option value={6}>6 Months (300 XAF)</option>
            <option value={12}>1 Year (600 XAF)</option>
          </select>
        </div>

        <div className="modal-total">
          <strong>Total Cost: {months * pricePerMonth} XAF</strong>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-pay" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white; padding: 25px; border-radius: 12px;
          width: 90%; max-width: 400px; text-align: center;
        }
        .subscription-options { margin: 20px 0; }
        select { width: 100%; padding: 10px; margin-top: 10px; border-radius: 5px; }
        .modal-total { margin-bottom: 20px; color: #007e77; font-size: 1.2em; }
        .modal-actions { display: flex; gap: 10px; justify-content: center; }
        .btn-pay { background: #007e77; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        .btn-cancel { background: #eee; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default PayToViewModal;