import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
    addSelectedDinnerSlotId,
    }:{
    scheData: DinnerSlot[];
    addSelectedDinnerSlotId: any;
}) {
    return (
        <div className={styles.narrowDown}>
            <div>
                {scheData.map((dinnerSlot)=>(
                    <button 
                        className={`${styles.btn} ${styles.btnLine}`}
                        key = {dinnerSlot.id}
                        onClick={()=>{
                            addSelectedDinnerSlotId(dinnerSlot.id)
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