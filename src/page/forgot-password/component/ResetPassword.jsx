import { Button, Form, Input, message } from 'antd';
import React from 'react';
import {useNavigate } from 'react-router';
import styles from './styles.module.scss';
import lock from '../../../assets/forgot-password/lock.png';
import { forgotPassWord } from '../../../service/authentication';
import { handleErrorMessage } from '../../../helper';


function ResetPassword({ email }) {
  const navigate = useNavigate()
  const handleSubmit = async (payload) => {
    const password = {
      newPassword: payload.newPassword,
      email: email,
    };
    try {
      await forgotPassWord(password);
      message.success("thay đổi mật khẩu thành công")
      navigate('/login');
    } catch (error) {
      handleErrorMessage(error);
    }
  };
  return (
    <div className={styles.forgotContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={lock} alt="" />
        </div>
      </div>
      <h3>Tạo mật khẩu mới</h3>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
            },
          ]}
          wrapperCol={{ span: 24 }}
        >
          <Input type="password" placeholder="New password" className={styles.inputCustom} maxLength={50} />
        </Form.Item>

        <Form.Item
          name="confirm"
          rules={[
            {
              required: true,
            },
          ]}
          wrapperCol={{ span: 24 }}
        >
          <Input type="password" placeholder="Confirm password" className={styles.inputCustom} maxLength={50} />
        </Form.Item>
        <Button htmlType="submit" className={styles.submit}>
          Gửi
        </Button>
      </Form>
      <div className={styles.back} onClick={() => navigate('/login')}>
        <p>Hủy</p>
      </div>
    </div>
  );
}

export default ResetPassword;