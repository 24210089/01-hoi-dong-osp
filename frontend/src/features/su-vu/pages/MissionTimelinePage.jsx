// src/features/su-vu/pages/MissionTimelinePage.jsx

import React from "react";
import Timeline from "@components/common/Timeline";
import { missionService } from "@services";
import { formatDate } from "@utils";

// Mission type configurations mapped from "field" values in MissionForm
const missionTypeConfig = {
  education: {
    label: "Giáo dục",
    icon: "fas fa-chalkboard-teacher",
    className: "type-education",
  },
  pastoral: {
    label: "Mục vụ",
    icon: "fas fa-cross",
    className: "type-mission",
  },
  publishing: {
    label: "Xuất bản",
    icon: "fas fa-book",
    className: "type-mission",
  },
  media: {
    label: "Truyền thông",
    icon: "fas fa-broadcast-tower",
    className: "type-mission",
  },
  healthcare: {
    label: "Y tế",
    icon: "fas fa-stethoscope",
    className: "type-health",
  },
  social: {
    label: "Xã hội",
    icon: "fas fa-hands-helping",
    className: "type-community",
  },
};

const getMissionConfig = (field) => {
  return (
    missionTypeConfig[field] || {
      label: field || "Sứ vụ khác",
      icon: "fas fa-tasks",
      className: "type-mission",
    }
  );
};

const MissionTimelinePage = () => {
  // Fetch missions by sister
  const fetchDataBySister = async (sisterId) => {
    try {
      const response = await missionService.getBySister(sisterId);
      if (response && response.success) {
        // Backend returns { sister: {...}, missions: [...] }
        const rawItems =
          response.data?.missions ||
          response.data?.items ||
          response.data?.data ||
          response.data ||
          [];

        const items = Array.isArray(rawItems)
          ? rawItems
          : Array.isArray(rawItems.missions)
          ? rawItems.missions
          : [];

        return items.sort(
          (a, b) =>
            new Date(b.start_date || b.created_at) -
            new Date(a.start_date || a.created_at)
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching missions:", error);
      return [];
    }
  };

  // Get item config based on mission type
  const getItemConfig = (item) => {
    return getMissionConfig(item.field || item.mission_type || item.type);
  };

  // Render item content
  const renderItemContent = (item, config) => (
    <>
      <div className="timeline-date">
        <i className="fas fa-calendar"></i>
        {formatDate(item.start_date)}
        {item.end_date ? ` - ${formatDate(item.end_date)}` : " - Hiện tại"}
      </div>
      <h3 className="timeline-title">
        {item.specific_role || item.position || item.title || config.label}
      </h3>
      <span className={`timeline-stage ${config.className}`}>
        {config.label}
      </span>

      {item.organization && (
        <div className="timeline-info">
          <i className="fas fa-building"></i>
          {item.organization}
        </div>
      )}

      {item.location && (
        <div className="timeline-location">
          <i className="fas fa-map-marker-alt"></i>
          {item.location}
        </div>
      )}

      {item.description && (
        <p className="timeline-description mt-2">{item.description}</p>
      )}

      {item.achievements && (
        <div className="timeline-info">
          <i className="fas fa-trophy"></i>
          Thành tích: {item.achievements}
        </div>
      )}
    </>
  );

  // Calculate stats
  const calculateStats = (items, sister) => {
    const total = items.length;
    const currentMissions = items.filter(
      (i) => !i.end_date || new Date(i.end_date) >= new Date()
    ).length;
    const uniqueTypes = [...new Set(items.map((i) => i.mission_type || i.type))]
      .length;
    const yearsOfService = items.reduce((total, item) => {
      const start = new Date(item.start_date);
      const end = item.end_date ? new Date(item.end_date) : new Date();
      return total + (end - start) / (365.25 * 24 * 60 * 60 * 1000);
    }, 0);

    return [
      {
        icon: "fas fa-tasks",
        label: "Tổng sứ vụ",
        value: total,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        icon: "fas fa-briefcase",
        label: "Đang phục vụ",
        value: currentMissions,
        gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
      },
      {
        icon: "fas fa-layer-group",
        label: "Loại sứ vụ",
        value: uniqueTypes,
        gradient: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
      },
      {
        icon: "fas fa-clock",
        label: "Năm phục vụ",
        value: Math.round(yearsOfService),
        gradient: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
      },
    ];
  };

  return (
    <Timeline
      title="Timeline Sứ Vụ"
      subtitle="Xem lịch sử các sứ vụ và công tác của nữ tu"
      icon="fas fa-tasks"
      backUrl="/su-vu"
      fetchDataBySister={fetchDataBySister}
      getItemConfig={getItemConfig}
      renderItemContent={renderItemContent}
      calculateStats={calculateStats}
      emptyMessage="Chưa có hồ sơ sứ vụ"
      emptyDescription="Nữ tu này chưa có thông tin sứ vụ nào được ghi nhận."
    />
  );
};

export default MissionTimelinePage;
