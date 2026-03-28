import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import RideCard from '../components/RideCard'
import RideCardSkeleton from '../components/RideCardSkeleton'
import { api, getErrorMessage } from '../services/api'
import { toDateInputValue } from '../utils/date'

const FindRidePage = () => {
  const [filters, setFilters] = useState({ from: '', to: '', date: '', vehicle: '' })
  const [activeFilters, setActiveFilters] = useState({})
  const [rides, setRides] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 })
  const [isLoading, setIsLoading] = useState(true)

  const fetchRides = useCallback(async (activeFiltersPayload = {}, pageValue = 1) => {
    setIsLoading(true)

    const params = {
      ...activeFiltersPayload,
      page: pageValue,
      limit,
    }

    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    try {
      const response = await api.get('/rides', { params })
      setRides(response.data.rides)
      setPagination(
        response.data.pagination || {
          page: pageValue,
          pages: 1,
          total: response.data.rides?.length || 0,
          limit,
        },
      )
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch rides'))
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchRides(activeFilters, page)
  }, [fetchRides, activeFilters, page])

  const handleSearch = async (event) => {
    event.preventDefault()
    setPage(1)
    setActiveFilters(filters)
  }

  const resetFilters = async () => {
    setFilters({ from: '', to: '', date: '', vehicle: '' })
    setActiveFilters({})
    setPage(1)
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

      {!isLoading && pagination.pages > 1 && (
        <section className="section-card flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="secondary-btn px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm font-medium text-slate-700">
            Page {pagination.page} of {pagination.pages} · {pagination.total} rides
          </p>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={page >= pagination.pages}
            className="secondary-btn px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </section>
      )}
    </div>
  )
}

export default FindRidePage
