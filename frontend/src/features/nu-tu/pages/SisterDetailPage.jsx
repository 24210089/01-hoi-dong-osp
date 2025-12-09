// src/features/nu-tu/pages/SisterDetailPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Tab,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { sisterService } from "@services";
import { formatDate, calculateAge, resolveMediaUrl } from "@utils";
import { JOURNEY_STAGE_LABELS } from "@utils/constants";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./SisterDetailPage.css";

const SisterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sister, setSister] = useState(null);

  useEffect(() => {
    fetchSisterDetail();
  }, [id]);

  const fetchSisterDetail = async () => {
    try {
      setLoading(true);
      const response = await sisterService.getById(id);
      if (response.success) {
        setSister(response.data);
      }
    } catch (error) {
      console.error("Error fetching sister detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/nu-tu/${id}/edit`);
  };

  const handleDelete = async () => {
    const name = sister.religious_name || sister.birth_name;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${name}?`)) {
      try {
        await sisterService.delete(id);
        navigate("/nu-tu");
      } catch (error) {
        console.error("Error deleting sister:", error);
      }
    }
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

  if (!sister) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h3>Không tìm thấy thông tin nữ tu</h3>
          <Button variant="primary" onClick={() => navigate("/nu-tu")}>
            Quay lại danh sách
          </Button>
        </div>
      </Container>
    );
  }

  const avatarUrl = resolveMediaUrl(sister.photo_url || sister.avatar_url);

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Thông tin Nữ Tu"
        items={[
          { label: "Quản lý Nữ Tu", link: "/nu-tu" },
          { label: sister.religious_name || sister.birth_name },
        ]}
      />

      {/* Action Buttons */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="action-buttons">
          <Button variant="success" onClick={handleEdit}>
            <i className="fas fa-edit me-2"></i>
            Chỉnh sửa
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="fas fa-trash me-2"></i>
            Xóa
          </Button>
          <Button variant="secondary" onClick={() => navigate("/nu-tu")}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
        </div>
      </div>

      <Tab.Container defaultActiveKey="basic">
        <Row className="g-4">
          {/* Left Column - Avatar & Navigation */}
          <Col lg={3}>
            {/* Avatar Card */}
            <Card className="health-info-card">
              <Card.Header className="documents-header">
                <i className="fas fa-user-circle"></i>
                <span>Hồ sơ</span>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="avatar-section">
                  <div className="avatar-large">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={sister.religious_name || sister.birth_name}
                      />
                    ) : (
                      <div className="avatar-placeholder-large">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>

                  <div className="name-display">
                    {sister.religious_name && (
                      <div className="religious-name">
                        {sister.religious_name}
                      </div>
                    )}
                    <div className="birth-name">{sister.birth_name}</div>
                    <div className="code">
                      <i className="fas fa-id-card me-2"></i>
                      {sister.code}
                    </div>
                  </div>

                  <div className="mt-3">
                    {(() => {
                      const currentStage = getCurrentStage(
                        sister.vocationJourney
                      );
                      const stageName = currentStage
                        ? JOURNEY_STAGE_LABELS[currentStage.stage] ||
                          currentStage.stage
                        : "Chưa xác định";
                      return (
                        <Badge bg="primary" className="mb-2">
                          <i className="fas fa-route me-1"></i>
                          {stageName}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Info Card */}
            <Card className="health-info-card">
              <Card.Header className="system-header">
                <i className="fas fa-info-circle"></i>
                <span>Thông tin nhanh</span>
              </Card.Header>
              <Card.Body className="p-2">
                <div className="quick-info">
                  <div className="quick-info-item">
                    <i className="fas fa-birthday-cake text-primary"></i>
                    <div className="info-content">
                      <small className="text-muted">Ngày sinh</small>
                      <div className="fw-semibold">
                        {formatDate(sister.date_of_birth)}
                      </div>
                      <small className="text-muted">
                        ({calculateAge(sister.date_of_birth)} tuổi)
                      </small>
                    </div>
                  </div>

                  <div className="quick-info-item">
                    <i className="fas fa-home text-success"></i>
                    <div className="info-content">
                      <small className="text-muted">Cộng đoàn</small>
                      <div className="fw-semibold">
                        {(() => {
                          const currentStage = getCurrentStage(
                            sister.vocationJourney
                          );
                          return (
                            currentStage?.community_name ||
                            sister.current_community_name ||
                            "-"
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="quick-info-item">
                    <i className="fas fa-phone text-info"></i>
                    <div className="info-content">
                      <small className="text-muted">Điện thoại</small>
                      <div className="fw-semibold">{sister.phone || "-"}</div>
                    </div>
                  </div>

                  <div className="quick-info-item">
                    <i className="fas fa-envelope text-warning"></i>
                    <div className="info-content">
                      <small className="text-muted">Email</small>
                      <div className="fw-semibold">{sister.email || "-"}</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Content */}
          <Col lg={9}>
            {/* Navigation Tabs */}
            <Card className="health-info-card mb-3">
              <Card.Body className="p-2">
                <Nav variant="pills" className="nav-horizontal-tabs">
                  <Nav.Link eventKey="basic">
                    <i className="fas fa-user"></i>
                    Thông tin cơ bản
                  </Nav.Link>
                  <Nav.Link eventKey="journey">
                    <i className="fas fa-route"></i>
                    Hành trình
                  </Nav.Link>
                  <Nav.Link eventKey="education">
                    <i className="fas fa-graduation-cap"></i>
                    Học vấn
                  </Nav.Link>
                  <Nav.Link eventKey="mission">
                    <i className="fas fa-briefcase"></i>
                    Sứ vụ
                  </Nav.Link>
                  <Nav.Link eventKey="health">
                    <i className="fas fa-heartbeat"></i>
                    Sức khỏe
                  </Nav.Link>
                  <Nav.Link eventKey="evaluation">
                    <i className="fas fa-clipboard-check"></i>
                    Đánh giá
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>

            {/* Content Card */}
            <Card className="health-info-card">
              <Card.Header>
                <i className="fas fa-info-circle"></i>
                <span>Chi tiết thông tin</span>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Basic Info Tab */}
                  <Tab.Pane eventKey="basic">
                    <div className="info-section">
                      <h5>
                        <i className="fas fa-user"></i>
                        Thông tin cá nhân
                      </h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <InfoItem
                            label="Họ và tên khai sinh"
                            value={sister.birth_name}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Tên thánh"
                            value={sister.saint_name}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Cộng đoàn hiện tại"
                            value={(() => {
                              // Lấy cộng đoàn từ vocationJourney (giai đoạn gần nhất)
                              const currentStage = getCurrentStage(
                                sister.vocationJourney
                              );
                              return (
                                currentStage?.community_name ||
                                sister.current_community_name
                              );
                            })()}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Giai đoạn hiện tại"
                            value={(() => {
                              const currentStage = getCurrentStage(
                                sister.vocationJourney
                              );
                              return currentStage
                                ? JOURNEY_STAGE_LABELS[currentStage.stage] ||
                                    currentStage.stage
                                : "Chưa xác định";
                            })()}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="Mã số" value={sister.code} />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Ngày sinh"
                            value={formatDate(sister.date_of_birth)}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Nơi sinh"
                            value={sister.place_of_birth}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="Quê quán" value={sister.hometown} />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Quốc tịch"
                            value={sister.nationality}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="CMND/CCCD" value={sister.id_card} />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="Điện thoại" value={sister.phone} />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="Email" value={sister.email} />
                        </Col>
                        <Col md={12}>
                          <InfoItem
                            label="Địa chỉ thường trú"
                            value={sister.permanent_address}
                          />
                        </Col>
                        <Col md={12}>
                          <InfoItem
                            label="Địa chỉ hiện tại"
                            value={sister.current_address}
                          />
                        </Col>
                      </Row>
                    </div>

                    <div className="info-section">
                      <h5>
                        <i className="fas fa-users"></i>
                        Thông tin gia đình
                      </h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <InfoItem
                            label="Tên cha"
                            value={sister.father_name}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Nghề nghiệp cha"
                            value={sister.father_occupation}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem label="Tên mẹ" value={sister.mother_name} />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Nghề nghiệp mẹ"
                            value={sister.mother_occupation}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Số anh chị em"
                            value={sister.siblings_count}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Tôn giáo gia đình"
                            value={sister.family_religion}
                          />
                        </Col>
                        <Col md={12}>
                          <InfoItem
                            label="Địa chỉ gia đình"
                            value={sister.family_address}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Người liên hệ khẩn cấp"
                            value={sister.emergency_contact_name}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="SĐT liên hệ khẩn cấp"
                            value={sister.emergency_contact_phone}
                          />
                        </Col>
                      </Row>
                    </div>

                    <div className="info-section">
                      <h5>
                        <i className="fas fa-church"></i>
                        Bí tích
                      </h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <InfoItem
                            label="Ngày rửa tội"
                            value={formatDate(sister.baptism_date)}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Nơi rửa tội"
                            value={sister.baptism_place}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Ngày thêm sức"
                            value={formatDate(sister.confirmation_date)}
                          />
                        </Col>
                        <Col md={6}>
                          <InfoItem
                            label="Ngày rước lễ lần đầu"
                            value={formatDate(sister.first_communion_date)}
                          />
                        </Col>
                      </Row>
                    </div>

                    {/* Tài liệu đính kèm */}
                    <div className="info-section">
                      <h5>
                        <i className="fas fa-file-alt"></i>
                        Tài liệu đính kèm
                      </h5>
                      <Row className="g-3">
                        <Col md={12}>
                          {(() => {
                            // Parse documents - could be array, JSON string, or null
                            let docs = [];
                            if (Array.isArray(sister.documents)) {
                              docs = sister.documents;
                            } else if (
                              typeof sister.documents === "string" &&
                              sister.documents
                            ) {
                              try {
                                docs = JSON.parse(sister.documents);
                              } catch (e) {
                                docs = [];
                              }
                            } else if (sister.documents_url) {
                              try {
                                docs = JSON.parse(sister.documents_url);
                              } catch (e) {
                                docs = [];
                              }
                            }

                            if (docs && docs.length > 0) {
                              return (
                                <div className="document-list">
                                  {docs.map((doc, index) => (
                                    <div
                                      key={index}
                                      className="document-item d-flex align-items-center p-2 border rounded mb-2"
                                    >
                                      <i className="fas fa-file me-2 text-primary"></i>
                                      <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                      >
                                        {doc.name || `Tài liệu ${index + 1}`}
                                      </a>
                                      {doc.uploadedAt && (
                                        <small className="text-muted ms-auto">
                                          {formatDate(doc.uploadedAt)}
                                        </small>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return (
                              <p className="text-muted">
                                Chưa có tài liệu đính kèm
                              </p>
                            );
                          })()}
                        </Col>
                      </Row>
                    </div>

                    {/* Ghi chú */}
                    <div className="info-section">
                      <h5>
                        <i className="fas fa-sticky-note"></i>
                        Ghi chú
                      </h5>
                      <Row className="g-3">
                        <Col md={12}>
                          {sister.notes ? (
                            <div
                              className="p-3 bg-light rounded"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {sister.notes}
                            </div>
                          ) : (
                            <p className="text-muted">Chưa có ghi chú</p>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>

                  {/* Journey Tab */}
                  <Tab.Pane eventKey="journey">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Hành trình Ơn Gọi</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/nu-tu/${id}/hanh-trinh`)}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Xem chi tiết Timeline
                      </Button>
                    </div>
                    <div className="timeline">
                      {sister.vocationJourney &&
                      sister.vocationJourney.length > 0 ? (
                        [...sister.vocationJourney]
                          .sort(
                            (a, b) =>
                              new Date(a.start_date) - new Date(b.start_date)
                          )
                          .map((journey, index) => (
                            <div
                              key={journey.id || index}
                              className="timeline-item"
                            >
                              <div className="timeline-marker"></div>
                              <div className="timeline-content">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1">
                                      {JOURNEY_STAGE_LABELS[journey.stage] ||
                                        journey.stage}
                                    </h6>
                                    <small className="text-muted">
                                      {formatDate(journey.start_date)}
                                      {journey.end_date &&
                                        ` - ${formatDate(journey.end_date)}`}
                                      {!journey.end_date && " - Hiện tại"}
                                    </small>
                                  </div>
                                  {journey.community_name && (
                                    <Badge bg="primary">
                                      {journey.community_name}
                                    </Badge>
                                  )}
                                </div>
                                {journey.supervisor_name && (
                                  <p className="mb-1 small">
                                    <i className="fas fa-user-tie me-1"></i>
                                    Người hướng dẫn: {journey.supervisor_name}
                                  </p>
                                )}
                                {journey.notes && (
                                  <p className="mb-0 text-muted small">
                                    {journey.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted">
                          Chưa có thông tin hành trình
                        </p>
                      )}
                    </div>
                  </Tab.Pane>

                  {/* Education Tab */}
                  <Tab.Pane eventKey="education">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Học vấn</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/hoc-van/timeline/${id}`)}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Xem chi tiết Timeline
                      </Button>
                    </div>
                    <div className="timeline">
                      {sister.education && sister.education.length > 0 ? (
                        [...sister.education]
                          .sort(
                            (a, b) =>
                              new Date(a.start_date) - new Date(b.start_date)
                          )
                          .map((edu, index) => (
                            <div
                              key={edu.id || index}
                              className="timeline-item"
                            >
                              <div className="timeline-marker"></div>
                              <div className="timeline-content">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1">
                                      {edu.level === "doctorate" && "Tiến sĩ"}
                                      {edu.level === "master" && "Thạc sĩ"}
                                      {edu.level === "bachelor" && "Cử nhân"}
                                      {edu.level === "associate" && "Cao đẳng"}
                                      {edu.level === "vocational" &&
                                        "Trung cấp"}
                                      {edu.level === "high_school" && "THPT"}
                                      {edu.level === "certificate" &&
                                        "Chứng chỉ"}
                                      {edu.level === "other" && "Khác"}
                                      {![
                                        "doctorate",
                                        "master",
                                        "bachelor",
                                        "associate",
                                        "vocational",
                                        "high_school",
                                        "certificate",
                                        "other",
                                      ].includes(edu.level) && edu.level}
                                    </h6>
                                    <small className="text-muted">
                                      {formatDate(edu.start_date)}
                                      {edu.end_date
                                        ? ` - ${formatDate(edu.end_date)}`
                                        : " - Hiện tại"}
                                    </small>
                                  </div>
                                  <Badge
                                    bg={
                                      edu.status === "da_tot_nghiep"
                                        ? "success"
                                        : edu.status === "dang_hoc"
                                        ? "info"
                                        : "secondary"
                                    }
                                  >
                                    {edu.status === "da_tot_nghiep" &&
                                      "Đã tốt nghiệp"}
                                    {edu.status === "dang_hoc" && "Đang học"}
                                    {edu.status === "tam_nghi" && "Tạm nghỉ"}
                                    {edu.status === "da_nghi" && "Đã nghỉ"}
                                    {![
                                      "da_tot_nghiep",
                                      "dang_hoc",
                                      "tam_nghi",
                                      "da_nghi",
                                    ].includes(edu.status) &&
                                      (edu.graduation_year || "Đang học")}
                                  </Badge>
                                </div>
                                <p className="mb-1">
                                  <i className="fas fa-university me-1"></i>
                                  {edu.institution}
                                </p>
                                {edu.major && (
                                  <p className="mb-1 small">
                                    <i className="fas fa-book me-1"></i>
                                    Chuyên ngành: {edu.major}
                                  </p>
                                )}
                                {edu.gpa && (
                                  <p className="mb-0 small text-muted">
                                    GPA: <strong>{edu.gpa}</strong>
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted">Chưa có thông tin học vấn</p>
                      )}
                    </div>
                  </Tab.Pane>

                  {/* Mission Tab */}
                  <Tab.Pane eventKey="mission">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Sứ vụ</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/su-vu/timeline/${id}`)}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Xem chi tiết Timeline
                      </Button>
                    </div>
                    <div className="timeline">
                      {sister.missions && sister.missions.length > 0 ? (
                        [...sister.missions]
                          .sort(
                            (a, b) =>
                              new Date(a.start_date) - new Date(b.start_date)
                          )
                          .map((mission, index) => (
                            <div
                              key={mission.id || index}
                              className="timeline-item"
                            >
                              <div className="timeline-marker"></div>
                              <div className="timeline-content">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1">{mission.position}</h6>
                                    <small className="text-muted">
                                      {formatDate(mission.start_date)}
                                      {mission.end_date
                                        ? ` - ${formatDate(mission.end_date)}`
                                        : " - Hiện tại"}
                                    </small>
                                  </div>
                                  {mission.type && (
                                    <Badge bg="success">{mission.type}</Badge>
                                  )}
                                </div>
                                <p className="mb-1">
                                  <i className="fas fa-building me-1"></i>
                                  {mission.organization}
                                </p>
                                {mission.description && (
                                  <p className="mb-0 text-muted small">
                                    {mission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted">Chưa có thông tin sứ vụ</p>
                      )}
                    </div>
                  </Tab.Pane>

                  {/* Evaluation Tab */}
                  <Tab.Pane eventKey="evaluation">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Đánh giá</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/danh-gia/timeline/${id}`)}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Xem chi tiết Timeline
                      </Button>
                    </div>
                    <div className="timeline">
                      {sister.evaluations && sister.evaluations.length > 0 ? (
                        [...sister.evaluations]
                          .sort(
                            (a, b) =>
                              new Date(b.evaluation_date || b.created_at) -
                              new Date(a.evaluation_date || a.created_at)
                          )
                          .map((evaluation, index) => (
                            <div
                              key={evaluation.id || index}
                              className="timeline-item"
                            >
                              <div className="timeline-marker"></div>
                              <div className="timeline-content">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1">
                                      {evaluation.period ||
                                        evaluation.evaluation_type ||
                                        "Đánh giá"}
                                    </h6>
                                    <small className="text-muted">
                                      {formatDate(evaluation.evaluation_date)}
                                    </small>
                                  </div>
                                  {evaluation.overall_rating && (
                                    <Badge
                                      bg={
                                        evaluation.overall_rating >= 90
                                          ? "success"
                                          : evaluation.overall_rating >= 75
                                          ? "info"
                                          : evaluation.overall_rating >= 60
                                          ? "warning"
                                          : "danger"
                                      }
                                    >
                                      <i className="fas fa-star me-1"></i>
                                      {evaluation.overall_rating}/100
                                    </Badge>
                                  )}
                                </div>
                                {evaluation.evaluator_name && (
                                  <p className="mb-1 small">
                                    <i className="fas fa-user-tie me-1"></i>
                                    Người đánh giá: {evaluation.evaluator_name}
                                  </p>
                                )}
                                {evaluation.strengths && (
                                  <p className="mb-1 small">
                                    <i className="fas fa-plus-circle text-success me-1"></i>
                                    {evaluation.strengths}
                                  </p>
                                )}
                                {evaluation.weaknesses && (
                                  <p className="mb-0 text-muted small">
                                    <i className="fas fa-minus-circle text-danger me-1"></i>
                                    {evaluation.weaknesses}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted">Chưa có đánh giá</p>
                      )}
                    </div>
                  </Tab.Pane>

                  {/* Health Tab */}
                  <Tab.Pane eventKey="health">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Sức khỏe</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/suc-khoe/timeline/${id}`)}
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Xem chi tiết Timeline
                      </Button>
                    </div>
                    <div className="timeline">
                      {sister.health_records &&
                      sister.health_records.length > 0 ? (
                        [...sister.health_records]
                          .sort(
                            (a, b) =>
                              new Date(b.check_date) - new Date(a.check_date)
                          )
                          .map((record, index) => (
                            <div
                              key={record.id || index}
                              className="timeline-item"
                            >
                              <div className="timeline-marker"></div>
                              <div className="timeline-content">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1">
                                      Khám ngày {formatDate(record.check_date)}
                                    </h6>
                                    <small className="text-muted">
                                      {record.facility}
                                    </small>
                                  </div>
                                  <Badge
                                    bg={getHealthStatusColor(
                                      record.health_status
                                    )}
                                  >
                                    {record.health_status}
                                  </Badge>
                                </div>
                                {record.doctor && (
                                  <p className="mb-1 small">
                                    <i className="fas fa-user-md me-1"></i>
                                    Bác sĩ: {record.doctor}
                                  </p>
                                )}
                                {record.diagnosis && (
                                  <p className="mb-1 small">
                                    <strong>Chẩn đoán:</strong>{" "}
                                    {record.diagnosis}
                                  </p>
                                )}
                                {record.treatment && (
                                  <p className="mb-0 text-muted small">
                                    <strong>Điều trị:</strong>{" "}
                                    {record.treatment}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted">Chưa có hồ sơ sức khỏe</p>
                      )}
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

// Helper Component
const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <label>{label}</label>
    <div className={`value ${!value || value === "-" ? "empty" : ""}`}>
      {value || "Chưa cập nhật"}
    </div>
  </div>
);

// Helper Functions
const getHealthStatusColor = (status) => {
  const colors = {
    excellent: "success",
    good: "info",
    fair: "warning",
    poor: "danger",
  };
  return colors[status] || "secondary";
};

// Lấy giai đoạn hiện tại từ hành trình ơn gọi (gần nhất)
const getCurrentStage = (vocationJourney) => {
  if (!vocationJourney || vocationJourney.length === 0) return null;
  // Sắp xếp theo thời gian giảm dần và lấy giai đoạn hiện tại (chưa có end_date hoặc gần nhất)
  const sorted = [...vocationJourney].sort(
    (a, b) => new Date(b.start_date) - new Date(a.start_date)
  );
  // Ưu tiên giai đoạn chưa kết thúc
  const current = sorted.find((j) => !j.end_date);
  return current || sorted[0];
};

export default SisterDetailPage;
