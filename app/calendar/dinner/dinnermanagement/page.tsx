'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'
import DinnerManager from './DinnerManager';
import CreateModal from './CreateModal';
import DetailModal from './DetailModal'

export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const [scheData, setScheData] = useState<DinnerSlot[]>([]);
      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const [modalType, setModalType] = useState<'create'|'detail' |null>(null);
      const router = useRouter();
      const [dinnerSlotId, setDinnerSlotId] = useState<number| null>(null);
      const [reservationId, setReservationId] = useState<number| null>(null);


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
                                    <div className={styles.narrowDown}>
                                          <p>絞り込み</p>
                                          <input type="text" />
                                          <p>人数</p>
                                          <form 
                                                className={styles.guestCount}
                                                action="#" 
                                                method="post"
                                          >
                                                <div>
                                                      <input type="checkbox" name="belowTwo" value=""/>
                                                      <label htmlFor="belowTwo">1~2人</label>
                                                </div>
                                                <div>
                                                      <input type="checkbox" name="three" value=""/>
                                                      <label htmlFor="three">3人</label>
                                                </div>
                                                <div>
                                                      <input type="checkbox" name="fourOrMore" value=""/>
                                                      <label htmlFor="fourOrMore">4人以上</label>
                                                </div>
                                          </form>
                                          <p>時間</p>
                                          <form 
                                                action="#"
                                                method='post'
                                          >
                                                <div>
                                                      <input type="checkbox" name="first" value="" />
                                                      <label htmlFor="first">{scheData[0].startAt}</label>
                                                </div>
                                          </form>
                                    </div>
                                    <div className={styles.list}>
                                          <button onClick={()=>setModalType('detail')}>追加</button>
                                          {modalType === 'detail' &&(
                                                <DetailModal
                                                      dinnerSlotId = {dinnerSlotId}
                                                      onClose={() => {setModalType(null)}}
                                                      reservationData = {reservationData}
                                                      reservationId = {reservationId}
                                                      setReservationId = {setReservationId}
                                                />
                                          )}
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
            </div>
      )

}
