import { Button, Card, Form, Input, message, Row } from 'antd';
import { signUp } from '../../service/authentication';
import { handleErrorMessage, isValidEmail } from '../../helper';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styles from './styles.module.scss';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const isAuthenticated = !!Cookies.get('token');
  if (isAuthenticated) return navigate('/');
  const [form] = Form.useForm();

  const handleSubmit = async (payload) => {
    setLoading(true)
    const params = {
      email: payload.email,
      password: payload.password,
      confirm: payload.confirm
    }
    try {
      await signUp(params);
      message.destroy();
      message.success('Đăng ký thành công');
      navigate('/login');
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false)

    }
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.wrapperSignUp}>
        <div className={styles.signUpForm}>
          <Row justify="center" className={styles.formTitle}>
            <h3 className='font-bold !text-2xl !lg:text-[32px] uppercase gradient-text'>My Calendar</h3>
          </Row>
          <Form onFinish={handleSubmit} className={styles.formContainer} form={form}>
            <Form.Item
              name="email"
              rules={[
                {
                  validator: (_, value) => {
                    if (!isValidEmail(value)) {
                      console.log('zooo')
                      return Promise.reject('Email không hợp lệ');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input className={styles.customInputSignUp} placeholder={'email'} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password className={styles.customInputSignUp} placeholder={'Mật khẩu'} />
            </Form.Item>
            <Form.Item
              name="confirm"
              rules={[
                { required: true, message: 'password không được để trống' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('mật khẩu không trùng khớp'));
                  },
                }),
              ]}
              dependencies={['password']}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password className={styles.customInputSignUp} placeholder={'Xác nhận mật khẩu'} />
            </Form.Item>
              <Button type="primary" className={styles.btnSignUp} loading={loading} htmlType='submit' >
                Đăng ký
              </Button>
            <Form.Item labelCol={{ span: 24 }}>
              <p>
                <NavLink to="/login">Đăng nhập</NavLink>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}