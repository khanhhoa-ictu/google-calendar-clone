import { Button, Card, Form, Input, message, Row } from "antd";
import { login } from "../../service/authentication";
import logoLogin from "../../assets/login/login-1.svg";
import Cookies from "js-cookie";
import { handleErrorMessage, isValidEmail } from "../../helper";
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "./styles.module.scss";

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = !!Cookies.get("token");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (payload) => {
    const params = {
      email: payload.email,
      password: payload.password,
    };

    try {
      const data = await login(params);
      const { token } = data;
      Cookies.set("token", token);

      navigate("/");
    } catch (error) {
      console.log(error);
      handleErrorMessage(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.wrapperLogin}>
        <div className={styles.formContainer}>
          <Card className={styles.loginForm}>
            <Row justify="center" className={styles.formTitle}>
              <h3 className="font-bold !text-2xl !lg:text-[32px] uppercase gradient-text">
                My Calendar
              </h3>
            </Row>
            <Form onFinish={handleSubmit} className={styles.formContainerItem}>
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
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className={styles.customInputLogin}
                  placeholder="Email"
                  maxLength={50}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password không được để trống" },
                ]}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  className={styles.customInputLogin}
                  placeholder="Mật khẩu"
                  maxLength={50}
                />
              </Form.Item>
              <Form.Item labelCol={{ span: 24 }}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className={styles.btnLogin}
                >
                  {"Đăng nhập"}
                </Button>
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                className={styles.forgotPassword}
              >
                <NavLink to="/forgot-password">Quên mật khẩu</NavLink>
              </Form.Item>
            </Form>
          </Card>

          <Card className={styles.signUp}>
            <Row justify="center" className={styles.formTitle}>
              <h3>
                Nếu chưa có tài khoản vui lòng{" "}
                <NavLink to="/register">đăng ký</NavLink>
              </h3>
            </Row>
          </Card>
        </div>

        <div className={styles.rightDriver}>
          <svg
            preserveAspectRatio="none"
            width="102px"
            height="1080px"
            viewBox="0 0 102 1080"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g stroke="none" strokeWidth="1" fillRule="evenodd">
              <g fillRule="nonzero">
                <g transform="translate(51.000000, 540.000000) rotate(90.000000) translate(-51.000000, -540.000000) translate(-489.000000, 489.000000)">
                  <g transform="translate(540.000000, 51.000000) rotate(180.000000) translate(-540.000000, -51.000000) ">
                    <path
                      d="M0,7.9621684 C164.947265,47.9621684 344.947265,54.6288351 540,27.9621684 C735.052736,1.2955018 915.052736,14.6288351 1080,67.9621684 L1080,102 L0,102 L0,7.9621684 Z"
                      fillOpacity="0.457"
                    ></path>
                    <path
                      d="M0,37.9621684 C169.028912,88.578393 349.028912,88.578393 540,37.9621684 C730.97109,-12.6540561 910.97109,-12.6540561 1080,37.9621684 L1080,102 L0,102 L0,37.9621684 Z"
                      transform="translate(540.000000, 51.000000) scale(-1, 1) translate(-540.000000, -51.000000) "
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className={styles.wrapperImage}>
        <img src={logoLogin} alt="" />
      </div>
    </div>
  );
}
