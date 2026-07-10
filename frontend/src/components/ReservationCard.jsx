import React from 'react';

const ReservationCard = ({ reservation, onCancel, isAdminView = false }) => {
  const { _id, date, timeSlot, guests, status, table, customer } = reservation;
  const isCancelled = status === 'cancelled';

  return (
    <div className={`res-card ${isCancelled ? 'cancelled-card' : ''}`}>
      <div className="res-header">
        <h4>Date: {date}</h4>
        <span className={`status-badge ${status}`}>{status.toUpperCase()}</span>
      </div>
      <div className="res-body">
        <p><strong>Time Slot:</strong> {timeSlot}</p>
        <p><strong>Guests:</strong> {guests}</p>
        <p><strong>Table Reference:</strong> {table ? `Table ${table.tableNumber} (Seats ${table.capacity})` : 'N/A'}</p>
        
        {isAdminView && customer && (
          <div className="admin-user-details">
            <p><strong>Customer:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
          </div>
        )}
      </div>
      {!isCancelled && onCancel && (
        <button className="cancel-action-btn" onClick={() => onCancel(_id)}>
          Cancel Reservation
        </button>
      )}
    </div>
  );
};

export default ReservationCard;