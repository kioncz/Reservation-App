import { useState } from 'react'
import Bar_inic from '../../components/Bar_inc/Bar_inic.jsx'
import Event_inc from '../../components/Events_inic/Event_inc.jsx'
import Filter_bar from '../../components/Filter_bar/Filter_bar.jsx'

function Menu_user() {
    const [filteredEvents, setFilteredEvents] = useState(null)

    return (
        <div className="menu_user">
            <Bar_inic />
            <Filter_bar onFilterChange={setFilteredEvents} />
            <Event_inc filteredEvents={filteredEvents} />
        </div>
            )
    }

export default Menu_user

