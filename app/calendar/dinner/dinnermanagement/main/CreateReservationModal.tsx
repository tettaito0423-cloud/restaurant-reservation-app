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
    const [checkout, setCheckout] = useState<string>("");
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [selectedDinnerSlots, setSelectedDinnerSlots] = useState<{date: string, courseType: string, dinnerSlotId: number, dinnerSlot: string}[]>([]);
    const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlotData[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(date);


    const createTommorrow = (date: string) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        const tommorrow = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(currentDate).replace(/\//g, "-").replace(" ", "T");
        setCheckout(String(tommorrow))
    };


    {/**APIからデータを取得 */}
    const getSchedule = async ()=> {
        const fromTo = [checkin, checkout]
        const schedule = await fetchSchedule(fromTo);
        const result = Object.groupBy(
            schedule,
            (element) => (
                `${String(new Date(element.dinnerStartAt).getMonth() + 1)}/${String(new Date(element.dinnerStartAt).getDate())}`
            )
        ); 
        const a = Object.entries(result).map(([key, value]) => ({
            date: key,
            dinnerSlots: value ?? []
        }));
        setDinnerSlotData(a);
    };


    {/**checkinとcheckoutから宿泊日全てを取得 */}
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
    };



    const saveDinnerSlot = (courseType: string, dinnerSlotId: number, dinnerSlot: string) =>{
        setSelectedDinnerSlots((prev) => [
            ...prev.filter((selectedDinnerSlot) => 
                selectedDinnerSlot.dinnerSlot.split("T")[0] !== dinnerSlot.split("T")[0]
            ),{
                date: dinnerSlot.split("T")[0],
                courseType: courseType,
                dinnerSlotId: dinnerSlotId,
                dinnerSlot: dinnerSlot
            },
        ]);
    }

  
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
                checkin: new Date(checkin),
                checkout: new Date(checkout),
                dietaryRestrictions: (dietaryRestrictions),
                comment: (comment),
                selectedDinnerSlots: (selectedDinnerSlots)
            }),
        });
        onClose();
    };

    useEffect(() => {
        createTommorrow(date)
    }, []);

    useEffect(() => {
        if(!checkout)return;
        getSchedule()
        getDays()
    }, [checkin, checkout]);



    return(
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <div style ={{display: "flex", justifyContent: "space-between", marginBottom: "1%"}}>
                <label>予約登録</label>
                <button
                    style = {{}}
                    onClick={()=>{
                        onClose();
                    }}
                >
                    X
                </button>
            </div>
            <div className = {styles.stayInfo}>
                <div className = {styles.stayLabel}>
                    <label>宿泊情報</label>
                </div>
                <div className = {styles.details}>
                    <div className = {styles.roomNum}>
                        <label style = {{fontSize: "large"}}>部屋番号</label>
                        <input
                            type="number"
                            value = {roomNumber}
                            onChange = {(e)=>
                                setRoomNumber(e.target.value)
                            }
                        />
                    </div>
                    <div style = {{marginLeft: "5%"}}>
                        <label style = {{fontSize: "large"}}>
                            <input type="checkbox"/>外来予約
                        </label>
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
                                    setCheckout(e.target.value);
                                }}
                            />
                        </div>
                        
                    </div>
                </div>
            </div>


            <div className = {styles.personalInfo}>
                <div style = {{backgroundColor: "#e4f0ff"}}>
                    <label>
                        人数・プラン
                    </label>
                </div>
                <div>
                    <div className = {styles.peopleNum}>
                        <label className = {styles.personalLabel}>大人</label>
                        <input
                            type="number"
                            value={adultCount}
                            onChange = {(e)=>
                                setAdultCount(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className = {styles.peopleNum}>
                        <label className = {styles.personalLabel}>子供(食事あり)</label>
                        <input 
                            type="number"
                            value = {childMealCount}
                            onChange = {(e)=>
                                setChildMealCount(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className = {styles.peopleNum}>
                        <label className = {styles.personalLabel}>子供(食事なし)</label>
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
    
            <div className = {styles.notes}>
                <div style = {{backgroundColor: "#e4f0ff"}}>
                    <label>備考</label>
                </div>
                <div>
                    <div>
                        <label style = {{verticalAlign: "top"}}>食事制限</label>
                        <textarea
                            cols = {40}
                            value = {dietaryRestrictions}
                            onChange = {(e) => {
                                setDietaryRestrictions(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <label style = {{verticalAlign: "top"}}>コメント</label>
                        <textarea
                            rows = {5}
                            cols = {40}
                            value = {comment}
                            onChange = {(e) => {
                                setComment(e.target.value)
                            }}
                        />
                    </div>
                </div>
            </div>
          
       
            
            <div className = {styles.schedules}>
                <div style = {{backgroundColor: "#e4f0ff"}}>
                    <label>日ごとの食事予定</label>
                </div>
                <div style = {{marginLeft: "5px"}}>
                    <div className = {styles.dates}>
                        {dates.map((day) =>
                            <div key = {day}>
                                <label
                                    className= {styles.date}
                                    onClick = {() =>
                                        setSelectedDate(day)
                                    }>{day}
                                    <input
                                        type="radio"
                                        name = "date"
                                        defaultChecked = {day === `${new Date(checkin).getMonth() + 1}/${new Date(checkin).getDate()}`}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                    <div className = {styles.meals}>
                        <div className = {styles.dinner}>
                            {dinnerSlotData.length > 0 && (
                                <div>
                                    <label style = {{display: "block"}}>夕食</label>
                                    <div style = {{display: "flex"}}>
                                        <label className = {styles.courseType}>
                                            <input
                                                type="radio"
                                                name = "courseType"
                                                onChange = {() => 
                                                    setCourseType("FULL")
                                                }
                                            />フルコース
                                        </label>
                                        <label className = {styles.courseType}>
                                            <input
                                                type="radio"
                                                name = "courseType"
                                                onChange = {() => 
                                                    setCourseType("HALF")
                                                }
                                            />ハーフコース
                                        </label>
                                    </div>
                                </div>
                            )}
                            {dinnerSlotData.filter((dinnerSlot) => dinnerSlot.date === selectedDate).map((i) =>
                                <div key = {i.date}>
                                    {courseType === "FULL" && (
                                        <div  className = {styles.dinnerSlots}>
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
                                                                    selectedDinnerSlot.dinnerSlotId === n.id
                                                            )}
                                                            onChange = {(e) => {
                                                                saveDinnerSlot("FULL", n.id, n.dinnerStartAt)
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                
                                    {courseType === "HALF" && (
                                        <div  className = {styles.dinnerSlots}>
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
                                                                    selectedDinnerSlot.dinnerSlotId === n.id
                                                            )}
                                                            onChange = {(e) => {
                                                                saveDinnerSlot("HALF", n.id, n.dinnerStartAt)
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className = {styles.breakfast}>
                            朝食    
                        </div>
                    </div>
                </div>
            </div>
            <footer className = {styles.footer}>
                <button onClick={handleSave}>
                    登録
                </button>
            </footer>
        </div>
    </div>
    );
}