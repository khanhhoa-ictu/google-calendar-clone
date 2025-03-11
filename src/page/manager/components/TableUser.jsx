import React from "react";
import UserItem from "./UserItem";

function TableUser({ dataSource, deleteUserSuccess, editUserSuccess }) {
  return (
    <div>
      <table className="w-full">
        <tbody>
          <tr className="!py-2 !h-10">
            <th>Email</th>
            <th>Hành động</th>
          </tr>

          {dataSource?.map((item) => {
            return (
              <UserItem
                user={item}
                key={item.id}
                deleteUserSuccess={deleteUserSuccess}
                editUserSuccess={editUserSuccess}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableUser;
