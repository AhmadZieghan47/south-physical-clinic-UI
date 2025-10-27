import { useState } from "react";
import { Link } from "react-router";
import { Modal } from "../../../../../../core/common/modal";
import { Trash, AlertCircle } from "lucide-react";

const ModalExamples = () => {
  // State for different modals
  const [standardModal, setStandardModal] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [smallModal, setSmallModal] = useState(false);
  const [xlModal, setXlModal] = useState(false);
  const [fullWidthModal, setFullWidthModal] = useState(false);
  
  // Position modals
  const [topModal, setTopModal] = useState(false);
  const [centerModal, setCenterModal] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  
  // Colored header modals
  const [primaryHeaderModal, setPrimaryHeaderModal] = useState(false);
  const [successHeaderModal, setSuccessHeaderModal] = useState(false);
  const [infoHeaderModal, setInfoHeaderModal] = useState(false);
  const [warningHeaderModal, setWarningHeaderModal] = useState(false);
  const [dangerHeaderModal, setDangerHeaderModal] = useState(false);
  const [darkHeaderModal, setDarkHeaderModal] = useState(false);
  
  // Filled modals
  const [primaryFilledModal, setPrimaryFilledModal] = useState(false);
  const [successFilledModal, setSuccessFilledModal] = useState(false);
  const [infoFilledModal, setInfoFilledModal] = useState(false);
  const [warningFilledModal, setWarningFilledModal] = useState(false);
  const [dangerFilledModal, setDangerFilledModal] = useState(false);
  const [darkFilledModal, setDarkFilledModal] = useState(false);
  
  // Alert modals
  const [successAlertModal, setSuccessAlertModal] = useState(false);
  const [infoAlertModal, setInfoAlertModal] = useState(false);
  const [warningAlertModal, setWarningAlertModal] = useState(false);
  const [dangerAlertModal, setDangerAlertModal] = useState(false);
  
  // Special modals
  const [scrollableModal, setScrollableModal] = useState(false);
  const [staticBackdropModal, setStaticBackdropModal] = useState(false);
  const [fullscreenModal, setFullscreenModal] = useState(false);
  const [fullscreenSmModal, setFullscreenSmModal] = useState(false);
  const [fullscreenMdModal, setFullscreenMdModal] = useState(false);
  const [fullscreenLgModal, setFullscreenLgModal] = useState(false);
  const [fullscreenXlModal, setFullscreenXlModal] = useState(false);
  const [fullscreenXxlModal, setFullscreenXxlModal] = useState(false);
  
  // Form and loading modals
  const [formModal, setFormModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom alert modal
  const [customAlertModal, setCustomAlertModal] = useState(false);

  const handleLoadingAction = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setLoadingModal(false);
  };

  return (
    <>
      {/* Page Content */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold mb-0">Reusable Modal Examples</h4>
            </div>
            <div className="text-end">
              <ol className="breadcrumb m-0 py-0">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Base UI</Link>
                </li>
                <li className="breadcrumb-item active">Modal Examples</li>
              </ol>
            </div>
          </div>
          {/* End Page Header */}

          {/* Size Variants */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Modal Sizes</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Modals have five optional sizes: small, default (medium), large, extra large, and full width.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setStandardModal(true)}
                    >
                      Standard Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setSmallModal(true)}
                    >
                      Small Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => setLargeModal(true)}
                    >
                      Large Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setXlModal(true)}
                    >
                      XL Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setFullWidthModal(true)}
                    >
                      Full Width Modal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Variants */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Modal Positions</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Specify the position for the modal: top, center, or bottom of the viewport.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setTopModal(true)}
                    >
                      Top Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCenterModal(true)}
                    >
                      Center Modal
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setBottomModal(true)}
                    >
                      Bottom Modal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colored Header & Filled Modals */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Colored Header Modals</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Modals with colored headers for different contexts.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setPrimaryHeaderModal(true)}
                    >
                      Primary Header
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setSuccessHeaderModal(true)}
                    >
                      Success Header
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => setInfoHeaderModal(true)}
                    >
                      Info Header
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setWarningHeaderModal(true)}
                    >
                      Warning Header
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setDangerHeaderModal(true)}
                    >
                      Danger Header
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => setDarkHeaderModal(true)}
                    >
                      Dark Header
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Filled Modals</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Modals with entire background filled with contextual colors.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setPrimaryFilledModal(true)}
                    >
                      Primary Filled
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setSuccessFilledModal(true)}
                    >
                      Success Filled
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => setInfoFilledModal(true)}
                    >
                      Info Filled
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setWarningFilledModal(true)}
                    >
                      Warning Filled
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setDangerFilledModal(true)}
                    >
                      Danger Filled
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => setDarkFilledModal(true)}
                    >
                      Dark Filled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Modals */}
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Alert Modals</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Compact alert-style modals with icons for notifications and confirmations.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setSuccessAlertModal(true)}
                    >
                      Success Alert
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => setInfoAlertModal(true)}
                    >
                      Info Alert
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setWarningAlertModal(true)}
                    >
                      Warning Alert
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setDangerAlertModal(true)}
                    >
                      Danger Alert
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => setCustomAlertModal(true)}
                    >
                      Custom Icon Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Scrollable Modal</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">Modal with scrollable body content.</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setScrollableModal(true)}
                  >
                    Scrollable Modal
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Static Backdrop</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Modal that won't close when clicking outside.
                  </p>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={() => setStaticBackdropModal(true)}
                  >
                    Static Backdrop
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Loading State</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">Modal with loading state example.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setLoadingModal(true)}
                  >
                    Loading Modal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fullscreen & Form */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Fullscreen Modals</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Modals that can be fullscreen at different breakpoints.
                  </p>
                  <div className="hstack gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenModal(true)}
                    >
                      Fullscreen
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenSmModal(true)}
                    >
                      Below SM
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenMdModal(true)}
                    >
                      Below MD
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenLgModal(true)}
                    >
                      Below LG
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenXlModal(true)}
                    >
                      Below XL
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setFullscreenXxlModal(true)}
                    >
                      Below XXL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Form Modal</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">Example modal with a form inside.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormModal(true)}
                  >
                    Open Form Modal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer d-sm-flex align-items-center justify-content-between bg-white py-2 px-4 border-top">
          <p className="text-dark mb-0">
            ©
            <Link to="#" className="link-primary">
              Kanakku
            </Link>
            , All Rights Reserved
          </p>
          <p className="text-dark">Version : 1.3.8</p>
        </div>
      </div>

      {/* Modal Components */}
      
      {/* Size Modals */}
      <Modal
        isOpen={standardModal}
        onClose={() => setStandardModal(false)}
        title="Standard Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStandardModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <h5>Text in a modal</h5>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
        <hr />
        <p className="mb-0">
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
        </p>
      </Modal>

      <Modal
        isOpen={smallModal}
        onClose={() => setSmallModal(false)}
        size="sm"
        title="Small Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSmallModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p className="mb-0">This is a small modal.</p>
      </Modal>

      <Modal
        isOpen={largeModal}
        onClose={() => setLargeModal(false)}
        size="lg"
        title="Large Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setLargeModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p className="mb-0">This is a large modal with more space.</p>
      </Modal>

      <Modal
        isOpen={xlModal}
        onClose={() => setXlModal(false)}
        size="xl"
        title="Extra Large Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setXlModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p className="mb-0">This is an extra large modal.</p>
      </Modal>

      <Modal
        isOpen={fullWidthModal}
        onClose={() => setFullWidthModal(false)}
        size="full-width"
        title="Full Width Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullWidthModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p className="mb-0">This modal takes the full width of the viewport.</p>
      </Modal>

      {/* Position Modals */}
      <Modal
        isOpen={topModal}
        onClose={() => setTopModal(false)}
        position="top"
        title="Top Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setTopModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Text in a modal</h5>
        <p className="mb-0">This modal is aligned to the top of the viewport.</p>
      </Modal>

      <Modal
        isOpen={centerModal}
        onClose={() => setCenterModal(false)}
        position="center"
        title="Centered Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCenterModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Centered Modal</h5>
        <p className="mb-0">This modal is vertically centered.</p>
      </Modal>

      <Modal
        isOpen={bottomModal}
        onClose={() => setBottomModal(false)}
        position="bottom"
        title="Bottom Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setBottomModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Text in a modal</h5>
        <p className="mb-0">This modal is aligned to the bottom of the viewport.</p>
      </Modal>

      {/* Colored Header Modals */}
      <Modal
        isOpen={primaryHeaderModal}
        onClose={() => setPrimaryHeaderModal(false)}
        variant="primary"
        headerStyle="colored"
        title="Primary Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPrimaryHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Primary Background</h5>
        <p className="mb-0">
          This modal has a primary colored header for visual emphasis.
        </p>
      </Modal>

      <Modal
        isOpen={successHeaderModal}
        onClose={() => setSuccessHeaderModal(false)}
        variant="success"
        headerStyle="colored"
        title="Success Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSuccessHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-success">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Success Background</h5>
        <p className="mb-0">This modal has a success colored header.</p>
      </Modal>

      <Modal
        isOpen={infoHeaderModal}
        onClose={() => setInfoHeaderModal(false)}
        variant="info"
        headerStyle="colored"
        title="Info Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setInfoHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-info">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Info Background</h5>
        <p className="mb-0">This modal has an info colored header.</p>
      </Modal>

      <Modal
        isOpen={warningHeaderModal}
        onClose={() => setWarningHeaderModal(false)}
        variant="warning"
        headerStyle="colored"
        title="Warning Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setWarningHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-warning">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Warning Background</h5>
        <p className="mb-0">This modal has a warning colored header.</p>
      </Modal>

      <Modal
        isOpen={dangerHeaderModal}
        onClose={() => setDangerHeaderModal(false)}
        variant="danger"
        headerStyle="colored"
        title="Danger Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDangerHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-danger">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Danger Background</h5>
        <p className="mb-0">This modal has a danger colored header.</p>
      </Modal>

      <Modal
        isOpen={darkHeaderModal}
        onClose={() => setDarkHeaderModal(false)}
        variant="dark"
        headerStyle="colored"
        title="Dark Header Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDarkHeaderModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-dark">
              Save changes
            </button>
          </>
        }
      >
        <h5 className="mt-0">Dark Background</h5>
        <p className="mb-0">This modal has a dark colored header.</p>
      </Modal>

      {/* Filled Modals */}
      <Modal
        isOpen={primaryFilledModal}
        onClose={() => setPrimaryFilledModal(false)}
        variant="primary"
        filled
        title="Primary Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setPrimaryFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>
          This entire modal has a primary background color for maximum visual impact.
        </p>
        <p className="mb-0">All text automatically adapts to white for readability.</p>
      </Modal>

      <Modal
        isOpen={successFilledModal}
        onClose={() => setSuccessFilledModal(false)}
        variant="success"
        filled
        title="Success Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setSuccessFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>This entire modal has a success background color.</p>
        <p className="mb-0">Perfect for success confirmations.</p>
      </Modal>

      <Modal
        isOpen={infoFilledModal}
        onClose={() => setInfoFilledModal(false)}
        variant="info"
        filled
        title="Info Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setInfoFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>This entire modal has an info background color.</p>
        <p className="mb-0">Great for informational messages.</p>
      </Modal>

      <Modal
        isOpen={warningFilledModal}
        onClose={() => setWarningFilledModal(false)}
        variant="warning"
        filled
        title="Warning Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setWarningFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>This entire modal has a warning background color.</p>
        <p className="mb-0">Ideal for warning messages.</p>
      </Modal>

      <Modal
        isOpen={dangerFilledModal}
        onClose={() => setDangerFilledModal(false)}
        variant="danger"
        filled
        title="Danger Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-info"
              onClick={() => setDangerFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>This entire modal has a danger background color.</p>
        <p className="mb-0">Perfect for critical error messages.</p>
      </Modal>

      <Modal
        isOpen={darkFilledModal}
        onClose={() => setDarkFilledModal(false)}
        variant="dark"
        filled
        title="Dark Filled Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setDarkFilledModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-secondary">
              Save changes
            </button>
          </>
        }
      >
        <p>This entire modal has a dark background color.</p>
        <p className="mb-0">Great for dark-themed notifications.</p>
      </Modal>

      {/* Alert Modals */}
      <Modal
        isOpen={successAlertModal}
        onClose={() => setSuccessAlertModal(false)}
        size="sm"
        variant="success"
        filled
        alert
        title="Well Done!"
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSuccessAlertModal(false)}
          >
            Continue
          </button>
        }
      >
        <p className="mt-3">
          Congratulations! You've achieved success! 🎉 Your hard work, dedication,
          and perseverance have paid off.
        </p>
      </Modal>

      <Modal
        isOpen={infoAlertModal}
        onClose={() => setInfoAlertModal(false)}
        size="sm"
        variant="info"
        alert
        title="Heads up!"
        footer={
          <button
            type="button"
            className="btn btn-info"
            onClick={() => setInfoAlertModal(false)}
          >
            Continue
          </button>
        }
      >
        <p className="mt-3">
          Please be informed that our platform will undergo scheduled maintenance
          on 21 April from 10:30 PM to 11:45 PM.
        </p>
      </Modal>

      <Modal
        isOpen={warningAlertModal}
        onClose={() => setWarningAlertModal(false)}
        size="sm"
        variant="warning"
        alert
        title="Incorrect Information"
        footer={
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => setWarningAlertModal(false)}
          >
            Continue
          </button>
        }
      >
        <p className="mt-3">
          We have detected suspicious activity on our platform. As a precautionary
          measure, we urge all users to refrain from logging in or providing any
          personal information until further notice.
        </p>
      </Modal>

      <Modal
        isOpen={dangerAlertModal}
        onClose={() => setDangerAlertModal(false)}
        size="sm"
        variant="danger"
        filled
        alert
        title="Oh snap!"
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDangerAlertModal(false)}
          >
            Continue
          </button>
        }
      >
        <p className="mt-3">
          A critical security breach has been identified on our platform. Your
          personal information and sensitive data may be at risk.
        </p>
      </Modal>

      <Modal
        isOpen={customAlertModal}
        onClose={() => setCustomAlertModal(false)}
        size="sm"
        variant="danger"
        alert
        alertIcon={<Trash className="h1 text-danger" />}
        title="Delete Confirmation"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCustomAlertModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setCustomAlertModal(false)}
            >
              Delete
            </button>
          </>
        }
      >
        <p className="mt-3">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </Modal>

      {/* Scrollable Modal */}
      <Modal
        isOpen={scrollableModal}
        onClose={() => setScrollableModal(false)}
        scrollable
        title="Scrollable Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setScrollableModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </p>
        <p>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </p>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </p>
        <p>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </p>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </p>
        <p className="mb-0">
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </p>
      </Modal>

      {/* Static Backdrop Modal */}
      <Modal
        isOpen={staticBackdropModal}
        onClose={() => setStaticBackdropModal(false)}
        staticBackdrop
        title="Static Backdrop Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStaticBackdropModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Understood
            </button>
          </>
        }
      >
        <p className="m-0">
          I will not close if you click outside me. Don't even try to press escape
          key. You must use the close button or footer buttons.
        </p>
      </Modal>

      {/* Fullscreen Modals */}
      <Modal
        isOpen={fullscreenModal}
        onClose={() => setFullscreenModal(false)}
        fullscreen
        title="Fullscreen Modal"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is always fullscreen regardless of viewport size.</p>
      </Modal>

      <Modal
        isOpen={fullscreenSmModal}
        onClose={() => setFullscreenSmModal(false)}
        fullscreen="sm"
        title="Fullscreen Below SM"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenSmModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is fullscreen below the SM breakpoint (576px).</p>
      </Modal>

      <Modal
        isOpen={fullscreenMdModal}
        onClose={() => setFullscreenMdModal(false)}
        fullscreen="md"
        title="Fullscreen Below MD"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenMdModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is fullscreen below the MD breakpoint (768px).</p>
      </Modal>

      <Modal
        isOpen={fullscreenLgModal}
        onClose={() => setFullscreenLgModal(false)}
        fullscreen="lg"
        title="Fullscreen Below LG"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenLgModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is fullscreen below the LG breakpoint (992px).</p>
      </Modal>

      <Modal
        isOpen={fullscreenXlModal}
        onClose={() => setFullscreenXlModal(false)}
        fullscreen="xl"
        title="Fullscreen Below XL"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenXlModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is fullscreen below the XL breakpoint (1200px).</p>
      </Modal>

      <Modal
        isOpen={fullscreenXxlModal}
        onClose={() => setFullscreenXxlModal(false)}
        fullscreen="xxl"
        title="Fullscreen Below XXL"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFullscreenXxlModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <p>This modal is fullscreen below the XXL breakpoint (1400px).</p>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title="Edit User"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormModal(false)}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select className="form-control" id="role">
              <option>Admin</option>
              <option>Manager</option>
              <option>User</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Loading Modal */}
      <Modal
        isOpen={loadingModal}
        onClose={() => setLoadingModal(false)}
        isLoading={isLoading}
        title="Processing Request"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setLoadingModal(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLoadingAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </>
        }
      >
        <p>
          Click the Submit button to see the loading state in action. The close
          button will be disabled during processing.
        </p>
        <div className="alert alert-info mb-0" role="alert">
          <AlertCircle className="me-2" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} />
          This is a simulated async operation that takes 2 seconds.
        </div>
      </Modal>
    </>
  );
};

export default ModalExamples;


