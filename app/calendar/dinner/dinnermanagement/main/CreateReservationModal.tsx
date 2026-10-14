'use client';

import styles from './Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import { stringify } from 'querystring';

type Props = {
    date: string;
    onClose: ()=> void;
};

export default function Modal({
    date,
    onClose,
 }:Props){
    
    const [roomNumber, setRoomNumber] = useState<string>("");
    const [adultCount, setAdultCount] = useState<number>();
    const [childMealCount, setChildMealCount] = useState<number>()
    const [childNoMealCount, setChildNoMealCount] = useState<number>()
    const [checkin, setChekin] = useState<string>(date)
    const [checkout, setChekout] = useState<string>(date)
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string>()
    const [comment, setComment] = useState<string>()
    const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlot[]>([]);
    console.log("dinnerSlotData", dinnerSlotData)
    console.log("checkin", checkin)
    console.log("checkout", checkout)


    {/**チェックインとチェックアウトからすべての宿泊日を算出する */}
    const generateStays = (checkin: string, checkout: string) => {
        const stays:string[] = [];
        for(
            let day = new Date(checkin);
            day < new Date(checkout);
            day.setDate(day.getDate()+1)
        ) {
            stays.push(
                `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
            );
        }
        return stays;
    };
    const stays = generateStays(checkin, checkout)
    console.log("stays", stays)


    const getSchedule = async ()=> {
        const schedule = await fetchSchedule(stays);
        setDinnerSlotData(schedule);
    };

    useEffect(() => {
        getSchedule()
    }, [checkin, checkout]);



    const handleSave = async ()=>{
        await fetch('/api/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomNumber: (roomNumber),
                adultCount: Number(adultCount),
                childMealCount: Number(childMealCount),
                childNoMealCount: Number(childNoMealCount),
                checkin: (checkin),
                checkout: (checkout),
                dietaryRestrictions: (dietaryRestrictions),
                comment: (comment),
                date: (stays),
                
            }),
        });
        onClose();
    };

    return(
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <button 
                onClick={()=>{
                    onClose();
                }}
            >
                X
            </button>

            <div>
                <p>部屋番号</p>
                <input
                    type="number"
                />
            </div>
            <div>
                <div>
                    <p>大人</p>
                        <input
                            type="number"
                            value={adultCount}
                        />
                </div>
                <div>
                    <div className={styles.child}>
                        <div>
                            <p>アンファン</p>
                            <input type="number" />
                        </div>
                        <div>
                            <p>Dチャメ</p>
                            <input type="number" />
                        </div>
                    </div>
                </div>
            </div>
            <div className = {styles.term}>
                <div>
                    <p>チェックイン</p>
                    <input 
                        type="date"
                        value={checkin}
                        onChange={(e)=>
                            setChekin(e.target.value)
                        }
                    />
                </div>
                <div>
                    <p>チェックアウト</p>
                    <input 
                        type="date"
                        value={checkout}
                        onChange={(e)=>{
                            setChekout(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div>
                <p>タイムテーブル</p>
                <div className = {styles.date}>
                    {stays.map((stay) =>                      
                        <div key={stay}>
                            {stay}
                        </div>
                    )}
                </div>
                    {dinnerSlotData.map((dinnerSlot) => 
                        <div key = {dinnerSlot.id}>
                            {dinnerSlot.dinnerStartAt}
                        </div>
                    )}
            </div>

            <button onClick={handleSave}>
                登録
            </button>
        </div>
    </div>
    );
}