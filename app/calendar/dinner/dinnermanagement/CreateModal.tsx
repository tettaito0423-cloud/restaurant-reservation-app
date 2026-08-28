'use client';

import styles from '../../../Modal.module.css';
import { useState } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../lib/getTimetable'

type Props = {
    date: string;
    onClose: () => void;

};

export default function Modal({
  date,
  onClose,
}: Props) {


  const [part, setPart] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");


  const handleSave = async () => {
    const times:string[] = [first, second, third].filter(Boolean);

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
    fetchSchedule(date)
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
              value={first}
              onChange={(e)=>
                setFirst(e.target.value)
              }
            />
            <input
              type="time"
              value={second}
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
              value={first}
              onChange={(e)=> {
                setFirst(e.target.value)
              }}
            />
            <input
              type="time"
              value={second}
              onChange={(e)=> 
                setSecond(e.target.value)
              }
            />
            <input
              type="time"
              value={third}
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