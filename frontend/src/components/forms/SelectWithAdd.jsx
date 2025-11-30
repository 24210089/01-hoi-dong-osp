// src/components/forms/SelectWithAdd.jsx

import React, { useState } from "react";
import { Form, InputGroup, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const SelectWithAdd = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  touched,
  required,
  placeholder = "Chọn...",
  disabled,
  onAddNew,
  addNewLabel = "Thêm mới",
  renderOption,
  valueKey = "code",
  labelKey = "name",
  colorKey = "color",
  showColor = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ code: "", name: "", color: "#6c757d" });
  const [submitting, setSubmitting] = useState(false);

  const handleAddClick = () => {
    setNewItem({ code: "", name: "", color: "#6c757d" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewItem({ code: "", name: "", color: "#6c757d" });
  };

  const handleSubmitNew = async () => {
    if (!newItem.name.trim()) return;

    setSubmitting(true);
    try {
      // Generate code from name if not provided
      const code = newItem.code.trim() || newItem.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      
      if (onAddNew) {
        const result = await onAddNew({ ...newItem, code });
        if (result && result.success) {
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error adding new item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isInvalid = touched && error;

  return (
    <>
      <Form.Group className="mb-3">
        {label && (
          <Form.Label>
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
        )}
        <InputGroup>
          <Form.Select
            name={name}
            value={value || ""}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            isInvalid={isInvalid}
            className={showColor ? "pe-5" : ""}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option[valueKey]} value={option[valueKey]}>
                {renderOption ? renderOption(option) : option[labelKey]}
              </option>
            ))}
          </Form.Select>
          {onAddNew && (
            <Button
              variant="outline-primary"
              onClick={handleAddClick}
              disabled={disabled}
              title={addNewLabel}
            >
              <i className="fas fa-plus"></i>
            </Button>
          )}
          {isInvalid && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </InputGroup>
        {showColor && value && (
          <div className="mt-1">
            {options.filter((o) => o[valueKey] === value).map((o) => (
              <span
                key={o[valueKey]}
                className="badge"
                style={{ backgroundColor: o[colorKey] || "#6c757d" }}
              >
                {o[labelKey]}
              </span>
            ))}
          </div>
        )}
      </Form.Group>

      {/* Add New Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{addNewLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Nhập tên..."
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mã (tự động tạo nếu để trống)</Form.Label>
            <Form.Control
              type="text"
              value={newItem.code}
              onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
              placeholder="vd: ten_moi"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Màu sắc</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="color"
                value={newItem.color}
                onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                style={{ width: "60px", height: "38px" }}
              />
              <Form.Control
                type="text"
                value={newItem.color}
                onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                placeholder="#6c757d"
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitNew}
            disabled={submitting || !newItem.name.trim()}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Lưu
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

SelectWithAdd.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  options: PropTypes.array,
  error: PropTypes.string,
  touched: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onAddNew: PropTypes.func,
  addNewLabel: PropTypes.string,
  renderOption: PropTypes.func,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  colorKey: PropTypes.string,
  showColor: PropTypes.bool,
};

export default SelectWithAdd;
