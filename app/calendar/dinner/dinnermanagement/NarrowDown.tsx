import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
    updateSelectedDinnerSlotId,
    }:{
    scheData: DinnerSlot[];
    updateSelectedDinnerSlotId: any;
}) {
    return (
        <div className={styles.narrowDown}>
            <div>
                {scheData.map((dinnerSlot)=>(
                    <button 
                        className={`${styles.btn} ${styles.btnLine}`}
                        key = {dinnerSlot.id}
                        onClick={()=>{
                            updateSelectedDinnerSlotId(dinnerSlot.id)
                        }}
                    >
                        {dinnerSlot.startAt}
                    </button>
                ))}
            </div>
            <div>
                <button className={`${styles.btn} ${styles.btnLine}`}>
                    1・2人
                </button>
                <button className={`${styles.btn} ${styles.btnLine}`}>
                    3人
                </button>
                <button className={`${styles.btn} ${styles.btnLine}`}>
                    4人
                </button>
            </div>
        </div>
    );
}