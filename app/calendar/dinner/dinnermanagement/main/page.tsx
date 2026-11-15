'use client';
import styles from './DinnerManager.module.css';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation} from '../../../../../lib/getReservations'
import DinnerManager from './DinnerManager'
import NarrowDown from './NarrowDown'
import CreateMealSlotModal from './CreateMealSlotModal'
import CreateReservationModal from './CreateReservationModal'
import { discoverValidationDepths } from 'next/dist/server/app-render/instant-validation/instant-validation';

export type Reservation = {
  id: number;
  roomNumber: string;
  adultCount: number;
  childMealCount: number;
  childNoMealCount: number;
  checkin: string;
  checkout: string;
  dietaryRestrictions: string;
  comment: string;
  dinnerSlotId: number;
  courseType: string;
}


export default function Home() {
      const searchParams = useSearchParams();
      const date = searchParams.get('date') ?? '';
      const dates:string[] = [];
      dates.push(date);
      const router = useRouter();
      const [modalType, setModalType] = useState<'mealSlot'|'reservation' |null>(null);
      const [mealType, setMealType] = useState<'both'|'dinner'|'breakfast'>("both")
      const [selectedDinnerSlotIds, setSelectedDinnerSlotId] = useState<number[]>([]);
      const smallParty = 2;
      const mediumParty = 3;
      const largeParty = 4;


      const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlot[]>([]);
      const getSchedule = async ()=> {
            const schedule = await fetchSchedule(dates);
            console.log("schedule", schedule)
            setDinnerSlotData(schedule);
      };
      


      const [reservationData, setReservationData] = useState<Reservation[]>([]);
      const getAllReservation = async ()=> {
            const reservationsData = await fetchReservation(date);
            const reservations = reservationsData.map((reservation:any) => {
                  const result: Reservation = {
                        ...reservation.reservation,
                        dinnerSlotId: reservation.dinners.dinnerSlotId,
                        courseType: reservation.dinners.courseType
                  };
                  return result
            });
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
      console.log("dinnerSlotData", dinnerSlotData)


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
                                                onClick={() => 
                                                      setMealType("both")
                                                }>
                                                すべて
                                          </button>
                                          <button
                                                className={`${styles.btn} ${styles.btnLine}`}
                                                onClick = {() =>{
                                                      setMealType("dinner")
                                                      console.log("mealType", mealType)
                                                }}>
                                                夕食
                                          </button>
                                          <button
                                                className={`${styles.btn} ${styles.btnLine}`}>
                                                朝食
                                          </button>
                                    </div>
                                    {mealType === "dinner" &&(
                                          <div>
                                                {dinnerSlotData.map((dinnerSlot) =>
                                                      <div>
                                                            <button className={`${styles.btn} ${styles.btnLine}`}>
                                                                  {dinnerSlot.dinnerStartAt.split("T")[1]}
                                                            </button>
                                                      </div>
                                                )}
                                          </div>
                                    )}

                                
                                    {mealType === "both" &&(
                                          <table>
                                                <thead>
                                                      <tr>
                                                            <th>部屋番号</th>
                                                            <th>大人</th>
                                                            <th>子供（食事あり）</th>
                                                            <th>子供（食事なし）</th>
                                                            <th>食事制限</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {reservationData.map((reservation) => 
                                                            <tr key={reservation.id}>
                                                                  <td>{reservation.roomNumber}</td>
                                                                  <td>{reservation.adultCount}</td>
                                                                  <td>{reservation.childMealCount}</td>
                                                                  <td>{reservation.childNoMealCount}</td>
                                                                  <td>{reservation.dietaryRestrictions}</td>
                                                            </tr>
                                                      )}
                                                </tbody>
                                          </table> 
                                    )}

                                    {mealType === "dinner" &&(
                                          <table>
                                                <thead>
                                                      <tr>
                                                            <th>部屋番号</th>
                                                            <th>大人</th>
                                                            <th>子供（食事あり）</th>
                                                            <th>子供（食事なし）</th>
                                                            <th>食事制限</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {reservationData.map((reservation) => 
                                                            <tr key={reservation.id}>
                                                                  <td>{reservation.roomNumber}</td>
                                                                  <td>{reservation.adultCount}</td>
                                                                  <td>{reservation.childMealCount}</td>
                                                                  <td>{reservation.childNoMealCount}</td>
                                                                  <td>{reservation.dietaryRestrictions}</td>
                                                            </tr>
                                                      )}
                                                </tbody>
                                          </table> 
                                    )}
                                


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