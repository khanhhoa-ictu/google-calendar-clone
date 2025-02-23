import React, { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";

function ModalCreateCalendar({ isOpen, onClose, onOk }) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (!isOpen) setTitle("");
  }, [isOpen]);
  return (
    <Modal
      title="Basic Modal"
      open={isOpen}
      onOk={() => onOk(title)}
      onCancel={() => onClose(false)}
    >
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
    </Modal>
  );
}

export default ModalCreateCalendar;
