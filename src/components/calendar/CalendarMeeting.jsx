import { Button, Input, Modal, notification } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 } from "uuid";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
import {
  addEvent,
  getDetailEvent,
  getListCalendar,
  updateEvent,
  updateRecurringEvent,
} from "../../service/event";
import { createPoll } from "../../service/meeting";
import CustomToolbar from "../custom-toolbar";
import ModalCreateCalendar from "../modal/ModalCreateCalendar";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarMeeting({ profile }) {
  const [myEventsList, setMyEventsList] = useState([]);
  const [viewMode, setViewMode] = useState("week");
  const [modalVote, setModalVote] = useState(false);
  const [vote, setVote] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleSelectSlot = async (value) => {
    const now = new Date();
    if (value.start < now) {
      notification.warning({ message: "Không thể tạo sự kiện trong quá khứ" });
      return;
    }
    const defaultTitle = {
      start_time: value.start,
      end_time: value.end,
      title: "",
      id: v4(),
    };
    setMyEventsList([...myEventsList, defaultTitle]);
  };

  const handleVote = async () => {
    const convertVote = myEventsList.map((item) => ({
      start_time: moment(item?.start_time).format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment(item?.end_time).format("YYYY-MM-DD HH:mm:ss"),
    }));
    const params = {
      title: vote.title,
      description: vote.description,
      options: convertVote,
      created_by: profile?.id,
    };
    try {
      const response = await createPoll(params);
      setMyEventsList([]);
      navigate(`/meeting/${response.pollId}`);
    } catch (error) {
      handleErrorMessage(error);
    }
    console.log(convertVote);
  };

  return (
    <div className={styles.calendar}>
      <DndProvider backend={HTML5Backend}>
        <DnDCalendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start_time"
          endAccessor="end_time"
          longPressThreshold={500}
          timeslots={4}
          step={30}
          resizable={false}
          selectable
          showMultiDayTimes={true}
          onSelectSlot={handleSelectSlot}
          view={viewMode}
          eventPropGetter={(event) => {
            // userEmail là email của người dùng hiện tại
            const userEmail = profile.google_email;

            const attendee = event.attendees?.find(
              (a) => a.email === userEmail
            );

            const status = attendee?.response_status;

            let backgroundColor = "#3174ad"; // mặc định
            let color = "white";
            if (status === "declined") backgroundColor = "#f44336"; // đỏ
            else if (status === "accepted") backgroundColor = "#3174ad";
            else if (status === "needsAction") {
              color = "#039be5";
              backgroundColor = "white"; // cam
            }

            return {
              style: {
                backgroundColor,
                color: color || "white",
                borderRadius: "5px",
                padding: "2px",
              },
            };
          }}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                setViewMode={setViewMode}
                viewMode={viewMode}
                profile={profile}
                myEventsList={myEventsList}
                handleVote={() => setModalVote(true)}
              />
            ),
          }}
        />
      </DndProvider>

      <Modal
        title="Tạo cuộc họp bỏ phiếu"
        open={modalVote}
        onOk={null}
        onCancel={() => setModalVote(false)}
        footer={null}
        centered
        className="delete-event-modal"
      >
        <div className="!p-6">
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Nhập tiêu đề"
              value={vote.title}
              onChange={(e) => setVote({ ...vote, title: e.target.value })}
            />
            <Input.TextArea
              placeholder="nhập miêu tả"
              value={vote.description}
              onChange={(e) =>
                setVote({ ...vote, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end w-full !mt-6">
            <Button onClick={() => handleVote()} className="!px-6 !h-[40px]">
              Tạo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarMeeting;
