import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { api, getErrorMessage } from '../services/api'
import { formatDate } from '../utils/date'

const RideCard = ({ ride, showActions = true }) => {
  const { user, isAuthenticated } = useAuth()
  const [isJoining, setIsJoining] = useState(false)

  const formattedPhone = String(ride?.userId?.phone || '').replace(/\D/g, '')
  const waLink = `https://wa.me/${formattedPhone}`

  const isOwner = user?._id && ride?.userId?._id && String(user._id) === String(ride.userId._id)
  const hasSeats = Number(ride?.availableSeats || 0) > 0

  const handleJoinRide = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join rides')
      return
    }

    if (isOwner) {
      toast.error('You cannot join your own ride')
      return
    }

    if (!hasSeats) {
      toast.error('No seats available')
      return
    }

    setIsJoining(true)

    try {
      await api.post(`/rides/${ride._id}/join`, { message: '' })
      toast.success('Join request sent successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to join this ride'))
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <article className="section-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-bold text-slate-900">
          {ride.from} → {ride.to}
        </p>
        <span className="chip">
          {ride.vehicle}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-slate-600">
        <p>
          <span className="font-medium">Date:</span> {formatDate(ride.date)}
        </p>
        <p>
          <span className="font-medium">Time:</span> {ride.time}
        </p>
        <p>
          <span className="font-medium">Seats:</span> {ride.availableSeats}/{ride.seats}
        </p>
        <p>
          <span className="font-medium">Driver:</span> {ride?.userId?.name} ({ride?.userId?.phone})
        </p>
      </div>

      {ride.notes && <p className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">{ride.notes}</p>}

      {showActions && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            onClick={handleJoinRide}
            disabled={isJoining || !hasSeats || isOwner}
            className="primary-btn px-3 py-2 text-center text-xs"
          >
            {isOwner ? 'Your Ride' : isJoining ? 'Joining...' : hasSeats ? 'Join Ride' : 'No Seats'}
          </button>
          <Link
            to={`/rides/${ride._id}`}
            className="dark-btn px-3 py-2 text-center text-xs"
          >
            View Details
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-green-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-green-700"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
    </article>
  )
}

export default RideCard
