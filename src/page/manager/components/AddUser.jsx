import { Button, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { handleErrorMessage, isValidEmail } from "../../../helper";
import { addUser } from "../../../service/user";

function AddUser({addUserSuccess}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = useForm();

  const handleCancelModal = () => {
    form.resetFields();
    setIsOpenModal(false);
  };

  const handleSubmit = async(payload) =>{
    try {
        await addUser(payload);
        notification.success({message:"thêm người dùng thành công"});
        setIsOpenModal(false);
        form.resetFields();
        addUserSuccess()
    } catch (error) {
        handleErrorMessage(error)
    }
  }

  return (
    <div>
      <div className="text-right">
        <Button type="primary" className="!h-[40px]" onClick={() => setIsOpenModal(true)}>
          Thêm người dùng
        </Button>
      </div>

      <Modal
        title="Thêm người dùng"
        visible={isOpenModal}
        onOk={() => form.submit()}
        onCancel={handleCancelModal}
        wrapClassName={styles.wrapperModal}
      >
        <Form form={form} onFinish={handleSubmit}>
          <div className={styles.fromItem}>
            <label>Email</label>
            <Form.Item name="email"
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
          <div className={styles.fromItem}>
            <label>Password</label>
            <Form.Item name="password"
             rules={[
                { required: true, message: "Password không được để trống" },
              ]}
            >
              <Input type="password" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AddUser;
