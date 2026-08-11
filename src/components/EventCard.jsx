/**
 * EventCard — displays event summary with status badge
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Card className="mb-3 h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{event.title}</Card.Title>
          <StatusBadge status={event.status} />
        </div>
        <Card.Text className="text-muted small">
          {eventDate} &middot; {event.location}
        </Card.Text>
        <Card.Text>{event.description.substring(0, 120)}...</Card.Text>
        <div className="mt-auto">
          <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
