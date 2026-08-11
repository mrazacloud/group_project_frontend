/**
 * StatusBadge — color-coded badge for event status
 */
import React from 'react';
import { Badge } from 'react-bootstrap';

const STATUS_CONFIG = {
  upcoming: { bg: 'primary', label: 'Upcoming' },
  ongoing: { bg: 'success', label: 'Ongoing' },
  completed: { bg: 'secondary', label: 'Completed' },
  cancelled: { bg: 'danger', label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { bg: 'light', label: status };
  return <Badge bg={config.bg}>{config.label}</Badge>;
};

export default StatusBadge;
