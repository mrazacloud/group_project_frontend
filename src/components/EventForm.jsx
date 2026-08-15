/**
 * EventForm — reusable form for creating and editing events
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const EventForm = ({ initialData, onSubmit, submitLabel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    image: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        date: initialData.date ? initialData.date.substring(0, 10) : '',
        location: initialData.location || '',
        capacity: initialData.capacity || '',
        image: initialData.image || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.capacity || Number(form.capacity) < 1) errs.capacity = 'Capacity must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...form, capacity: Number(form.capacity) });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          value={form.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="Event title"
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          placeholder="Describe your event"
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              isInvalid={!!errors.date}
            />
            <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              isInvalid={!!errors.capacity}
              min="1"
              placeholder="Max attendees"
            />
            <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          name="location"
          value={form.location}
          onChange={handleChange}
          isInvalid={!!errors.location}
          placeholder="Venue or address"
        />
        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image URL (optional)</Form.Label>
        <Form.Control
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
        <Form.Text className="text-muted">
          Paste a link to an image for your event banner
        </Form.Text>
      </Form.Group>

      {form.image && (
        <div className="mb-3">
          <img
            src={form.image}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.375rem' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <Button variant="primary" type="submit">
        {submitLabel || 'Submit'}
      </Button>
    </Form>
  );
};

export default EventForm;
