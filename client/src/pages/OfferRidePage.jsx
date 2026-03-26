import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ErrorBanner from '../components/ErrorBanner'
import { api, getErrorMessage } from '../services/api'
import { toDateInputValue } from '../utils/date'

const initialRideForm = {
  from: '',
  to: '',
  date: '',
  time: '',
  vehicle: 'Bike',
  seats: 1,
  notes: '',
}

const OfferRidePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialRideForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await api.post('/rides', {
        ...form,
        seats: Number(form.seats),
      })

      toast.success('Ride created successfully')
      navigate(`/rides/${response.data.ride._id}`)
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create ride')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-card p-5">
      <h1 className="page-title mb-4">Offer a Ride</h1>

      <ErrorBanner message={errorMessage} className="mb-3" />

      <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          required
          placeholder="From"
          value={form.from}
          onChange={(event) => setForm((prev) => ({ ...prev, from: event.target.value }))}
          className="input-field"
        />
        <input
          required
          placeholder="To"
          value={form.to}
          onChange={(event) => setForm((prev) => ({ ...prev, to: event.target.value }))}
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-2 md:col-span-2 md:max-w-md">
          <input
            required
            type="date"
            min={toDateInputValue()}
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            className="input-field"
          />
          <input
            required
            type="time"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:col-span-2 md:max-w-md">
          <select
            value={form.vehicle}
            onChange={(event) => setForm((prev) => ({ ...prev, vehicle: event.target.value }))}
            className="input-field"
          >
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>
          <input
            required
            min="1"
            max="6"
            type="number"
            value={form.seats}
            onChange={(event) => setForm((prev) => ({ ...prev, seats: event.target.value }))}
            className="input-field"
          />
        </div>

        <textarea
          rows={3}
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          className="input-field md:col-span-2"
        />

        <button disabled={isSubmitting} className="primary-btn md:col-span-2 md:max-w-xs">
          {isSubmitting ? 'Posting ride...' : 'Post Ride'}
        </button>
      </form>
    </section>
  )
}

export default OfferRidePage
