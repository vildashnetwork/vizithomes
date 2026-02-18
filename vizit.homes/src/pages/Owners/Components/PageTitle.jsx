import React, { Children } from "react";
import "./Components.css";
import AddIcon from "@mui/icons-material/Add";
function PageTitle({
  title,
  subTitle,
  userName,
  buttonText,
  btnFunction,
  children,
}) {
  return (
    <div className="welcome">
      <div>
        <h2>
          {title}
          {userName}
        </h2>
        <p>{subTitle}</p>
      </div>
      <div className="any-btns">
        {buttonText && (
          <button className="button" onClick={btnFunction}>
            <AddIcon className="btn-icon" /> {buttonText}
          </button>
        )}

        {children}
      </div>
    </div>
  );
}

export default PageTitle;
