import React from "react";

function Modal({ children }) {
  return (
    <div className="modal">
      <div className="div">
        <button className="btn-close-btn" onClick={()=>{
            document.querySelector(".modal").style.display = "none";
        }}>Close</button>
        
        <div className="main">

           {children} 
        </div>
      </div>
    </div>
  );
}

export default Modal;
