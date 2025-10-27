import React from "react";
import type { OverbookItem } from "../types";
import { SchedulerAPI } from "../api";

interface OverbookingWidgetProps {
  queue: OverbookItem[];
  loading: boolean;
  onAddToQueue: () => void;
  onRefresh: () => void;
}

const OverbookingWidget: React.FC<OverbookingWidgetProps> = ({
  queue,
  loading,
  onAddToQueue,
  onRefresh,
}) => {
  const handlePlace = async (itemId: string) => {
    try {
      // TODO: Implement placement logic
      console.log("Place item:", itemId);
      await SchedulerAPI.removeOverbook(itemId);
      onRefresh();
    } catch (err) {
      console.error("Failed to place appointment:", err);
    }
  };

  const handleRemove = async (itemId: string) => {
    if (window.confirm("Are you sure you want to remove this from the queue?")) {
      try {
        await SchedulerAPI.removeOverbook(itemId);
        onRefresh();
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="panel-body">
        <div className="loading-state">Loading queue...</div>
      </div>
    );
  }

  return (
    <>
      <h3>Overbooking Queue</h3>
      <div className="panel-body">
        {queue.length === 0 ? (
          <div className="empty-state">
            <p>No patients in queue</p>
            <button className="btn btn-sm" onClick={onAddToQueue}>
              Add Patient
            </button>
          </div>
        ) : (
          <>
            {queue.map((item) => (
              <div key={item.id} className="queue-item">
                <div>
                  <strong>Patient ID: {item.patientId}</strong>
                  <div className="meta">
                    <span className={`tag priority-${item.extraCare ? 'high' : 'medium'}`}>
                      {item.extraCare ? "High Priority" : "Medium Priority"}
                    </span>
                  </div>
                  {item.reason && <div className="meta small">{item.reason}</div>}
                </div>
                <div className="queue-actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => handlePlace(item.id)}
                    title="Place appointment"
                  >
                    Place
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from queue"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary w-100 mt-2" onClick={onAddToQueue}>
              Add Patient to Queue
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default OverbookingWidget;



