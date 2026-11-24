'use client';

import styles from './Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../../lib/getTimetable'
import ReservationTextField from "./fields/ReservationTextField";
import ReservationNumberField from "./fields/ReservationNumberField";
import ReservationDateField from "./fields/ReservationDateField";

type Props = {
    date: string;
    mode: "create" | "detail";
    reservation?: {
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
    };
    onClose: ()=> void;
};

type DinnerSlotData = {
    date: string
    dinnerSlots: DinnerSlot[];
}


export default function ReservationModal({
    mode,
    date,
    reservation,
    onClose,
 }:Props){
    const [courseType, setCourseType] = useState<'FULL'|'HALF'|null>("FULL");
    const [roomNumber, setRoomNumber] = useState(reservation?.roomNumber ?? "");
    const [adultCount, setAdultCount] = useState(reservation?.adultCount ?? 0);
    const [childMealCount, setChildMealCount] = useState(reservation?.childMealCount ?? 0);
    const [childNoMealCount, setChildNoMealCount] = useState(reservation?.childNoMealCount ?? 0);
    const [checkin, setChekin] = useState(reservation?.checkin ?? date);
    const [checkout, setCheckout] = useState(reservation?.checkout ?? "");
    const [dietaryRestrictions, setDietaryRestrictions] = useState(reservation?.dietaryRestrictions ?? "");
    const [comment, setComment] = useState(reservation?.comment ?? "");

    


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
        setCourseType("FULL")
    };


    {/**APIからデータを取得 */}
    const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlotData[]>([]);
    const getSchedule = async () => {
        const fromTo = [checkin, checkout]
        const schedule = await fetchSchedule(fromTo);
        const result = Object.groupBy(
            schedule,
            (element) => (
                `${String(new Date(element.dinnerStartAt).getFullYear())}/${String(new Date(element.dinnerStartAt).getMonth() + 1)}/${String(new Date(element.dinnerStartAt).getDate())}`
            )
        ); 
        const a = Object.entries(result).map(([key, value]) => ({
            date: key,
            dinnerSlots: value ?? []
        }));
        setDinnerSlotData(a);
    };


    {/**checkinとcheckoutから宿泊日全てを取得する処理 */}
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(date);
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
            dayArr.push(`${new Date(fixedDay).getFullYear()}/${new Date(fixedDay).getMonth() + 1}/${new Date(fixedDay).getDate()}`)
        }
        setDates(dayArr);
        setSelectedDate(dayArr[0]);
    };


    const [selectedDinnerSlots, setSelectedDinnerSlots] = useState<{
        date: string,
        courseType: string,
        dinnerSlotId: number | null,
        isComfirmed: boolean,
        dinnerSlot: string
    }[]>([]);
    const saveDinnerSlot = (date: string ,courseType: string, dinnerSlotId: number | null, isComfirmed: boolean, dinnerSlot: string) => {
        setSelectedDinnerSlots((prev) => [
            ...prev.filter((selectedDinnerSlot) =>
                selectedDinnerSlot.date !== date
            ),{
                date: date,
                courseType: courseType,
                dinnerSlotId: dinnerSlotId,
                isComfirmed: isComfirmed,
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

            
            <div>
                <label>予約登録</label>
                <button
                    style = {{}}
                    onClick={()=>{
                        onClose();
                    }}>
                    X
                </button>
            </div>


            <div>
                <div>
                    <label>宿泊情報</label>
                </div>
                <ReservationTextField
                    mode = {mode}
                    label = "部屋番号"
                    value = {roomNumber}
                    onChange = {() => setRoomNumber}
                />
                <div>
                    <div>
                        <ReservationDateField
                            mode = {mode}
                            label = "チェックイン"
                            value = {checkin}
                            onChange = {() => setChekin}
                        />
                    </div>
                    <div>
                        <ReservationDateField
                            mode = {mode}
                            label = "チェックアウト"
                            value = {checkout}
                            onChange = {() => setCheckout}
                        />
                    </div>
                </div>
            </div>


            <div>
                <div>
                    <label>
                        人数・プラン
                    </label>
                </div>
                <ReservationNumberField
                    mode = {mode}
                    label = "大人"
                    value = {adultCount}
                    onChange = {() => setAdultCount}
                />
                <ReservationNumberField
                    mode = {mode}
                    label = "子供（食事あり）"
                    value = {childMealCount}
                    onChange = {() => setChildMealCount}
                />
                <ReservationNumberField
                    mode = {mode}
                    label = "子供（食事なし）"
                    value = {childNoMealCount}
                    onChange = {() => setChildNoMealCount}
                />
            </div>
            
            
            <div>
                <ReservationTextField
                    mode = {mode}
                    label = "食事制限"
                    value = {dietaryRestrictions}
                    onChange = {() => setDietaryRestrictions}
                />
                <ReservationTextField
                    mode = {mode}
                    label = "コメント"
                    value = {comment}
                    onChange = {() => setComment}
                />
            </div>

            
            <div>
                <div>
                    <label>日ごとの食事予定</label>
                </div>
                <div>
                    <div>
                        {dates.map((day) =>
                            <div key = {day}>
                                <label
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
                    <div>
                        <div>
                            {dinnerSlotData.length > 0 && (
                                <div>
                                    <label>夕食</label>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name = "courseType"
                                                checked = {courseType === "FULL"}
                                                onChange = {() => 
                                                    setCourseType("FULL")
                                                }
                                            />フルコース
                                        </label>
                                        <label>
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
                                        <div>
                                            {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:15").map((n) =>
                                                <div 
                                                    key = {n.id}>
                                                    <label>
                                                        <input 
                                                            type="radio"
                                                            name = "dinnerSlot"
                                                            value = {n.id}
                                                            checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                                selectedDinnerSlot.courseType === "FULL" && 
                                                                    selectedDinnerSlot.dinnerSlotId === n.id
                                                            )}
                                                            onChange = {() => {
                                                                saveDinnerSlot(i.date, "FULL", n.id, true, n.dinnerStartAt)
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                            <label>
                                                <input 
                                                    type='radio'
                                                    name = "dinnerSlot"
                                                    checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                        selectedDinnerSlot.courseType == "FULL" &&
                                                            selectedDinnerSlot.dinnerSlotId === null
                                                    )}
                                                    onChange={() => 
                                                        saveDinnerSlot(i.date, "FULL", null, false, "")
                                                    }
                                                />時間未定
                                            </label>
                                        </div>
                                    )}
                                
                                    {courseType === "HALF" && (
                                        <div>
                                            {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:00").map((n) =>
                                                <div 
                                                    key = {n.id}
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
                                                                saveDinnerSlot(i.date, "HALF", n.id, true, n.dinnerStartAt)
                                                            }}
                                                        />{n.dinnerStartAt.split("T")[1]}
                                                    </label>
                                                </div>
                                            )}
                                            <label>
                                                <input 
                                                    type='radio'
                                                    name = "dinnerSlot"
                                                    checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                        selectedDinnerSlot.courseType == "HALF" &&
                                                            selectedDinnerSlot.dinnerSlotId === null
                                                    )}
                                                    onChange={() => 
                                                        saveDinnerSlot(i.date, "FULL", null, false, "")
                                                    }
                                                />時間未定
                                            </label>
                                        </div>
                                    )}
                                    <div>

                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            朝食    
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <button onClick={handleSave}>
                    登録
                </button>
            </footer>
        </div>
    </div>
    );
}