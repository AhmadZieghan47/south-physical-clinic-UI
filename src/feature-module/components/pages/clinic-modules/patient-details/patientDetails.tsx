import { Phone } from "tabler-icons-react";
import { Link } from "react-router";
import { useState } from "react";

import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import {
  mockAppointments,
  mockPayments,
  patientData,
} from "../../../../../lib/mockData";
import { AppointmentsTable } from "../patient-details/AppointmentsTable";
import { PaymentsTable } from "../patient-details/PaymentsTable";
import SearchTable from "../patient-details/SearchTable";
import { PlansTable, type PlanRow } from "./PlansTable";

import "./patientDetails.css";
import Modals from "./modals/modals";

const CreatePatient = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="container">
          {/* <!-- Header --> */}
          <div className="patient-header">
            <div className="patient-info">
              <div className="avatar">
                <ImageWithBasePath src="assets/img/icons/medIcon.svg" />
              </div>
              <div>
                <div className="patient-id">{`#${patientData.id}`}</div>
                <div className="patient-name">{patientData.fullName}</div>
                <div className="badges">
                  {patientData.hasInsurance && (
                    <span className="badge insurance">Insurance</span>
                  )}
                  {patientData.extraCare && (
                    <span className="badge extra-care">Extra Care</span>
                  )}
                </div>
                <div className="patient-contact">
                  <Phone className="phone-icon" color="blue" />
                  <span>{patientData.phone}</span>
                  <br />
                </div>
              </div>
            </div>
            <div className="cta">
              <div className="last-visit">Last visited: 30 Apr 2025</div>
              <button className="book-btn">Book Appointment</button>
            </div>
          </div>

          {/* <!-- Information cards --> */}
          <div className="info-grid">
            {/* <!-- About & Insurance --> */}
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
                  <span>{patientData.nationalId}</span>
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

            {/* <!-- Diagnosis & Symptoms --> */}
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
                to="#transactions"
                data-bs-toggle="tab"
                aria-expanded="true"
                className="nav-link bg-transparent"
              >
                <span>Transactions</span>
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
              <AppointmentsTable rows={mockAppointments} />
            </div>
            <div className="tab-pane" id="transactions">
              <SearchTable
                searchText={searchText}
                handleSearch={handleSearch}
              />
              <PaymentsTable rows={mockPayments} />
            </div>
            <div className="tab-pane" id="plans">
              <SearchTable
                searchText={searchText}
                handleSearch={handleSearch}
              />
              <PlansTable rows={patientData?.plans as PlanRow[]} />
            </div>
            <div className="tab-pane tab-content-new" id="files">
              <ul>
                <li>
                  <a href="#">MRI_Scan.pdf</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Modals />
    </>
  );
};

export default CreatePatient;
