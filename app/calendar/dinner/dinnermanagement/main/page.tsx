'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import DinnerManager from './DinnerManager'
import SelectPlan from './SelectPlan'
import NarrowDown from './NarrowDown'
import CreateMealSlotModal from './CreateMealSlotModal'
import CreateReservationModal from './CreateReservationModal'




export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const dates:string[] = [];
      dates.push(date);
      const router = useRouter();
      const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlot[]>([]);
      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const [modalType, setModalType] = useState<'mealSlot'|'reservation' |null>(null);
      const [reservation, setReservation] = useState<Reservation| null>(null);
      const [selectedDinnerSlotIds, setSelectedDinnerSlotId] = useState<number[]>([]);
      const [selectedGuestCount, setSelectedGuestCount] = useState<number[]>([]);
      const smallParty = 2;
      const mediumParty = 3;
      const largeParty = 4;


      const getSchedule = async ()=> {
            const schedule = await fetchSchedule(dates);
            console.log("schedule", schedule)
            setDinnerSlotData(schedule);
      };

      useEffect(() => {
            getSchedule()
            dinnerSlotData.map((e)=>{
                  e.times.map((i)=>(
                        setSelectedDinnerSlotId([...selectedDinnerSlotIds, i.id])
                  ))
                  
            });
      }, []);

      const getReservation = async ()=> {
            const reservations = await fetchReservation(date);
            setReservationData(reservations);
      };

      useEffect(() => {   
            if (dinnerSlotData.length < 2) return;
            getReservation();
      }, [dinnerSlotData]);



      {/*夕食時間絞り込み 
      const updateSelectedDinnerSlotId = (e:number) => {
            if (selectedDinnerSlotIds.includes(e)) {
                  setSelectedDinnerSlotId(
                        selectedDinnerSlotIds.filter((dinnerSlotId)=>(
                              e !== dinnerSlotId
                        ))
                  );
            } else {
                  setSelectedDinnerSlotId([...selectedDinnerSlotIds, e]);
            }
      };
      */}
      {/*人数絞り込み 
      const updateSelectedGuestCount = (i:number) =>{
            if (selectedGuestCount.includes(i)) {
                  setSelectedGuestCount(
                        selectedGuestCount.filter((guestCount)=>(
                              i !== guestCount
                        ))
                  );
            } else {
                  setSelectedGuestCount([...selectedGuestCount, i])
            }
      };
      */}
      



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
                                    <SelectPlan
                                          reservationData = {reservationData}
                                    />


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
                                    <div className={styles.lists}>
                                          
                                          
                                    </div>
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