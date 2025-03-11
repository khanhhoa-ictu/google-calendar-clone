import React, { useEffect, useState } from "react";
import TableUser from "./TableUser";
import { listUser } from "../../../service/user";
import { handleErrorMessage } from "../../../helper";
import AddUser from "./AddUser";

function User() {
  const [dataSource, setDataSource] = useState([]);

  const getListUser = async () => {
    try {
      const dataUSer = await listUser();
      setDataSource(dataUSer);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    getListUser();
  }, []);

  return (
    <div className="flex-1 !mt-10 !px-20">
      <div className="mx-auto">
        <h1 className="!text-[32px] uppercase text-center !mb-10 !font-semibold">
          Quản lý người dùng
        </h1>
        <AddUser addUserSuccess={() => getListUser()} />
        <TableUser
          dataSource={dataSource}
          deleteUserSuccess={() => getListUser()}
          editUserSuccess={() => getListUser()}
        />
      </div>
     
    </div>
  );
}

export default User;
