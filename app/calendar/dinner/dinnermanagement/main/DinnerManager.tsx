import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../../lib/getTimetable'
import {Reservation} from '../../../../../lib/getReservations'

export default function DinnerManager({
    scheData,
    reservationData,
    smallParty,
    mediumParty,
    largeParty
}:{
    scheData:DinnerSlot[];
    reservationData:Reservation[];
    smallParty: number;
    mediumParty: number;
    largeParty: number;
}) {
    return (
        <div className={styles.situation}>
            <div className = {styles.dinnerSituation}>
                <div className = {styles.dinnerHeader}>
                    <p className={styles.title}>
                        夕食
                    </p>
                    <p className={styles.subtitle}>予約状況</p>
                </div>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>人数</th>
                            <th>1・2名</th>
                            <th>3名</th>
                            <th>4名以上</th>
                        </tr>
                            {scheData.map((schedule)=>(
                                <tr
                                    key={schedule.id}
                                >
                                    <th>
                                        {schedule.startAt}
                                    </th>
                                    <td>
                                        <div className={styles.textContainer}>
                                            <div>
                                                {reservationData.filter((reservation)=>
                                                    reservation.guestCount <= smallParty && reservation.dinnerSlotId === schedule.id)
                                                    .length
                                                }件
                                            </div>
                                            <div>
                                                残り
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {reservationData.filter((reservation)=>
                                                reservation.guestCount === mediumParty && reservation.dinnerSlotId === schedule.id)
                                                .length
                                            }件
                                        </div>
                                        <div>
                                            残り
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {reservationData.filter((reservation)=>
                                                reservation.guestCount >= largeParty && reservation.dinnerSlotId === schedule.id)
                                                .length
                                            }件
                                        </div>
                                        <div>
                                            残り
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}