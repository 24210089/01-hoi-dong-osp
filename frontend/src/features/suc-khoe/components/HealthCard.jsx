import React from "react";
import { Card, Badge } from "react-bootstrap";
import { formatDate } from "@utils";

const HealthCard = ({ healthRecord, onView, onEdit, onDelete }) => {
  // Map general_health to status colors
  const getHealthStatusColor = (generalHealth) => {
    const colors = {
      good: "success",
      average: "warning",
      weak: "danger",
    };
    return colors[generalHealth] || "secondary";
  };

  const getHealthStatusLabel = (generalHealth) => {
    const labels = {
      good: "Tốt",
      average: "Trung bình",
      weak: "Yếu",
    };
    return labels[generalHealth] || generalHealth || "Chưa xác định";
  };

  // Get sister name from joined data - show saint name + birth name
  const getSisterDisplayName = () => {
    const saintName = healthRecord.sister_saint_name || healthRecord.saint_name;
    const birthName = healthRecord.sister_birth_name || healthRecord.birth_name;

    if (saintName && birthName) {
      return `${saintName} ${birthName}`;
    } else if (saintName) {
      return saintName;
    } else if (birthName) {
      return birthName;
    }
    return `Nữ tu #${healthRecord.sister_id}`;
  };

  return (
    <Card
      className="health-card h-100"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="health-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <Badge bg={getHealthStatusColor(healthRecord.general_health)}>
            {getHealthStatusLabel(healthRecord.general_health)}
          </Badge>
        </div>

        {/* Sister name - saint name + birth name */}
        <h6 className="mb-2 text-primary fw-bold">
          <i className="fas fa-user me-2"></i>
          {getSisterDisplayName()}
        </h6>

        {/* Checkup date */}
        <div className="health-date mb-2">
          <i className="fas fa-calendar-alt text-primary me-2"></i>
          {healthRecord.checkup_date
            ? formatDate(healthRecord.checkup_date)
            : "Chưa có ngày khám"}
        </div>

        <div className="health-details">
          {/* Checkup place */}
          {healthRecord.checkup_place && (
            <div className="detail-item">
              <i className="fas fa-hospital text-success me-2"></i>
              <span>{healthRecord.checkup_place}</span>
            </div>
          )}

          {/* Doctor */}
          {healthRecord.doctor && (
            <div className="detail-item">
              <i className="fas fa-user-md text-info me-2"></i>
              <span>BS. {healthRecord.doctor}</span>
            </div>
          )}

          {/* Diagnosis */}
          {healthRecord.diagnosis && (
            <div className="detail-item">
              <i className="fas fa-stethoscope text-danger me-2"></i>
              <span className="text-truncate">{healthRecord.diagnosis}</span>
            </div>
          )}

          {/* Blood pressure */}
          {healthRecord.blood_pressure && (
            <div className="detail-item">
              <i className="fas fa-tint text-danger me-2"></i>
              <span>Huyết áp: {healthRecord.blood_pressure}</span>
            </div>
          )}

          {/* Weight */}
          {healthRecord.weight && (
            <div className="detail-item">
              <i className="fas fa-weight text-warning me-2"></i>
              <span>Cân nặng: {healthRecord.weight} kg</span>
            </div>
          )}

          {/* Height */}
          {healthRecord.height && (
            <div className="detail-item">
              <i className="fas fa-ruler-vertical text-info me-2"></i>
              <span>Chiều cao: {healthRecord.height} cm</span>
            </div>
          )}

          {/* Heart rate */}
          {healthRecord.heart_rate && (
            <div className="detail-item">
              <i className="fas fa-heart text-danger me-2"></i>
              <span>Nhịp tim: {healthRecord.heart_rate}</span>
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top">
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary flex-grow-1"
            onClick={() => onView(healthRecord)}
          >
            <i className="fas fa-eye me-1"></i>
            Xem
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onEdit(healthRecord)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(healthRecord)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default HealthCard;
