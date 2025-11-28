// src/features/bao-cao/components/ReportFilter/ReportFilter.jsx

import React, { useState } from "react";
import { Button, Offcanvas, Form, Row, Col } from "react-bootstrap";
import Select from "@components/forms/Select";
import DatePicker from "@components/forms/DatePicker";
import "./ReportFilter.css";

const ReportFilter = ({ filters, onFilterChange, onApply, onClear }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleApply = () => {
    onApply();
    handleClose();
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <>
      {/* Filter Button */}
      <Button variant="outline-primary" onClick={handleShow}>
        <i className="fas fa-filter me-2"></i>
        Bộ lọc
      </Button>

      {/* Filter Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="fas fa-filter me-2"></i>
            Bộ lọc báo cáo
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form>
            <Row className="g-3">
              {/* Date Range */}
              <Col xs={12}>
                <h6 className="filter-section-title">Khoảng thời gian</h6>
              </Col>

              <Col xs={12}>
                <DatePicker
                  label="Từ ngày"
                  value={filters.start_date || ""}
                  onChange={(date) => handleChange("start_date", date)}
                />
              </Col>

              <Col xs={12}>
                <DatePicker
                  label="Đến ngày"
                  value={filters.end_date || ""}
                  onChange={(date) => handleChange("end_date", date)}
                />
              </Col>

              {/* Quick Date Range */}
              <Col xs={12}>
                <Select
                  label="Khoảng thời gian nhanh"
                  value={filters.quick_range || ""}
                  onChange={(e) => handleChange("quick_range", e.target.value)}
                >
                  <option value="">Tùy chọn</option>
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                  <option value="this_week">Tuần này</option>
                  <option value="last_week">Tuần trước</option>
                  <option value="this_month">Tháng này</option>
                  <option value="last_month">Tháng trước</option>
                  <option value="this_quarter">Quý này</option>
                  <option value="this_year">Năm này</option>
                  <option value="last_year">Năm trước</option>
                </Select>
              </Col>

              {/* Community Filter */}
              <Col xs={12}>
                <h6 className="filter-section-title mt-3">Cộng đoàn</h6>
              </Col>

              <Col xs={12}>
                <Select
                  label="Cộng đoàn"
                  value={filters.community_id || ""}
                  onChange={(e) => handleChange("community_id", e.target.value)}
                >
                  <option value="">Tất cả cộng đoàn</option>
                  {/* Add community options dynamically */}
                </Select>
              </Col>

              {/* Status Filter */}
              <Col xs={12}>
                <h6 className="filter-section-title mt-3">Trạng thái</h6>
              </Col>

              <Col xs={12}>
                <Select
                  label="Trạng thái nữ tu"
                  value={filters.sister_status || ""}
                  onChange={(e) =>
                    handleChange("sister_status", e.target.value)
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="on_leave">Đang nghỉ</option>
                  <option value="retired">Đã nghỉ hưu</option>
                </Select>
              </Col>

              {/* Report Type */}
              <Col xs={12}>
                <h6 className="filter-section-title mt-3">Loại báo cáo</h6>
              </Col>

              <Col xs={12}>
                <Select
                  label="Loại báo cáo"
                  value={filters.report_type || ""}
                  onChange={(e) => handleChange("report_type", e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="overview">Tổng quan</option>
                  <option value="journey">Hành trình</option>
                  <option value="health">Sức khỏe</option>
                  <option value="evaluation">Đánh giá</option>
                  <option value="mission">Sứ vụ</option>
                </Select>
              </Col>
            </Row>

            {/* Buttons */}
            <div className="d-flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={handleClear}
                className="flex-grow-1"
              >
                <i className="fas fa-redo me-2"></i>
                Xóa bộ lọc
              </Button>
              <Button
                variant="primary"
                onClick={handleApply}
                className="flex-grow-1"
              >
                <i className="fas fa-check me-2"></i>
                Áp dụng
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ReportFilter;
