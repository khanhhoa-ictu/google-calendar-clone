import React, { useState } from "react";
import Request from "./component/Request";
import Verify from "./component/Verify";
import styles from "./styles.module.scss";
import { STATUS_FORGOT_PASSWORD } from "../../helper/constants";
import { handleErrorMessage } from "../../helper";
import { Spin } from "antd";
import { requestPassword } from "../../service/authentication";
import ResetPassword from "./component/ResetPassword";

function ForgotPassWord() {
  const [statusForgot, setStatusForgot] = useState(
    STATUS_FORGOT_PASSWORD.REQUEST
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRequest = async () => {
    const newEmail = {
      email,
    };
    try {
      setLoading(true);
      await requestPassword(newEmail);
      setStatusForgot(STATUS_FORGOT_PASSWORD.VERIFY);
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.forgotPassword}>
      {statusForgot === STATUS_FORGOT_PASSWORD.REQUEST ? (
        <Request
          email={email}
          handleRequest={handleRequest}
          handleChangeEmail={(value) => setEmail(value)}
        />
      ) : statusForgot === STATUS_FORGOT_PASSWORD.VERIFY ? (
        <Verify
          email={email}
          handleVerify={() => setStatusForgot("")}
          handleLoading={(value) => setLoading(value)}
        />
      ) : (
        <ResetPassword email={email} />
      )}
    </div>
  );
}

export default ForgotPassWord;
