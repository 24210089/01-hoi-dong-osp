// src/guards/RoleGuard.jsx
// Simple guard - no role checking (all access granted)

import React from "react";

/**
 * RoleGuard - Simplified version without role checks
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 */
const RoleGuard = ({ children }) => {
  // Simply render children without any role checks
  return <>{children}</>;
};

export default RoleGuard;
