import React, { useEffect, useState } from "react";
import { Button, DatePicker, Input, Modal, TimePicker } from "antd";
import styles from "./styles.module.scss";
import moment from "moment";
import dayjs from "dayjs";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
import { deleteEvent } from "../../service/event";

function ModalCreateCalendar({
  isOpen,
  onClose,
  onOk,
  selectedSlot,
  handleChangeTime,
  mode,
  view
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
    } else {
      setDescription(selectedSlot?.description || "");
      setTitle(selectedSlot?.title || "");
    }
  }, [isOpen]);

  const onChangeStartTime = (time) => {
    const newDate = moment(selectedSlot?.start_time)
      .startOf("day")
      .add(time.hour(), "hours")
      .add(time.minute(), "minutes");
    handleChangeTime({ ...selectedSlot, start_time: new Date(newDate) });
  };

  const onChangeEndTime = (time) => {
    if (!time) return
    const newDate = moment(selectedSlot?.start_time)
      .startOf("day")
      .add(time?.hour(), "hours")
      .add(time?.minute(), "minutes");
    handleChangeTime({ ...selectedSlot, end_time: new Date(newDate) });
  };

  const onChangeDate = (date) => {
    const startTime = moment(selectedSlot.start_time);
    const endTime = moment(selectedSlot.end_time);

    if (view === "month") {
      handleChangeTime({
        ...selectedSlot,
        start_time: new Date(moment(date.toString())),
        end_time: new Date(moment(date.toString()).endOf("day")),
      });
      return
    }

    const newStartTime = moment(date.toString())
      .startOf("day")
      .add(startTime.hour(), "hours")
      .add(startTime.minute(), "minutes");

    const newEndTime = moment(date.toString())
      .startOf("day")
      .add(endTime.hour(), "hours")
      .add(endTime.minute(), "minutes");

    handleChangeTime({
      ...selectedSlot,
      start_time: new Date(newStartTime),
      end_time: new Date(newEndTime),
    });
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedSlot?.id)
    } catch (error) {
      handleErrorMessage(error)
    } finally {
      onClose(false)
    }
  };

  return (
    <div>
      <Modal
        title={
          <div className={styles.modalTitle}>
            {mode === STATUS_EVENT.UPDATE ? 'Cập nhật sự kiện' : 'tạo mới sự kiện'}
          </div>
        }
        open={isOpen}
        onOk={() => onOk(title, description, mode)}
        onCancel={() => onClose(false)}
        width={520}
        centered
      >
        <div className={styles.modalCreateCalendar}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="nhập tiêu đề"
            size="large"
          />
          <div className={styles.dateTimeContainer}>
            <DatePicker
              onChange={onChangeDate}
              value={dayjs(selectedSlot?.start_time) || null}
              size="large"
              placeholder="Select date"

            />
            {
              view !== "month" && <div className="flex gap-3" >
                <TimePicker
                  minuteStep={15}
                  format="HH:mm"
                  onChange={onChangeStartTime}
                  value={dayjs(selectedSlot?.start_time) || null}
                  size="large"
                  placeholder="Thời gian bắt đầu"
                />
                <TimePicker
                  minuteStep={15}
                  format="HH:mm"
                  onChange={onChangeEndTime}
                  value={dayjs(selectedSlot?.end_time) || null}
                  size="large"
                  placeholder="Thời gian kết thúc"
                />
              </div>
            }

          </div>
          <Input.TextArea
            placeholder="Nhập mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          {mode === STATUS_EVENT.UPDATE && (
            <Button className={styles.btnDelete} onClick={handleDeleteEvent}>
              Xoá
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ModalCreateCalendar;
