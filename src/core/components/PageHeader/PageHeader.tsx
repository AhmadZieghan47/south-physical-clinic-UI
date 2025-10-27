import React from 'react';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode; // Add actions prop
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="mb-4 header-content">
      <h6 className="fw-bold mb-0 d-flex align-items-center">{title}</h6>
      {actions && <div className="header-actions">{actions}</div>}
    </div>
  );
};
