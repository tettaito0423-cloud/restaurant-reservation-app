import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function DinnerManager({
    scheData,
    reservationData,
}:{
    scheData:DinnerSlot[];
    reservationData:Reservation[];
}) {
    return (
        <div className={styles.timeCard}>
            <div className={styles.timeSlot}>
                <p>{scheData[0].startAt}</p>
                <div className={styles.limit}>
                    <p>1~2名</p>
                    <p>3名</p>
                    <p>4名~</p>
                </div>
            </div>
            <div className={styles.timeSlot}>
                <p>{scheData[1].startAt}</p>
                <div className={styles.limit}>
                    <p>1~2名</p>
                    <p>3名</p>
                    <p>4名~</p>
                </div>
            </div>
        </div>
    );
}