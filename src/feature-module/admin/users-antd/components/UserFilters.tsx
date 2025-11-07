import React from "react";
import { Row, Col, Input, Select, Button, Space, Tag } from "antd";
import { SearchOutlined, CloseCircleOutlined, UserOutlined } from "@ant-design/icons";
import type { UserRole } from "../../../../api/users";

const { Search } = Input;
const { Option } = Select;

export interface UsersFilters {
  search: string;
  role?: UserRole;
  page: number;
  pageSize: number;
}

interface UserFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
  totalCount: number;
}

/**
 * Filter component for users list using Ant Design components
 * Includes search and role filter with clear functionality
 */
const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleRoleChange = (value: UserRole | undefined) => {
    onFiltersChange({
      ...filters,
      role: value,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      role: undefined,
      page: 1,
      pageSize: filters.pageSize,
    });
  };

  const hasActiveFilters = filters.search || filters.role;

  return (
    <div className="users-filters" style={{ background: "#fff", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <Row gutter={[16, 16]} align="middle">
        {/* Search */}
        <Col xs={24} sm={24} md={10} lg={10}>
          <Search
            placeholder="Search by name, username, or email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearchChange}
            style={{ width: "100%" }}
          />
        </Col>

        {/* Role Filter */}
        <Col xs={24} sm={12} md={6} lg={6}>
          <Select
            placeholder="Filter by role"
            allowClear
            size="large"
            value={filters.role || undefined}
            onChange={handleRoleChange}
            style={{ width: "100%" }}
            suffixIcon={<UserOutlined />}
          >
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="RECEPTION">Reception</Option>
            <Option value="THERAPIST">Therapist</Option>
          </Select>
        </Col>

        {/* Stats & Actions */}
        <Col xs={24} sm={12} md={8} lg={8}>
          <Space size="middle" style={{ width: "100%", justifyContent: "flex-end" }}>
            <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
              <UserOutlined style={{ marginRight: "4px" }} />
              {totalCount} Total
            </Tag>
            {hasActiveFilters && (
              <Button
                type="default"
                icon={<CloseCircleOutlined />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default UserFilters;

