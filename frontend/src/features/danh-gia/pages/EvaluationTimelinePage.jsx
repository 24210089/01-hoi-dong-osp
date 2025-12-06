// src/features/danh-gia/pages/EvaluationTimelinePage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "@components/common/Timeline";
import { evaluationService } from "@services";
import { formatDate } from "@utils";

// Evaluation type configurations
const evaluationTypeConfig = {
  annual: {
    label: "Đánh giá năm",
    icon: "fas fa-calendar-alt",
    className: "type-annual",
  },
  semi_annual: {
    label: "Đánh giá 6 tháng",
    icon: "fas fa-calendar-week",
    className: "type-semi-annual",
  },
  quarterly: {
    label: "Đánh giá quý",
    icon: "fas fa-calendar-day",
    className: "type-quarterly",
  },
  monthly: {
    label: "Đánh giá tháng",
    icon: "fas fa-calendar",
    className: "type-monthly",
  },
  special: {
    label: "Đánh giá đặc biệt",
    icon: "fas fa-star",
    className: "type-special",
  },
};

const getEvaluationConfig = (type) => {
  return (
    evaluationTypeConfig[type] || {
      label: type || "Chưa xác định",
      icon: "fas fa-clipboard-check",
      className: "type-evaluation",
    }
  );
};

const getRatingColor = (rating) => {
  if (!rating) return "secondary";
  if (rating >= 90) return "success";
  if (rating >= 75) return "info";
  if (rating >= 60) return "warning";
  return "danger";
};

const getRatingLabel = (rating) => {
  if (!rating) return "Chưa đánh giá";
  if (rating >= 90) return "Xuất sắc";
  if (rating >= 75) return "Tốt";
  if (rating >= 60) return "Khá";
  return "Cần cải thiện";
};

const EvaluationTimelinePage = () => {
  const navigate = useNavigate();

  // Fetch evaluations by sister
  const fetchDataBySister = async (sisterId) => {
    try {
      const response = await evaluationService.getList({
        sister_id: sisterId,
        page_size: 1000,
      });
      if (response && response.success) {
        const items = response.data?.items || response.data || [];
        // Ensure items is an array
        const evaluations = Array.isArray(items) ? items : [];
        // Sort by evaluation_date descending
        return evaluations.sort(
          (a, b) =>
            new Date(b.evaluation_date || b.created_at) -
            new Date(a.evaluation_date || a.created_at)
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      return [];
    }
  };

  // Get item config based on evaluation type
  const getItemConfig = (item) => {
    return getEvaluationConfig(item.evaluation_type || item.type);
  };

  // Render item content
  const renderItemContent = (item, config) => (
    <>
      <div className="timeline-date">
        <i className="fas fa-calendar"></i>
        {formatDate(item.evaluation_date)}
      </div>
      <h3 className="timeline-title">{item.period || "Kỳ đánh giá"}</h3>
      <span className={`timeline-stage ${config.className}`}>
        {config.label}
      </span>

      {/* Overall Rating */}
      {item.overall_rating && (
        <div className="mb-2">
          <span
            className={`badge bg-${getRatingColor(item.overall_rating)} fs-6`}
          >
            <i className="fas fa-star me-1"></i>
            {item.overall_rating}/100 - {getRatingLabel(item.overall_rating)}
          </span>
        </div>
      )}

      {/* Category Ratings */}
      <div className="d-flex flex-wrap gap-2 mb-2">
        {item.spiritual_life && (
          <span className="badge bg-light text-dark">
            <i className="fas fa-praying-hands text-primary me-1"></i>
            Tâm linh: {item.spiritual_life}
          </span>
        )}
        {item.community_life && (
          <span className="badge bg-light text-dark">
            <i className="fas fa-users text-success me-1"></i>
            Cộng đoàn: {item.community_life}
          </span>
        )}
        {item.apostolic_work && (
          <span className="badge bg-light text-dark">
            <i className="fas fa-hands-helping text-info me-1"></i>
            Tông đồ: {item.apostolic_work}
          </span>
        )}
        {item.personal_development && (
          <span className="badge bg-light text-dark">
            <i className="fas fa-seedling text-warning me-1"></i>
            Phát triển: {item.personal_development}
          </span>
        )}
      </div>

      {/* Strengths */}
      {item.strengths && (
        <p className="timeline-description">
          <strong>
            <i className="fas fa-plus-circle text-success me-1"></i>Điểm mạnh:
          </strong>{" "}
          {item.strengths}
        </p>
      )}

      {/* Weaknesses */}
      {item.weaknesses && (
        <p className="timeline-description">
          <strong>
            <i className="fas fa-minus-circle text-danger me-1"></i>Điểm yếu:
          </strong>{" "}
          {item.weaknesses}
        </p>
      )}

      {/* Evaluator */}
      {(item.evaluator_name || item.evaluator) && (
        <div className="timeline-info">
          <i className="fas fa-user-tie"></i>
          Người đánh giá: {item.evaluator_name || item.evaluator}
        </div>
      )}

      {/* Recommendations */}
      {item.recommendations && (
        <div className="timeline-info">
          <i className="fas fa-lightbulb"></i>
          Kiến nghị: {item.recommendations}
        </div>
      )}
    </>
  );

  // Calculate stats
  const calculateStats = (items, sister) => {
    const total = items.length;
    const annualCount = items.filter(
      (i) => (i.evaluation_type || i.type) === "annual"
    ).length;
    const latestEvaluation = items[0];
    const avgRating =
      items.length > 0
        ? Math.round(
            items
              .filter((i) => i.overall_rating)
              .reduce((sum, i) => sum + i.overall_rating, 0) /
              items.filter((i) => i.overall_rating).length
          )
        : 0;

    return [
      {
        icon: "fas fa-clipboard-check",
        label: "Tổng đánh giá",
        value: total,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        icon: "fas fa-calendar-alt",
        label: "Đánh giá năm",
        value: annualCount,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
      {
        icon: "fas fa-star",
        label: "Điểm trung bình",
        value: avgRating > 0 ? `${avgRating}/100` : "N/A",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
      {
        icon: "fas fa-award",
        label: "Đánh giá gần nhất",
        value: latestEvaluation
          ? getRatingLabel(latestEvaluation.overall_rating)
          : "N/A",
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
    ];
  };

  // Handle click on timeline item to view detail
  const handleItemClick = (item) => {
    if (item && item.id) {
      navigate(`/danh-gia/${item.id}`);
    }
  };

  return (
    <Timeline
      title="Timeline Đánh giá"
      subtitle="Xem lịch sử đánh giá của nữ tu - Nhấn vào từng giai đoạn để xem chi tiết"
      icon="fas fa-clipboard-check"
      backUrl="/danh-gia"
      fetchDataBySister={fetchDataBySister}
      getItemConfig={getItemConfig}
      renderItemContent={renderItemContent}
      calculateStats={calculateStats}
      onItemClick={handleItemClick}
      emptyMessage="Chưa có đánh giá"
      emptyDescription="Nữ tu này chưa có thông tin đánh giá nào được ghi nhận."
    />
  );
};

export default EvaluationTimelinePage;
