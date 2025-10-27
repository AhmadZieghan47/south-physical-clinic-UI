import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { searchPatientsForQueue, addToQueue, isPatientInQueue } from '@/api/overbookingQueue';
import { type PriorityT, type BigIntStr } from '@/types/typedefs';
import { authService } from '@/services/authService';

interface AddPatientToQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: () => void;
}

const PRIORITY_OPTIONS = [
  { label: 'High Priority', value: 'HIGH' },
  { label: 'Medium Priority', value: 'MEDIUM' },
  { label: 'Low Priority', value: 'LOW' },
];

export const AddPatientToQueueModal: React.FC<AddPatientToQueueModalProps> = ({ isOpen, onClose, onPatientAdded }) => {
  const user = authService.getUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: BigIntStr; fullName: string; phone: string }>>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<BigIntStr | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityT>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedPatientId(null);
      setSelectedPatientName(null);
      setPriority('MEDIUM');
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const results = await searchPatientsForQueue(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error('Error searching patients:', err);
          setError('Failed to search patients.');
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedPatientId(null);
    setSelectedPatientName(null);
    setError(null);
  };

  const handlePatientSelect = (patient: { id: BigIntStr; fullName: string; phone: string }) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientName(`${patient.fullName} (ID: ${patient.id}, Phone: ${patient.phone})`);
    setSearchResults([]); // Hide search results after selection
    setSearchQuery(`${patient.fullName} - ${patient.id}`);
  };

  const handleAddPatient = async () => {
    if (!selectedPatientId || !user?.id) {
      setError('Please select a patient.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const alreadyInQueue = await isPatientInQueue(selectedPatientId);
      if (alreadyInQueue) {
        setError('This patient is already in the active overbooking queue.');
        return;
      }

      await addToQueue({ patientId: selectedPatientId, priority, addedBy: user.id as BigIntStr });
      onPatientAdded();
      onClose();
    } catch (err) {
      console.error('Failed to add patient to queue:', err);
      setError('Failed to add patient to queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Patient to Overbooking Queue</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body add-patient-modal-content">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label>Search Patient:</label>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                disabled={loading}
                className="search-input"
              />
              {isSearching && searchQuery.length > 2 && <div className="search-status">Searching...</div>}
              {searchResults.length > 0 && searchQuery.length > 2 && (
                <ul className="search-results-list">
                  {searchResults.map(patient => (
                    <li key={patient.id} onClick={() => handlePatientSelect(patient)}>
                      {patient.fullName} (ID: {patient.id}, Phone: {patient.phone})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedPatientId && (
              <div className="form-group">
                <label>Selected Patient:</label>
                <input type="text" value={selectedPatientName || ''} disabled readOnly className="search-input" />
              </div>
            )}

            <div className="form-group">
              <label>Priority:</label>
              <select
                className="filter-select"
                value={priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as PriorityT)}
                disabled={loading}
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer modal-actions">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddPatient} disabled={loading || !selectedPatientId}>
              {loading ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
