'use client';

import styles from '../../../Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../lib/getReservations'

type Props = {
    dinnerSlotId: number|null;
    reservationId: number|null;
    reservationData: Reservation[]
    onClose: ()=> void;
    setReservationId: (id: number | null) => void;
};

export default function Modal({
    onClose,
    dinnerSlotId,
    reservationId,
    reservationData,
    setReservationId
 }:Props){

    const [roomNumber, setRoomNumber] = useState<number| null>(null);;
    const [peopleNumber, setPeopleNumber] = useState<number| null>(null);;


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
    console.log(reservationData)



    return(
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <button 
                onClick={()=>{
                    onClose();
                    setReservationId(null);
                }}
            >
                X
            </button>
            <p>部屋番号</p>
            <input
                type="number"
                value={roomNumber ?? ""}
                onChange={(e) =>
                    setRoomNumber(e.target.value === "" ? null : Number(e.target.value))
                }
            />
            <p>人数</p>
            <input
                type="number"
                value = {peopleNumber ?? ""}
                onChange={(e) =>
                    setPeopleNumber(e.target.value === "" ? null : Number(e.target.value))
                }
            />
            <button onClick={handleSave}>
                登録
            </button>
        </div>
    </div>
    );
 }