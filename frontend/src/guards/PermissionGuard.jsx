// src/guards/PermissionGuard.jsx
// Simple guard - no permission checking (all access granted)

import React from "react";

/**
 * PermissionGuard - Simplified version without permission checks
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 */
const PermissionGuard = ({ children }) => {
  // Simply render children without any permission checks
  return <>{children}</>;
};

export default PermissionGuard;
