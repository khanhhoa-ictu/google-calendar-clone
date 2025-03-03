import { message } from "antd";

export const handleErrorMessage = (error) => {
    message.destroy();
    message.error(getErrorMessage(error));
 
  };
  
  export const getErrorMessage = (error) => {
    return error?.response?.data?.message || 'Something went wrong!';
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  export const  isValidEmail = (email) => {
    return emailRegex.test(email);
  }