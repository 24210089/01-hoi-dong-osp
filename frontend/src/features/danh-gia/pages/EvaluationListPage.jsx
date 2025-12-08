// src/features/danh-gia/pages/EvaluationListPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Nav, Tab } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { evaluationService } from "@services";
import { useTable, useDebounce } from "@hooks";
import { EvaluationCard } from "../components";
import SearchBox from "@components/common/SearchBox";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import StatsCards from "@components/common/StatsCards";
import SearchFilterBar from "@components/common/SearchFilterBar";

const EvaluationListPage = () => {
  const { sisterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);

  const table = useTable({
    initialPageSize: 12,
  });

  const debouncedSearch = useDebounce(table.searchTerm, 500);

  useEffect(() => {
    fetchEvaluations();
  }, [sisterId, table.currentPage, table.pageSize, debouncedSearch]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const params = sisterId
        ? { sister_id: sisterId, ...table.getTableParams() }
        : table.getTableParams();
      const response = await evaluationService.getList(params);

      if (response.success) {
        setEvaluations(response.data.items || response.data);
        table.setTotalItems(response.data.total || response.data.length);
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate(
      sisterId ? `/nu-tu/${sisterId}/danh-gia/create` : "/danh-gia/create"
    );
  };

  const handleView = (evaluation) => {
    navigate(`/danh-gia/${evaluation.id}`);
  };

  const handleEdit = (evaluation) => {
    navigate(`/danh-gia/${evaluation.id}/edit`);
  };

  const handleDelete = async (evaluation) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        const response = await evaluationService.delete(evaluation.id);
        if (response.success) {
          toast.success("Đã xóa đánh giá thành công!");
          fetchEvaluations();
        } else {
          toast.error(response.error || "Có lỗi xảy ra khi xóa đánh giá");
        }
      } catch (error) {
        console.error("Error deleting evaluation:", error);
        toast.error("Không thể xóa đánh giá. Vui lòng thử lại!");
      }
    }
  };

  const evaluationsByType = {
    annual: evaluations.filter((e) => e.evaluation_type === "annual"),
    semi_annual: evaluations.filter((e) => e.evaluation_type === "semi_annual"),
    quarterly: evaluations.filter((e) => e.evaluation_type === "quarterly"),
    monthly: evaluations.filter((e) => e.evaluation_type === "monthly"),
    special: evaluations.filter((e) => e.evaluation_type === "special"),
  };

  // Calculate average rating
  const averageRating =
    evaluations.length > 0
      ? (
          evaluations.reduce((sum, e) => sum + (e.overall_rating || 0), 0) /
          evaluations.length
        ).toFixed(1)
      : 0;

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
        title="Quản lý Đánh giá"
        items={[
          ...(sisterId ? [{ label: "Quản lý Nữ Tu", link: "/nu-tu" }] : []),
          { label: "Đánh giá" },
        ]}
      />

      {/* Statistics */}
      <StatsCards
        stats={[
          {
            label: "Tổng số",
            value: evaluations.length,
            icon: "fas fa-clipboard-check",
            color: "primary",
          },
          {
            label: "Điểm TB",
            value: averageRating,
            icon: "fas fa-star",
            color: "success",
          },
          {
            label: "Đánh giá năm",
            value: evaluationsByType.annual.length,
            icon: "fas fa-calendar-alt",
            color: "info",
          },
          {
            label: "Đánh giá đặc biệt",
            value: evaluationsByType.special.length,
            icon: "fas fa-exclamation-circle",
            color: "warning",
          },
        ]}
      />

      {/* Search */}
      <SearchFilterBar
        searchValue={table.searchTerm}
        onSearchChange={table.handleSearch}
        searchPlaceholder="Tìm kiếm theo kỳ đánh giá, người đánh giá..."
      />

      {/* Content */}
      {evaluations.length > 0 ? (
        <Tab.Container defaultActiveKey="all">
          <Card>
            <Card.Header className="bg-white">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="all">
                    <i className="fas fa-list me-2"></i>
                    Tất cả ({evaluations.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="annual">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Năm ({evaluationsByType.annual.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="semi_annual">
                    <i className="fas fa-calendar-week me-2"></i>6 tháng (
                    {evaluationsByType.semi_annual.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="quarterly">
                    <i className="fas fa-calendar-day me-2"></i>
                    Quý ({evaluationsByType.quarterly.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="special">
                    <i className="fas fa-star me-2"></i>
                    Đặc biệt ({evaluationsByType.special.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="all">
                  <Row className="g-4">
                    {evaluations.map((evaluation) => (
                      <Col key={evaluation.id} xs={12} sm={6} lg={4}>
                        <EvaluationCard
                          evaluation={evaluation}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
                {Object.entries(evaluationsByType).map(([type, items]) => (
                  <Tab.Pane key={type} eventKey={type}>
                    <Row className="g-4">
                      {items.map((evaluation) => (
                        <Col key={evaluation.id} xs={12} sm={6} lg={4}>
                          <EvaluationCard
                            evaluation={evaluation}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <i
              className="fas fa-clipboard-check text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5>Chưa có đánh giá</h5>
            <p className="text-muted">Thêm đánh giá đầu tiên để theo dõi</p>
            <Button variant="primary" onClick={handleAdd}>
              <i className="fas fa-plus me-2"></i>
              Thêm Đánh giá
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EvaluationListPage;
