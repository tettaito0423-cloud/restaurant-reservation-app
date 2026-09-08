'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'
import DinnerManager from './DinnerManager';
import CreateModal from './CreateModal';

export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const [scheData, setScheData] = useState<DinnerSlot[]>([]);
      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const [modalType, setModalType] = useState<'create'| null>(null);
      const router = useRouter();


      const getSche = async ()=> {
            const schedule = await fetchSchedule(date);
            setScheData(schedule);
      };
      useEffect(() => {
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
                  <div className={styles.header}>
                        <p>{date}</p>
                        <div>
                              <button
                                    className={styles.calendar} 
                                    onClick={() => {
                                          router.push(`/`)
                                    }}>
                                    カレンダー
                              </button>
                        </div>
                  </div>
                  {scheData.length > 0 &&(
                        <DinnerManager
                              scheData = {scheData}
                              reservationData = {reservationData}
                        />
                  )}
                  
                  {scheData.length === 0 &&(
                        <div>
                              <button onClick={()=>setModalType('create')}>
                              新規作成
                              </button>
                        </div>
                  )}

                  {modalType === 'create' &&(
                        <CreateModal
                              date={date}
                              onClose={() => {setModalType(null)}}
                              getSche = {getSche}
                        />
                  )}
            </div>
      )

}
