import { useState, useEffect } from "react";
import { handleErrorMessage } from "../helper";
import {profile as getProfile} from '../service/user'
import Cookies from "js-cookie";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (err) {
       handleErrorMessage(err)
      }
    };

  useEffect(() => {
   

    fetchProfile();
  }, []);
  const refreshProfile = () => fetchProfile();
  return { profile, refreshProfile };
};

export default useProfile;
