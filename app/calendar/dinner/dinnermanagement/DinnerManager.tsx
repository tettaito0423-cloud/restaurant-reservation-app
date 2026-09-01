import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function DinnerManager({
    scheData,
    reservationData
}:{
    scheData:DinnerSlot[];
    reservationData:Reservation[];
}) {
    return (
        <div className={styles.page}>
            <div className={styles.list}>
                <input type="text" />
                {reservationData.map((reservation)=>(
                    <div className={styles.container}>
                        <p>{reservation.roomNumber}</p>
                        <p>{reservation.guestCount}名</p>
                    </div>
                ))}

            </div>
            <div className={styles.info}>
                <div className={styles.card}>
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
                <div>
                    <p>時間未定</p>
                </div>
            </div>
        </div>
    );
}