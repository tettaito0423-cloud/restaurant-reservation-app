'use client';
import styles from './Modal.module.css';

type Props = {
  date: string;
  onClose: () => void;
  onMoveRestaurant:() => void;
  onMoveFront:() => void;
};

export default function Modal({
date,
  onClose,
  onMoveRestaurant,
  onMoveFront,
}: Props){

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose}>
          X
        </button>
        <h2>{date}</h2>
        <div>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <button onClick={onMoveFront}>
                予約管理
            </button>
            <button onClick={onMoveRestaurant}>
                営業管理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}