import React, { useEffect, useState } from "react";
import { Button, DatePicker, notification, Select, Space } from "antd"; // Dùng Ant Design cho đẹp (hoặc dùng button thường)
import styles from "./styles.module.scss";
import iconDatePicker from "../../assets/icon/Date.svg";
import ArrowRightOutlined from "../../assets/icon/arrow-right.svg";
import ArrowLeftOutlined from "../../assets/icon/arrow-left.svg";
import iconPrevDay from "../../assets/icon/prev-day.svg";
import iconNextDay from "../../assets/icon/next-day.svg";
import { handleErrorMessage } from "../../helper/index";
import classNames from "classnames";
import dayjs from "dayjs";
import { checkSyncToGoogle, syncGoogleCalendar } from "../../service/event";
import { useLocation } from "react-router";

function CustomToolbar({
  onNavigate,
  onView,
  date,
  setViewMode,
  viewMode,
  profile,
  myEventsList,
  handleLoadCalendar,
  handleVote,
}) {
  const [isSync, setIsSync] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isMeetingPage = location.pathname === "/meeting";
  const handleChangeView = (value) => {
    setViewMode(value);
  };

  const handlePrevDay = () => {
    onNavigate("PREV");
  };

  const handleNextDay = () => {
    onNavigate("NEXT");
  };

  const handleToDay = () => {
    onNavigate("TODAY");
  };

  const handleChangeDate = (date) => {
    if (!date) return;
    onNavigate("DATE", new Date(date));
  };

  const handleSyncToGoogleCalendar = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (accessToken) {
        await syncGoogleCalendar({
          userId: profile?.id,
          accessToken: accessToken,
        });
        setTimeout(() => {
          handleCheckSync();
          notification.success({
            message: "đồng bộ lên google calendar thành công",
          });
          setLoading(false);
        }, 2000);
      } else {
        window.location.href = `http://localhost:8080/google/auth/${profile?.id}`;
      }
    } catch (error) {
      setLoading(false);
      handleErrorMessage(error);
    }
  };
  const handleCheckSync = async () => {
    try {
      const sync = await checkSyncToGoogle(profile?.id);
      setIsSync(!!sync?.data?.length);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      handleCheckSync();
    }
  }, [profile?.id, myEventsList]);

  return (
    <div className={styles.headerWrapper}>
      <Space>
        <DatePicker
          suffixIcon={<img src={iconDatePicker} alt="" />}
          value={dayjs(date)}
          onChange={handleChangeDate}
          format={"DD-MM-YYYY"}
          superNextIcon={null}
          superPrevIcon={null}
          className={classNames("dateCustom", styles.datePickerHeader)}
          nextIcon={
            <img
              src={ArrowRightOutlined}
              alt=""
              className={classNames(styles.dateAction, styles.dateActionRight)}
            />
          }
          prevIcon={
            <img
              src={ArrowLeftOutlined}
              alt=""
              className={classNames(styles.dateAction, styles.dateActionLeft)}
            />
          }
          dropdownClassName={styles.dropDownDatePicker}
        />
        <Space size={22} className={styles.menuLeft}>
          <Button
            onClick={handleToDay}
            className={classNames(
              styles.btnToday,
              "border-radius-4 text-[#3b65e2]"
            )}
          >
            Hôm nay
          </Button>
          <div className="flex-align-center">
            <div className="flex">
              <img
                src={iconPrevDay}
                onClick={handlePrevDay}
                className={classNames(styles.iconAction, "text-[#333]")}
                alt="icon"
              />
              <img
                src={iconNextDay}
                onClick={handleNextDay}
                className={classNames(styles.iconAction, "text-[#333]")}
                alt="icon"
              />
            </div>
          </div>
        </Space>
      </Space>

      <div className="flex gap-2 items-center min-w-[370px] justify-end">
        <Button
          onClick={handleVote}
          disabled={!isMeetingPage}
          className="!h-[40px]"
        >
          Tạo vote
        </Button>
        <Button
          disabled={!isSync}
          loading={loading}
          className="!h-[40px]"
          onClick={handleSyncToGoogleCalendar}
        >
          Đồng bộ lên google calendar
        </Button>

        <div>
          <Select
            onChange={handleChangeView}
            value={viewMode}
            className="min-w-[100px] !h-[40px]"
          >
            <Select.Option value={"month"}>Tháng</Select.Option>
            <Select.Option value={"week"}>Tuần</Select.Option>
            <Select.Option value={"day"}>Ngày</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CustomToolbar;
