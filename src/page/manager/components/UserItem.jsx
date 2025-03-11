import { Button, notification } from 'antd'
import React, { useState } from 'react'
import { handleErrorMessage } from '../../../helper'
import { deleteUser } from '../../../service/user'
import ModalConfirm from '../../../components/modal/ModalConfirm'
import EditUser from './EditUser'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function UserItem({ user, deleteUserSuccess, editUserSuccess }) {
  const [loading, setLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState({
    delete: false,
    edit: false
  })

  const handleOkDelete = async () => {
    setLoading(true)
    try {
      await deleteUser(user.id)
      setIsOpenModal({ ...isOpenModal, delete: false })
      notification.success({ message: "xoá người dùng thành công" });
      deleteUserSuccess()
    } catch (error) {
      handleErrorMessage(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className='!py-3 h-[40px]' >
      <td className="py-4 px-6">{user.email}</td>
      <td>
        <div className="flex justify-center gap-3">
          <Button
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => setIsOpenModal({ ...isOpenModal, edit: true })}
          >
            Cập nhật
          </Button>

          <Button
            danger
            type="primary"
            size="middle"
            icon={<DeleteOutlined />}
            onClick={() => setIsOpenModal({ ...isOpenModal, delete: true })}
          >
            Xoá
          </Button>
        </div>
      </td>
      <ModalConfirm
        isOpen={isOpenModal.delete}
        handleOk={handleOkDelete}
        handleCancel={() => setIsOpenModal({ ...isOpenModal, delete: false })}
        title={"Xóa bài viết"}
        loading={loading}
      >
        Bạn có muốn xóa người dùng này không?
      </ModalConfirm>
      {isOpenModal.edit && (
        <EditUser
          isModalVisible={isOpenModal.edit}
          handleOk={editUserSuccess}
          handleCancel={() => setIsOpenModal({ ...isOpenModal, edit: false })}
          id={user.id}
        />
      )}
    </tr>
  )
}

export default UserItem