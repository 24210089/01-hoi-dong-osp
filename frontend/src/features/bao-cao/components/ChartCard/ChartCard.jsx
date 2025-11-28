// src/features/bao-cao/components/ChartCard/ChartCard.jsx

import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import "./ChartCard.css";

const ChartCard = ({ title, subtitle, children, actions, loading = false }) => {
  return (
    <Card className="chart-card">
      <Card.Header className="chart-card-header">
        <div className="chart-header-content">
          <div>
            <h5 className="chart-title mb-0">{title}</h5>
            {subtitle && <p className="chart-subtitle mb-0">{subtitle}</p>}
          </div>
          {actions && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="chart-actions"
              >
                <i className="fas fa-ellipsis-v"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {actions.map((action, index) => (
                  <Dropdown.Item key={index} onClick={action.onClick}>
                    <i className={`${action.icon} me-2`}></i>
                    {action.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Card.Header>
      <Card.Body className="chart-card-body">
        {loading ? (
          <div className="chart-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          children
        )}
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
