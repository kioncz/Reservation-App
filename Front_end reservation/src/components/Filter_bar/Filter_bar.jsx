import React from 'react';
import { getFilteredEvents } from '../../api/eventapi.js'


const Filter_bar = ({ onFilterChange }) => {
    const [filters, setFilters] = React.useState({  
        date: '',
        hour: '',
        location: ''
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const filteredEvents = await getFilteredEvents(filters);
            onFilterChange(filteredEvents);
        } catch (error) {
            console.error('Error al obtener eventos filtrados:', error);
        }
    };

    return (
        <form className="mx-auto grid max-w-295 grid-cols-1 items-end gap-4 bg-white/95 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
                <span>Fecha</span>
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-normal text-slate-800 outline-none transition focus:border-orange-700 focus:bg-white focus:ring-2 focus:ring-orange-200"
                />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
                <span>Hora</span>
                <input
                    type="time"
                    value={filters.hour}
                    onChange={(e) => handleFilterChange('hour', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-normal text-slate-800 outline-none transition focus:border-orange-700 focus:bg-white focus:ring-2 focus:ring-orange-200"
                />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
                <span>Ubicación</span>
                <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Ej. Guayas"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-700 focus:bg-white focus:ring-2 focus:ring-orange-200"
                />
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                <button type="submit" className="flex-1 rounded-lg bg-orange-700 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300">
                    Buscar
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-lg bg-slate-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    onClick={() => {
                        setFilters({ date: '', hour: '', location: '' });
                        onFilterChange(null);
                    }}
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
}

export default Filter_bar;