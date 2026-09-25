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
      const [reservationDetail, setReservationDetail] = useState<Reservation| null>(null);
      const [selectedDinnerSlotIds, setSelectedDinnerSlotId] = useState<number[]>([]);
      const [selectedGuestCount, setSelectedGuestCount] = useState<number[]>([]);

      const smallParty = 2;
      const mediumParty = 3;
      const largeParty = 4;

      const selectedReservations = reservationData.filter((reservation)=>{
            if (selectedDinnerSlotIds.length === 0) {
                  return reservationData
            } else{
                  return selectedDinnerSlotIds.includes(reservation.dinnerSlotId)
            }
      });
      const resultReservation = selectedReservations.filter((reservation)=>{
            if (selectedGuestCount.length === 0) {
                  return true
            } else {
                  return selectedGuestCount.includes(reservation.guestCount)
            }
      });

      {/*mapメソッドで、2の場合は2以下の予約を取得し、*/}
      const result = selectedReservations.filter((resevation)=>{
            return resevation.guestCount <= smallParty
      });
      console.log("result", result)
      console.log("selectedDinnerSlotIds", selectedDinnerSlotIds)
      console.log("selectedGuestCount", selectedGuestCount)



      const getSchedule = async ()=> {
            const schedule = await fetchSchedule(date);
            setScheData(schedule);
      };

      useEffect(() => {
            getSchedule()
            scheData.map((e)=>(
                  setSelectedDinnerSlotId([...selectedDinnerSlotIds, e.id])
            ));
      }, []);

      const getReservation = async ()=> {
            const reservations = await fetchReservation(scheData[0].id, scheData[1].id);
            setReservationData(reservations);
      };

      useEffect(() => {   
            if (scheData.length < 2) return;
            getReservation();
      }, [scheData]);


      {/*絞り込み機能 */}
      {/*もしselectedDinnerSlotIdsの中にすでに含まれているidなら削除する。
            含まれていないなら追加する。*/}
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

      const updateSelectedGuestCount = (i:number, a:number) =>{
            if (selectedGuestCount.includes(i || a)) {
                  setSelectedGuestCount(
                        selectedGuestCount.filter((guestCount)=>(
                              i !== guestCount && a !== guestCount
                        ))
                  );
            } else {
                  setSelectedGuestCount([...selectedGuestCount, i, a])
            }
      };



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
                        <div className={styles.page}>
                              <div className={styles.table}>
                                    <button
                                          onClick={()=>{
                                                setReservationDetail(null)
                                                setModalType('detail')
                                          }}
                                    >
                                          追加
                                    </button>
                                    {/*絞り込み*/}
                                    <NarrowDown
                                          scheData = {scheData}
                                          updateSelectedDinnerSlotId = {updateSelectedDinnerSlotId}
                                          updateSelectedGuestCount = {updateSelectedGuestCount}
                                    />
                                    {/*予約一覧*/}
                                    <div className={styles.lists}>
                                          {resultReservation.map((reservation)=>(
                                                <div  key={reservation.id} 
                                                      className={styles.container}
                                                      onClick={()=>{
                                                            setReservationDetail(reservation)
                                                            setModalType('detail')
                                                      }}
                                                >
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
                              {/*予約状況*/}
                              <div className={styles.timeTable}> 
                                    <DinnerManager
                                          scheData = {scheData}
                                          reservationData = {reservationData}
                                    />
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
                              getSchedule = {getSchedule}
                        />
                  )}

                  {modalType === 'detail' &&(
                        <DetailModal
                              reservationDetail = {reservationDetail}
                              scheData = {scheData}
                              onClose={() => {
                                    setModalType(null)
                                    getReservation()
                              }}

                        />
                  )}
            </div>
      )

}
