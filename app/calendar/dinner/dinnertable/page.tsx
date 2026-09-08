'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DinnerTable2 from './DinnerTable2';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'


export default function DinnerPage() {

  const searchParams = useSearchParams();
  const date = searchParams.get('date') ?? '';
  const [scheData, setScheData] = useState<DinnerSlot[]>([])
  const [reservationData, setReservationData] = useState<Reservation[]>([])
  const [selectedCell, setSelectedCell] = useState<number| null>(null);
  const [dinnerSlotId, setDinnerSlotId] = useState<number| null>(null);
  const [modalType, setModalType] = useState<'detail'| null>(null);
  const [reservationId, setReservationId] = useState<number| null>(null);

  useEffect(() => {
    const getSche = async ()=> {
      const schedule = await fetchSchedule(date);
      setScheData(schedule);
    };
    getSche()      
  }, []);

  useEffect(() => {   
    if (scheData.length < 2) return;
    const getReservation = async ()=> {
      const reservations = await fetchReservation(scheData[0].id, scheData[1].id);
      setReservationData(reservations)
    }
    getReservation()
  }, [scheData]);


  return(
    <div>
      <h2>{date}</h2>
        {scheData.length == 2 && (
          <div>
            <DinnerTable2
              scheData = {scheData}
              reservationData = {reservationData}
              setSelectedCell = {setSelectedCell}
              setModalType = {setModalType}
              setDinnerSlotId = {setDinnerSlotId}
              setReservationId = {setReservationId}
            />
          </div>
        )}
      
    </div>
  );
}