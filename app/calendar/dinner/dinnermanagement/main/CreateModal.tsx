'use client';

import styles from '../../../../Modal.module.css';
import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../lib/getTimetable'

type Props = {
    date: string;
    onClose: () => void;
    getSchedule: () => void;
};

export default function Modal({
  date,
  onClose,
  getSchedule
}: Props) {


  const [part, setPart] = useState("");
  const [firstSlot, setFirst] = useState("18:00");
  const [secondSlot, setSecond] = useState("18:30");
  const [thirdSlot, setThird] = useState("");
  const halhFirstSlot = "18:15";



  const handleSave = async () => {
    const times:string[] = [firstSlot, halhFirstSlot, secondSlot, thirdSlot].filter(Boolean);

    await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        times,
      }),
    });
    getSchedule()
    onClose();
  };

  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>


        <button onClick={onClose}>
            X
        </button>
        <h2>{date}</h2>
        <select
          value={part}
          onChange={(e)=>setPart(e.target.value)}
        >
          <option value="">--1 つ選択してください--</option>
          <option value="2部制">2部制</option>
          <option value="3部制">3部制</option>
        </select>


        {part === "2部制" &&(
          <div>
            <input
              type="time"
              value={firstSlot}
              onChange={(e)=>
                setFirst(e.target.value)
              }
            />
            <input
              type="time"
              value={secondSlot}
              onChange={(e)=>
                setSecond(e.target.value)
              }
            />
          </div>
        )}

        {part === "3部制" &&(
          <div>
            <input
              type="time"
              value={"18:00"}
              onChange={(e)=> {
                setFirst(e.target.value)
              }}
            />
            <input
              type="time"
              value={"18:30"}
              onChange={(e)=> 
                setSecond(e.target.value)
              }
            />
            <input
              type="time"
              value={thirdSlot}
              onChange={(e)=> 
                setThird(e.target.value)
              }
            />
          </div>
        )}


        <button onClick={handleSave}>
            登録
        </button>


      </div>
    </div>
  );
}