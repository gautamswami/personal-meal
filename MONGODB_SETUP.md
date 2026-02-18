# MongoDB Setup Instructions

## Setup Steps

### 1. Update Environment Variables

Edit `.env.local` file and replace `<db_password>` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://gautam:YOUR_ACTUAL_PASSWORD@cluster0.0mjb7.mongodb.net/mealplan?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** Replace `YOUR_ACTUAL_PASSWORD` with your MongoDB Atlas password.

### 2. MongoDB Collections

The application will automatically create the following collections:

- `users` - Stores user accounts (username and hashed password)
- `meals` - Stores meal data for each user

### 3. Features Implemented

#### Authentication
- **Simple username-only signup/login** (uses username as password for simplicity)
- JWT token-based authentication (30-day expiry)
- Tokens stored in localStorage
- Each username is unique (case-insensitive)

#### Data Sync
- **LocalStorage → MongoDB**: On first signup, existing localStorage data is migrated to MongoDB
- **MongoDB → LocalStorage**: On login, data is loaded from MongoDB
- **Auto-sync**: Every meal addition/update automatically saves to both localStorage and MongoDB
- **Offline support**: App works with localStorage if MongoDB is unavailable

#### User Experience
- Existing localStorage data is preserved and migrated when signing up
- Login loads data from MongoDB (overrides localStorage)
- Logout clears tokens but keeps localStorage data
- Username displayed in header when logged in

## API Endpoints

### Authentication

**POST /api/auth/signup**
```json
{
  "username": "your-username"
}
```

**POST /api/auth/login**
```json
{
  "username": "your-username"
}
```

### Meals

**GET /api/meals**
- Requires Authorization header: `Bearer <token>`
- Returns user's meals from MongoDB

**POST /api/meals**
- Requires Authorization header: `Bearer <token>`
```json
{
  "meals": [/* array of meal objects */]
}
```

## Testing the Application

### 1. Create a New Account
- Open the app (loads authentication screen)
- Enter a username
- Click "Sign Up"
- If you had meals in localStorage, they'll be migrated to MongoDB

### 2. Add/Modify Meals
- All changes automatically sync to MongoDB
- Check browser console for sync status

### 3. Test Persistence
- Add a meal
- Logout (or clear localStorage except the token)
- Login again
- Your meals should load from MongoDB

### 4. Test with Multiple Accounts
- Logout
- Create a new username
- Each user has their own separate meal data

## Security Notes

1. **Password Security**: Currently uses username as password (bcrypt hashed). For production, implement proper password input.
2. **JWT Secret**: Change `JWT_SECRET` in `.env.local` to a secure random string
3. **Database Password**: Never commit `.env.local` to git (already in .gitignore)

## Database Structure

### users collection
```json
{
  "_id": ObjectId,
  "username": "string (lowercase, unique)",
  "password": "string (bcrypt hashed)",
  "createdAt": Date
}
```

### meals collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId (ref to users),
  "username": "string",
  "meals": [/* array of meal objects */],
  "createdAt": Date,
  "updatedAt": Date
}
```

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB URI is correct in `.env.local`
- Verify password doesn't contain special characters that need URL encoding
- Ensure IP whitelist is configured in MongoDB Atlas (add 0.0.0.0/0 for all IPs)

### Authentication Issues
- Clear localStorage and cookies if stuck
- Check browser console for error messages
- Verify API routes are working: Open DevTools → Network tab

### Data Not Syncing
- Check browser console for errors
- Verify JWT token exists: `localStorage.getItem('token')`
- Check MongoDB Atlas collections to see if data is being written
