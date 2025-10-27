import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import ExpensesModal from "../modal/expensesModal";
import type { Expense, ExpenseMethod } from "../../../../../types/typedefs";
import { listExpenses, deleteExpense } from "../../../../../api/expenses";
import { listExpenseCategories } from "../../../../../api/expenseCategories";

const ExpensesList = () => {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<ExpenseMethod | "">("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [vendorFilter, setVendorFilter] = useState<string>("");
  const [fromPaidAt, setFromPaidAt] = useState<string | "">("");
  const [toPaidAt, setToPaidAt] = useState<string | "">("");
  const [categories, setCategories] = useState<Array<{ id: string; nameEn: string }>>([]);

  const columns = [
    {
      title: "Expense ID",
      dataIndex: "id",
      render: (text: any) => <Link to="">{text}</Link>,
      sorter: (a: any, b: any) => Number(a.id) - Number(b.id),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (text: any) => <div className="text-dark"> {categories.find(c => c.id === text)?.nameEn || text} </div>,
      sorter: (a: any, b: any) => Number(a.categoryId) - Number(b.categoryId),
    },
    {
      title: "Amount",
      dataIndex: "amountJd",
      render: (text: any) => (
        <div className="fw-semibold text-dark"> {text} </div>
      ),
      sorter: (a: any, b: any) => Number(a.amountJd) - Number(b.amountJd),
    },
    {
      title: "Date",
      dataIndex: "paidAt",
      render: (text: any) => <div className="text-dark"> {new Date(text).toLocaleString()} </div>,
      sorter: (a: any, b: any) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime(),
    },
    {
      title: "Purchased By",
      dataIndex: "recordedBy",
      render: (text: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md me-2">
            <ImageWithBasePath
              src={`assets/img/users/user-01.jpg`}
              alt="product"
              className="rounded-circle"
            />
          </Link>
          <Link to="#" className="text-dark fw-semibold">
            {text}
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => Number(a.recordedBy) - Number(b.recordedBy),
    },
    {
      title: "Payment Method",
      dataIndex: "method",
      render: (text: any) => <div className="text-dark">{text}</div>,
      sorter: (a: any, b: any) => a.method.localeCompare(b.method),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any) => (
        <span
          className={`badge border ${
            text === "Approved"
              ? "badge-soft-success border-success text-success"
              : text === "Pending"
              ? "badge-soft-warning border-warning text-warning"
              : text === "New"
              ? "badge-soft-primary border-primary text-primary"
              : "badge-soft-danger border-danger text-danger"
          } rounded fw-medium`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "",
      render: (_: any, record: Expense) => (
        <div className="action-item p-2">
          <Link to="#" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#edit_new_expense"
                onClick={() => { (window as any).__editExpense = record; (window as any).__openEditExpense && (window as any).__openEditExpense(); }}
              >
                Edit
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                onClick={async () => { try { await deleteExpense(record.id); await fetchRows(); } catch (e) { console.error(e); } }}
              >
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  const data = useMemo(() => rows, [rows]);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExpenses({
        ...(categoryFilter ? { categoryId: categoryFilter } : {}),
        ...(methodFilter ? { method: methodFilter } : {}),
        ...(vendorFilter ? { vendorName: vendorFilter } : {}),
        ...(fromPaidAt ? { fromPaidAt } : {}),
        ...(toPaidAt ? { toPaidAt } : {}),
      });
      setRows(data);
    } catch (e: any) {
      setError(e?.error?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await listExpenseCategories(true);
      setCategories(cats.map((c) => ({ id: c.id, nameEn: c.nameEn })));
    } catch (e) {
      // ignore for now
    }
  };

  useEffect(() => {
    (window as any).__refreshExpenses = fetchRows;
    fetchCategories();
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Start Page Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Expenses
                <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-1">
                  Total Expenses : 565
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              {/* dropdown*/}
              <div className="dropdown me-1">
                <Link
                  to="#"
                  className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Export
                  <i className="ti ti-chevron-down ms-2" />
                </Link>
                <ul className="dropdown-menu p-2">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as PDF
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as Excel
                    </Link>
                  </li>
                </ul>
              </div>
              <Link
                to="#"
                className="btn btn-primary ms-2 fs-13 btn-md"
                data-bs-toggle="modal"
                data-bs-target="#add_new_expense"
              >
                <i className="ti ti-plus me-1" />
                New Expense
              </Link>
            </div>
          </div>
          {/* End Page Header */}
          {/*  Start Filter */}
          <div className=" d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="d-flex align-items-center gap-2">
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
            <div className="d-flex table-dropdown mb-3 pb-1 right-content align-items-center flex-wrap row-gap-3">
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
                      <Link
                        to="#"
                        className="link-danger text-decoration-underline"
                      >
                        Clear All
                      </Link>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="mb-2">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Method</label>
                      <select className="form-select" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value as any)}>
                        <option value="">All</option>
                        <option value="CASH">CASH</option>
                        <option value="POS">POS</option>
                        <option value="CREDIT_CARD">CREDIT_CARD</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Vendor</label>
                      <input className="form-control" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">From</label>
                      <input type="datetime-local" className="form-control" value={fromPaidAt} onChange={(e) => setFromPaidAt(e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">To</label>
                      <input type="datetime-local" className="form-control" value={toPaidAt} onChange={(e) => setToPaidAt(e.target.value)} />
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={fetchRows}>Apply</button>
                      <button className="btn btn-light" onClick={() => { setCategoryFilter(""); setMethodFilter(""); setVendorFilter(""); setFromPaidAt(""); setToPaidAt(""); fetchRows(); }}>Clear</button>
                    </div>
                  </div>
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
          {/*  End Filter */}
          {/*  Start Table */}
          <div className="table-responsive">
            <Datatable columns={columns} dataSource={data} Selection={false} searchText={searchText} />
            {loading && <div className="p-2">Loading...</div>}
            {error && <div className="p-2 text-danger">{error}</div>}
          </div>
          {/*  End Table */}
        </div>
        {/* End Content */}
        {/* Footer Start */}
        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 ©
            <Link to="#" className="link-primary">
              Preclinic
            </Link>
            , All Rights Reserved
          </p>
        </div>
        {/* Footer End */}
      </div>
      {/* ========================
			End Page Content
		========================= */}

      <ExpensesModal />
    </>
  );
};

export default ExpensesList;
