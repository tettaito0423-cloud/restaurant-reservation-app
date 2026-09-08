'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'
import DinnerManager from './DinnerManager'
import NarrowDown from './NarrowDown'
import CreateModal from './CreateModal'
import DetailModal from './DetailModal'

export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const [scheData, setScheData] = useState<DinnerSlot[]>([]);
      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const [modalType, setModalType] = useState<'create'|'detail' |null>(null);
      const router = useRouter();
      const [dinnerSlotId, setDinnerSlotId] = useState<number| null>(null);


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
                        <button
                              className={styles.calendar} 
                              onClick={() => {
                                    router.push(`/`)
                              }}>
                              カレンダー
                        </button>
                  </div>

                  {scheData.length > 0 &&(
                        <div>
                              <DinnerManager
                                    scheData = {scheData}
                                    reservationData = {reservationData}
                              />
                              <div className={styles.table}>

                                    {/*絞り込み表示*/}
                                    <NarrowDown
                                          scheData = {scheData}
                                    />

                                    {/*予約一覧表示*/}
                                    <div className={styles.list}>
                                          <button 
                                                onClick={()=>setModalType('detail')}
                                          >
                                                追加
                                          </button>
                                          {reservationData.map((reservation)=>(
                                                <div key={reservation.id} 
                                                className={styles.container}>
                                                <p>{reservation.roomNumber}号室</p>
                                                <p>{reservation.guestCount}名</p>
                                                <p>{new Date(reservation.dinnerSlot.startAt).toLocaleTimeString("ja-JP", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                      })}
                                                </p>
                                                </div>
                                          ))}
                                    </div>

                              </div>
                        </div>

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

                  {modalType === 'detail' &&(
                        <DetailModal
                              dinnerSlotId = {dinnerSlotId}
                              onClose={() => {setModalType(null)}}
                              reservationData = {reservationData}

                        />
                  )}
            </div>
      )

}
