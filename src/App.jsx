import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import vi_VN from "antd/lib/locale/vi_VN";
import moment from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import "./App.css";
import ForgotPassWord from "./page/forgot-password";
import HomePage from "./page/home";
import LoginPage from "./page/login";
import Manager from './page/manager';
import Register from "./page/register";
import useProfile from "./hook/useProfile";

moment.locale("vi");
function App() {
  const {profile} = useProfile();
  return (
    <ConfigProvider locale={vi_VN}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage profile={profile} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassWord />} />
          <Route path="/manager" element={<Manager profile={profile} />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
