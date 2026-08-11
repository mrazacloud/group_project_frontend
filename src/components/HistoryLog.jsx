/**
 * HistoryLog — displays event change history
 */
import React from 'react';
import { ListGroup } from 'react-bootstrap';

const HistoryLog = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-muted">No history yet.</p>;
  }

  return (
    <ListGroup variant="flush">
      {history.map((entry) => (
        <ListGroup.Item key={entry._id} className="px-0">
          <small className="text-muted">
            {new Date(entry.timestamp).toLocaleString()}
          </small>
          <br />
          <strong>{entry.username}</strong>: {entry.action}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default HistoryLog;
