import { useState, useEffect } from "react";
import { Modal, Form, Radio, Switch, message } from "antd";
import { useOverbookingQueue } from "@/hooks/useOverbookingQueue";
import type { QueueItemWithPatient, UpdateQueueItemRequest } from "@/types/overbookingQueue";
import { PRIORITY_CONFIGS } from "@/types/overbookingQueue";

interface EditQueueItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: QueueItemWithPatient) => void;
  queueItem: QueueItemWithPatient | null;
}

const EditQueueItemModal = ({
  isOpen,
  onClose,
  onSuccess,
  queueItem,
}: EditQueueItemModalProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook for updating queue item
  const { updateQueueItemData } = useOverbookingQueue();

  // ============================================================================
  // FORM VALIDATION RULES
  // ============================================================================
  
  const formRules = {
    priority: [
      { required: true, message: "Please select a priority level" },
    ],
  };

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  
  const handleSubmit = async (values: any) => {
    if (!queueItem) return;

    try {
      setIsSubmitting(true);

      const updateData: UpdateQueueItemRequest = {
        priority: values.priority,
        isActive: values.isActive,
      };

      const updatedItem = await updateQueueItemData(queueItem.id, updateData);
      
      if (updatedItem) {
        message.success("Queue item updated successfully");
        onSuccess(updatedItem);
        handleCancel();
      }
    } catch (error: any) {
      console.error("Failed to update queue item:", error);
      message.error(error.message || "Failed to update queue item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
  
  useEffect(() => {
    if (isOpen && queueItem) {
      form.setFieldsValue({
        priority: queueItem.priority,
        isActive: queueItem.isActive,
      });
    }
  }, [isOpen, queueItem, form]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderPatientInfo = () => {
    if (!queueItem) return null;

    return (
      <div className="card bg-light mb-4">
        <div className="card-body">
          <h6 className="card-title mb-3">
            <i className="ti ti-user me-2" />
            Patient Information
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <strong>Name:</strong>
                <span>{queueItem.patient.fullName}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <strong>Phone:</strong>
                <span>{queueItem.patient.phone || "N/A"}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <strong>Added:</strong>
                <span>{new Date(queueItem.addedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <strong>Added By:</strong>
                <span>{queueItem.addedByUser.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const getCurrentPriorityDisplay = () => {
    if (!queueItem) return null;
    
    const config = PRIORITY_CONFIGS[queueItem.priority];
    return (
      <div className="alert alert-info d-flex align-items-center gap-2">
        <i className={config.icon} />
        <span>
          Currently set to <strong>{config.label}</strong> - {config.description}
        </span>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  if (!queueItem) {
    return null;
  }

  return (
    <Modal
      title={
        <div className="d-flex align-items-center gap-2">
          <i className="ti ti-edit text-primary" />
          Edit Queue Item
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={650}
      footer={null}
      destroyOnHidden
      className="custom-modal"
    >
      <div className="mt-4">
        {/* Patient Information Display */}
        {renderPatientInfo()}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: queueItem.priority,
            isActive: queueItem.isActive,
          }}
        >
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
            <div>
              {getCurrentPriorityDisplay()}
              {renderPriorityOptions()}
            </div>
          </Form.Item>

          {/* ============================================================================
          ACTIVE STATUS TOGGLE
          ============================================================================ */}
          <Form.Item
            label={
              <div className="d-flex align-items-center gap-2">
                <i className="ti ti-eye" />
                Queue Status
              </div>
            }
            name="isActive"
            valuePropName="checked"
          >
            <div className="d-flex align-items-center gap-3">
              <Switch 
                size="default"
                checkedChildren={
                  <span className="d-flex align-items-center gap-1">
                    <i className="ti ti-check" />
                    Active
                  </span>
                }
                unCheckedChildren={
                  <span className="d-flex align-items-center gap-1">
                    <i className="ti ti-x" />
                    Inactive
                  </span>
                }
              />
              <div className="flex-grow-1">
                <small className="text-muted">
                  Inactive patients are hidden from the main queue view but remain in the system
                </small>
              </div>
            </div>
          </Form.Item>

          {/* ============================================================================
          CHANGE SUMMARY
          ============================================================================ */}
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="ti ti-info-circle me-2" />
                Change Summary
              </h6>
              <Form.Item dependencies={['priority', 'isActive']} noStyle>
                {({ getFieldValue }) => {
                  const newPriority = getFieldValue('priority');
                  const newIsActive = getFieldValue('isActive');
                  
                  const priorityChanged = newPriority !== queueItem.priority;
                  const statusChanged = newIsActive !== queueItem.isActive;
                  
                  if (!priorityChanged && !statusChanged) {
                    return (
                      <div className="text-muted">
                        <i className="ti ti-info-circle me-2" />
                        No changes detected
                      </div>
                    );
                  }
                  
                  return (
                    <div className="d-flex flex-column gap-2">
                      {priorityChanged && (
                        <div className="d-flex align-items-center gap-2">
                          <i className="ti ti-arrow-right text-primary" />
                          <span>
                            Priority: 
                            <span className={`ms-1 ${PRIORITY_CONFIGS[queueItem.priority].colorClass}`}>
                              {PRIORITY_CONFIGS[queueItem.priority].label}
                            </span>
                            {" → "}
                            <span className={`${PRIORITY_CONFIGS[newPriority as keyof typeof PRIORITY_CONFIGS]?.colorClass || ''} fw-semibold`}>
                              {PRIORITY_CONFIGS[newPriority as keyof typeof PRIORITY_CONFIGS]?.label || 'Unknown'}
                            </span>
                          </span>
                        </div>
                      )}
                      {statusChanged && (
                        <div className="d-flex align-items-center gap-2">
                          <i className="ti ti-arrow-right text-primary" />
                          <span>
                            Status: 
                            <span className={`ms-1 ${queueItem.isActive ? 'text-success' : 'text-secondary'}`}>
                              {queueItem.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {" → "}
                            <span className={`fw-semibold ${newIsActive ? 'text-success' : 'text-secondary'}`}>
                              {newIsActive ? 'Active' : 'Inactive'}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </div>

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
                  Updating...
                </>
              ) : (
                <>
                  <i className="ti ti-check me-2" />
                  Update Queue Item
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditQueueItemModal;
