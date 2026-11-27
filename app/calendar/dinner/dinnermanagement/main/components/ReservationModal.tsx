'use client';

import styles from './Modal.module.css';
import { useState, useEffect } from 'react';
import ReservationTextField from "./fields/ReservationTextField";
import ReservationNumberField from "./fields/ReservationNumberField";
import ReservationDateField from "./fields/ReservationDateField";
import MealSchedule from './mealSchedule/MealSchedule';

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


export default function ReservationModal({
    mode,
    date,
    reservation,
    onClose,
 }:Props){

    const [roomNumber, setRoomNumber] = useState(reservation?.roomNumber ?? "");
    const [adultCount, setAdultCount] = useState(reservation?.adultCount ?? 0);
    const [childMealCount, setChildMealCount] = useState(reservation?.childMealCount ?? 0);
    const [childNoMealCount, setChildNoMealCount] = useState(reservation?.childNoMealCount ?? 0);
    const [checkin, setChekin] = useState(reservation?.checkin ?? date);
    const [checkout, setCheckout] = useState(reservation?.checkout ?? "");
    const [dietaryRestrictions, setDietaryRestrictions] = useState(reservation?.dietaryRestrictions ?? "");
    const [comment, setComment] = useState(reservation?.comment ?? "");

    





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
                <MealSchedule
                    mode = {mode}
                    date = {date}
                    checkin = {checkin}
                    checkout = {checkout}
                    label = "食事"
                    setCheckout = {setCheckout}
                />
            </div>

            
            <div>
                <div>
                    <label>日ごとの食事予定</label>
                </div>
                <div>
                    <div>
                        
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