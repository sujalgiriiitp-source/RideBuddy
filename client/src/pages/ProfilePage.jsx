import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import RideCard from '../components/RideCard'
import { useAuth } from '../context/AuthContext'
import { api, getErrorMessage } from '../services/api'

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth()
  const [postedRides, setPostedRides] = useState([])
  const [rideHistory, setRideHistory] = useState([])
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await api.get('/users/me')
        setPostedRides(response.data.ridesPosted || [])
        setRideHistory(response.data.rideHistory || [])
      } catch (error) {
        toast.error(getErrorMessage(error, 'Unable to fetch profile'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileDetails()
  }, [])

  const updatePhoto = async () => {
    try {
      await api.patch('/users/me/photo', { profilePhoto })
      await refreshProfile()
      toast.success('Profile photo updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update photo'))
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading profile..." />
  }

  return (
    <section className="space-y-5">
      <article className="section-card p-5">
        <h1 className="page-title">My Profile</h1>

        <div className="mt-3 flex items-center gap-3">
          <img
            src={user?.profilePhoto || 'https://placehold.co/80x80'}
            alt="Profile"
            className="h-16 w-16 rounded-full border-2 border-slate-200 object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-600">{user?.email}</p>
            <p className="text-sm text-slate-600">{user?.phone}</p>
            <p className="mt-1 text-xs text-slate-500">Rating: {user?.averageRating || 0}/5</p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={profilePhoto}
            onChange={(event) => setProfilePhoto(event.target.value)}
            placeholder="Paste profile photo URL"
            className="input-field"
          />
          <button onClick={updatePhoto} className="dark-btn px-4 text-xs">
            Save
          </button>
        </div>
      </article>

      <article>
        <h2 className="mb-2 text-lg font-bold text-slate-900">Rides Posted</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {postedRides.length ? (
            postedRides.map((ride) => <RideCard key={ride._id} ride={ride} showActions={false} />)
          ) : (
            <p className="text-sm text-slate-600">You have not posted any rides yet.</p>
          )}
        </div>
      </article>

      <article>
        <h2 className="mb-2 text-lg font-bold text-slate-900">Ride History</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {rideHistory.length ? (
            rideHistory.map((ride) => <RideCard key={ride._id} ride={ride} showActions={false} />)
          ) : (
            <p className="text-sm text-slate-600">No completed joined rides yet.</p>
          )}
        </div>
      </article>
    </section>
  )
}

export default ProfilePage
