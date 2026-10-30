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
  const [events, setEvents] = useState<{start: string}[]>([]);


  const getSchedule = async ()=> {
    const data = await fetchSchedule(firstAndLastDays);
    const formattedData = data.map((item: any) => ({
      id: item.id,
      dinnerStartAt: new Date(item.dinnerStartAt),
    }));

    const filteredData = formattedData.filter((item:any) => (
      `${String(item.dinnerStartAt.getHours())}:${String(item.dinnerStartAt.getMinutes())}` !== "18:15"
    ));
    const events = filteredData.map((item:any) => ({
      start: item.dinnerStartAt
    }));
    setEvents(events)
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
        datesSet={(info) => {
          setFirstAndLastDays([String(info.start), String(info.end)])
        }}
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