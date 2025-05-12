import { Button, Checkbox, Input, notification, Radio } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useProfile } from "../../context/ProfileContext";
import { handleErrorMessage } from "../../helper";
import {
  finalizePoll,
  updateMeetingPoll,
  votePoll,
} from "../../service/meeting";
function Vote({ pollDetail }) {
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const fullUrl = `${window.location.origin}${location.pathname}`;
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState([]);
  const [poll, setPoll] = useState({
    title: "",
    description: "",
  });
  const totalVote = useMemo(() => {
    const voteCount = pollDetail?.options?.map((item) => item?.vote_count);
    var count = voteCount?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    return count;
  }, [pollDetail]);

  const handleVote = async () => {
    const params = {
      email: profile.email,
      option_ids: value,
    };
    try {
      await votePoll(params, id);
      notification.success({ message: "đăng ký tham gia thành công" });
      navigate("/");
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleCreateEvent = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const params = {
      poll_id: id,
      created_by: profile.id,
      accessToken,
    };
    try {
      await finalizePoll(params);
      notification.success({ message: "Tạo lịch thành công" });
      navigate("/");
      setPoll({ title: "", description: "" });
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleUpdateEvent = async () => {
    const params = {
      poll_id: id,
      title: poll.title,
      description: poll.description,
    };
    try {
      await updateMeetingPoll(params);
      notification.success({ message: "cập nhật sự kiện thành công" });
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (pollDetail) {
      setPoll({
        title: pollDetail.poll.title,
        description: pollDetail.poll.description,
      });
    }
  }, [pollDetail]);

  return (
    <div className="w-full !px-10">
      <div className="w-full !px-10 max-w-[600px] !mx-auto !mt-10">
        <h1 className="text-center">Lựa chọn lịch</h1>
        <div className="w-full flex flex-col items-center gap-8">
          <div className="w-full flex flex-col gap-6">
            <Input
              placeholder="nhập tiêu đề cho sự kiện"
              value={poll.title}
              onChange={(e) => setPoll({ ...poll, title: e.target.value })}
            />
            <Input.TextArea
              placeholder="nhập miêu tả cho cuộc họp"
              value={poll.description}
              onChange={(e) =>
                setPoll({ ...poll, description: e.target.value })
              }
            />
            <div className="flex justify-between">
              <p>URL: {fullUrl}</p>
              <Button onClick={handleCopy}>
                {copied ? "Đã sao chép" : "Sao chép"}
              </Button>
            </div>
          </div>
          {profile?.id === pollDetail?.poll?.created_by && (
            <div className="flex justify-end w-full">
              <Button
                onClick={handleUpdateEvent}
                className="!px-6 !h-[40px]"
                disabled={profile?.id !== pollDetail?.poll?.created_by}
              >
                Cập nhật thông tin cho sự kiện
              </Button>
            </div>
          )}
        </div>
        <h3 className="text-left !my-8 text-xl">Lựa chọn thời gian phù hợp:</h3>

        <div className="w-full text-left">
          <Checkbox.Group
            value={value}
            onChange={(values) => setValue(values)}
            className="!flex !flex-col !gap-4"
            disabled={profile?.id === pollDetail?.poll?.created_by}
          >
            {pollDetail?.options?.map((item) => {
              return (
                <Checkbox value={item.id} className="!text-lg">
                  {moment(item?.start_time).format("HH:mm")}-
                  {moment(item?.end_time).format("HH:mm")} ({item?.vote_count}{" "}
                  lượt chọn)
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </div>
        <div className="mt-4 text-right">
          {profile?.id === pollDetail?.poll?.created_by ? (
            <Button
              onClick={handleCreateEvent}
              className="!px-6 !h-[40px]"
              disabled={!totalVote}
            >
              Tạo lịch
            </Button>
          ) : (
            <Button onClick={handleVote} className="!px-6 !h-[40px]">
              Xác nhận
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vote;
