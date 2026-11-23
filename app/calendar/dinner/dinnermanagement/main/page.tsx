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
import { resolveSoa } from 'dns';

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
  isComfirmed: boolean;
  dinnerSlotId: number;
  dinnerStartAt: string;
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
            setDinnerSlotData(schedule);
      };
      

      {/**APIからデータ取得 */}
      const [reservations, setReservations] = useState<Reservation[]>([]);
      const getAllReservation = async ()=> {
            const reservationData = await fetchReservation(date);
            const formattedReservations: Reservation[] = reservationData.map((item:any) => ({
                  id: item.reservation.id,
                  roomNumber: item.reservation.roomNumber,
                  adultCount: item.reservation.adultCount,
                  childMealCount: item.reservation.childMealCount,
                  childNoMealCount: item.reservation.childNoMealCount,
                  checkin: item.reservation.checkin,
                  checkout: item.reservation.checkout,
                  dietaryRestrictions: item.reservation.dietaryRestrictions,
                  comment: item.reservation.comment,
                  isComfirmed: item.dinners.isComfirmed,
                  dinnerSlotId: item.dinners.dinnerSlotId,
                  courseType: item.dinners.courseType,
            }));
            setReservations(formattedReservations);
      };

      const displayReservation = reservations.filter((reservation) =>{
            if (mealType === "both"){
                  return reservation
            } else if (mealType === "dinner") {
                  return reservation.courseType !== null;
            }
      })


      useEffect(() => {
            getSchedule()
            dinnerSlotData.map((e)=>{
                  setSelectedDinnerSlotId([...selectedDinnerSlotIds, e.id])
            });
      }, []);

      useEffect(() => {
            if(modalType === null){
                  getAllReservation();
            }
      }, [modalType]);


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
                              <div>
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
                                                      <div key = {dinnerSlot.id}>
                                                            <button className={`${styles.btn} ${styles.btnLine}`}>
                                                                  {dinnerSlot.dinnerStartAt.split("T")[1]}
                                                            </button>
                                                      </div>
                                                )}
                                          </div>
                                    )}

                                
                                    {mealType === "both" &&(
                                          <table className = {styles.table}>
                                                <thead>
                                                      <tr>
                                                            <th>部屋番号</th>
                                                            <th>大人</th>
                                                            <th>子供（食事あり）</th>
                                                            <th>子供（食事なし）</th>
                                                            <th>夕食時間</th>
                                                            <th>食事制限</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {reservations.map((reservation) => 
                                                            <tr key = {reservation.id}>
                                                                  <td>{reservation.roomNumber}</td>
                                                                  <td>{reservation.adultCount}</td>
                                                                  <td>{reservation.childMealCount}</td>
                                                                  <td>{reservation.childNoMealCount}</td>
                                                                  <td>
                                                                        {(dinnerSlotData.find((slot) => 
                                                                              slot.id === reservation.dinnerSlotId
                                                                        )?.dinnerStartAt)?.split("T")[1]}
                                                                  </td>
                                                                  <td>{reservation.dietaryRestrictions}</td>
                                                            </tr>
                                                      )}
                                                </tbody>
                                          </table> 
                                    )}
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