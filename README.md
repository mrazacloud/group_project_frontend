# EventHub Frontend — Part 2

React frontend for the EventHub event management application.

## Setup

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:3001
```

For production, set this to your deployed backend URL.

## Pages

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Home | `/` | No | Public listing of all events |
| Login | `/login` | No | User login |
| Register | `/register` | No | User registration |
| Dashboard | `/dashboard` | Yes | Manage own events |
| Create Event | `/events/new` | Yes | Create a new event |
| Event Detail | `/events/:id` | Partial | View event, RSVP, history |
| Edit Event | `/events/:id/edit` | Yes (owner) | Edit event |
| Profile | `/profile` | Yes | Update user info |

## Tech

- React 18
- React Router 6
- React Bootstrap
- Bootstrap 5
