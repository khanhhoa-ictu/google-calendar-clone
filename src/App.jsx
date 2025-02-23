import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";
import "antd/dist/reset.css";
import "moment/locale/vi";
import moment from "moment";
import vi_VN from "antd/lib/locale/vi_VN";
import { ConfigProvider } from "antd";
import HomePage from "./page/home";
import LoginPage from "./page/login";
import { BrowserRouter as Router, Routes, Route } from 'react-router';

moment.locale("vi");
function App() {
  return (
    <ConfigProvider locale={vi_VN}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
