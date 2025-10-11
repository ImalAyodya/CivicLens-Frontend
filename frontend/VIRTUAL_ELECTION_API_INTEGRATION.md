# Virtual Election Backend API Integration

## Overview
Successfully integrated the Virtual Election frontend screens with the backend API endpoints.

## Backend Endpoints Used

### 1. **GET /api/virtual-elections**
- **Purpose**: Fetch all virtual elections
- **Usage**: `ElectionScreen.tsx` - Loads all elections and displays the active one
- **Response**: Array of election objects with candidates and votes

### 2. **POST /api/virtual-elections/create**
- **Purpose**: Create a new virtual election
- **Usage**: `AddElectionScreen.tsx` - Creates new elections with selected candidates
- **Request Body**:
```json
{
  "name": "Election Name",
  "description": "Optional description",
  "startDate": "2025-10-22T00:00:00.000Z",
  "endDate": "2025-10-29T00:00:00.000Z",
  "candidates": [
    {
      "name": "Candidate Name",
      "party": "Party Name",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### 3. **POST /api/virtual-elections/vote**
- **Purpose**: Cast a vote for a candidate
- **Usage**: `ElectionScreen.tsx` - Records user votes
- **Request Body**:
```json
{
  "electionId": "election_id",
  "candidateId": "candidate_id",
  "userId": "user_id"
}
```
- **Note**: Requires authentication middleware

## Frontend Changes

### ElectionScreen.tsx
**Features Added:**
- ✅ Fetches active elections from backend on component mount
- ✅ Displays real-time vote counts and percentages
- ✅ Handles voting with loading states and user feedback
- ✅ Calculates time remaining dynamically
- ✅ Shows loading spinner while fetching data
- ✅ Displays empty state when no elections exist
- ✅ Auto-refreshes after voting to show updated counts
- ✅ Party color mapping for consistent UI

**API Integration:**
```typescript
// Fetch elections
const response = await fetch(`${Config.API_URL}/virtual-elections`);

// Cast vote
const response = await fetch(`${Config.API_URL}/virtual-elections/vote`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ electionId, candidateId, userId })
});
```

### AddElectionScreen.tsx
**Features Added:**
- ✅ Fetches real politicians from backend for candidate selection
- ✅ Creates elections with proper date handling
- ✅ Validates election name and minimum candidate count
- ✅ Shows loading spinner while creating election
- ✅ Disabled state during submission
- ✅ Success/error feedback with alerts
- ✅ Auto-navigates back after successful creation

**API Integration:**
```typescript
// Fetch politicians for candidate selection
const response = await fetch(`${Config.API_URL}/politicians`);

// Create election
const response = await fetch(`${Config.API_URL}/virtual-elections/create`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(electionData)
});
```

## Data Models

### Election Interface
```typescript
interface Election {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
  votes?: Vote[];
  isActive: boolean;
}
```

### Candidate Interface
```typescript
interface Candidate {
  _id: string;
  name: string;
  party: string;
  imageUrl?: string;
}
```

### Vote Interface
```typescript
interface Vote {
  user: string;
  candidate: string;
  timestamp: Date;
}
```

## Authentication

The voting endpoint (`/api/virtual-elections/vote`) requires authentication via the `auth` middleware. The frontend uses the `UserContext` to get the current user's ID:

```typescript
const { user } = useUser();

// Used in voting request
body: JSON.stringify({
  electionId: activeElection._id,
  candidateId: candidateId,
  userId: user.id, // From UserContext
})
```

## Error Handling

Both screens implement comprehensive error handling:

1. **Network Errors**: Catches fetch failures and displays "Could not connect to server"
2. **API Errors**: Parses error messages from backend responses
3. **Validation Errors**: Client-side validation before API calls
4. **Loading States**: Visual feedback during async operations

## Party Color Mapping

Consistent party colors across the application:

```typescript
const colors: { [key: string]: string } = {
  "Democratic Party": "#2563EB",
  "Republican Party": "#DC2626",
  "Independent": "#22C55E",
  "Green Party": "#9333EA",
  "United National Party": "#006400",
  "Podu Jana Peramuna": "#DC2626",
  "National People's Power": "#730b0bff",
};
```

## Testing Checklist

- ✅ ElectionScreen loads elections from backend
- ✅ Vote button records votes and updates UI
- ✅ AddElectionScreen fetches real politicians
- ✅ Election creation submits to backend successfully
- ✅ Loading states display correctly
- ✅ Error messages show appropriate feedback
- ✅ Navigation flows work properly
- ✅ Empty states render when no data exists
- ✅ Vote percentages calculate correctly
- ✅ Time remaining displays accurately

## Configuration

Backend URL is configured in `src/config.ts`:

```typescript
const Config = {
  API_URL: 'http://civiclens-backend-production-2c6d.up.railway.app/api',
};
```

For local development, change to:
```typescript
API_URL: 'http://localhost:5000/api',
```

## Next Steps (Optional Enhancements)

1. **Date Picker**: Add interactive date/time picker for election dates
2. **Edit Elections**: Implement edit functionality for existing elections
3. **Delete Elections**: Add delete option with confirmation
4. **Vote History**: Show user's voting history
5. **Real-time Updates**: WebSocket integration for live vote counting
6. **Election Results**: Detailed results page when election ends
7. **Candidate Management**: Separate screen to manage candidates
8. **Election Statistics**: Analytics dashboard for election data

## Files Modified

1. `src/screens/virtualElection/ElectionScreen.tsx` - Complete backend integration
2. `src/screens/virtualElection/AddElectionScreen.tsx` - Complete backend integration

## Dependencies Used

- `@react-navigation/native` - Navigation
- `react-native-paper` - Checkbox component
- `UserContext` - Authentication state
- `Config` - API URL configuration
