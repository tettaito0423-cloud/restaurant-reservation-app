import styles from './Table.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function DinnerTable2({
    scheData,
    reservationData,
    setSelectedCell,
    setModalType,
    setDinnerSlotId,
    setReservationId
}:{
    scheData: DinnerSlot[];
    reservationData: Reservation[];
    setSelectedCell: any;
    setModalType: any;
    setDinnerSlotId: any;
    setReservationId: any;
}) {

    const judge = (num: number)=>{
        return reservationData.filter((item)=>
            item.dinnerSlotId === scheData[num].id
        )
    };

    const reservations_1 = judge(0)
    const reservations_2 = judge(1)
    
    return (
        <div className={styles.container}>
        <table className={styles.table}>
            <tbody>
                <tr>
                    <td className={styles.timeCell}>
                        {scheData[0].startAt}
                    </td>
                    {reservations_1.map((reservation, index) => ( 
                        <td key={index}
                            className={styles.cell}
                            onClick={()=>{
                                setSelectedCell(index+1);
                                setModalType('detail'); 
                                setDinnerSlotId(scheData[0].id)
                                setReservationId(reservation.id)
                            }}
                        >
                            <p>{reservation.roomNumber}</p>
                            <p>{reservation.guestCount}名</p>
                        </td>
                    ))}
                    <td className={styles.cell}
                        onClick={()=>{
                            setModalType('detail'); 
                            setDinnerSlotId(scheData[0].id)
                        }}
                    >
                        +
                    </td>
                </tr>
                <tr>
                    <td className={styles.timeCell}>
                        {scheData[1].startAt}
                    </td>
                    {Array.from({ length: reservations_2.length }).map((_, index) => ( 
                        <td key={index}
                            className={styles.cell}
                            onClick={()=>{
                                setSelectedCell(index+1);
                                setModalType('detail'); 
                                setDinnerSlotId(scheData[0].id)
                                setReservationId(reservations_2[index].id)
                            }}
                        >
                        <p>{reservations_2[index].roomNumber}</p>
                        <p>{reservations_2[index].guestCount}名</p>
                        </td>
                    ))}
                    <td className={styles.cell}
                        onClick={()=>{
                            setModalType('detail'); 
                            setDinnerSlotId(scheData[0].id)
                        }}
                    >
                        +
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    );
}