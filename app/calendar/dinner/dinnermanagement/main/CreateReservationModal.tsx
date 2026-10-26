'use client';

import styles from './Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import { stringify } from 'querystring';
import { time } from 'console';

type Props = {
    date: string;
    onClose: ()=> void;
};

export default function Modal({
    date,
    onClose,
 }:Props){
    const [courseType, setCourseType] = useState<'FULL'|'HALF'|null>(null);
    const [roomNumber, setRoomNumber] = useState<string>("");
    const [adultCount, setAdultCount] = useState<number>(0);
    const [childMealCount, setChildMealCount] = useState<number>(0);
    const [childNoMealCount, setChildNoMealCount] = useState<number>(0);
    const [checkin, setChekin] = useState<string>(date);
    const [checkout, setChekout] = useState<string>(date);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [dinnerSlotId, setDinnerSlotId] = useState<number>();
    const [dinnerSlotData, setDinnerSlotData] = useState([]);


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

    const stays = [checkin, checkout]


    const getSchedule = async ()=> {
        const schedule = await fetchSchedule(stays);
        const a = schedule.map((i:any) => ({
            id: i.id,
            dinnerStartAt : new Date(i.dinnerStartAt)
        }))
        setDinnerSlotData(a);
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
                courseType: (courseType),
                dinnerSlotId: (dinnerSlotId),
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
                    value = {roomNumber}
                    onChange = {(e)=>
                        setRoomNumber(e.target.value)
                    }
                />
            </div>
            <div>
                <div>
                    <p>大人</p>
                        <input
                            type="number"
                            value={adultCount}
                            onChange = {(e)=>
                                setAdultCount(Number(e.target.value))
                            }
                        />
                </div>
                <div>
                    <div className={styles.child}>
                        <div>
                            <p>アンファン</p>
                            <input 
                                type="number"
                                value = {childMealCount}
                                onChange = {(e)=>
                                    setChildMealCount(Number(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <p>Dチャメ</p>
                            <input 
                                type="number"
                                value = {childNoMealCount}
                                onChange = {(e)=>
                                    setChildNoMealCount(Number(e.target.value))
                                }
                            />
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

                    {dinnerSlotData.map((dinnerSlot) =>(
                        <div key = {dinnerSlot.dinnerStartAt}>
                            {dinnerSlot.times.map((time) => (
                                <div key = {time.id}>
                                    <h3>{dinnerSlot.date}</h3>
                                    <label>
                                        <input 
                                            type="radio"
                                            name = "courseType"
                                            onChange = {()=>setCourseType('FULL')}
                                        />フルコース
                                    </label>
                                    <label>
                                        <input 
                                            type="radio"
                                            name = "courseType"
                                            onChange = {()=>setCourseType('HALF')}    
                                        />ハーフコース
                                    </label>
                            


                                    {courseType === 'FULL' &&(
                                        dinnerSlot.times.filter((time) => time.dinnerStartAt !== "18:15").map((time)=>
                                            <div key = {time.id}>
                                                <label>
                                                    <input 
                                                        type="radio"
                                                        name = "time"
                                                        value = {time.id}
                                                        onChange={(e)=>{
                                                            setDinnerSlotId(parseFloat(e.target.value));
                                                        }}
                                                    />{time.dinnerStartAt}
                                                </label>
                                            </div>
                                        )
                                    )}

                                    {courseType === 'HALF' &&(
                                        dinnerSlot.times.filter((time) => time.dinnerStartAt !== "18:00").map((time)=>
                                            <div key = {time.id}>
                                                <label>
                                                    <input 
                                                        type="radio"
                                                        name = "time"
                                                        value = {time.id}
                                                        onChange={(e)=>{
                                                            setDinnerSlotId(parseFloat(e.target.value));
                                                        }}
                                                    />{time.dinnerStartAt}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>
            <div>
                <div>食事制限</div>
                <input type="text" />
            </div>
            <div>
                <div>コメント</div>
                <input type="text" />
            </div>
            <button onClick={handleSave}>
                登録
            </button>
        </div>
    </div>
    );
}