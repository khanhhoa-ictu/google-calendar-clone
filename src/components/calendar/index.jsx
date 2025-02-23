import React, { useCallback, useMemo, useState } from "react";
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
import styles from './styles.module.scss'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
function DnDResource() {
  const [myEventsList, setMyEventsList] = useState(events);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

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
      start: value.start,
      end: value.end,
      title: "",
      id: v4(),
    };
    setSelectedSlot(defaultTitle);
    setMyEventsList([...myEventsList, defaultTitle]);
    setIsOpenModal(true);
  };
  
  const handleCreateNewTitle = (value) => {
    const indexTitle = myEventsList.findIndex((item)=>item.id === selectedSlot.id);
    if(indexTitle > 0){
        const cloneMyEventList = [...myEventsList];
        cloneMyEventList[indexTitle].title = value;
        setMyEventsList(cloneMyEventList)
    }
    setSelectedSlot(null);
    setIsOpenModal(false);
  };

  const handleCloseModal = () => {
    if (selectedSlot.title === "") {
      const filterMyEventList = myEventsList.filter(
        (item) => item.id !== selectedSlot.id
      );
      setMyEventsList(filterMyEventList);
    }
    setIsOpenModal(false);
    setSelectedSlot(null);
  };

  
  return (
    <div className="flex-1" >
      <DndProvider backend={HTML5Backend}>
        <DnDCalendar
          // className="!h-full"
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          longPressThreshold={500}
          timeslots={4}
          step={15}
          onEventDrop={moveEvent}
          resizable={false}
          selectable
          showMultiDayTimes={true}
          onSelectSlot={handleSelectSlot}
          defaultView="week"
          components={{
            toolbar: CustomToolbar,
          }}
        //   messages={viMessages} //
          //   components={{
          //     event: props?.customEvent
          //       ? props?.customEvent
          //       : handleShowCustomEvent,
          //     toolbar: (
          //       data: React.PropsWithChildren<ToolbarProps<Event, object>>
          //     ) => <PageHeader data={data} isSearch={isSearch} />,
          //     resourceHeader: (
          //       data: React.PropsWithChildren<ResourceHeaderProps>
          //     ) => <HeaderCalendar data={data} />,
          //     timeGutterHeader: (data) => <GutterHeader data={data} />,
          //   }}
        />
      </DndProvider>
      <ModalCreateCalendar
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onOk={(value) => handleCreateNewTitle(value)}
      />
    </div>
  );
}

export default DnDResource;
