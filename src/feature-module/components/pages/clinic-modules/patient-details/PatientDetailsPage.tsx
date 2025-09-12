import { Phone } from "tabler-icons-react";
import { Link, useParams } from "react-router";
import { useState } from "react";

import ImageWithBasePath from "@/core/imageWithBasePath";
import {
  AppointmentsTable,
  PaymentsTable,
  FilesTable,
  PlansTable,
  type PlanRow,
} from "./tables";
import AddPaymentModal, {
  type PaymentFormData,
} from "./modals/AddPaymentModal";
import { usePatientDetails } from "./hooks/usePatientDetails";

import "./styles/patientDetails.css";
import Modals from "./modals/modals";
import { SearchTable } from "./components";

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

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
  } = usePatientDetails(id);

  const handleAddPayment = async (paymentData: PaymentFormData) => {
    if (!patient?.id) return;

    setPaymentLoading(true);
    try {
      console.log("Adding payment:", {
        ...paymentData,
        patientId: patient.id,
        recordedBy: "current-user-id",
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPaymentModalOpen(false);

      await refresh();

      console.log("Payment added successfully!");
    } catch (error) {
      console.error("Failed to add payment:", error);
    } finally {
      setPaymentLoading(false);
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
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
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
    <>
      <div className="page-wrapper">
        <div className="container">
          <div className="patient-header">
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
              <button className="book-btn">Book Appointment</button>
            </div>
          </div>

          <div className="info-grid">
            <div className="card">
              <h3>About & Insurance</h3>
              <div className="card-content">
                <div className="field">
                  <label>DOB</label>
                  <span>25 Jan 1990</span>
                </div>
                <div className="field">
                  <label>Age</label>
                  <span>35 years</span>
                </div>
                <div className="field">
                  <label>Gender</label>
                  <span>Male</span>
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
                  <span>31 Dec 2025</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Diagnosis & Symptoms</h3>
              <div className="card-content">
                <div className="field f-size">
                  <label>Diagnoses</label>
                  <ul className="diagnosis-list">
                    <span>- Lower Back Pain</span>
                    <span>- Post‑surgical Rehab</span>
                  </ul>
                </div>
                <div className="field f-size">
                  <label>Symptoms</label>
                  <ul className="symptoms-list">
                    <span>- Muscle stiffness</span>
                    <span>- Limited range of motion</span>
                    <span>- Mild swelling</span>
                  </ul>
                </div>
              </div>
            </div>
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
                to="#plans"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link bg-transparent"
              >
                <span>Plans</span>
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
            <div className="tab-pane" id="plans">
              <SearchTable
                searchText={searchText}
                handleSearch={handleSearch}
              />
              <PlansTable rows={patient?.plans as PlanRow[]} />
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
      <Modals />

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleAddPayment}
        patientId={patient?.id || ""}
        patientName={patient?.fullName || ""}
        loading={paymentLoading}
      />
    </>
  );
};

export default PatientDetailsPage;
