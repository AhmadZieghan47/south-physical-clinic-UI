import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";

import { getPatients } from "../api/patients";
import type { AddressJson, Patient } from "../types/typedefs";
import { all_routes } from "../feature-module/routes/all_routes";

export function usePatientsTable(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState<Number>(0);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "fullName",
        render: (text: String, record: Patient) => (
          <Link
            to={`${all_routes.patientDetails.replace(':id', record.id)}`}
            className="text-dark fw-semibold"
          >
            {text}
          </Link>
        ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
      },
      {
        title: "Date Of Birth",
        dataIndex: "dob",
      },
      {
        title: "Address",
        dataIndex: "addressJson",
        render: (add: AddressJson) =>
          add ? `${add?.city}, ${add?.street}` : "None",
      },
      {
        title: "Balance",
        dataIndex: "balance",
        render: (bal: any) => (
          <span
            className={`badge rounded fs-13 fw-medium
        ${
          +bal >= 0
            ? "badge-soft-success text-success border-success border"
            : "badge-soft-danger text-danger border-danger border"
        }`}
          >
            {bal}
          </span>
        ),
        sorter: (a: any, b: any) => a.balance - b.balance,
      },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPatients({ page, pageSize, search })
      .then(({ data, total }) => {
        if (isMounted) {
          setPatients(data);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        // handle errors gracefully – e.g. show toast or log
        console.error("Failed to fetch patients:", error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // cleanup: prevent state update if the component unmounts before fetch completes
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search]);

  return {
    columns,
    patients,
    totalCount,
    loading,
  };
}
