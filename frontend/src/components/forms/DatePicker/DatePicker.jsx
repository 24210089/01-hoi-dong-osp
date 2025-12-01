// src/components/forms/DatePicker/DatePicker.jsx

import React, { forwardRef, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./DatePicker.css";

// Helper functions for date conversion
const formatDateToDisplay = (isoDate) => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

const parseDisplayToISO = (displayDate) => {
  if (!displayDate) return "";
  // Handle dd/mm/yyyy format
  const parts = displayDate.split("/");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    if (year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  return displayDate;
};

const isValidDateString = (str) => {
  if (!str) return false;
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = str.match(regex);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  // Check valid day for month
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
};

const DatePicker = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      error,
      touched,
      required = false,
      disabled = false,
      readOnly = false,
      helpText,
      min,
      max,
      className = "",
      size = "md",
      ...props
    },
    ref
  ) => {
    const hasError = touched && error;
    const [displayValue, setDisplayValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Sync displayValue with value prop
    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatDateToDisplay(value));
      }
    }, [value, isFocused]);

    const handleInputChange = (e) => {
      const inputVal = e.target.value;
      setDisplayValue(inputVal);

      // Auto-add slashes
      let formatted = inputVal.replace(/\D/g, "");
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
      if (formatted.length >= 5) {
        formatted = formatted.slice(0, 5) + "/" + formatted.slice(5, 9);
      }

      if (formatted !== inputVal && formatted.length <= 10) {
        setDisplayValue(formatted);
      }

      // If valid date, call onChange with ISO format
      const checkVal = formatted.length <= 10 ? formatted : inputVal;
      if (isValidDateString(checkVal)) {
        const isoDate = parseDisplayToISO(checkVal);
        if (onChange) {
          onChange(isoDate);
        }
      } else if (inputVal === "" && onChange) {
        onChange("");
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      // Format on blur if valid
      if (isValidDateString(displayValue)) {
        const isoDate = parseDisplayToISO(displayValue);
        setDisplayValue(formatDateToDisplay(isoDate));
        if (onChange) {
          onChange(isoDate);
        }
      } else if (displayValue && !isValidDateString(displayValue)) {
        // Invalid date - reset to original value
        setDisplayValue(formatDateToDisplay(value));
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <Form.Group className={`datepicker-group-custom ${className}`}>
        {label && (
          <Form.Label className="datepicker-label">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
        )}

        <div className={`datepicker-wrapper ${hasError ? "has-error" : ""}`}>
          <span className="datepicker-icon">
            <i className="fas fa-calendar-alt"></i>
          </span>

          <Form.Control
            ref={ref}
            type="text"
            name={name}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            isInvalid={hasError}
            size={size}
            className="datepicker-control"
            placeholder="dd/mm/yyyy"
            maxLength={10}
            {...props}
          />
        </div>

        {helpText && !hasError && (
          <Form.Text className="datepicker-help-text">
            <i className="fas fa-info-circle me-1"></i>
            {helpText}
          </Form.Text>
        )}

        {hasError && (
          <Form.Control.Feedback type="invalid" className="d-block">
            <i className="fas fa-exclamation-circle me-1"></i>
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
