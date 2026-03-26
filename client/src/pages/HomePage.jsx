import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorBanner from '../components/ErrorBanner'
import RideCard from '../components/RideCard'
import LoadingSpinner from '../components/LoadingSpinner'
import RideCardSkeleton from '../components/RideCardSkeleton'
import { api, getErrorMessage } from '../services/api'

const HomePage = () => {
  const [rides, setRides] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/rides')
        setRides(response.data.rides.slice(0, 6))
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load rides right now'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRides()
  }, [])

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-card">
        <p className="text-xs uppercase tracking-widest text-brand-100">RideBuddy</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">Travel smarter across your city</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-100 md:text-base">
          Find safe rides with verified students, split costs, and reach on time.
        </p>
        <div className="mt-5 flex gap-2">
          <Link to="/find" className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-brand-700 md:text-sm">
            Find Ride
          </Link>
          <Link
            to="/offer"
            className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-semibold text-white md:text-sm"
          >
            Offer Ride
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Rides</h2>
          <Link to="/find" className="text-xs font-semibold text-brand-600">
            View all
          </Link>
        </div>

        <ErrorBanner message={error} className="mb-3" />

        <div className="grid gap-3 md:grid-cols-2">
          {isLoading ? (
            <>
              <RideCardSkeleton />
              <RideCardSkeleton />
            </>
          ) : rides.length ? (
            rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
          ) : (
            <p className="text-sm text-slate-600">No rides posted yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
