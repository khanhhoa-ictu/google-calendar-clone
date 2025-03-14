import { Button, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { handleErrorMessage, isValidEmail } from "../../../helper";
import { getUserDetail, updateUser } from "../../../service/user";

function EditUser({ isModalVisible, handleCancel, handleOk, id }) {
  const [form] = useForm();

  const handleCancelModal = () => {
    form.resetFields();
    handleCancel();
  };

  const loadDetailUser = async() =>{
    try {
        const user = await getUserDetail(id);
        form.setFieldsValue(user?.data)
    } catch (error) {
        handleErrorMessage(error)
    }
  }

  useEffect(()=>{
    if(id){
        loadDetailUser()
    }
  },[id])

  const handleSubmit = async (payload) => {
    try {
      await updateUser({
        id: id,
        email: payload.email
      });
      notification.success({ message: "cập nhật người dùng thành công" });
      handleCancel();
      form.resetFields();
      handleOk();
    } catch (error) {
      handleErrorMessage(error);
    }
  };
  
  return (
    <Modal
      title="Cập nhật người dùng"
      visible={isModalVisible}
      onOk={() => form.submit()}
      onCancel={handleCancelModal}
      wrapClassName={styles.wrapperModal}
    >
      <Form form={form} onFinish={handleSubmit}>
        <div className={styles.fromItem}>
          <label>Email</label>
          <Form.Item
            name="email"
            rules={[
              {
                validator: (_, value) => {
                  if (!isValidEmail(value)) {
                    return Promise.reject("Email không hợp lệ");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
       
      </Form>
    </Modal>
  );
}

export default EditUser;
