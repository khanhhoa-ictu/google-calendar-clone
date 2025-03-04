import { Button, Input } from 'antd';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import lock from '../../../assets/forgot-password/lock.png';
import { useNavigate } from 'react-router';
import { handleErrorMessage } from '../../../helper';
import { verifyPassword } from '../../../service/authentication';


function Verify({ handleVerify, email, handleLoading }) {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate()
  const handleSubmit = async () => {
    const newEmail = {
      otp,
      email,
    };

    try {
      handleLoading(true);
      await verifyPassword(newEmail);
      setOTP('');
      handleVerify();
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      handleLoading(false);
    }
  };
  return (
    <div className={styles.forgotContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={lock} alt="" />
        </div>
      </div>
      <h3>Quên mật khẩu</h3>
      <p>Nhập mã OTP</p>
      <p>Chúng tôi đã gửi đến gmail của bạn một mã OPT hãy kiểm tra hom thư đến hoặc (thư mục spam)</p>
      <Input
        type="email"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        placeholder="nhập mã OTP"
        className={styles.inputCustom}
        maxLength={50}
      />
      <Button onClick={handleSubmit} className={styles.submit}>
        Gửi mã
      </Button>
      <div className={styles.back} onClick={() => navigate('/login')}>
        <p>Hủy</p>
      </div>
    </div>
  );
}

export default Verify;