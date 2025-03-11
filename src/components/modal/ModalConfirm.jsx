"use client";
import { Modal } from "antd";
import React from "react";
import styles from "./styles.module.scss";

function ModalConfirm(props) {
  const { isOpen, handleOk, handleCancel, title, children, loading } = props;
  return (
    <Modal
      title={title}
      visible={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.modalCustom}
      closable={false}
      cancelText={"Cancel"}
      okText={"OK"}
      confirmLoading={loading}
    >
      {!!children && children}
    </Modal>
  );
}

export default ModalConfirm;