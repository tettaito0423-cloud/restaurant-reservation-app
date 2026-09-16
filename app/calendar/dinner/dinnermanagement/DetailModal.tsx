'use client';

import styles from '../../../Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'

type Props = {
    scheData: DinnerSlot[] | null;
    chosenReservation: Reservation | null;
    onClose: ()=> void;
};

export default function Modal({
    onClose,
    scheData,
    chosenReservation,
 }:Props){
    const [dinnerSlotId, setDinnerSlotId] = useState<number | null>(chosenReservation?.dinnerSlotId ?? null);
    const [roomNumber, setRoomNumber] = useState<number | null>(chosenReservation?.roomNumber ?? null);
    const [peopleNumber, setPeopleNumber] = useState<number | null>((chosenReservation?.guestCount ?? null));


    const handleSave = async ()=>{
        await fetch('/api/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dinnerSlotId: Number(dinnerSlotId),
                roomNumber: Number(roomNumber),
                peopleNumber: Number(peopleNumber)
            }),
        });
        onClose();
    };

    return(
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <button 
                onClick={()=>{
                    setRoomNumber(null);
                    setPeopleNumber(null);
                    onClose();
                }}>
                X
            </button>

            <div>
                <p>部屋番号</p>
                <input
                    type="number"
                    value={roomNumber ?? ""}
                    onChange={(e) =>
                        setRoomNumber(e.target.value === "" ? null : Number(e.target.value))
                    }
                />
            </div>
            <div>
                <p>人数</p>
                <input
                    type="number"
                    value = {peopleNumber ?? ""}
                    onChange={(e) =>
                        setPeopleNumber(e.target.value === "" ? null : Number(e.target.value))
                    }
                />
            </div>

            <div>
                <p>タイムテーブル</p>
                {scheData?.map((timeTable)=>(
                    <div>
                        <input
                            type="radio"
                            value={dinnerSlotId ?? ""}
                            checked={dinnerSlotId === timeTable.id}
                            onChange={()=>setDinnerSlotId(timeTable.id)}
                        />
                        <label>
                            {timeTable.startAt}
                        </label>
                    </div>
                ))}
                
            </div>

            <button onClick={handleSave}>
                登録
            </button>
        </div>
    </div>
    );
}