import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
}:{
    scheData: DinnerSlot[];
}) {
    return (
        <div className={styles.narrowDown}>
            <div>
                {scheData.map((dinnerSlot)=>(
                    <button key = {dinnerSlot.id}>
                        {dinnerSlot.startAt}
                    </button>
                ))}
                <button>
                    1・2人
                </button>
                <button>
                    3人
                </button>
                <button>
                    4人
                </button>
            </div>
        </div>
    );
}