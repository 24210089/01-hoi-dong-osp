-- ============================================
-- DATABASE: nun_management
-- ============================================
CREATE DATABASE IF NOT EXISTS nun_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE nun_management;

-- ============================================
-- TABLE: users (KHÔNG có role_id)
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: permissions
-- ============================================
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_key (`key`),
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: user_permissions
-- ============================================
CREATE TABLE user_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_permission (user_id, permission_id),
    INDEX idx_user_id (user_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: permission_groups (Optional)
-- ============================================
CREATE TABLE permission_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: permission_group_items
-- ============================================
CREATE TABLE permission_group_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    
    FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_permission (group_id, permission_id),
    INDEX idx_group_id (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: communities
-- ============================================
CREATE TABLE communities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    established_date DATE,
    superior_id INT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: user_community_permissions
-- ============================================
CREATE TABLE user_community_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    community_id INT NOT NULL,
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_manage_members BOOLEAN DEFAULT FALSE,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_community (user_id, community_id),
    INDEX idx_user_id (user_id),
    INDEX idx_community_id (community_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: sisters
-- ============================================
CREATE TABLE sisters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    religious_name VARCHAR(100) NOT NULL,
    birth_name VARCHAR(100),
    birth_date DATE,
    birth_place VARCHAR(200),
    community_id INT,
    phone VARCHAR(20),
    email VARCHAR(100),
    current_stage VARCHAR(50),
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_religious_name (religious_name),
    INDEX idx_community_id (community_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: system_logs
-- ============================================
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ============================================
-- INSERT PERMISSIONS
-- ============================================
INSERT INTO permissions (`key`, name, description, module, icon) VALUES
-- Nữ Tu
('sisters.view', 'Xem danh sách nữ tu', 'Xem danh sách và thông tin nữ tu', 'Nữ Tu', 'users'),
('sisters.create', 'Thêm nữ tu mới', 'Tạo hồ sơ nữ tu mới', 'Nữ Tu', 'user-plus'),
('sisters.edit', 'Chỉnh sửa thông tin nữ tu', 'Cập nhật thông tin nữ tu', 'Nữ Tu', 'user-edit'),
('sisters.delete', 'Xóa nữ tu', 'Xóa hồ sơ nữ tu', 'Nữ Tu', 'user-minus'),
('sisters.export', 'Xuất dữ liệu nữ tu', 'Xuất danh sách nữ tu ra Excel', 'Nữ Tu', 'file-export'),

-- Hành Trình
('journey.view', 'Xem hành trình ơn gọi', 'Xem lịch sử hành trình', 'Hành Trình', 'route'),
('journey.create', 'Thêm giai đoạn mới', 'Thêm giai đoạn trong hành trình', 'Hành Trình', 'plus-circle'),
('journey.edit', 'Chỉnh sửa hành trình', 'Cập nhật thông tin hành trình', 'Hành Trình', 'edit'),
('journey.delete', 'Xóa giai đoạn', 'Xóa giai đoạn trong hành trình', 'Hành Trình', 'trash'),

-- Cộng Đoàn
('community.view', 'Xem danh sách cộng đoàn', 'Xem thông tin cộng đoàn', 'Cộng Đoàn', 'building'),
('community.create', 'Thêm cộng đoàn mới', 'Tạo cộng đoàn mới', 'Cộng Đoàn', 'plus'),
('community.edit', 'Chỉnh sửa cộng đoàn', 'Cập nhật thông tin cộng đoàn', 'Cộng Đoàn', 'edit'),
('community.delete', 'Xóa cộng đoàn', 'Xóa cộng đoàn', 'Cộng Đoàn', 'trash'),
('community.assign', 'Phân công nữ tu', 'Phân công nữ tu vào cộng đoàn', 'Cộng Đoàn', 'user-check'),

-- Sức Khỏe
('health.view', 'Xem hồ sơ sức khỏe', 'Xem thông tin sức khỏe', 'Sức Khỏe', 'heartbeat'),
('health.create', 'Thêm hồ sơ sức khỏe', 'Tạo hồ sơ sức khỏe mới', 'Sức Khỏe', 'notes-medical'),
('health.edit', 'Chỉnh sửa hồ sơ sức khỏe', 'Cập nhật thông tin sức khỏe', 'Sức Khỏe', 'edit'),
('health.delete', 'Xóa hồ sơ sức khỏe', 'Xóa hồ sơ sức khỏe', 'Sức Khỏe', 'trash'),

-- Học Vấn
('education.view', 'Xem thông tin học vấn', 'Xem bằng cấp và học vấn', 'Học Vấn', 'graduation-cap'),
('education.create', 'Thêm bằng cấp', 'Thêm bằng cấp mới', 'Học Vấn', 'plus'),
('education.edit', 'Chỉnh sửa học vấn', 'Cập nhật thông tin học vấn', 'Học Vấn', 'edit'),
('education.delete', 'Xóa bằng cấp', 'Xóa bằng cấp', 'Học Vấn', 'trash'),

-- Sứ Vụ
('mission.view', 'Xem sứ vụ', 'Xem danh sách sứ vụ', 'Sứ Vụ', 'briefcase'),
('mission.create', 'Tạo sứ vụ mới', 'Tạo sứ vụ mới', 'Sứ Vụ', 'plus'),
('mission.edit', 'Chỉnh sửa sứ vụ', 'Cập nhật thông tin sứ vụ', 'Sứ Vụ', 'edit'),
('mission.assign', 'Phân công sứ vụ', 'Phân công sứ vụ cho nữ tu', 'Sứ Vụ', 'user-tag'),

-- Báo Cáo
('report.view', 'Xem báo cáo', 'Xem các báo cáo thống kê', 'Báo Cáo', 'chart-bar'),
('report.create', 'Tạo báo cáo mới', 'Tạo báo cáo mới', 'Báo Cáo', 'file-alt'),
('report.export', 'Xuất báo cáo', 'Xuất báo cáo ra file', 'Báo Cáo', 'file-export'),
('report.print', 'In báo cáo', 'In báo cáo', 'Báo Cáo', 'print'),

-- Người Dùng
('users.view', 'Xem danh sách người dùng', 'Xem thông tin người dùng', 'Người Dùng', 'users-cog'),
('users.create', 'Tạo tài khoản mới', 'Tạo tài khoản người dùng mới', 'Người Dùng', 'user-plus'),
('users.edit', 'Chỉnh sửa người dùng', 'Cập nhật thông tin người dùng', 'Người Dùng', 'user-edit'),
('users.delete', 'Xóa người dùng', 'Xóa tài khoản người dùng', 'Người Dùng', 'user-times'),
('users.permissions', 'Quản lý phân quyền', 'Cấp và thu hồi quyền người dùng', 'Người Dùng', 'shield-alt'),

-- Cài Đặt
('settings.view', 'Xem cài đặt', 'Xem cài đặt hệ thống', 'Cài Đặt', 'cog'),
('settings.edit', 'Thay đổi cài đặt', 'Thay đổi cài đặt hệ thống', 'Cài Đặt', 'cogs'),
('settings.backup', 'Sao lưu & khôi phục', 'Sao lưu và khôi phục dữ liệu', 'Cài Đặt', 'database'),
('settings.audit', 'Xem nhật ký hoạt động', 'Xem lịch sử hoạt động', 'Cài Đặt', 'history');

-- ============================================
-- INSERT PERMISSION GROUPS
-- ============================================
INSERT INTO permission_groups (name, description, icon, sort_order) VALUES
('Quản lý Nữ Tu', 'Tất cả quyền liên quan đến quản lý nữ tu', 'users', 1),
('Quản lý Hành Trình', 'Tất cả quyền liên quan đến hành trình ơn gọi', 'route', 2),
('Quản lý Cộng Đoàn', 'Tất cả quyền liên quan đến cộng đoàn', 'building', 3),
('Quản lý Sức Khỏe', 'Tất cả quyền liên quan đến sức khỏe', 'heartbeat', 4),
('Quản lý Học Vấn', 'Tất cả quyền liên quan đến học vấn', 'graduation-cap', 5),
('Quản lý Sứ Vụ', 'Tất cả quyền liên quan đến sứ vụ', 'briefcase', 6),
('Quản lý Báo Cáo', 'Tất cả quyền liên quan đến báo cáo', 'chart-bar', 7),
('Quản trị Hệ Thống', 'Quyền quản trị viên', 'cog', 8);

-- ============================================
-- MAP PERMISSIONS TO GROUPS
-- ============================================
INSERT INTO permission_group_items (group_id, permission_id)
SELECT 1, id FROM permissions WHERE module = 'Nữ Tu';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 2, id FROM permissions WHERE module = 'Hành Trình';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 3, id FROM permissions WHERE module = 'Cộng Đoàn';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 4, id FROM permissions WHERE module = 'Sức Khỏe';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 5, id FROM permissions WHERE module = 'Học Vấn';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 6, id FROM permissions WHERE module = 'Sứ Vụ';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 7, id FROM permissions WHERE module = 'Báo Cáo';

INSERT INTO permission_group_items (group_id, permission_id)
SELECT 8, id FROM permissions WHERE module IN ('Người Dùng', 'Cài Đặt');

-- ============================================
-- INSERT SAMPLE COMMUNITIES
-- ============================================
INSERT INTO communities (code, name, address, phone, established_date, is_active) VALUES
('CD001', 'Nhà Dòng Bà Rịa', '123 Đường Trần Hưng Đạo, TP. Bà Rịa', '0254-3851234', '1990-01-15', TRUE),
('CD002', 'Nhà Dòng Vũng Tàu', '456 Đường Lê Lợi, TP. Vũng Tàu', '0254-3852345', '1995-05-20', TRUE),
('CD003', 'Nhà Dòng Long Điền', '789 Đường Nguyễn Trãi, Huyện Long Điền', '0254-3853456', '2000-08-10', TRUE),
('CD004', 'Nhà Dòng Xuyên Mộc', '321 Đường Lê Duẩn, Huyện Xuyên Mộc', '0254-3854567', '2005-12-25', TRUE);

-- ============================================
-- INSERT ADMIN USER (Password: admin123)
-- ============================================
INSERT INTO users (username, email, password, full_name, is_active) VALUES
('admin', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'Administrator', TRUE);

-- Grant all permissions to admin
INSERT INTO user_permissions (user_id, permission_id, granted_by)
SELECT 1, id, 1 FROM permissions;

-- Grant access to all communities for admin
INSERT INTO user_community_permissions (user_id, community_id, can_view, can_edit, can_manage_members, granted_by)
SELECT 1, id, TRUE, TRUE, TRUE, 1 FROM communities;
