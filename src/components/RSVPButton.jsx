/**
 * RSVPButton — RSVP/cancel button with status display
 */
import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { rsvpAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RSVPButton = ({ eventId }) => {
  const { user } = useAuth();
  const [rsvp, setRsvp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    rsvpAPI.list(eventId).then((rsvps) => {
      const mine = rsvps.find((r) => r.user._id === user._id);
      setRsvp(mine || null);
    }).catch(() => {});
  }, [eventId, user]);

  if (!user) {
    return <p className="text-muted">Login to RSVP</p>;
  }

  const handleRSVP = async () => {
    setLoading(true);
    try {
      const newRsvp = await rsvpAPI.create(eventId);
      setRsvp(newRsvp);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const updated = await rsvpAPI.cancel(eventId);
      setRsvp(updated);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  if (rsvp && rsvp.status === 'cancelled') {
    return (
      <div>
        <p className="text-muted mb-2">You cancelled your RSVP</p>
        <Button variant="outline-primary" size="sm" onClick={handleRSVP} disabled={loading}>
          RSVP Again
        </Button>
      </div>
    );
  }

  if (rsvp) {
    return (
      <div>
        <Badge bg={rsvp.status === 'attending' ? 'success' : 'warning'} className="mb-2">
          {rsvp.status === 'attending' ? 'Attending' : 'Waitlisted'}
        </Badge>
        <br />
        <Button variant="outline-danger" size="sm" onClick={handleCancel} disabled={loading}>
          Cancel RSVP
        </Button>
      </div>
    );
  }

  return (
    <Button variant="success" onClick={handleRSVP} disabled={loading}>
      {loading ? 'Processing...' : 'RSVP Now'}
    </Button>
  );
};

export default RSVPButton;
