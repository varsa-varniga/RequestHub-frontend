import React, { useState } from 'react';

const RequestForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ title, description, priority });
    }
    setTitle('');
    setDescription('');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Create Request</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Title:<br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          Description:<br />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            style={{ width: '100%', minHeight: 80 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          Priority:<br />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;
