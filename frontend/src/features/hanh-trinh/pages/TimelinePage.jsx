// src/features/hanh-trinh/pages/TimelinePage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { journeyService, sisterService } from "@services";
import { formatDate, calculateDuration } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./TimelinePage.css";

const TimelinePage = () => {
  const { sisterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sister, setSister] = useState(null);
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    fetchData();
  }, [sisterId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch sister info
      const sisterRes = await sisterService.getDetail(sisterId);
      if (sisterRes && sisterRes.success) {
        setSister(sisterRes.data);
      } else if (sisterRes && !sisterRes.success) {
        setSister(sisterRes);
      }

      // Fetch journey timeline for this sister
      const journeyRes = await journeyService.getList({ sister_id: sisterId, limit: 100 });
      if (journeyRes && journeyRes.success) {
        // Sort by start_date ascending for timeline
        const sortedJourneys = (journeyRes.data || []).sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
        setJourneys(sortedJourneys);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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

  return (
    <Container fluid className="py-4">
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Quản lý Nữ tu", link: "/nu-tu" },
          { label: sister?.birth_name || sister?.full_name, link: `/nu-tu/${sisterId}` },
          { label: "Hành trình ơn gọi" },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Hành trình Ơn gọi</h2>
          <p className="text-muted mb-0">
            {sister?.saint_name && (
              <span className="text-primary me-2">{sister.saint_name}</span>
            )}
            {sister?.birth_name || sister?.full_name}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(`/nu-tu/${sisterId}`)}
        >
          Quay lại
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Các giai đoạn</h5>
            </Card.Header>
            <Card.Body>
              {journeys.length > 0 ? (
                <div className="timeline">
                  {journeys.map((journey, index) => (
                    <div key={journey.id} className="timeline-item">
                      <div className="timeline-marker">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: journey.stage_color || '#6c757d',
                            color: '#fff'
                          }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="timeline-content">
                        <Card className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">
                                  {journey.stage_name || journey.stage}
                                </h6>
                                <small className="text-muted">
                                  {formatDate(journey.start_date)}
                                  {journey.end_date &&
                                    ` - ${formatDate(journey.end_date)}`}
                                </small>
                              </div>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: journey.stage_color || '#6c757d',
                                  color: '#fff'
                                }}
                              >
                                {journey.end_date
                                  ? "Hoàn thành"
                                  : "Đang thực hiện"}
                              </span>
                            </div>
                            {journey.notes && (
                              <p className="text-muted mt-2 mb-0 small">
                                {journey.notes}
                              </p>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Chưa có thông tin hành trình</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Thông tin hiện tại</h5>
            </Card.Header>
            <Card.Body>
              {sister && (
                <>
                  <div className="mb-3">
                    <small className="text-muted d-block">
                      Giai đoạn hiện tại
                    </small>
                    {journeys.length > 0 && journeys[journeys.length - 1] ? (
                      <span
                        className="badge mt-1"
                        style={{
                          backgroundColor: journeys[journeys.length - 1].stage_color || '#6c757d',
                          color: '#fff'
                        }}
                      >
                        {journeys[journeys.length - 1].stage_name || journeys[journeys.length - 1].stage}
                      </span>
                    ) : (
                      <span className="badge bg-secondary mt-1">Chưa xác định</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Mã số</small>
                    <div className="fw-semibold">{sister.code || sister.sister_code}</div>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Ngày sinh</small>
                    <div className="fw-semibold">
                      {formatDate(sister.date_of_birth || sister.birth_date)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Ngày gia nhập</small>
                    <div className="fw-semibold">
                      {formatDate(sister.join_date)}
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TimelinePage;
