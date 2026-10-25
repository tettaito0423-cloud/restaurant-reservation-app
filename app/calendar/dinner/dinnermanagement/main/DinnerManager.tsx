import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../../lib/getTimetable'
import {Reservation} from '../../../../../lib/getReservations'

export default function DinnerManager({
    dinnerSlotData,
    reservationData,
    smallParty,
    mediumParty,
    largeParty
}:{
    dinnerSlotData:DinnerSlot[];
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
                        {/**
                            {dinnerSlotData.map((dinnerSlot)=>(
                                <tr 
                                    key={dinnerSlot.date}
                                >
                                    <th>
                                        
                                    </th>
                                    <td>
                                        <div className={styles.textContainer}>
                                            <div>
                                                {reservationData.filter((reservation)=>
                                                    reservation.guestCount <= smallParty && reservation.dinnerSlotId === dinnerSlot.date)
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
                                                reservation.guestCount === mediumParty && reservation.dinnerSlotId === dinnerSlot.date)
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
                                                reservation.guestCount >= largeParty && reservation.dinnerSlotId === dinnerSlot.date)
                                                .length
                                            }件
                                        </div>
                                        <div>
                                            残り
                                        </div>
                                    </td>
                                </tr>
                            ))}
                         */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}