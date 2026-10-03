import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function SelectPlan({
    reservationData,
}:{
    reservationData: Reservation[];
}) {
    return (
        <div>
            <button
                className={`${styles.btn} ${styles.btnLine}`}
            >
                すべて
                {reservationData.length}
            </button>
            <button
                className={`${styles.btn} ${styles.btnLine}`}
            >
                夕食
            </button>
            <button
                className={`${styles.btn} ${styles.btnLine}`}
            >
                朝食
            </button>
        </div>
    );
}