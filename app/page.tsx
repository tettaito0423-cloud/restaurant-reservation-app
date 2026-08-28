'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './modal';
import { title } from 'process';

export default function Home() {

  type DataType = {
    startAt: string
  };

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState("")
  const router = useRouter()
  const [events, setEvents] = useState([]);
  const [data, setData] = useState<DataType | null>(null);

  useEffect(()=>{
    const fetchData = async()=>{
      const res = await fetch(`/api/save`);
      const data = await res.json();
      const formatted = data.map((item:any)=>({
        start:item.startAt
      }))
      setEvents(formatted);
    }
    fetchData();
  },[]);

  
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={jaLocale}
        events = {events}
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
            router.push(`/calendar/dinner/dinnermanagement?date=${date}`)
          }}
        />
      )}
    </div>
  );
}
