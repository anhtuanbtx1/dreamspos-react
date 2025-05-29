import React, { useState } from 'react';
import { EnhancedLoader, LoadingButton } from '../../components/Loading';

const EnhancedLoaders = () => {
  const [buttonLoading, setButtonLoading] = useState({});
  const [showLoader, setShowLoader] = useState({});

  const handleButtonClick = (buttonId) => {
    setButtonLoading(prev => ({ ...prev, [buttonId]: true }));
    
    setTimeout(() => {
      setButtonLoading(prev => ({ ...prev, [buttonId]: false }));
    }, 3000);
  };

  const toggleLoader = (loaderId) => {
    setShowLoader(prev => ({ ...prev, [loaderId]: !prev[loaderId] }));
  };

  return (
    <div className="page-wrapper cardhead">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Enhanced Loaders</h3>
              <p className="text-muted">Beautiful loading animations and buttons with various styles</p>
            </div>
          </div>
        </div>

        {/* Loading Animations */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Modern Ring Loader</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="modern" size="medium" color="primary" showText={false} overlay={false} />
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => toggleLoader('modern')}
                >
                  Toggle with Overlay
                </button>
                {showLoader.modern && (
                  <EnhancedLoader 
                    type="modern" 
                    size="large" 
                    color="primary" 
                    text="Loading with overlay..." 
                    overlay={true} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Pulse Loader</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="pulse" size="medium" color="success" showText={false} overlay={false} />
                <button 
                  className="btn btn-success mt-3"
                  onClick={() => toggleLoader('pulse')}
                >
                  Toggle with Progress
                </button>
                {showLoader.pulse && (
                  <EnhancedLoader 
                    type="pulse" 
                    size="large" 
                    color="success" 
                    text="Processing data" 
                    overlay={true}
                    progress={75}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Wave Loader</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="wave" size="medium" color="info" showText={false} overlay={false} />
                <button 
                  className="btn btn-info mt-3"
                  onClick={() => toggleLoader('wave')}
                >
                  Show Wave Overlay
                </button>
                {showLoader.wave && (
                  <EnhancedLoader 
                    type="wave" 
                    size="large" 
                    color="info" 
                    text="Syncing data" 
                    overlay={true} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Gradient Spinner</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="gradient" size="medium" color="danger" showText={false} overlay={false} />
                <button 
                  className="btn btn-danger mt-3"
                  onClick={() => toggleLoader('gradient')}
                >
                  Show Gradient Overlay
                </button>
                {showLoader.gradient && (
                  <EnhancedLoader 
                    type="gradient" 
                    size="large" 
                    color="danger" 
                    text="Uploading files" 
                    overlay={true} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Dots Loader</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="dots" size="medium" color="primary" showText={false} overlay={false} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Bounce Loader</h5>
              </div>
              <div className="card-body text-center">
                <EnhancedLoader type="bounce" size="medium" color="success" showText={false} overlay={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Buttons */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Loading Buttons</h5>
                <p className="text-muted mb-0">Interactive buttons with loading states</p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Primary Buttons</h6>
                    <div className="btn-list mb-4">
                      <LoadingButton
                        variant="primary"
                        size="small"
                        loading={buttonLoading.btn1}
                        onClick={() => handleButtonClick('btn1')}
                        loadingText="Saving..."
                      >
                        Save Changes
                      </LoadingButton>

                      <LoadingButton
                        variant="primary"
                        size="medium"
                        loading={buttonLoading.btn2}
                        onClick={() => handleButtonClick('btn2')}
                        loadingText="Processing..."
                        spinnerType="dots"
                      >
                        Process Data
                      </LoadingButton>

                      <LoadingButton
                        variant="primary"
                        size="large"
                        loading={buttonLoading.btn3}
                        onClick={() => handleButtonClick('btn3')}
                        loadingText="Uploading..."
                        spinnerType="pulse"
                      >
                        Upload Files
                      </LoadingButton>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6>Colored Buttons</h6>
                    <div className="btn-list mb-4">
                      <LoadingButton
                        variant="success"
                        loading={buttonLoading.btn4}
                        onClick={() => handleButtonClick('btn4')}
                        loadingText="Submitting..."
                      >
                        Submit Form
                      </LoadingButton>

                      <LoadingButton
                        variant="danger"
                        loading={buttonLoading.btn5}
                        onClick={() => handleButtonClick('btn5')}
                        loadingText="Deleting..."
                      >
                        Delete Item
                      </LoadingButton>

                      <LoadingButton
                        variant="outline-primary"
                        loading={buttonLoading.btn6}
                        onClick={() => handleButtonClick('btn6')}
                        loadingText="Loading..."
                      >
                        Load More
                      </LoadingButton>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <h6>Disabled State</h6>
                    <div className="btn-list">
                      <LoadingButton variant="primary" disabled>
                        Disabled Button
                      </LoadingButton>
                      
                      <LoadingButton variant="secondary" disabled>
                        Also Disabled
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Variations */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Size Variations</h5>
              </div>
              <div className="card-body text-center">
                <div className="d-flex justify-content-around align-items-center flex-wrap gap-4">
                  <div>
                    <h6>Small</h6>
                    <EnhancedLoader type="modern" size="small" color="primary" showText={false} overlay={false} />
                  </div>
                  <div>
                    <h6>Medium</h6>
                    <EnhancedLoader type="modern" size="medium" color="primary" showText={false} overlay={false} />
                  </div>
                  <div>
                    <h6>Large</h6>
                    <EnhancedLoader type="modern" size="large" color="primary" showText={false} overlay={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoaders;
