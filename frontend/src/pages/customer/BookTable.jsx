import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';

const BookTable = () => {
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSelectedTable(null);
    setSelectedSlot('');
    try {
      const res = await axiosClient.get(`/reservations/available?date=${date}&guests=${guests}`);
      setAvailableTables(res.data.data);
      if (res.data.data.length === 0) {
        setError('No available options mapping to selection guidelines.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBookingExecution = async () => {
    setError('');
    setSuccess('');
    try {
      await axiosClient.post('/reservations', {
        tableId: selectedTable._id,
        date,
        timeSlot: selectedSlot,
        guests: parseInt(guests, 10)
      });
      setSuccess('Reservation successfully saved and indexed!');
      setAvailableTables([]);
      setSelectedTable(null);
      setSelectedSlot('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content-container">
      <h2>Reserve a Table</h2>
      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <form onSubmit={handleSearch} className="search-form-row">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Party Size</label>
          <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} required />
        </div>
        <button type="submit" className="search-btn">Check Availability</button>
      </form>

      {availableTables.length > 0 && (
        <div className="results-wrapper">
          <h3>Step 2: Choose Table & Time</h3>
          <div className="tables-grid">
            {availableTables.map(t => (
              <div 
                key={t._id} 
                className={`table-select-card ${selectedTable?._id === t._id ? 'selected' : ''}`}
                onClick={() => { setSelectedTable(t); setSelectedSlot(''); }}
              >
                <h4>Table {t.tableNumber}</h4>
                <p>Capacity: {t.capacity} guests</p>
              </div>
            ))}
          </div>

          {selectedTable && (
            <div className="slots-wrapper">
              <h4>Available Slots for Table {selectedTable.tableNumber}:</h4>
              <div className="slots-grid">
                {selectedTable.availableSlots.map(slot => (
                  <button
                    key={slot}
                    className={`slot-pill ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTable && selectedSlot && (
            <button className="confirm-booking-btn" onClick={handleBookingExecution}>
              Confirm Allocation for {guests} Guests on {date} @ {selectedSlot}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookTable;