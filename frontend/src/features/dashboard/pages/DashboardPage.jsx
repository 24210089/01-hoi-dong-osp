// src/features/dashboard/pages/DashboardPage.jsx

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '@context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, permissions, communities } = useAuth();

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="mb-1">
          <i className="fas fa-home me-2"></i>
          Xin chào, {user?.full_name || user?.username}!
        </h2>
        <p className="text-muted mb-0">
          Chào mừng bạn đến với Hệ thống Quản lý Nữ Tu
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card stat-card-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Quyền được cấp</h6>
                  <h2 className="mb-0">{permissions.length}</h2>
                </div>
                <div className="stat-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card stat-card-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Cộng đoàn quản lý</h6>
                  <h2 className="mb-0">{communities.length}</h2>
                </div>
                <div className="stat-icon">
                  <i className="fas fa-home"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card stat-card-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Trạng thái</h6>
                  <h5 className="mb-0">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Hoạt động
                  </h5>
                </div>
                <div className="stat-icon">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Access */}
      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Truy cập nhanh
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-access-grid">
                <a href="/sisters" className="quick-access-item">
                  <i className="fas fa-users"></i>
                  <span>Quản lý Nữ Tu</span>
                </a>
                <a href="/communities" className="quick-access-item">
                  <i className="fas fa-home"></i>
                  <span>Cộng Đoàn</span>
                </a>
                <a href="/users" className="quick-access-item">
                  <i className="fas fa-user-cog"></i>
                  <span>Người Dùng</span>
                </a>
                <a href="/reports" className="quick-access-item">
                  <i className="fas fa-chart-bar"></i>
                  <span>Báo Cáo</span>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin tài khoản
              </h5>
            </Card.Header>
            <Card.Body>
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Tên đăng nhập:</td>
                    <td><strong>{user?.username}</strong></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Email:</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Họ và tên:</td>
                    <td>{user?.full_name || '-'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Số điện thoại:</td>
                    <td>{user?.phone || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
// src/features/dashboard/pages/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "@context";
import StatsOverview from "../components/StatsOverview";
import RecentActivities from "../components/RecentActivities/RecentActivities";
import QuickActions from "../components/QuickActions/QuickActions";

// Mock data for demo
const mockStats = {
  totalSisters: 156,
  activeSisters: 142,
  totalCommunities: 12,
  averageAge: 45,
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await reportService.getOverview();
      // if (response.success) {
      //   setStats(response.data);
      // }

      // Mock data for demo
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="mb-1">Chào mừng, {user?.full_name || "Admin"}!</h2>
        <p className="text-muted">Tổng quan hệ thống quản lý hội dòng</p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Recent Activities & Quick Actions */}
      <Row className="g-4 mt-2">
        <Col lg={8}>
          <RecentActivities />
        </Col>
        <Col lg={4}>
          <QuickActions />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
