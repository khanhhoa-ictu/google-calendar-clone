import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import events from "../../resources/event";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { v4 } from "uuid";
import ModalCreateCalendar from "../modal/ModalCreateCalendar";
import viMessages from "../../language/viMessages";
import CustomToolbar from "../custom-toolbar";
import styles from "./styles.module.scss";
import {
  addEvent,
  getListCalendar,
  updateEvent,
  updateRecurringEvent,
} from "../../service/event";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
import useProfile from "../../hook/useProfile";
import { notification } from "antd";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
function DnDResource() {
  const { profile } = useProfile();
  const [myEventsList, setMyEventsList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mode, setMode] = useState(STATUS_EVENT.ADD);
  const [viewMode, setViewMode] = useState("week");

  const moveEvent = async ({ event, start, end }) => {
    const params = {
      user_id: profile.id,
      title: event?.title,
      description: event?.description,
      start_time: moment(start).format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment(end).format("YYYY-MM-DD HH:mm:ss"),
      id: event?.id,
    };

    try {
      const newEvent = await updateEvent(params);
      const indexTitle = myEventsList.findIndex(
        (item) => item.id === event?.id
      );
      if (indexTitle >= 0) {
        const cloneMyEventList = [...myEventsList];
        cloneMyEventList[indexTitle] = {
          ...newEvent?.data,
          start_time: new Date(start),
          end_time: new Date(end),
        };
        setMyEventsList(cloneMyEventList);
      }
      setSelectedSlot(null);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleSelectSlot = async (value) => {
    const defaultTitle = {
      start_time: value.start,
      end_time: value.end,
      title: "",
      id: v4(),
    };
    setSelectedSlot(defaultTitle);
    setMyEventsList([...myEventsList, defaultTitle]);
    setIsOpenModal(true);
  };

  const handleCreateNewEvent = async (title, description, frequency, mode) => {
    if (!title) {
      notification.error({ message: "vui lòng nhập tiêu đề" });
      return;
    }
    const params = {
      user_id: profile?.id,
      title: title,
      description: description,
      start_time: moment(selectedSlot.start_time).format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment(selectedSlot.end_time).format("YYYY-MM-DD HH:mm:ss"),
      frequency,
    };

    try {
      if (mode === STATUS_EVENT.UPDATE) {
        await updateRecurringEvent(selectedSlot?.recurring_id, {
          ...params,
          id: selectedSlot.id,
        });
      
      } else {
        await addEvent(params);
      }
      handleLoadCalendar();
      setSelectedSlot(null);
      setMode(STATUS_EVENT.ADD);
      setIsOpenModal(false);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleCloseModal = () => {
    handleLoadCalendar();
    setIsOpenModal(false);
    setSelectedSlot(null);
    setMode(STATUS_EVENT.ADD);
  };

  const handleChangeTime = (value) => {
    const index = myEventsList.findIndex((item) => item.id === value.id);
    if (index === -1) {
      return;
    }
    const cloneMyEventList = [...myEventsList];
    cloneMyEventList[index] = value;

    setSelectedSlot(value);
    setMyEventsList(cloneMyEventList);
  };

  const handleViewDetail = (event) => {
    setSelectedSlot(event);
    setMode(STATUS_EVENT.UPDATE);
    setIsOpenModal(true);
  };

  const handleLoadCalendar = async () => {
    try {
      const dataCalendar = await getListCalendar(profile?.id);
      const convertDataCalendar = dataCalendar?.data?.map((item) => ({
        ...item,
        start_time: new Date(item.start_time),
        end_time: new Date(item.end_time),
      }));
      setMyEventsList(convertDataCalendar);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      handleLoadCalendar();
    }
  }, [profile?.id]);

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
          onEventDrop={moveEvent}
          resizable={false}
          selectable
          showMultiDayTimes={true}
          onSelectSlot={handleSelectSlot}
          view={viewMode}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                setViewMode={setViewMode}
                viewMode={viewMode}
              />
            ),
          }}
          onSelectEvent={handleViewDetail}
        />
      </DndProvider>
      <ModalCreateCalendar
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onOk={handleCreateNewEvent}
        selectedSlot={selectedSlot}
        handleChangeTime={handleChangeTime}
        mode={mode}
        view={viewMode}
      />
    </div>
  );
}

export default DnDResource;
