/**
 * EventCard — displays event summary with image and status badge
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const imgSrc = event.image || PLACEHOLDER;

  return (
    <Card className="mb-3 h-100 shadow-sm">
      <img
        src={imgSrc}
        alt={event.title}
        className="event-image"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
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
