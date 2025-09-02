import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";

interface Props {
  searchText: string;
  setSearchText: (text: String) => void;
}

export default function SearchFilters({ searchText, setSearchText }: Props) {
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <div className=" d-flex align-items-center justify-content-between flex-wrap">
      <div>
        <div className="search-set mb-3">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div className="table-search d-flex align-items-center mb-0">
              <div className="search-input">
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex table-dropdown mb-3 right-content align-items-center flex-wrap row-gap-3">
        <div className="dropdown me-2">
          <Link
            to="#"
            className="bg-white border rounded btn btn-md text-dark fs-14 py-1 align-items-center d-flex fw-normal"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            <i className="ti ti-filter text-gray-5 me-1" />
            Filters
          </Link>
          <div
            className="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown p-0"
            id="filter-dropdown"
          >
            <div className="d-flex align-items-center justify-content-between border-bottom filter-header">
              <h4 className="mb-0 fw-bold">Filter</h4>
              <div className="d-flex align-items-center">
                <Link to="#" className="link-danger text-decoration-underline">
                  Clear All
                </Link>
              </div>
            </div>
            <form action="#">
              <div className="filter-body pb-0">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Patient</label>
                    <Link to="#" className="link-primary mb-1">
                      Reset
                    </Link>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn bg-white  d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="true"
                    >
                      Select <i className="ti ti-chevron-down ms-auto" />
                    </Link>
                    <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                      <div className="mb-3">
                        <div className="input-icon-start input-icon position-relative">
                          <span className="input-icon-addon fs-12">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-md"
                            placeholder="Search"
                          />
                        </div>
                      </div>
                      <ul className="mb-3">
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/users/user-33.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Alberto Ripley
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/users/user-12.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Bernard Griffith
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/users/user-02.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Carol Lam
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/users/user-08.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Ezra Belcher
                          </label>
                        </li>
                      </ul>
                      <div className="row g-2">
                        <div className="col-6">
                          <Link
                            to="#"
                            className="btn btn-outline-white w-100 close-filter"
                          >
                            Cancel
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#" className="btn btn-primary w-100">
                            Select
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Doctor</label>
                    <Link to="#" className="link-primary mb-1">
                      Reset
                    </Link>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn bg-white  d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="true"
                    >
                      Select <i className="ti ti-chevron-down ms-auto" />
                    </Link>
                    <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                      <div className="mb-3">
                        <div className="input-icon-start input-icon position-relative">
                          <span className="input-icon-addon fs-12">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-md"
                            placeholder="Search"
                          />
                        </div>
                      </div>
                      <ul className="mb-3">
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/doctors/doctor-01.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Dr. Mick Thompson
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/doctors/doctor-02.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Dr. Sarah Johnson
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/doctors/doctor-03.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Dr. Emily Carter
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/doctors/doctor-04.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Dr. David Lee
                          </label>
                        </li>
                        <li className="mb-0">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            <span className="avatar avatar-xs rounded-circle me-2">
                              <ImageWithBasePath
                                src="assets/img/doctors/doctor-05.jpg"
                                className="flex-shrink-0 rounded-circle"
                                alt="img"
                              />
                            </span>
                            Dr. Anna Kim
                          </label>
                        </li>
                      </ul>
                      <div className="row g-2">
                        <div className="col-6">
                          <Link
                            to="#"
                            className="btn btn-outline-white w-100 close-filter"
                          >
                            Cancel
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#" className="btn btn-primary w-100">
                            Select
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Designation</label>
                    <Link to="#" className="link-primary mb-1">
                      Reset
                    </Link>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn bg-white  d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="true"
                    >
                      Select <i className="ti ti-chevron-down ms-auto" />
                    </Link>
                    <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                      <div className="mb-3">
                        <div className="input-icon-start input-icon position-relative">
                          <span className="input-icon-addon fs-12">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-md"
                            placeholder="Search"
                          />
                        </div>
                      </div>
                      <ul className="mb-3">
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Cardiologist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Orthopedic Surgeon
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Pediatrician
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Gynecologist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Psychiatrist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Neurosurgeon
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Oncologist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Pulmonologist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Urologist
                          </label>
                        </li>
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Dermatologist
                          </label>
                        </li>
                      </ul>
                      <div className="row g-2">
                        <div className="col-6">
                          <Link
                            to="#"
                            className="btn btn-outline-white w-100 close-filter"
                          >
                            Cancel
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#" className="btn btn-primary w-100">
                            Select
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label mb-1 text-dark fs-14 fw-medium">
                    Date<span className="text-danger">*</span>
                  </label>
                  <div className="input-icon-end position-relative">
                    <input
                      type="text"
                      className="form-control bookingrange"
                      placeholder="dd/mm/yyyy"
                    />
                    <span className="input-icon-addon">
                      <i className="ti ti-calendar" />
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Status</label>
                    <Link to="#" className="link-primary mb-1">
                      Reset
                    </Link>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn bg-white  d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="true"
                    >
                      Select <i className="ti ti-chevron-down ms-auto" />
                    </Link>
                    <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                      <ul className="mb-3">
                        <li className="mb-1">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Available
                          </label>
                        </li>
                        <li className="mb-0">
                          <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                            />
                            Unavailable
                          </label>
                        </li>
                      </ul>
                      <div className="row g-2">
                        <div className="col-6">
                          <Link
                            to="#"
                            className="btn btn-outline-white w-100 close-filter"
                          >
                            Cancel
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="#" className="btn btn-primary w-100">
                            Select
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-footer d-flex align-items-center justify-content-end border-top">
                <Link
                  to="#"
                  className="btn btn-light btn-md me-2 fw-medium"
                  id="close-filter"
                >
                  Close
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary btn-md fw-medium"
                >
                  Filter
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="dropdown">
          <Link
            to="#"
            className="dropdown-toggle btn bg-white btn-md d-inline-flex align-items-center fw-normal rounded border text-dark px-2 py-1 fs-14"
            data-bs-toggle="dropdown"
          >
            <span className="me-1"> Sort By : </span> Recent
          </Link>
          <ul className="dropdown-menu  dropdown-menu-end p-2">
            <li>
              <Link to="#" className="dropdown-item rounded-1">
                Recent
              </Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item rounded-1">
                Oldest
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
