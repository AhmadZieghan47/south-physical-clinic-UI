import React from "react";
import { Row, Col, Form, Button, Badge, InputGroup } from "react-bootstrap";
import { Search, X, Users } from "lucide-react";
import type { UserRole } from "../../../../api/users";

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
 * Improved filter component using React-Bootstrap
 * Features: Modern styling, better UX, responsive design
 */
const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      role: e.target.value as UserRole,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      page: 1,
      pageSize: filters.pageSize,
    });
  };

  const hasActiveFilters = filters.search || filters.role;

  return (
    <div className="filter-section fade-in">
      <Row className="align-items-end g-3">
        {/* Search */}
        <Col xs={12} md={6} lg={5}>
          <Form.Group>
            <Form.Label className="form-label-modern d-flex align-items-center gap-2">
              <Search size={16} />
              Search Users
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white">
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, username, or email..."
                value={filters.search}
                onChange={handleSearchChange}
                className="form-control-modern"
              />
            </InputGroup>
          </Form.Group>
        </Col>

        {/* Role Filter */}
        <Col xs={12} sm={6} md={3} lg={3}>
          <Form.Group>
            <Form.Label className="form-label-modern d-flex align-items-center gap-2">
              <Users size={16} />
              Filter by Role
            </Form.Label>
            <Form.Select
              value={filters.role || ""}
              onChange={handleRoleChange}
              className="form-control-modern"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="RECEPTION">Reception</option>
              <option value="THERAPIST">Therapist</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Stats & Actions */}
        <Col xs={12} sm={6} md={3} lg={4}>
          <div className="d-flex align-items-center justify-content-end gap-2 h-100">
            <Badge
              bg="primary"
              className="px-3 py-2"
              style={{ fontSize: "14px" }}
            >
              <Users size={16} className="me-2" />
              {totalCount} Total
            </Badge>
            {hasActiveFilters && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleClearFilters}
                className="btn-modern"
              >
                <X size={16} className="me-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserFilters;

