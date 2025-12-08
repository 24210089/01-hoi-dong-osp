// src/features/danh-gia/pages/EvaluationListPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  Badge,
  Pagination,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { evaluationService } from "@services";
import { useTable, useDebounce } from "@hooks";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import StatsCards from "@components/common/StatsCards";
import SearchFilterBar from "@components/common/SearchFilterBar";
import { formatDate } from "@utils";

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
  }, [
    sisterId,
    table.currentPage,
    table.pageSize,
    debouncedSearch,
    table.sortBy,
    table.sortOrder,
  ]);

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

  const handleSort = (key) => {
    table.handleSort(key);
  };

  const renderSortIcon = (key) => {
    if (table.sortBy !== key)
      return <i className="fas fa-sort text-muted ms-1"></i>;
    return table.sortOrder === "asc" ? (
      <i className="fas fa-sort-up ms-1"></i>
    ) : (
      <i className="fas fa-sort-down ms-1"></i>
    );
  };

  const typeLabel = (type) => {
    const map = {
      annual: "Năm",
      semi_annual: "6 tháng",
      quarterly: "Quý",
      monthly: "Tháng",
      special: "Đặc biệt",
    };
    return map[type] || type || "-";
  };

  const sisterName = (e) => {
    const saint = e.sister_saint_name || e.saint_name;
    const birth = e.sister_birth_name || e.birth_name;
    if (saint && birth) return `${saint} ${birth}`;
    return saint || birth || `Nữ tu #${e.sister_id || "?"}`;
  };

  const sortedEvaluations = useMemo(() => {
    const items = [...evaluations];

    const getValue = (item) => {
      switch (table.sortBy) {
        case "sister":
          return sisterName(item);
        case "evaluation_date":
          return item.evaluation_date
            ? new Date(item.evaluation_date).getTime()
            : 0;
        case "evaluation_type":
          return item.evaluation_type || "";
        case "evaluator":
          return item.evaluator || "";
        case "overall_rating":
          return item.overall_rating || 0;
        case "period":
          return item.period || "";
        default:
          return item.evaluation_date
            ? new Date(item.evaluation_date).getTime()
            : 0;
      }
    };

    items.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);

      if (typeof aVal === "number" && typeof bVal === "number") {
        return table.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return table.sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return items;
  }, [evaluations, table.sortBy, table.sortOrder]);

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
      <Card
        className="shadow-sm border-0 rounded-3"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Card.Body className="p-0">
          {evaluations.length === 0 ? (
            <div className="text-center py-5">
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
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-nowrap">#</th>
                      <th
                        role="button"
                        onClick={() => handleSort("sister")}
                        className="text-nowrap"
                      >
                        Nữ tu {renderSortIcon("sister")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("evaluation_date")}
                        className="text-nowrap"
                      >
                        Ngày đánh giá {renderSortIcon("evaluation_date")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("period")}
                        className="text-nowrap"
                      >
                        Kỳ {renderSortIcon("period")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("evaluation_type")}
                        className="text-nowrap"
                      >
                        Loại {renderSortIcon("evaluation_type")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("evaluator")}
                        className="text-nowrap"
                      >
                        Người đánh giá {renderSortIcon("evaluator")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("overall_rating")}
                        className="text-nowrap"
                      >
                        Điểm tổng {renderSortIcon("overall_rating")}
                      </th>
                      <th className="text-end text-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvaluations.map((evaluation, index) => {
                      const rating = evaluation.overall_rating || 0;
                      const ratingColor =
                        rating >= 8
                          ? "success"
                          : rating >= 6
                          ? "warning"
                          : "danger";
                      return (
                        <tr key={evaluation.id}>
                          <td>
                            {(table.currentPage - 1) * table.pageSize +
                              index +
                              1}
                          </td>
                          <td className="fw-semibold text-primary">
                            {sisterName(evaluation)}
                          </td>
                          <td className="text-nowrap">
                            {evaluation.evaluation_date
                              ? formatDate(evaluation.evaluation_date)
                              : "-"}
                          </td>
                          <td>{evaluation.period || "-"}</td>
                          <td>{typeLabel(evaluation.evaluation_type)}</td>
                          <td>{evaluation.evaluator || "-"}</td>
                          <td>
                            <Badge bg={ratingColor}>{rating}/10</Badge>
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => handleView(evaluation)}
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEdit(evaluation)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(evaluation)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
        {table.totalPages > 1 && (
          <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Trang {table.currentPage} / {table.totalPages}
            </small>
            <Pagination className="mb-0">
              <Pagination.First
                onClick={() => table.firstPage()}
                disabled={table.currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => table.previousPage()}
                disabled={table.currentPage === 1}
              />
              <Pagination.Item active>{table.currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={() => table.nextPage()}
                disabled={table.currentPage === table.totalPages}
              />
              <Pagination.Last
                onClick={() => table.lastPage()}
                disabled={table.currentPage === table.totalPages}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default EvaluationListPage;
