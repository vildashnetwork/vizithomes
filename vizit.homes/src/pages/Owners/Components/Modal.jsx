import React from "react";
import CloseIcon from '@mui/icons-material/Close';

function Modal({ children, justification }) {
  return (
    <div className="modal"
    style={{
      justifyContent: justification? justification : "center",
      paddingRight: "20px" ,
    }}
    
    >
      <div className="div">
        <button className="btn-close-btn" onClick={()=>{
            document.querySelector(".modal").style.display = "none";
            
        }}><CloseIcon/></button>
        
        <div className="main">

           {children} 
        </div>
      </div>
    </div>
  );
}

export default Modal;
