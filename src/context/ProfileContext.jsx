import { createContext, useState, useEffect, useContext } from "react";
import { profile as getProfile } from "../service/user";
import { handleErrorMessage } from "../helper";
import Cookies from "js-cookie";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const token = Cookies.get("token");
  
  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    fetchProfile(); // Lấy profile khi app khởi động
  }, []);

  const refreshProfile = () => fetchProfile(); // Hàm cập nhật profile sau khi đăng nhập

  return (
    <ProfileContext.Provider value={{ profile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook dùng để lấy profile ở bất kỳ đâu trong app
export const useProfile = () => useContext(ProfileContext);
