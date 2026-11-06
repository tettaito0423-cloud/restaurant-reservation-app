'use client';

import styles from './Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import { stringify } from 'querystring';
import { time } from 'console';
import { compareNumbers } from '@fullcalendar/core/internal';
import { CourseType } from '@prisma/client';
//import { DinnerSlot } from '@prisma/client';

type Props = {
    date: string;
    onClose: ()=> void;
};

type DinnerSlotData = {
    date: string
    dinnerSlots: DinnerSlot[];
}


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
    const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlotData[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(date);
    const [dates, setDates] = useState<string[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedDinnerSlots, setSelectedDinnerSlots] = useState<{courseType: string, dinnerSlot: string}[]>([]);
    const stays = [checkin, checkout]


    const getSchedule = async ()=> {
        const schedule = await fetchSchedule(stays);
        const result = Object.groupBy(
            schedule,
            (element) => (
                `${String(new Date(element.dinnerStartAt).getMonth() + 1)}/${String(new Date(element.dinnerStartAt).getDate())}`
            )
        ); 
        console.log("result", result)
        const a = Object.entries(result).map(([key, value]) => ({
            date: key,
            dinnerSlots: value ?? []
        }));
        setDinnerSlotData(a);
    };

    const getDays = () => {
        const start = new Date(checkin);
        const end = new Date(checkout);

        const numberOfDays = Math.floor(
            Number(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        const dayArr: string[] = [];
        for (let i = 0; i < numberOfDays; i++) {
            const day = new Date(start)
            day.setDate(start.getDate() + i)
            const fixedDay = new Intl.DateTimeFormat("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(day).replace(/\//g, "-").replace(" ", "T");
            dayArr.push(`${new Date(fixedDay).getMonth() + 1}/${new Date(fixedDay).getDate()}`)
        }
        setDates(dayArr);
        setSelectedDate(dayArr[0]);
        setIsSelected(isSelected);
    };

    useEffect(() => {
        getSchedule()
        getDays()
    }, [checkin, checkout]);



    const saveDinnerSlot = (dinnerSlot: string, courseType: string) =>{
        setSelectedDinnerSlots((prev) => [
            ...prev.filter((selectedDinnerSlot) => 
                selectedDinnerSlot.dinnerSlot.split("T")[0] !== dinnerSlot.split("T")[0]
            ),{
                courseType: courseType,
                dinnerSlot: dinnerSlot
            },
        ]);
    }
    console.log("selectedDinnerSlots", selectedDinnerSlots)
  
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
                date: (dates),
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
                <label>宿泊情報</label>
                <div className = {styles.stayInfo}>
                    <div className = {styles.roomNum}>
                        <label>部屋番号</label>
                        <input
                            type="number"
                            value = {roomNumber}
                            onChange = {(e)=>
                                setRoomNumber(e.target.value)
                            }
                        />
                    </div>
                    <div className = {styles.term}>
                        <div>
                            <label className= {styles.checkInOut}>チェックイン</label>
                            <input 
                                className = {styles.inputCheckInOut}
                                type="date"
                                value={checkin}
                                onChange={(e)=>
                                    setChekin(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className={styles.checkInOut}>チェックアウト</label>
                            <input
                                className={styles.inputCheckInOut}
                                type="date"
                                value={checkout}
                                onChange={(e)=>{
                                    setChekout(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className = {styles.personalInfo}>
                <label>大人</label>
                    <input
                        type="number"
                        value={adultCount}
                        onChange = {(e)=>
                            setAdultCount(Number(e.target.value))
                        }
                    />
                <div className={styles.child}>
                    <label>アンファン</label>
                        <input 
                            type="number"
                            value = {childMealCount}
                            onChange = {(e)=>
                                setChildMealCount(Number(e.target.value))
                            }
                        />

                    <label>Dチャメ</label>
                        <input 
                            type="number"
                            value = {childNoMealCount}
                            onChange = {(e)=>
                                setChildNoMealCount(Number(e.target.value))
                            }
                        />
                </div>
            </div>
            <div>
                <label>食事制限</label>
                    <input type="text" />
        
                <label>コメント</label>
                    <input type="text" />
            </div>
            
            <div>
                <label>タイムテーブル</label>
                <div>
                    <div>夕食</div>
                    <div className = {styles.radioCards}>
                        {dates.map((day) =>
                            <div key = {day}>
                                <label
                                    className= {styles.radioCard}
                                    onClick = {() =>
                                        setSelectedDate(day)
                                    }
                                >
                                    <input
                                        type="radio"
                                        name = "date"
                                        defaultChecked = {day === `${new Date(checkin).getMonth() + 1}/${new Date(checkin).getDate()}`}
                                    />
                                    {day}
                                </label>
                            </div>
                        )}
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name = "courseType"
                                onChange = {() => 
                                    setCourseType("FULL")
                                }
                            />フルコース
                            <input
                                type="radio"
                                name = "courseType"
                                onChange = {() => 
                                    setCourseType("HALF")
                                }
                            />ハーフコース
                        </label>
                    </div>
                    <div>
                        {dinnerSlotData.filter((dinnerSlot) => dinnerSlot.date === selectedDate).map((i) =>
                            <div key = {i.date}>
                                {courseType === "FULL" && (
                                    <div  className = {styles.dinnerSlots}>
                                        <label>フルコース
                                            {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:15").map((n) =>
                                                <div 
                                                    key = {n.id}
                                                    className = {styles.dinnerSlot}
                                                >
                                                    <label>
                                                        <input 
                                                            type="radio"
                                                            name = "dinnerSlot"
                                                            value = {n.id}
                                                            checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                                selectedDinnerSlot.courseType === "FULL" && 
                                                                    selectedDinnerSlot.dinnerSlot === n.dinnerStartAt
                                                            )}
                                                            onChange = {(e) => {
                                                                saveDinnerSlot(n.dinnerStartAt, "FULL")
                                                                setDinnerSlotId(Number(e.target.value))
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                )}
                            
                                {courseType === "HALF" && (
                                    <div  className = {styles.dinnerSlots}>
                                        <label>ハーフコース
                                            {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:00").map((n) =>
                                                <div 
                                                    key = {n.id}
                                                    className = {styles.dinnerSlot}
                                                >
                                                    <label>
                                                        <input 
                                                            type="radio"
                                                            name = "dinnerSlot"
                                                            value = {n.id}
                                                            checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                                selectedDinnerSlot.courseType === "HALF" && 
                                                                    selectedDinnerSlot.dinnerSlot === n.dinnerStartAt
                                                            )}
                                                            onChange = {(e) => {
                                                                saveDinnerSlot(n.dinnerStartAt, "HALF")
                                                                setDinnerSlotId(Number(e.target.value))
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={handleSave}>
                登録
            </button>
        </div>
    </div>
    );
}