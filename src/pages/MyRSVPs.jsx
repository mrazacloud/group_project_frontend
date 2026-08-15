/**
 * MyRSVPs — independent list of events the user has RSVPed to
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { rsvpAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop';

const MyRSVPs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    rsvpAPI.myRSVPs()
      .then(setRsvps)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel your RSVP for this event?')) return;
    try {
      await rsvpAPI.cancel(eventId);
      setRsvps((prev) => prev.filter((r) => r.event._id !== eventId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div>
      <h1 className="mb-4">My RSVPs</h1>

      {rsvps.length === 0 ? (
        <Alert variant="info">You haven't RSVPed to any events yet. <Link to="/">Browse events</Link></Alert>
      ) : (
        <Row>
          {rsvps.map((rsvp) => (
            <Col md={6} lg={4} key={rsvp._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <img
                  src={rsvp.event.image || PLACEHOLDER}
                  alt={rsvp.event.title}
                  className="event-image"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{rsvp.event.title}</Card.Title>
                    <StatusBadge status={rsvp.event.status} />
                  </div>
                  <Card.Text className="text-muted small">
                    {new Date(rsvp.event.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })} &middot; {rsvp.event.location}
                  </Card.Text>
                  <Card.Text className="small">
                    Organized by: {rsvp.event.organizer.username}
                  </Card.Text>
                  <div className="mt-auto d-flex align-items-center gap-2">
                    <Badge bg={rsvp.status === 'attending' ? 'success' : 'warning'}>
                      {rsvp.status === 'attending' ? 'Attending' : 'Waitlisted'}
                    </Badge>
                    <Link to={`/events/${rsvp.event._id}`} className="btn btn-outline-primary btn-sm">
                      View
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(rsvp.event._id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MyRSVPs;
