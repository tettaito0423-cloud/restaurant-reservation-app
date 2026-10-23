'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './modal';
import {fetchSchedule, DinnerSlot} from '../lib/getTimetable'


export default function Home() {

  const [firstAndLastDays, setFirstAndLastDays] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState("")
  const router = useRouter()
  const [events, setEvents] = useState([]);


  const getSchedule = async ()=> {
    const data = await fetchSchedule(firstAndLastDays);
    const schedules = data.map((item:any)=> (
      item.dinnerStartAt
    ))
    const event = schedules.map((schedule:any) =>({
      start: schedule 
    }))
    setEvents(event)
  };


  useEffect(() => {
    getSchedule()
  }, [firstAndLastDays]
  );

  
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={jaLocale}
        events = {events}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit"
        }}
        datesSet={(info) => 
          setFirstAndLastDays([String(info.start), String(info.end)])
        }
        dateClick={(info) =>{
          setDate(info.dateStr)
          setIsModalOpen(true)
        }}
      />
      {isModalOpen && (
        <Modal
          date ={date}
          onClose={() => {setIsModalOpen(false)}}
          onMoveRestaurant={() => {
            router.push(`/calendar/dinner/dinnertable?date=${date}`)
          }}
          onMoveFront = {()=>{
            router.push(`/calendar/dinner/dinnermanagement/main?date=${date}`)
          }}
        />
      )}
    </div>
  );
}