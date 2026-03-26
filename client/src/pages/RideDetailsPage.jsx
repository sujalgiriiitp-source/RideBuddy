import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { api, getErrorMessage } from '../services/api'
import { formatDate } from '../utils/date'

const RideDetailsPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [ride, setRide] = useState(null)
  const [interests, setInterests] = useState([])
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwner = useMemo(() => {
    return ride && user && String(ride.userId?._id) === String(user._id)
  }, [ride, user])

  const fetchRideDetails = useCallback(async () => {
    try {
      const response = await api.get(`/rides/${id}`)
      setRide(response.data.ride)
      setInterests(response.data.interests || [])
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to fetch ride details'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRideDetails()
  }, [fetchRideDetails])

  const handleJoinRide = async () => {
    setIsSubmitting(true)

    try {
      await api.post(`/rides/${id}/join`, { message })
      toast.success('Join request sent')
      fetchRideDetails()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to send request'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestStatusUpdate = async (interestId, status) => {
    try {
      await api.patch(`/rides/interests/${interestId}`, { status })
      toast.success(`Request ${status}`)
      fetchRideDetails()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update request'))
    }
  }

  const submitRating = async () => {
    try {
      await api.post(`/users/${ride.userId._id}/rate`, { rating: Number(rating) })
      toast.success('Rating submitted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to submit rating'))
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading ride details..." />
  }

  if (!ride) {
    return <p className="text-sm text-slate-600">Ride not found.</p>
  }

  return (
    <section className="space-y-5">
      <article className="section-card p-5">
        <h1 className="text-xl font-bold text-slate-900">
          {ride.from} → {ride.to}
        </h1>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium">Date:</span> {formatDate(ride.date)}
          </p>
          <p>
            <span className="font-medium">Time:</span> {ride.time}
          </p>
          <p>
            <span className="font-medium">Vehicle:</span> {ride.vehicle}
          </p>
          <p>
            <span className="font-medium">Seats:</span> {ride.availableSeats}/{ride.seats}
          </p>
          <p>
            <span className="font-medium">Driver:</span> {ride.userId.name} ({ride.userId.phone})
          </p>
          <p>
            <span className="font-medium">Rating:</span> {ride.userId?.averageRating || 0}/5
          </p>
        </div>

        {ride.notes && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{ride.notes}</p>}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a
            href={`https://wa.me/${ride.userId.phone}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Chat on WhatsApp
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Join me on RideBuddy! Ride: ${ride.from} to ${ride.to}`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-green-600 px-3 py-2 text-center text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            Invite via WhatsApp
          </a>
        </div>
      </article>

      {isAuthenticated && !isOwner && (
        <article className="section-card p-5">
          <h2 className="text-lg font-bold text-slate-900">Request to Join</h2>
          <textarea
            rows={2}
            placeholder="Add a short message (optional)"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="input-field mt-2"
          />
          <button disabled={isSubmitting} onClick={handleJoinRide} className="primary-btn mt-2">
            {isSubmitting ? 'Sending request...' : 'Join Ride'}
          </button>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <h3 className="text-sm font-semibold text-slate-800">Rate this driver</h3>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                className="input-field max-w-[90px]"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button onClick={submitRating} className="secondary-btn px-3 py-1 text-xs">
                Submit Rating
              </button>
            </div>
          </div>
        </article>
      )}

      <article className="section-card p-5">
        <h2 className="text-lg font-bold text-slate-900">Participants</h2>
        <div className="mt-2 space-y-2">
          {ride.participants?.length ? (
            ride.participants.map((participant) => (
              <p key={participant._id} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {participant.name} - {participant.phone}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-500">No accepted participants yet.</p>
          )}
        </div>
      </article>

      {isOwner && (
        <article className="section-card p-5">
          <h2 className="text-lg font-bold text-slate-900">Join Requests</h2>
          <div className="mt-2 space-y-2">
            {interests.length ? (
              interests.map((interest) => (
                <div
                  key={interest._id}
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700"
                >
                  <p className="font-medium">
                    {interest.userId?.name} ({interest.userId?.phone})
                  </p>
                  <p className="text-xs text-slate-500">Status: {interest.status}</p>
                  {interest.message && <p className="mt-1 text-xs">Message: {interest.message}</p>}
                  {interest.status === 'pending' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleRequestStatusUpdate(interest._id, 'accepted')}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestStatusUpdate(interest._id, 'rejected')}
                        className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No requests yet.</p>
            )}
          </div>
        </article>
      )}
    </section>
  )
}

export default RideDetailsPage
