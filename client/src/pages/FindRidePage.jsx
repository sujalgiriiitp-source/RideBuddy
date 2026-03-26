import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import RideCard from '../components/RideCard'
import RideCardSkeleton from '../components/RideCardSkeleton'
import { api, getErrorMessage } from '../services/api'
import { toDateInputValue } from '../utils/date'

const FindRidePage = () => {
  const [filters, setFilters] = useState({ from: '', to: '', date: '', vehicle: '' })
  const [rides, setRides] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRides = useCallback(async (activeFilters = {}) => {
    setIsLoading(true)

    try {
      const response = await api.get('/rides', { params: activeFilters })
      setRides(response.data.rides)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch rides'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRides()
  }, [fetchRides])

  const handleSearch = async (event) => {
    event.preventDefault()
    fetchRides(filters)
  }

  const resetFilters = async () => {
    setFilters({ from: '', to: '', date: '', vehicle: '' })
    setIsLoading(true)

    try {
      const response = await api.get('/rides')
      setRides(response.data.rides)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to reset filters'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="section-card p-5">
        <h1 className="page-title mb-4">Find Your Ride</h1>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSearch}>
          <input
            placeholder="From"
            value={filters.from}
            onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
            className="input-field"
          />
          <input
            placeholder="To"
            value={filters.to}
            onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
            className="input-field"
          />
          <input
            type="date"
            min={toDateInputValue()}
            value={filters.date}
            onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))}
            className="input-field"
          />
          <select
            value={filters.vehicle}
            onChange={(event) => setFilters((prev) => ({ ...prev, vehicle: event.target.value }))}
            className="input-field"
          >
            <option value="">All Vehicles</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>

          <div className="mt-1 grid grid-cols-2 gap-2 md:col-span-2 md:max-w-xs">
            <button className="primary-btn w-full text-xs">
              Search
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="secondary-btn w-full text-xs"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {isLoading ? (
          <>
            <RideCardSkeleton />
            <RideCardSkeleton />
          </>
        ) : rides.length ? (
          rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
        ) : (
          <div className="section-card md:col-span-2">
            <p className="text-sm text-slate-600">No rides match these filters. Try changing location, date, or vehicle.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default FindRidePage
