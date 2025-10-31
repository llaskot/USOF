import "./DatePicker.css"


import {createPortal} from "react-dom";
import {DateRangePicker} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {useEffect, useState} from "react";
import "./DatePicker.css"
import {useDispatch, useSelector} from "react-redux";
import {setDateFrom, setDateTo} from "../../../store/postsSlice.js";


export function CalendarButton() {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState([
        {startDate: new Date(2010, 0, 1), endDate: new Date(), key: "selection"}
    ]);
    const reset = useSelector(state => state.posts.reset);
    useEffect(() => {setRange([{startDate: new Date(2010, 0, 1), endDate: new Date(), key: "selection"}])
    }, [reset])

    return (
        <>
            <button className="calendar-btn" onClick={() => setOpen(true)}>
                {range[0].startDate.toLocaleDateString()} — {range[0].endDate.toLocaleDateString()}
            </button>

            {open && (
                <CalendarPopup
                    onClose={() => setOpen(false)}
                    onChange={(param) => {
                        setRange([{
                            startDate: param.startDate,
                            endDate: param.endDate,
                            key: "selection"
                        }]);
                    }
                    }
                />
            )}
        </>
    );
}



function CalendarPopup({onChange, onClose}) {
    const [tempRange, setTempRange] = useState([
        {startDate: new Date(), endDate: new Date(), key: "selection"}
    ]);
    const dispatch = useDispatch();

    const handleOk = () => {
        onChange(tempRange[0]);
        dispatch(setDateFrom(_formatDateForRequest(tempRange[0].startDate, 0, 0, 0)));
        dispatch(setDateTo(_formatDateForRequest(tempRange[0].endDate, 23, 59, 59)))
        onClose();
    };

    const handleCancel = () => {
        onClose(); // не меняем диапазон
    };

    return createPortal(
        <div className="calendar-overlay">
            <div className="calendar-content">
                <DateRangePicker
                    ranges={tempRange}
                    onChange={item => setTempRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    direction="horizontal"
                />
                <div className="calendar-buttons">
                    <button onClick={handleOk}>OK</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>,
        document.getElementById("modal")
    );
}




function _formatDateForRequest(date, h, m, s) {
    const pad = n => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    return `${yyyy}-${mm}-${dd}%20${h}:${m}:${s}`;
}

