# JSON-Server Setup Guide

This project now uses JSON-Server as the backend to store and manage data.

## Setup Instructions

### 1. Start JSON-Server

Before running the frontend, you need to start the JSON-Server:

```bash
npm run server
```

This will start JSON-Server on `http://localhost:3001` and watch the `Database/db.json` file.

### 2. Start the Frontend

In a separate terminal, start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

## Database Structure

The `Database/db.json` file contains:

- **destinations**: Travel destinations with details
- **bookings**: User trip bookings
- **users**: User accounts
- **sessions**: Active user sessions
- **students**: (Legacy data, can be removed if not needed)

## API Endpoints

JSON-Server automatically creates REST endpoints:

- `GET /destinations` - List all destinations
- `GET /destinations/:id` - Get a specific destination
- `POST /destinations` - Create a new destination
- `PATCH /destinations/:id` - Update a destination
- `DELETE /destinations/:id` - Delete a destination

- `GET /bookings` - List all bookings
- `POST /bookings` - Create a new booking
- `PATCH /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Delete a booking

- `GET /users` - List all users
- `POST /users` - Create a new user

## Important Notes

1. **Always start JSON-Server first** before running the frontend
2. The database file (`Database/db.json`) is automatically updated when you create, update, or delete data
3. If you see connection errors, make sure JSON-Server is running on port 3001
4. The Dashboard and Booking History pages will automatically refresh when new bookings are created

## Troubleshooting

### "Backend server is not running" error
- Make sure JSON-Server is started with `npm run server`
- Check that it's running on port 3001
- Verify the `Database/db.json` file exists

### Data not updating
- Check the browser console for errors
- Verify JSON-Server is running and receiving requests
- Check that `Database/db.json` has the correct structure



