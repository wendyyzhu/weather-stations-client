export default function StateSelection({ onChange }) {
    return (
        <div className="state-selection">
            <label>State</label>
            <select onChange={onChange}>
                <option value="All">All</option>
                <option value="NSW">New South Wales</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="VIC">Victoria</option>
            </select>
        </div>
    )
}