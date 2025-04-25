import React, { useEffect, useState } from "react";
import Vote from "./Vote";
import Navbar from "../../components/navbar";
import { useParams } from "react-router";
import { detailPoll } from "../../service/meeting";
import { handleErrorMessage } from "../../helper";

function MeetingDetail() {
  const { id } = useParams();
    const [pollDetail, setPollDetail] = useState()
  const getPollDetail = async () => {
    try {
      const response = await detailPoll(id);
      setPollDetail(response)
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (id) {
      getPollDetail();
    }
  }, [id]);
  return (
    <div className="flex h-full gap-3">
      <Navbar />
      <Vote pollDetail={pollDetail} />
    </div>
  );
}

export default MeetingDetail;
