// src/features/bao-cao/components/StatCard/StatCard.jsx

import React from "react";
import { Card } from "react-bootstrap";
import "./StatCard.css";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  trendValue,
  onClick,
}) => {
  return (
    <Card
      className={`stat-card stat-card-${color} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <Card.Body>
        <div className="stat-card-content">
          <div className="stat-info">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            {trend && (
              <div className={`stat-trend trend-${trend}`}>
                <i
                  className={`fas fa-arrow-${
                    trend === "up" ? "up" : "down"
                  } me-1`}
                ></i>
                {trendValue}
              </div>
            )}
          </div>
          <div className={`stat-icon bg-${color}`}>
            <i className={icon}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
