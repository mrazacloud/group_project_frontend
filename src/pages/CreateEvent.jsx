/**
 * CreateEvent — form to create a new event
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import { eventAPI } from '../services/api';
import EventForm from '../components/EventForm';

const CreateEvent = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    try {
      const event = await eventAPI.create(formData);
      navigate(`/events/${event._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Card>
          <Card.Body>
            <h2 className="mb-4">Create New Event</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
