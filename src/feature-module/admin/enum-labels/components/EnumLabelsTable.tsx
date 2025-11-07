import React from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { EnumLabel } from '../../../../api/enumLabels';

interface EnumLabelsTableProps {
  enumLabels: EnumLabel[];
  onEdit: (enumLabel: EnumLabel) => void;
  onDelete: (enumType: string, code: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
  total: number;
}

interface GroupedLabels {
  [enumType: string]: EnumLabel[];
}

/**
 * Table component for displaying enum labels grouped by type
 */
const EnumLabelsTable: React.FC<EnumLabelsTableProps> = ({
  enumLabels,
  onEdit,
  onDelete,
  onPageChange,
  currentPage,
  pageSize,
  total
}) => {
  const [expandedTypes, setExpandedTypes] = React.useState<Set<string>>(new Set());

  // Group enum labels by type
  const groupedLabels: GroupedLabels = React.useMemo(() => {
    const grouped: GroupedLabels = {};
    
    // Defensive check for undefined/null enumLabels
    if (!enumLabels || !Array.isArray(enumLabels)) {
      return grouped;
    }
    
    enumLabels.forEach(label => {
      if (!grouped[label.enumType]) {
        grouped[label.enumType] = [];
      }
      grouped[label.enumType].push(label);
    });

    // Sort labels within each group by code
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => a.code.localeCompare(b.code));
    });

    return grouped;
  }, [enumLabels]);

  const enumTypes = Object.keys(groupedLabels).sort();

  // Expand all types by default on first render
  React.useEffect(() => {
    setExpandedTypes(new Set(enumTypes));
  }, [enumTypes.join(',')]);

  const toggleType = (type: string) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handleDeleteClick = (enumType: string, code: string, labelEn: string) => {
    if (window.confirm(`Are you sure you want to delete "${labelEn}" (${enumType}: ${code})?`)) {
      onDelete(enumType, code);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  if (!enumLabels || enumLabels.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted mb-0">No enum labels found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}></th>
                  <th>Code</th>
                  <th>Label (English)</th>
                  <th>Label (Arabic)</th>
                  <th style={{ width: '120px' }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enumTypes.map(enumType => {
                  const labels = groupedLabels[enumType];
                  const isExpanded = expandedTypes.has(enumType);
                  const typeColor = getTypeColor(enumType);

                  return (
                    <React.Fragment key={enumType}>
                      {/* Group Header Row */}
                      <tr 
                        className="enum-type-header"
                        style={{ backgroundColor: `${typeColor}10`, cursor: 'pointer' }}
                        onClick={() => toggleType(enumType)}
                      >
                        <td colSpan={5}>
                          <div className="d-flex align-items-center">
                            {isExpanded ? (
                              <ChevronUp className="me-2" size={18} />
                            ) : (
                              <ChevronDown className="me-2" size={18} />
                            )}
                            <span 
                              className="badge me-2"
                              style={{ backgroundColor: typeColor }}
                            >
                              {enumType}
                            </span>
                            <span className="text-muted">
                              ({labels.length} {labels.length === 1 ? 'item' : 'items'})
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Group Items */}
                      {isExpanded && labels.map(label => (
                        <tr key={`${label.enumType}-${label.code}`}>
                          <td></td>
                          <td>
                            <code className="text-primary">{label.code}</code>
                          </td>
                          <td>{label.labelEn}</td>
                          <td dir="rtl" className="text-end">{label.labelAr}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => onEdit(label)}
                              aria-label={`Edit ${label.labelEn}`}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(label.enumType, label.code, label.labelEn)}
                              aria-label={`Delete ${label.labelEn}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} entries
              </div>
              <nav aria-label="Enum labels pagination">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => onPageChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Get color for enum type
 */
function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    SessionType: '#1E40AF',
    Location: '#059669',
    ApptStatus: '#EA580C',
    CancelReason: '#DC2626',
    Gender: '#7C3AED',
    Role: '#0891B2',
    PriceBasis: '#65A30D'
  };

  return colorMap[type] || '#6B7280';
}

export default EnumLabelsTable;

