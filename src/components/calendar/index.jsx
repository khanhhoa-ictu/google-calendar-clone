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
import { addEvent, getListCalendar, updateEvent } from "../../service/event";
import { handleErrorMessage } from "../../helper";
import { STATUS_EVENT } from "../../helper/constants";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
function DnDResource({ userProfile }) {
  const [myEventsList, setMyEventsList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mode, setMode] = useState(STATUS_EVENT.ADD);
  const { scrollToTime } = useMemo(
    () => ({
      scrollToTime: new Date(1972, 0, 1, 9),
    }),
    []
  );
  const moveEvent = useCallback(({ event, start, end }) => {
    console.log(event);
    console.log(start);
    console.log(end);
    console.log(event?.id);
  }, []);

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

  const handleCreateNewEvent = async (title, description, mode) => {
    const params = {
      user_id: userProfile.id,
      title: title,
      description: description,
      start_time: moment(selectedSlot.start_time).format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment(selectedSlot.end_time).format("YYYY-MM-DD HH:mm:ss"),
    };

    let event = null;
    try {
      if (mode === STATUS_EVENT.UPDATE) {
        event = await updateEvent({
          ...params,
          id: selectedSlot.id,
        });
      } else {
        event = await addEvent(params);
      }
      const indexTitle = myEventsList.findIndex(
        (item) => item.id === selectedSlot.id
      );

      if (indexTitle >= 0) {
        const cloneMyEventList = [...myEventsList];
        cloneMyEventList[indexTitle] = {
          ...event.data,
          start_time: new Date(event?.data?.start_time),
          end_time: new Date(event?.data?.end_time),
        };

        setMyEventsList(cloneMyEventList);
      }
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
      const dataCalendar = await getListCalendar(userProfile?.id);
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
    if (userProfile?.id) {
      handleLoadCalendar();
    }
  }, [userProfile?.id]);

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
          defaultView="week"
          components={{
            toolbar: CustomToolbar,
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
      />
    </div>
  );
}

export default DnDResource;
