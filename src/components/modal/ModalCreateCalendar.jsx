import { Button, DatePicker, Input, Modal, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
import {
  changeStatusEventShare,
  changeStatusEventShareRecurring,
  checkSyncToGoogle,
  deleteEvent,
  deleteRecurringEvent,
  getDetailEvent,
} from "../../service/event";
import { getListEmail } from "../../service/user";
import styles from "./styles.module.scss";

function ModalCreateCalendar({
  isOpen,
  onClose,
  onOk,
  selectedSlot,
  handleChangeTime,
  mode,
  view,
}) {
  const { profile } = useProfile();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("none");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const [isOpenModalResponse, setIsOpenModalResponse] = useState(false);
  const [detailEvent, setDetailEven] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isSync, setIsSync] = useState(false);
  const [emailSelect, setEmailSelect] = useState([]);
  const [statusResponse, setStatusResponse] = useState("");
  const loadDetailEvent = async () => {
    try {
      const newEvent = await getDetailEvent(selectedSlot?.id);
      setEmailSelect(newEvent.data?.share_email || []);
      setFrequency(newEvent?.data?.frequency);
      setDetailEven(newEvent?.data);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setFrequency("none");
      setDetailEven(null);
      setEmailSelect([]);
      setEmails([]);
    } else {
      setDescription(selectedSlot?.description || "");
      setTitle(selectedSlot?.title || "");
      if (selectedSlot?.recurring_id) {
        loadDetailEvent();
      }
      handleCheckSync();
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

  const handleUpdateEvent = async () => {
    if (
      detailEvent?.frequency &&
      detailEvent?.frequency !== "none" &&
      frequency !== "none"
    ) {
      setIsOpenModalUpdate(true);
      return;
    }
    if (
      detailEvent?.frequency &&
      detailEvent?.frequency !== "none" &&
      frequency === "none"
    ) {
      onOk(title, description, frequency, mode, emailSelect);
      return;
    }
    if (
      detailEvent?.frequency &&
      detailEvent?.frequency === "none" &&
      frequency !== "none"
    ) {
      onOk(title, description, frequency, mode, emailSelect);
      return;
    }
    onOk(
      title,
      description,
      frequency,
      mode,
      emailSelect,
      detailEvent?.frequency
    );
  };

  const handleChangeRepeat = (value) => {
    setFrequency(value);
  };

  const deleteOnlyEvent = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await deleteEvent({ eventId: selectedSlot?.id, accessToken });
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      onClose(false);
      setIsOpenModal(false);
    }
  };

  const deleteListEvent = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await deleteRecurringEvent({ eventId: selectedSlot?.id, accessToken });
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      onClose(false);
      setIsOpenModal(false);
    }
  };

  const handleChange = (values) => {
    setEmailSelect(values);
  };

  const handleCheckSync = async () => {
    try {
      const sync = await checkSyncToGoogle(profile?.id);
      const listEmail = await getListEmail(profile?.id);
      const convertListEmail = listEmail?.users?.map((item) => ({
        label: item.google_email,
        value: item.google_email,
      }));
      setEmails(convertListEmail);
      setIsSync(!!sync?.data?.length);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleResponseEvent = async (status, all = false) => {
    const accessToken = localStorage.getItem("accessToken");
    const params = {
      event_id: selectedSlot?.id,
      email: profile?.google_email,
      response_status: status,
      accessToken,
    };
    try {
      if (all) {
        await changeStatusEventShareRecurring(params);
      } else {
        await changeStatusEventShare(params);
      }
      onClose(false);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleChangeStatusEvent = async (status) => {
    console.log(frequency);
    if (frequency !== "none") {
      setStatusResponse(status);
      setIsOpenModalResponse(true);
      return;
    }
    handleResponseEvent(status);
  };
  const getStyle = () => {
    const userEmail = profile.google_email;

    // tìm status của user đó
    const attendee = selectedSlot.attendees?.find((a) => a.email === userEmail);

    const status = attendee?.response_status;
    console.log(status);

    return (
      <div className="flex justify-between">
        <p>Tham dự: </p>
        <div className="flex gap-3">
          <button
            className={`${status === "accepted" && "!bg-blue-300"}`}
            onClick={() => handleChangeStatusEvent("accepted")}
          >
            Có
          </button>
          <button
            className={`${status === "declined" && "!bg-blue-300"}`}
            onClick={() => handleChangeStatusEvent("declined")}
          >
            Không
          </button>
        </div>
      </div>
    );
  };

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
        onOk={() => handleUpdateEvent()}
        onCancel={() => onClose(false)}
        width={520}
        centered
        okButtonProps={{ disabled: selectedSlot?.can_edit === false }}
      >
        <div className={styles.modalCreateCalendar}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="nhập tiêu đề"
            size="large"
            disabled={selectedSlot?.can_edit === false}
          />
          <Select
            className="!h-[40px]"
            value={frequency}
            onChange={handleChangeRepeat}
            disabled={selectedSlot?.can_edit === false}
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
              disabled={selectedSlot?.can_edit === false}
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
                  disabled={selectedSlot?.can_edit === false}
                />
                <TimePicker
                  minuteStep={15}
                  format="HH:mm"
                  onChange={onChangeEndTime}
                  value={dayjs(selectedSlot?.end_time) || null}
                  size="large"
                  placeholder="Thời gian kết thúc"
                  disabled={selectedSlot?.can_edit === false}
                />
              </div>
            )}
          </div>
          <div>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="chọn email để chia sẻ"
              onChange={handleChange}
              options={emails}
              value={emailSelect}
              disabled={isSync || selectedSlot?.can_edit === false}
            />
          </div>
          <Input.TextArea
            placeholder="Nhập mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={selectedSlot?.can_edit === false}
          />
          {selectedSlot?.can_edit === false && getStyle()}
          {mode === STATUS_EVENT.UPDATE && (
            <Button
              className={styles.btnDelete}
              onClick={handleDeleteEvent}
              disabled={selectedSlot?.can_edit === false}
            >
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
          <p className="!py-6">
            Bạn có muốn xoá tất cả chuỗi sự kiện này không?
          </p>
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

      <Modal
        title="Cập nhật sự kiện"
        open={isOpenModalUpdate}
        onOk={null}
        onCancel={() => setIsOpenModalUpdate(false)}
        footer={null}
        centered
        className="delete-event-modal"
      >
        <div className="!p-6">
          <p className="!py-6">
            Bạn có muốn cập nhật tất cả chuỗi sự kiện này không?
          </p>
          <div className="modal-buttons flex justify-between">
            <Button
              onClick={() => {
                onOk(
                  title,
                  description,
                  frequency,
                  mode,
                  detailEvent?.frequency
                );
                setIsOpenModalUpdate(false);
              }}
              className="btn-cancel"
              size="large"
            >
              Cập nhật sự kiện này
            </Button>
            <Button
              onClick={() => {
                onOk(title, description, frequency, mode, emailSelect);
                setIsOpenModalUpdate(false);
              }}
              type="primary"
              size="large"
            >
              Cập nhật chuỗi sự kiện
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Phản hồi sự kiện"
        open={isOpenModalResponse}
        onOk={null}
        onCancel={() => setIsOpenModalResponse(false)}
        footer={null}
        centered
        className="delete-event-modal"
      >
        <div className="!p-6">
          <p className="!py-6">
            Bạn có muốn tham gia tất cả sự kiện trong chuỗi này không?
          </p>
          <div className="modal-buttons flex justify-between">
            <Button
              onClick={() => {
                handleResponseEvent(statusResponse);
                setIsOpenModalResponse(false);
              }}
              className="btn-cancel"
              size="large"
            >
              Chỉ sự kiện này
            </Button>
            <Button
              onClick={() => {
                handleResponseEvent(statusResponse, true);
                setIsOpenModalResponse(false);
              }}
              type="primary"
              size="large"
            >
              Sụ kiện này và các sự kiện tiếp theo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalCreateCalendar;
