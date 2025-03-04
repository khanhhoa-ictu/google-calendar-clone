import { Button, Input } from 'antd';
import React from 'react';
import styles from './styles.module.scss';
import lock from '../../../assets/forgot-password/lock.png';
import { useNavigate } from 'react-router';



function Request(props) {
  const { handleRequest, email, handleChangeEmail } = props;
  const navigate = useNavigate()
  return (
    <div className={styles.forgotContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={lock} alt="" />
        </div>
      </div>

      <h3>Bạn gặp sự cố khi đăng nhập?</h3>
      <p>Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã xác minh để truy cập lại tài khoản</p>
      <Input
        type="email"
        value={email}
        onChange={(e) => handleChangeEmail(e.target.value)}
        placeholder="email"
        className={styles.inputCustom}
      />
      <Button type='primary' onClick={() => handleRequest()} className={styles.submit}>
        Gửi mã xác nhận
      </Button>
      <div className={styles.back} onClick={() => navigate("/login")}>
        <p>Quay lại trang trước</p>
      </div>
    </div>
  );
}

export default Request;