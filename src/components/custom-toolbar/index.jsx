import React from "react";
import { Button, DatePicker, Select, Space } from "antd"; // Dùng Ant Design cho đẹp (hoặc dùng button thường)
import styles from "./styles.module.scss";
import iconDatePicker from "../../assets/icon/Date.svg";
import ArrowRightOutlined from "../../assets/icon/arrow-right.svg";
import ArrowLeftOutlined from "../../assets/icon/arrow-left.svg";
import iconPrevDay from "../../assets/icon/prev-day.svg";
import iconNextDay from "../../assets/icon/next-day.svg";

import classNames from "classnames";

function CustomToolbar({ label, onNavigate, onView }) {
  const handleChangeView = (value) => {
    onView(value);
  };

  const handlePrevDay = () =>{
    onNavigate("PREV")
  }

  const handleNextDay = () =>{
    onNavigate("NEXT")
  }

  const handleToDay = () =>{
    onNavigate("TODAY")
  }

  return (
    <div className={styles.headerWrapper}>
      <Space>
        <DatePicker
          suffixIcon={<img src={iconDatePicker} alt="" />}
          //   value={moment(data.date)}
          //   onChange={handleChangeDate}
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

      {/* <div>
      <Button onClick={() => onNavigate("PREV")}>⬅ Trước</Button>
      <Button onClick={() => onNavigate("TODAY")}>📆 Hôm nay</Button>
      <Button onClick={() => onNavigate("NEXT")}>Tiếp ➡</Button>
    </div> */}
      <div className="flex gap-2 items-center" >
        <h3 className="!mb-0" >{label}</h3>

        <div>
          <Select onChange={handleChangeView} defaultValue="week">
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
