// src/hooks/useToast.js

import { useCallback } from "react";
import { toast } from "react-toastify";

const useToast = () => {
  /**
   * Show success toast
   */
  const success = useCallback((message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  /**
   * Show error toast
   */
  const error = useCallback((message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  /**
   * Show warning toast
   */
  const warning = useCallback((message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  /**
   * Show info toast
   */
  const info = useCallback((message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  /**
   * Show promise toast
   */
  const promise = useCallback((promiseFunc, messages = {}) => {
    return toast.promise(promiseFunc, {
      pending: messages.pending || "Đang xử lý...",
      success: messages.success || "Thành công!",
      error: messages.error || "Có lỗi xảy ra!",
    });
  }, []);

  /**
   * Dismiss all toasts
   */
  const dismiss = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    promise,
    dismiss,
  };
};

export default useToast;
