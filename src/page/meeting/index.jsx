import React from 'react'
import Navbar from '../../components/navbar'
import CalendarMeeting from "../../components/calendar/CalendarMeeting"
function Meeting({profile}) {
  return (
    <div className="flex h-full gap-3">
      <Navbar />
      <CalendarMeeting profile={profile} />
    </div>
  )
}

export default Meeting