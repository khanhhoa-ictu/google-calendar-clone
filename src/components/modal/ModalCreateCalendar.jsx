import React, { useEffect, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, TimePicker } from "antd";
import styles from "./styles.module.scss";
import moment from "moment";
import dayjs from "dayjs";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
import { deleteEvent, deleteRecurringEvent, getDetailEvent } from "../../service/event";

function ModalCreateCalendar({
  isOpen,
  onClose,
  onOk,
  selectedSlot,
  handleChangeTime,
  mode,
  view,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("none");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [detailEvent, setDetailEven] = useState(null)
  const loadDetailEvent = async () => {
    try {
      const newEvent = await getDetailEvent(selectedSlot?.recurring_id);
      setFrequency(newEvent?.data?.frequency);
      setDetailEven(newEvent?.data)
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setFrequency("none");
    } else {
      setDescription(selectedSlot?.description || "");
      setTitle(selectedSlot?.title || "");
      if (selectedSlot?.recurring_id) {
        loadDetailEvent();
      }
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
    if (!time) return;
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
      return;
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
    if (detailEvent?.frequency !== "none") {
      setIsOpenModal(true);
      return;
    }
    deleteOnlyEvent();
  };

  const handleChangeRepeat = (value) => {
    setFrequency(value);
  };


  const deleteOnlyEvent = async () => {
    try {
      await deleteEvent(selectedSlot?.id);
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      onClose(false);
      setIsOpenModal(false)
    }
  };

  const deleteListEvent = async() =>{
    try {
      await deleteRecurringEvent(selectedSlot?.recurring_id)
    } catch (error) {
      handleErrorMessage(error)
    }finally {
      onClose(false);
      setIsOpenModal(false)
    }
  }

  return (
    <div>
      <Modal
        title={
          <div className={styles.modalTitle}>
            {mode === STATUS_EVENT.UPDATE
              ? "Cập nhật sự kiện"
              : "tạo mới sự kiện"}
          </div>
        }
        open={isOpen}
        onOk={() => onOk(title, description, frequency, mode)}
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
          <Select
            className="!h-[40px]"
            value={frequency}
            onChange={handleChangeRepeat}
            options={[
              { value: "none", label: "không lặp" },
              { value: "daily", label: "lặp lại mỗi ngày" },
              { value: "weekly", label: "lặp lại mỗi tuần" },
              { value: "monthly", label: "lặp lại mỗi tháng" },
            ]}
          />

          <div className={styles.dateTimeContainer}>
            <DatePicker
              onChange={onChangeDate}
              value={dayjs(selectedSlot?.start_time) || null}
              size="large"
              placeholder="Select date"
            />
            {view !== "month" && (
              <div className="flex gap-3">
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
            )}
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

      <Modal
        title="Xoá sự kiện"
        open={isOpenModal}
        onOk={null}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
        centered
        className="delete-event-modal"
      >
        <div className="!p-6">
          <p className="!py-6">Bạn có muốn xoá tất cả chuỗi sự kiện này không?</p>
          <div className="modal-buttons flex justify-between">
            <Button 
              onClick={deleteOnlyEvent}
              className="btn-cancel "
              size="large"
            >
              Chỉ xoá sự kiện này
            </Button>
            <Button 
              onClick={deleteListEvent}
              type="primary"
              danger
              size="large"
            >
              Xoá chuỗi sự kiện này
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalCreateCalendar;
