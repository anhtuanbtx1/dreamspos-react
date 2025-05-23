import React from "react";
import { Link } from "react-router-dom";

// Create a proper React component with uppercase name to fix the ESLint error
const Chat = () => {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Chat Feature</h4>
                  <p>This feature has been removed.</p>
                  <Link to="/" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component with the correct name
export default Chat;
