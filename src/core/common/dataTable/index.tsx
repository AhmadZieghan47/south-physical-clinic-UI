// index.tsx
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { DatatableProps } from "../../data/interface";

const Datatable: React.FC<DatatableProps> = ({
  columns,
  dataSource,
  Selection,
  searchText,
  rowClassName,
  onRow,
  pagination,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [Selections, setSelections] = useState<any>(true);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setSelections(Selection);
  }, [Selection]);

  useEffect(() => {
    if (pagination?.serverSide) {
      // For server-side pagination, don't filter locally
      setFilteredDataSource(dataSource);
    } else {
      // For client-side pagination, filter locally
      const filteredData = dataSource?.filter((record) =>
        Object.values(record).some((field) =>
          String(field).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredDataSource(filteredData);
    }
  }, [searchText, dataSource, pagination?.serverSide]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      className="table table-nowrap datatable"
      rowSelection={Selections ? rowSelection : undefined}
      columns={columns}
      rowHoverable={false}
      dataSource={filteredDataSource}
      rowClassName={rowClassName}
      onRow={onRow}
      pagination={
        pagination?.serverSide
          ? {
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30", "50"],
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} entries`,
              nextIcon: <i className="ti ti-chevron-right" />,
              prevIcon: <i className="ti ti-chevron-left" />,
            }
          : {
              showSizeChanger: true,
              pageSize,
              pageSizeOptions: ["10", "20", "30", "50"],
              onShowSizeChange: (size) => setPageSize(size),
              total: filteredDataSource?.length,
              showTotal: (total) => `Showing ${total} entries`,
              nextIcon: <i className="ti ti-chevron-right" />,
              prevIcon: <i className="ti ti-chevron-left" />,
            }
      }
    />
  );
};

export default Datatable;
