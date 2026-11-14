'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import DinnerManager from './DinnerManager'
import NarrowDown from './NarrowDown'
import CreateMealSlotModal from './CreateMealSlotModal'
import CreateReservationModal from './CreateReservationModal'




export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const dates:string[] = [];
      dates.push(date);
      const router = useRouter();
      const [modalType, setModalType] = useState<'mealSlot'|'reservation' |null>(null);
      const [selectedDinnerSlotIds, setSelectedDinnerSlotId] = useState<number[]>([]);
      const smallParty = 2;
      const mediumParty = 3;
      const largeParty = 4;


      const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlot[]>([]);
      const getSchedule = async ()=> {
            const schedule = await fetchSchedule(dates);
            setDinnerSlotData(schedule);
      };


      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const getAllReservation = async ()=> {
            const reservations = await fetchReservation(date);
            const reservation = reservations.map((reservation:any) => {
                  console.log("reservation.reservation", reservation.reservation)
                  console.log("reservation.dinners", reservation.dinners)
            })
            setReservationData(reservations);
      };

      useEffect(() => {
            getSchedule()
            dinnerSlotData.map((e)=>{
                  setSelectedDinnerSlotId([...selectedDinnerSlotIds, e.id])
            });
      }, []);

      useEffect(() => {
            getAllReservation();
      }, [dinnerSlotData]);


      return(
            <div className = {styles.page}>
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

                  {dinnerSlotData.length > 0 &&(
                        <div>
                              <div className={styles.table}>
                                    <button
                                          onClick={()=>{setModalType('reservation')}}
                                    >
                                          追加
                                    </button>


                                    {/*プラン別予約一覧*/}
                                    <div>
                                          <button
                                          className={`${styles.btn} ${styles.btnLine}`}
                                          >
                                          すべて
                                          {reservationData.length}
                                          </button>
                                          <button
                                          className={`${styles.btn} ${styles.btnLine}`}
                                          >
                                          夕食
                                          </button>
                                          <button
                                          className={`${styles.btn} ${styles.btnLine}`}
                                          >
                                          朝食
                                          </button>
                                    </div>


                                    {/*絞り込み
                                    <NarrowDown
                                          dinnerSlotData = {dinnerSlotData}
                                          selectedDinnerSlotIds = {selectedDinnerSlotIds}
                                          selectedGuestCount = {selectedGuestCount}
                                          smallParty = {smallParty}
                                          mediumParty = {mediumParty}
                                          largeParty = {largeParty}
                                    />
                                    */}


                                    {/*予約一覧*/}
                                    <div className={styles.lists}></div>
                              </div>
                              {/*予約状況*/}
                              <div className={styles.timeTables}> 
                                    <DinnerManager
                                          dinnerSlotData = {dinnerSlotData}
                                          reservationData = {reservationData}
                                          smallParty = {smallParty}
                                          mediumParty = {mediumParty}
                                          largeParty = {largeParty}
                                    />
                                   
                              </div>
                        </div>

                  )}
                  
                  {dinnerSlotData.length === 0 &&(
                        <div>
                              <button onClick={()=>setModalType('mealSlot')}>
                              新規作成
                              </button>
                        </div>
                  )}

                  {modalType === 'mealSlot' &&(
                        <CreateMealSlotModal
                              date={date}
                              onClose={() => {setModalType(null)}}
                              getSchedule = {getSchedule}
                        />
                  )}

                  {modalType === 'reservation' &&(
                        <CreateReservationModal
                              date = {date}
                              onClose={()=>{setModalType(null)}}
                        />
                  )}
            </div>
      )

}