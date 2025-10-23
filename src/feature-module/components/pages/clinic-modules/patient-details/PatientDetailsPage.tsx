import { Phone } from "tabler-icons-react";
import { Link, useParams, useNavigate } from "react-router";
import { useState } from "react";

import ImageWithBasePath from "@/core/imageWithBasePath";
import {
  AppointmentsTable,
  PaymentsTable,
  FilesTable,
  type PlanRow,
  type AppointmentRow,
} from "./tables";
import AddPaymentModal, {
  type PaymentFormData,
} from "./modals/AddPaymentModal";
import AppointmentDetailsModal from "@/core/components/AppointmentDetailsModal";
import EditAppointmentModal from "@/core/components/EditAppointmentModal";
import CancelAppointmentModal from "@/core/components/CancelAppointmentModal";
import { useEnhancedPatientDetails } from "./hooks/useEnhancedPatientDetails";
import { SmartError, ErrorBoundary } from "@/components/ErrorDisplay";
import { createPayment } from "@/api/payments";
import { cancelAppointment } from "@/api/enhancedAppointments";
import type { CancelReasonT } from "@/types/typedefs";
import { SearchTable, PlanCard } from "./components";
import { all_routes } from "@/feature-module/routes/all_routes";

import "./styles/patientDetails.css";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] =
    useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRow | null>(null);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] =
    useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<AppointmentRow | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const {
    patient,
    loading,
    error,
    searchText,
    handleSearch,
    refresh,
    filteredAppointments,
    filteredPayments,
    filteredFiles,
    handleRetry,
    clearError,
  } = useEnhancedPatientDetails(id, {
    autoRetry: true,
    maxRetries: 3,
    showErrorToasts: true,
  });

  const handleAddPayment = async (paymentData: PaymentFormData) => {
    if (!patient?.id) return;

    setPaymentLoading(true);
    try {
      // Create the payment using the API
      const newPayment = await createPayment({
        patientId: patient.id,
        planId: paymentData.planId || null,
        appointmentId: paymentData.appointmentId || null,
        amountJd: paymentData.amountJd,
        method: paymentData.method,
        paidAt: new Date().toISOString(),
      });

      console.log("Payment added successfully:", newPayment);

      // Close the modal
      setIsPaymentModalOpen(false);

      // Refresh the patient data to get updated balance and payments
      await refresh();

      // Show success message (you might want to add a toast notification here)
      console.log("Payment added successfully!");
    } catch (error) {
      console.error("Failed to add payment:", error);
      // The error will be handled by the enhanced API's error handling system
      // You might want to show a specific error message to the user here
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewAppointment = (appointment: AppointmentRow) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleAppointmentModalClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: AppointmentRow) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentOpen(true);
  };

  const handleEditAppointmentClose = async (didSave?: boolean) => {
    setIsEditAppointmentOpen(false);
    if (didSave) {
      await refresh();
    }
  };

  const handleSessionCompleted = async () => {
    // Refresh the patient data to get updated appointment status
    await refresh();
  };

  const handleCancelAppointment = (appointment: AppointmentRow) => {
    setAppointmentToCancel(appointment);
    setIsCancelModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setAppointmentToCancel(null);
  };

  const handleCancelConfirm = async (cancelReason: CancelReasonT) => {
    if (!appointmentToCancel) return;

    setIsCancelling(true);
    try {
      await cancelAppointment(appointmentToCancel.id, cancelReason);
      await refresh(); // Refresh the patient data to get updated appointment status
      handleCancelModalClose();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleBookAppointment = () => {
    if (patient?.id) {
      navigate(`${all_routes.newAppointment}/${patient.id}`);
    } else {
      navigate(all_routes.newAppointment);
    }
  };

  const handleBeginTreatment = () => {
    if (patient?.id) {
      navigate(all_routes.beginTreatment.replace(":patientId", patient.id));
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading patient details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="mb-3">
            <SmartError
              error={error}
              onRetry={handleRetry}
              onDismiss={clearError}
              showSuggestions={true}
              showRetryButton={true}
            />
          </div>
          <div className="text-center">
            <Link to="/patients" className="btn btn-primary">
              <i className="ti ti-arrow-left me-1" />
              Back to Patients List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Patient Not Found</h4>
            <p>The requested patient could not be found.</p>
            <hr />
            <p className="mb-0">
              <Link to="/patients" className="btn btn-primary">
                Back to Patients List
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          <div
            className={`patient-header ${
              !patient.isActive ? "patient-inactive" : ""
            }`}
          >
            {!patient.isActive && (
              <div className="inactive-warning">
                <i className="ti ti-alert-triangle me-2"></i>
                <span>This patient is currently inactive</span>
              </div>
            )}
            <div className="patient-info">
              <div className="avatar">
                <ImageWithBasePath
                  src="assets/img/icons/medIcon.svg"
                  alt="medIcon"
                />
              </div>
              <div>
                <div className="patient-id">{`#${patient.id}`}</div>
                <div className="patient-name">{patient.fullName}</div>
                <div className="badges">
                  {patient.hasInsurance && (
                    <span className="badge insurance">Insurance</span>
                  )}
                  {patient.extraCare && (
                    <span className="badge extra-care">Extra Care</span>
                  )}
                  {!patient.isActive && (
                    <span className="badge inactive">Inactive</span>
                  )}
                </div>
                <div className="patient-contact">
                  <Phone className="phone-icon" color="blue" />
                  <span>{patient.phone}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="cta">
              <div className="last-visit">Last visited: 30 Apr 2025</div>
              <div className="patient-balance">
                Balance:{" "}
                <span
                  className={`balance-amount ${
                    parseFloat(patient.balance) < 0 ? "negative" : ""
                  }`}
                >
                  {patient.balance} JD
                </span>
              </div>
              {patient.isActive ? (
                <button
                  className="book-btn btn btn-primary"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>
              ) : (
                <button
                  className="begin-treatment-btn btn btn-warning"
                  onClick={handleBeginTreatment}
                >
                  Begin Treatment
                </button>
              )}
            </div>
          </div>

          <div className="info-grid">
            <div className="card">
              <h3>About & Insurance</h3>
              <div className="card-content">
                <div className="field">
                  <label>DOB</label>
                  <span>{patient.dob}</span>
                </div>
                <div className="field">
                  <label>Age</label>
                  <span>
                    {new Date().getFullYear() -
                      new Date(patient.dob).getFullYear()}{" "}
                    years
                  </span>
                </div>
                <div className="field">
                  <label>Gender</label>
                  <span>
                    {patient.gender === "M"
                      ? "Male"
                      : patient.gender === "F"
                      ? "Female"
                      : "Other"}
                  </span>
                </div>
                <div className="field">
                  <label>Blood Group</label>
                  <span>O+</span>
                </div>
                <div className="field">
                  <label>National Id</label>
                  <span>{patient.nationalId}</span>
                </div>
                <div className="field">
                  <label>Insurer</label>
                  <span>HealthCare Co.</span>
                </div>
                <div className="field">
                  <label>Policy No.</label>
                  <span>INS‑987654</span>
                </div>
                <div className="field">
                  <label>Policy Expiry</label>
                  <span>31 Dec 2025</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Medical History & Implants</h3>
              <div className="card-content">
                <div className="field f-size">
                  <label>Medical History</label>
                  {patient.medicalHistory &&
                  patient.medicalHistory.length > 0 ? (
                    <ul className="diagnosis-list">
                      {patient.medicalHistory.map(
                        (condition: string, index: number) => (
                          <span key={index}>- {condition}</span>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-muted">
                      No medical history recorded
                    </span>
                  )}
                </div>
                <div className="field f-size">
                  <label>Orthopedic Implants</label>
                  {patient.orthopedicImplants &&
                  patient.orthopedicImplants.length > 0 ? (
                    <ul className="symptoms-list">
                      {patient.orthopedicImplants.map(
                        (implant: string, index: number) => (
                          <span key={index}>- {implant}</span>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-muted">
                      No orthopedic implants recorded
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Show Plan Card for Active Patients */}
            {patient.isActive && patient.plans && patient.plans.length > 0 && (
              <PlanCard plan={patient.plans[0] as PlanRow} patient={patient} />
            )}
          </div>

          <ul className="nav nav-tabs nav-bordered mb-3">
            <li className="nav-item">
              <Link
                to="#appointments"
                data-bs-toggle="tab"
                aria-expanded="false"
                className="nav-link active bg-transparent"
              >
                <span>Appointments</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#payments"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link bg-transparent"
              >
                <span>Payments</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#files"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link bg-transparent"
              >
                <span>Files</span>
              </Link>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane show active" id="appointments">
              <SearchTable
                searchText={searchText}
                handleSearch={handleSearch}
              />
              <AppointmentsTable
                rows={filteredAppointments}
                loading={loading}
                onViewAppointment={handleViewAppointment}
                onEditAppointment={handleEditAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            </div>
            <div className="tab-pane" id="payments">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <SearchTable
                  searchText={searchText}
                  handleSearch={handleSearch}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={loading || !patient}
                >
                  <i className="ti ti-plus me-2"></i>
                  Add Payment
                </button>
              </div>
              <PaymentsTable rows={filteredPayments} loading={loading} />
            </div>
            <div className="tab-pane" id="files">
              <SearchTable
                searchText={searchText}
                handleSearch={handleSearch}
              />
              <FilesTable rows={filteredFiles} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleAddPayment}
        patientId={patient?.id || ""}
        patientName={patient?.fullName || ""}
        loading={paymentLoading}
      />

      <AppointmentDetailsModal
        isOpen={isAppointmentModalOpen}
        onClose={handleAppointmentModalClose}
        appointment={selectedAppointment}
        patient={patient}
        treatmentPlan={patient?.plans?.[0] || null}
        lastSessionNote={null} // TODO: Get last session note from appointment data
        onSessionCompleted={handleSessionCompleted}
      />

      <EditAppointmentModal
        isOpen={isEditAppointmentOpen}
        onClose={() => handleEditAppointmentClose(false)}
        appointment={selectedAppointment}
        onSaved={async () => {
          await refresh();
          handleEditAppointmentClose(true);
        }}
      />

      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        appointment={appointmentToCancel}
        isLoading={isCancelling}
      />
    </ErrorBoundary>
  );
};

export default PatientDetailsPage;
