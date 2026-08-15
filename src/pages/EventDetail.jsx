/**
 * EventDetail — single event view with RSVP and history
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { eventAPI, rsvpAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import RSVPButton from '../components/RSVPButton';
import HistoryLog from '../components/HistoryLog';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [history, setHistory] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await eventAPI.get(id);
        setEvent(data);

        // Load RSVPs
        const rsvps = await rsvpAPI.list(id);
        setAttendees(rsvps.filter((r) => r.status === 'attending'));

        // Load history if authenticated
        if (user) {
          const hist = await eventAPI.getHistory(id);
          setHistory(hist);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    loadEvent();
  }, [id, user]);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!event) {
    return <Alert variant="warning">Event not found.</Alert>;
  }

  const isOwner = user && event.organizer._id === user._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    try {
      await eventAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">&larr; Back to Events</Link>

      <Card className="mb-4">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="event-image-lg"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <h1 className="mb-3">{event.title}</h1>
            <StatusBadge status={event.status} />
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </Col>
            <Col md={6}>
              <strong>Location:</strong> {event.location}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Capacity:</strong> {attendees.length} / {event.capacity}
            </Col>
            <Col md={6}>
              <strong>Organized by:</strong> {event.organizer.username}
            </Col>
          </Row>

          <hr />
          <h5>Description</h5>
          <p>{event.description}</p>

          {event.status === 'upcoming' && <RSVPButton eventId={event._id} />}

          {isOwner && (
            <div className="mt-3">
              <Link to={`/events/${event._id}/edit`} className="btn btn-outline-primary btn-sm me-2">
                Edit Event
              </Link>
              <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                Delete Event
              </button>
            </div>
          )}
        </Card.Body>
      </Card>

      {attendees.length > 0 && (
        <Card className="mb-4">
          <Card.Header><strong>Attendees ({attendees.length})</strong></Card.Header>
          <Card.Body>
            {attendees.map((r) => (
              <Badge key={r._id} bg="info" className="me-2 mb-2">{r.user.username}</Badge>
            ))}
          </Card.Body>
        </Card>
      )}

      {user && (
        <Card className="mb-4">
          <Card.Header><strong>Event History</strong></Card.Header>
          <Card.Body>
            <HistoryLog history={history} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default EventDetail;
