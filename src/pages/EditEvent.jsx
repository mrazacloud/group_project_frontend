/**
 * EditEvent — form to edit an existing event (owner only)
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Alert, Spinner } from 'react-bootstrap';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventForm from '../components/EventForm';

const EditEvent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventAPI.get(id)
      .then((data) => {
        if (user && data.organizer._id !== user.id) {
          navigate('/dashboard');
          return;
        }
        setEvent(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    setError('');
    try {
      await eventAPI.update(id, formData);
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Card>
          <Card.Body>
            <h2 className="mb-4">Edit Event</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {event && <EventForm initialData={event} onSubmit={handleSubmit} submitLabel="Save Changes" />}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
