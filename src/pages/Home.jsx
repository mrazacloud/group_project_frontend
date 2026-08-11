/**
 * Home — public event listing page
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eventAPI.list()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Upcoming Events</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {events.length === 0 ? (
        <p className="text-muted">No events available yet.</p>
      ) : (
        <Row>
          {events.map((event) => (
            <Col md={6} lg={4} key={event._id} className="mb-4">
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;
