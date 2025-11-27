// src/hooks/useModal.js

import { useState, useCallback } from "react";

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  /**
   * Open modal
   */
  const open = useCallback((data = null) => {
    setIsOpen(true);
    setModalData(data);
  }, []);

  /**
   * Close modal
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  /**
   * Toggle modal
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Update modal data
   */
  const updateData = useCallback((data) => {
    setModalData(data);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle,
    updateData,
  };
};

export default useModal;
