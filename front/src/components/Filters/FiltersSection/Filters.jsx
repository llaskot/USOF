import {CalendarButton} from "../DatePicker/DatePicker.jsx";
import TwoSortControls from "../../TwoSortControls/TwoSortControls.jsx";
import "./FiltersSection.css"
import Toggle from "../../Togle/Toggle.jsx";
import {useDispatch, useSelector} from "react-redux";
import {cleanAll, setAllCategory, setInactive, setMy_own} from "../../../store/postsSlice.js";
import Button from "../../Button/Button.jsx";
import {filter, update} from "../../../store/categSlice.js";

export default function Filters() {
    const dispatch = useDispatch();
    const categoryState = useSelector(state => state.posts.requestParams.allCategory)
    const inactiveState = useSelector(state => state.posts.requestParams.inactive)
    const allCategories = useSelector(state => state.categories.allCategories);
    const userId = useSelector(state => state.auth.user?.id);
    const my_ownStatus = useSelector(state => state.posts.requestParams.my_own);

    return (
        <section className='filters'>
            <Toggle
                value={categoryState}
                onChange={(val) => dispatch(setAllCategory(val))}
                labels={["All", "Any"]}
                suffix="Categories"
            />
            <Toggle
                value={inactiveState}
                onChange={(val) => dispatch(setInactive(val))}
                labels={["✓", "✗"]}
                suffix="Inactive"/>
            { userId &&  <Toggle
                value={my_ownStatus}
                onChange={(val) => {
                    if (val) dispatch(setMy_own(userId))
                    else dispatch(setMy_own(false))
                }}
                labels={["All", "MY"]}
                suffix=""/>}
            <CalendarButton></CalendarButton>
            <TwoSortControls></TwoSortControls>
            <Button
                onChange={() => {
                    dispatch(cleanAll());
                    dispatch(filter([]));
                    const updatedCategories = allCategories.map(category =>
                        ({...category, selected: false})
                    );
                    dispatch(update({categories: updatedCategories}));
                }}
                className={"clean-all"}
            >Clean All</Button>
        </section>
    );
}