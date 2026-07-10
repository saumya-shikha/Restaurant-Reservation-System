import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import ReservationCard from '../../components/ReservationCard';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      const res = await axiosClient.get('/reservations/mine');
      setReservations(res.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this allocation?')) return;
    try {
      await axiosClient.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content-container">
      <h2>My Active & Past Allocations</h2>
      {error && <div className="error-banner">{error}</div>}
      <div className="cards-list-layout">
        {reservations.length === 0 ? (
          <p>No historical reservations identified matching structural data profiles.</p>
        ) : (
          reservations.map(res => (
            <ReservationCard key={res._id} reservation={res} onCancel={handleCancel} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyReservations;