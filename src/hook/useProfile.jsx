import { useState, useEffect } from "react";
import { handleErrorMessage } from "../helper";
import {profile as getProfile} from '../service/user'

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (err) {
       handleErrorMessage(err)
      }
    };

    fetchProfile();
  }, []);

  return { profile };
};

export default useProfile;
