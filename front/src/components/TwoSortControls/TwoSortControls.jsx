import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSort} from "../../store/postsSlice.js";
import "./TwoSortControls.css"

/**
 * Простой компонент с двумя селектами сортировки.
 * Опции: likeASC, likeDESC, dateASC, dateDESC
 * Правило: если в первом выбрана сортировка по лайкам,
 *        то во втором сортировка по лайкам недоступна (и наоборот для даты).
 */
export default function TwoSortControls() {
    // все опции (один источник правды)
    const OPTIONS = [
        {value: "likeASC", label: "reaction ↑", group: "like"},
        {value: "likeDESC", label: "reaction ↓", group: "like"},
        {value: "dateASC", label: "Date ↑", group: "date"},
        {value: "dateDESC", label: "Date ↓", group: "date"},
    ];

    // состояние выбранных значений
    const dispatch = useDispatch()
    const default0 = useSelector(state => state.posts.requestParams.sort[0])
    const default1 = useSelector(state => state.posts.requestParams.sort[1])
    const [sortA, setSortA] = useState(default0); // значение первого селекта
    const [sortB, setSortB] = useState(default1); // значение второго селекта

    // helper: возвращает группу опции по её value (или null)
    const getGroup = (val) => {
        const opt = OPTIONS.find(o => o.value === val);
        return opt ? opt.group : null;
    };




    useEffect(() => {
        const g1 = getGroup(sortA);
        const g2 = getGroup(sortB);
        if (g1 && g2 && g1 === g2) setSortB("");
        else if (default0 !== sortA || default1 !== sortB)
            dispatch(setSort([sortA, sortB]));
    }, [sortA, sortB]);





    return (
        <div className="sorts-container">
            {/* Первый селект — главный. Здесь доступны все опции */}
            <label className="form-row">
                Order by: 1
                <select
                    value={default0}
                    onChange={
                        (e) => setSortA(e.target.value)
                    }
                >
                    <option value="">----</option>
                    {OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </label>

            {/* Второй селект — вторичный. Опции, принадлежащие той же группе что и sort1, делаем disabled */}
            <label className="form-row">
                2
                <select
                    value={default1}
                    onChange={
                        (e) =>
                            setSortB(e.target.value)
                    }


                >
                    <option value="">----</option>
                    {OPTIONS.map(opt => {
                        const sameGroup = getGroup(sortA) && getGroup(sortA) === opt.group;
                        return (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={sameGroup} // делаем недоступной, если та же группа
                                title={sameGroup ? "Unavailable because primary sort uses same group" : ""}
                            >
                                {opt.label}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}




