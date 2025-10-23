import { useState, useEffect } from "react";
import { Modal, Select, Form, Input, Radio, message } from "antd";
import { useOverbookingQueue } from "@/hooks/useOverbookingQueue";
import { searchPatientsForQueue } from "@/api/overbookingQueue";
import type { QueueItemWithPatient, CreateQueueItemRequest } from "@/types/overbookingQueue";
import { PRIORITY_CONFIGS } from "@/types/overbookingQueue";

const { TextArea } = Input;
const { Option } = Select;

interface AddQueueItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: QueueItemWithPatient) => void;
  preselectedPatient?: { id: string; name: string };
}

interface PatientOption {
  id: string;
  fullName: string;
  phone: string;
}

const AddQueueItemModal = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedPatient,
}: AddQueueItemModalProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Get current user ID for addedBy field (this would come from auth context in real app)
  const currentUserId = "1"; // TODO: Get from auth context

  // Hook for adding to queue
  const { addPatientToQueue, isPatientAlreadyInQueue } = useOverbookingQueue();

  // ============================================================================
  // FORM VALIDATION RULES
  // ============================================================================
  
  const formRules = {
    patientId: [
      { required: true, message: "Please select a patient" },
    ],
    priority: [
      { required: true, message: "Please select a priority level" },
    ],
  };

  // ============================================================================
  // PATIENT SEARCH LOGIC
  // ============================================================================
  
  const handlePatientSearch = async (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!value || value.length < 2) {
      setPatientOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingPatients(true);
        const results = await searchPatientsForQueue(value);
        setPatientOptions(results);
      } catch (error) {
        console.error("Failed to search patients:", error);
        message.error("Failed to search patients");
      } finally {
        setIsSearchingPatients(false);
      }
    }, 300); // Debounce search

    setSearchTimeout(timeout);
  };

  const handlePatientSelect = async (patientId: string) => {
    try {
      // Check if patient is already in queue
      const alreadyInQueue = await isPatientAlreadyInQueue(patientId);
      if (alreadyInQueue) {
        message.warning("This patient is already in the queue");
        return;
      }
    } catch (error) {
      console.error("Failed to check if patient is in queue:", error);
      // Continue anyway - better to allow potential duplicate than block
    }
  };

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      // Check again if patient is already in queue (double-check)
      const alreadyInQueue = await isPatientAlreadyInQueue(values.patientId);
      if (alreadyInQueue) {
        message.error("This patient is already in the active queue");
        return;
      }

      const requestData: CreateQueueItemRequest = {
        patientId: values.patientId,
        priority: values.priority,
        isActive: true,
        addedBy: currentUserId,
      };

      const newItem = await addPatientToQueue(requestData);
      
      if (newItem) {
        message.success("Patient added to queue successfully");
        onSuccess(newItem);
        handleCancel(); // Reset form and close
      }
    } catch (error: any) {
      console.error("Failed to add patient to queue:", error);
      message.error(error.message || "Failed to add patient to queue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPatientOptions([]);
    onClose();
  };

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
  
  useEffect(() => {
    if (isOpen && preselectedPatient) {
      form.setFieldsValue({
        patientId: preselectedPatient.id,
      });
      setPatientOptions([
        {
          id: preselectedPatient.id,
          fullName: preselectedPatient.name,
          phone: "",
        },
      ]);
    }
  }, [isOpen, preselectedPatient, form]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // ============================================================================
  // RENDER PATIENT OPTIONS
  // ============================================================================
  
  const renderPatientOption = (patient: PatientOption) => (
    <Option key={patient.id} value={patient.id}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-medium">{patient.fullName}</div>
          {patient.phone && (
            <small className="text-muted">{patient.phone}</small>
          )}
        </div>
      </div>
    </Option>
  );

  // ============================================================================
  // RENDER PRIORITY OPTIONS
  // ============================================================================
  
  const renderPriorityOptions = () => (
    <Radio.Group className="w-100">
      <div className="row g-3">
        {Object.values(PRIORITY_CONFIGS).map((config) => (
          <div key={config.value} className="col-12">
            <div className="card border h-100">
              <div className="card-body p-3">
                <Radio value={config.value} className="w-100">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${config.bgColorClass}`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className={`${config.icon} ${config.colorClass}`} />
                    </div>
                    <div className="flex-grow-1">
                      <div className={`fw-semibold ${config.colorClass} mb-1`}>
                        {config.label}
                      </div>
                      <small className="text-muted">
                        {config.description}
                      </small>
                    </div>
                  </div>
                </Radio>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Radio.Group>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <Modal
      title={
        <div className="d-flex align-items-center gap-2">
          <i className="ti ti-user-plus text-primary" />
          Add Patient to Queue
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={600}
      footer={null}
      destroyOnHidden
      className="custom-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        initialValues={{
          priority: "MEDIUM", // Default to medium priority
        }}
      >
        {/* ============================================================================
        PATIENT SELECTION
        ============================================================================ */}
        <Form.Item
          label={
            <div className="d-flex align-items-center gap-2">
              <i className="ti ti-user" />
              Patient
            </div>
          }
          name="patientId"
          rules={formRules.patientId}
        >
          <Select
            showSearch
            placeholder="Search and select patient..."
            filterOption={false}
            onSearch={handlePatientSearch}
            onSelect={handlePatientSelect}
            loading={isSearchingPatients}
            notFoundContent={
              isSearchingPatients ? (
                <div className="text-center py-2">
                  <i className="ti ti-loader spin me-2" />
                  Searching patients...
                </div>
              ) : (
                <div className="text-center py-2 text-muted">
                  {patientOptions.length === 0 && !isSearchingPatients
                    ? "Type at least 2 characters to search"
                    : "No patients found"}
                </div>
              )
            }
            size="large"
            className="w-100"
            disabled={!!preselectedPatient}
          >
            {patientOptions.map(renderPatientOption)}
          </Select>
        </Form.Item>

        {/* ============================================================================
        PRIORITY SELECTION
        ============================================================================ */}
        <Form.Item
          label={
            <div className="d-flex align-items-center gap-2">
              <i className="ti ti-flag" />
              Priority Level
            </div>
          }
          name="priority"
          rules={formRules.priority}
        >
          {renderPriorityOptions()}
        </Form.Item>

        {/* ============================================================================
        OPTIONAL NOTES
        ============================================================================ */}
        <Form.Item
          label={
            <div className="d-flex align-items-center gap-2">
              <i className="ti ti-note" />
              Notes (Optional)
            </div>
          }
          name="notes"
        >
          <TextArea
            rows={3}
            placeholder="Add any special notes or instructions..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* ============================================================================
        FORM ACTIONS
        ============================================================================ */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="ti ti-loader spin me-2" />
                Adding to Queue...
              </>
            ) : (
              <>
                <i className="ti ti-plus me-2" />
                Add to Queue
              </>
            )}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddQueueItemModal;
