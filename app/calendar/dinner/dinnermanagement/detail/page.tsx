'use client';


import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'
import {fetchReservation, Reservation} from '../../../../../lib/getReservations'
import { stringify } from 'querystring';

type Props = {
    date: string;
    onClose: ()=> void;
};

export default function ReservationModal({
    date,
    onClose,
 }:Props){
    
    const [roomNumber, setRoomNumber] = useState<string>("");
    const [adultCount, setAdultCount] = useState<number>();
    const [childMealCount, setChildMealCount] = useState<number>()
    const [childNoMealCount, setChildNoMealCount] = useState<number>()
    const [checkin, setChekin] = useState<string>(date)
    const [checkout, setChekout] = useState<string>()
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string>()
    const [comment, setComment] = useState<string>()


    return(
    <div>
        <div>
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
                        onChange={(e)=>
                            setChekout(e.target.value)
                        }
                    />
                </div>
            </div>
            <div>
                <div>
                    <p>大人</p>
                        <input
                            type="number"
                        />
                </div>
                <div>
                    <div>
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
            <div>
                <p>タイムテーブル</p>
                
            </div>
        </div>
    </div>
    );
}