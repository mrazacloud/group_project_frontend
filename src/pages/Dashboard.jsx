/**
 * Dashboard — authenticated user's event management page
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    eventAPI.list()
      .then((all) => all.filter((e) => e.organizer._id === user.id))
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const updated = await eventAPI.updateStatus(eventId, newStatus);
      setEvents((prev) => prev.map((e) => (e._id === eventId ? updated : e)));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Events</h1>
        <Button as={Link} to="/events/new" variant="success">+ New Event</Button>
      </div>

      {events.length === 0 ? (
        <Alert variant="info">You haven't created any events yet. <Link to="/events/new">Create one!</Link></Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>
                  <Link to={`/events/${event._id}`}>{event.title}</Link>
                </td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td><StatusBadge status={event.status} /></td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    as={Link}
                    to={`/events/${event._id}/edit`}
                  >
                    Edit
                  </Button>
                  {event.status === 'upcoming' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="me-2"
                        onClick={() => handleStatusChange(event._id, 'ongoing')}
                      >
                        Start
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleStatusChange(event._id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {event.status === 'ongoing' && (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleStatusChange(event._id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Dashboard;
