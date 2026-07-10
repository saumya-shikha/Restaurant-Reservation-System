import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState('');

  const fetchTables = async () => {
    try {
      const res = await axiosClient.get('/tables');
      setTables(res.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosClient.post('/tables', {
        tableNumber: parseInt(tableNumber, 10),
        capacity: parseInt(capacity, 10)
      });
      setTableNumber('');
      setCapacity('');
      fetchTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTableStatus = async (id, currentStatus) => {
    try {
      await axiosClient.patch(`/tables/${id}`, { isActive: !currentStatus });
      fetchTables();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content-container admin-layout">
      <h2>Structural Seating Management</h2>
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleCreate} className="table-creation-form">
        <h3>Create New Structural Seating Asset</h3>
        <div className="form-group">
          <label>Table Number</label>
          <input type="number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Maximum Seating Capacity</label>
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required />
        </div>
        <button type="submit">Deploy Asset</button>
      </form>

      <h3>Active Grid Manifest</h3>
      <table className="admin-data-table">
        <thead>
          <tr>
            <th>Table Number</th>
            <th>Capacity Allocation</th>
            <th>Operational Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map(t => (
            <tr key={t._id}>
              <td>Table {t.tableNumber}</td>
              <td>{t.capacity} Seats</td>
              <td>
                <span className={`status-pill ${t.isActive ? 'active' : 'inactive'}`}>
                  {t.isActive ? 'OPERATIONAL' : 'OFFLINE'}
                </span>
              </td>
              <td>
                <button onClick={() => toggleTableStatus(t._id, t.isActive)}>
                  {t.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTables;