// src/features/su-vu/pages/MissionDetailPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { missionService, sisterService } from "@services";
import { formatDate, calculateDuration } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import MissionForm from "../components/MissionForm";
import "./MissionDetailPage.css";

const MissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchMissionDetail();
  }, [id]);

  const fetchMissionDetail = async () => {
    try {
      setLoading(true);
      const response = await missionService.getById(id);
      if (response.success) {
        const missionData =
          response.data?.mission || response.data?.data || response.data;
        if (!missionData) {
          setError("Không tìm thấy thông tin sứ vụ");
        }
        // Enrich with sister info if missing
        if (missionData && (!missionData.sister_name || !missionData.sister_birth_date)) {
          try {
            const sis = await sisterService.getById(missionData.sister_id);
            if (sis?.success) {
              const s = sis.data || sis;
              missionData.sister_name = s.birth_name || missionData.sister_name;
              missionData.sister_birth_date = s.date_of_birth || missionData.sister_birth_date;
              missionData.sister_religious_name = s.saint_name || missionData.sister_religious_name;
              missionData.sister_code = s.code || missionData.sister_code;
              missionData.sister_phone = s.phone || missionData.sister_phone;
              missionData.sister_email = s.email || missionData.sister_email;
              missionData.sister_avatar = s.photo_url || missionData.sister_avatar;
              missionData.sister_community = s.current_community_name || missionData.sister_community;
            }
          } catch (e) {
            console.error("Error enriching sister data", e);
          }
        }
        setMission(missionData);
      } else {
        setError("Không tìm thấy thông tin sứ vụ");
      }
    } catch (error) {
      console.error("Error fetching mission detail:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu sứ vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const result = await missionService.update(id, values);
      if (result.success) {
        toast.success("Cập nhật sứ vụ thành công!");
        setShowEditForm(false);
        fetchMissionDetail(); // Reload data
      } else {
        toast.error(result.error || "Không thể cập nhật sứ vụ");
      }
    } catch (error) {
      console.error("Error updating mission:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật sứ vụ");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sứ vụ này?")) {
      try {
        const result = await missionService.delete(id);
        if (result.success !== false) {
          toast.success("Đã xóa sứ vụ thành công!");
          setTimeout(() => navigate("/su-vu"), 800);
        } else {
          toast.error(result.error || "Không thể xóa sứ vụ");
        }
      } catch (error) {
        console.error("Error deleting mission:", error);
        toast.error("Lỗi khi xóa sứ vụ, vui lòng thử lại");
      }
    }
  };

  const handleViewSister = () => {
    navigate(`/nu-tu/${mission.sister_id}`);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <i
              className="fas fa-exclamation-circle text-danger mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5>{error || "Không tìm thấy thông tin sứ vụ"}</h5>
            <Button variant="primary" onClick={() => navigate("/su-vu")} className="mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Quay lại danh sách
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const isActive = !mission.end_date || new Date(mission.end_date) >= new Date();
  const duration = calculateDuration(mission.start_date, mission.end_date);

  const parseArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  };

  const documents = parseArray(mission.documents);
  const achievements = parseArray(mission.achievements);

  // Build sister display names (matching health page style)
  const sisterDisplayName = () => {
    const saint = mission.sister_saint_name || mission.saint_name;
    const birth = mission.sister_name || mission.birth_name;
    if (saint && birth) return `${saint} ${birth}`;
    return saint || birth || `Nữ tu #${mission.sister_id}`;
  };

  return (
    <div className="mission-detail-page">
      <Container fluid className="py-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
        {/* Breadcrumb */}
        <Breadcrumb
          title="Chi tiết Sứ vụ"
          items={[
            { label: "Quản lý Sứ vụ", link: "/su-vu" },
            { label: "Chi tiết" },
          ]}
        />

        {/* Action Buttons (aligned to health detail style) */}
        <div className="mission-action-buttons">
          <Button className="btn-back" onClick={() => navigate("/su-vu")}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <div>
            <Button className="btn-edit me-2" onClick={handleEdit}>
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa
            </Button>
            <Button className="btn-delete" onClick={handleDelete}>
              <i className="fas fa-trash me-2"></i>
              Xóa
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Left Column - Mission Info */}
          <Col lg={8}>
            <Card className="mission-detail-card mb-4">
              <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin sứ vụ
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                {/* Status Badge */}
                <Col xs={12}>
                  <div className="status-badge-large">
                    <Badge
                      bg={isActive ? "success" : "secondary"}
                      className="p-3"
                    >
                      <i
                        className={`fas fa-${
                          isActive ? "play" : "check"
                        }-circle me-2`}
                      ></i>
                      {isActive ? "Đang làm việc" : "Đã kết thúc"}
                    </Badge>
                    {mission.field && (
                      <Badge bg="info" className="p-3 ms-2">
                        <i className="fas fa-tag me-2"></i>
                        {getFieldLabel(mission.field)}
                      </Badge>
                    )}
                  </div>
                </Col>

                {/* Field (Lĩnh vực) */}
                <Col md={12}>
                  <InfoItem
                    icon="fas fa-tags"
                    iconColor="info"
                    label="Lĩnh vực sứ vụ"
                    value={getFieldLabel(mission.field)}
                  />
                </Col>

                {/* Specific Role */}
                {mission.specific_role && (
                  <Col md={12}>
                    <InfoItem
                      icon="fas fa-briefcase"
                      iconColor="primary"
                      label="Vai trò cụ thể"
                      value={mission.specific_role}
                    />
                  </Col>
                )}

                {/* Timeline */}
                <Col md={6}>
                  <InfoItem
                    icon="fas fa-calendar-alt"
                    iconColor="info"
                    label="Ngày bắt đầu"
                    value={formatDate(mission.start_date)}
                  />
                </Col>

                <Col md={6}>
                  <InfoItem
                    icon="fas fa-calendar-check"
                    iconColor="warning"
                    label="Ngày kết thúc"
                    value={
                      mission.end_date
                        ? formatDate(mission.end_date)
                        : "Hiện tại"
                    }
                  />
                </Col>

                {/* Duration */}
                <Col md={12}>
                  <InfoItem
                    icon="fas fa-clock"
                    iconColor="secondary"
                    label="Thời gian"
                    value={duration}
                  />
                </Col>

                {/* Notes */}
                {mission.notes && (
                  <Col xs={12}>
                    <div className="description-section">
                      <h6 className="mb-2">
                        <i className="fas fa-align-left text-primary me-2"></i>
                        Ghi chú
                      </h6>
                      <div className="description-content">{mission.notes}</div>
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Card className="mission-detail-card mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Thành tích
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {achievements.map((achievement, index) => (
                    <ListGroup.Item key={index} className="px-0">
                      <div className="d-flex align-items-start">
                        <i className="fas fa-medal text-warning me-3 mt-1"></i>
                        <div>
                          <div className="fw-semibold">{achievement.title}</div>
                          {achievement.description && (
                            <small className="text-muted">
                              {achievement.description}
                            </small>
                          )}
                          {achievement.date && (
                            <div>
                              <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(achievement.date)}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* Documents */}
          <Card className="mission-detail-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-file-alt me-2"></i>
                Tài liệu đính kèm ({documents.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {documents.length > 0 ? (
                <ListGroup variant="flush">
                  {documents.map((doc, index) => (
                    <ListGroup.Item key={index} className="px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-file-pdf text-danger me-3 fs-4"></i>
                          <div>
                            <div className="fw-semibold">{doc.name || doc.filename || `Tệp ${index + 1}`}</div>
                            <small className="text-muted">
                              {doc.size && `${(doc.size / 1024).toFixed(2)} KB`}
                              {doc.uploaded_at &&
                                ` • ${formatDate(doc.uploaded_at)}`}
                            </small>
                          </div>
                        </div>
                        {doc.url && (
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={doc.url}
                              target="_blank"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              href={doc.url}
                              download
                            >
                              <i className="fas fa-download"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-muted text-center py-3">
                  <i className="fas fa-folder-open fs-1 text-muted mb-2"></i>
                  <p className="mb-0">Chưa có tệp đính kèm</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Sister Info */}
        <Col lg={4}>
          <Card className="mission-detail-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Thông tin Nữ Tu
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div className="sister-avatar-medium mx-auto mb-3">
                  {mission.sister_avatar ? (
                    <img
                      src={mission.sister_avatar}
                      alt={mission.sister_name}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                {mission.sister_religious_name && (
                  <h5 className="text-primary mb-1">
                    {mission.sister_religious_name}
                  </h5>
                )}
                <h6 className="mb-1">{sisterDisplayName()}</h6>
                <p className="text-muted mb-0">{mission.sister_code || mission.sister_id}</p>
              </div>

              <div className="sister-info-list">
                <div className="info-row">
                  <i className="fas fa-birthday-cake text-primary"></i>
                  <div>
                    <small className="text-muted">Ngày sinh</small>
                    <div>{formatDate(mission.sister_birth_date)}</div>
                  </div>
                </div>

                <div className="info-row">
                  <i className="fas fa-home text-success"></i>
                  <div>
                    <small className="text-muted">Cộng đoàn</small>
                    <div>{mission.sister_community || "-"}</div>
                  </div>
                </div>

                <div className="info-row">
                  <i className="fas fa-phone text-info"></i>
                  <div>
                    <small className="text-muted">Điện thoại</small>
                    <div>{mission.sister_phone || "-"}</div>
                  </div>
                </div>

                <div className="info-row">
                  <i className="fas fa-envelope text-warning"></i>
                  <div>
                    <small className="text-muted">Email</small>
                    <div>{mission.sister_email || "-"}</div>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={handleViewSister}
              >
                <i className="fas fa-user me-2"></i>
                Xem hồ sơ đầy đủ
              </Button>
            </Card.Body>
          </Card>

          {/* History */}
          <Card className="mission-detail-card mt-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Lịch sử cập nhật
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="history-list">
                <div className="history-item">
                  <i className="fas fa-plus-circle text-success"></i>
                  <div>
                    <div className="fw-semibold">Tạo mới</div>
                    <small className="text-muted">
                      {formatDate(mission.created_at)}
                    </small>
                  </div>
                </div>
                {mission.updated_at &&
                  mission.updated_at !== mission.created_at && (
                    <div className="history-item">
                      <i className="fas fa-edit text-primary"></i>
                      <div>
                        <div className="fw-semibold">Cập nhật</div>
                        <small className="text-muted">
                          {formatDate(mission.updated_at)}
                        </small>
                      </div>
                    </div>
                  )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Form Modal */}
      <MissionForm
        show={showEditForm}
        onHide={() => setShowEditForm(false)}
        mission={mission}
        onSubmit={handleEditSubmit}
        sisterId={mission?.sister_id}
      />
      </Container>
    </div>
  );
};

// Helper Component
const InfoItem = ({ icon, iconColor, label, value }) => (
  <div className="info-item-box">
    <div className={`info-icon bg-${iconColor} bg-opacity-10`}>
      <i className={`${icon} text-${iconColor}`}></i>
    </div>
    <div className="info-content">
      <small className="text-muted d-block mb-1">{label}</small>
      <div className="fw-semibold">{value}</div>
    </div>
  </div>
);

// Helper Function
const getFieldLabel = (field) => {
  const fields = {
    education: "Giáo dục",
    pastoral: "Mục vụ",
    publishing: "Xuất bản",
    media: "Truyền thông",
    healthcare: "Y tế",
    social: "Xã hội",
  };
  return fields[field] || field;
};

export default MissionDetailPage;
