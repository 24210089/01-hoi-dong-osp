// src/components/forms/MultiFileUpload.jsx

import React, { useState, useRef } from "react";
import { Button, ListGroup, Badge, ProgressBar } from "react-bootstrap";
import PropTypes from "prop-types";

const MultiFileUpload = ({
  value = [],
  onChange,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const files = Array.isArray(value) ? value : [];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      pdf: "fa-file-pdf text-danger",
      doc: "fa-file-word text-primary",
      docx: "fa-file-word text-primary",
      xls: "fa-file-excel text-success",
      xlsx: "fa-file-excel text-success",
      ppt: "fa-file-powerpoint text-warning",
      pptx: "fa-file-powerpoint text-warning",
      jpg: "fa-file-image text-info",
      jpeg: "fa-file-image text-info",
      png: "fa-file-image text-info",
      gif: "fa-file-image text-info",
      zip: "fa-file-archive text-secondary",
      rar: "fa-file-archive text-secondary",
      txt: "fa-file-alt text-muted",
    };
    return icons[ext] || "fa-file text-muted";
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError("");

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Chỉ được upload tối đa ${maxFiles} file`);
      return;
    }

    const validFiles = [];
    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" vượt quá kích thước cho phép (${formatFileSize(maxSize)})`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const uploadedFiles = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append("file", file);

        // For now, create a local URL (in production, this would upload to server)
        const fileUrl = URL.createObjectURL(file);
        
        uploadedFiles.push({
          id: Date.now() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploadedAt: new Date().toISOString(),
        });

        setUploadProgress(((i + 1) / validFiles.length) * 100);
      }

      onChange([...files, ...uploadedFiles]);
    } catch (err) {
      setError("Có lỗi xảy ra khi upload file");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (fileId) => {
    const newFiles = files.filter((f) => f.id !== fileId);
    onChange(newFiles);
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="multi-file-upload">
      {/* Upload Button */}
      <div className="mb-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || uploading || files.length >= maxFiles}
          style={{ display: "none" }}
          id="multi-file-input"
        />
        <Button
          variant="outline-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading || files.length >= maxFiles}
        >
          <i className="fas fa-upload me-2"></i>
          Chọn file để upload
        </Button>
        <small className="text-muted ms-3">
          Tối đa {maxFiles} file, mỗi file không quá {formatFileSize(maxSize)}
        </small>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-3">
          <ProgressBar now={uploadProgress} label={`${Math.round(uploadProgress)}%`} animated />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger py-2 mb-3">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ListGroup>
          {files.map((file) => (
            <ListGroup.Item
              key={file.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <i className={`fas ${getFileIcon(file.name)} me-3 fa-lg`}></i>
                <div>
                  <div className="fw-medium">{file.name}</div>
                  <small className="text-muted">
                    {formatFileSize(file.size)}
                    {file.uploadedAt && (
                      <span className="ms-2">
                        • {new Date(file.uploadedAt).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  title="Tải xuống"
                >
                  <i className="fas fa-download"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveFile(file.id)}
                  disabled={disabled}
                  title="Xóa"
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Empty State */}
      {files.length === 0 && !uploading && (
        <div className="text-center text-muted py-4 border rounded bg-light">
          <i className="fas fa-folder-open fa-3x mb-3 opacity-50"></i>
          <p className="mb-0">Chưa có tài liệu nào được upload</p>
        </div>
      )}

      {/* File Count */}
      {files.length > 0 && (
        <div className="mt-2 text-end">
          <Badge bg="secondary">
            {files.length}/{maxFiles} file
          </Badge>
        </div>
      )}
    </div>
  );
};

MultiFileUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  disabled: PropTypes.bool,
};

export default MultiFileUpload;
