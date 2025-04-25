import { Input } from "antd";
import moment from "moment";
import React from "react";

function Vote({ pollDetail }) {
  return (
    <div className="w-full">
      <h1 className="text-center">Lựa chọn lịch</h1>
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">
        <Input placeholder="nhập tiêu đề cho sự kiện" />
        <Input.TextArea placeholder="nhập miêu tả cho cuộc họp" />
      </div>
      <div>
        {pollDetail?.options?.map((item) => {
          return (
            <div>
              <p>
                {moment(item?.start_time).format("HH:mm")}-
                {moment(item?.end_time).format("HH:mm")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Vote;
