import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ReservationCard from '../../components/ReservationCard';

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');

  const fetchAllReservations = async () => {
    try {
      let url = '/reservations';
      if (dateFilter) url += `?date=${dateFilter}`;
      const res = await axiosClient.get(url);
      setReservations(res.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, [dateFilter]);

  const handleCancelAdmin = async (id) => {
    if (!window.confirm('Forcibly cancel this reservation record?')) return;
    try {
      await axiosClient.delete(`/reservations/${id}`);
      fetchAllReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content-container admin-layout">
      <h2>Master Reservations Manager</h2>
      {error && <div className="error-banner">{error}</div>}

      <div className="filter-row">
        <label>Filter By Date: </label>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        {dateFilter && <button onClick={() => setDateFilter('')}>Clear Filter</button>}
      </div>

      <div className="cards-list-layout">
        {reservations.length === 0 ? (
          <p>No reservations currently on file matching parameters.</p>
        ) : (
          reservations.map(res => (
            <ReservationCard 
              key={res._id} 
              reservation={res} 
              onCancel={res.status === 'confirmed' ? handleCancelAdmin : null} 
              isAdminView={true} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllReservations;