
# Accessibility Scanner API

This is a simple Express.js API server that scans websites for accessibility issues using axe-core and Puppeteer.

## Setup

1. Navigate to the server directory:
   ```
   cd src/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

### GET /api/scan

Scans a website for accessibility issues.

**Query Parameters:**
- `url` (required): The URL of the website to scan

**Example Request:**
```
GET http://localhost:3001/api/scan?url=https://example.com
```

**Example Response:**
```json
{
  "violations": [
    {
      "id": "abc123",
      "impact": "critical",
      "description": "Images must have alternate text",
      "element": "<img src=\"banner.jpg\">",
      "help": "Images must have alt attribute",
      "helpUrl": "https://www.w3.org/WAI/tutorials/images/decorative/",
      "remediation": "Add descriptive alt text to the image: <img src=\"banner.jpg\" alt=\"Description of the image\">",
      "location": "Header section"
    }
  ],
  "scanDate": "2023-06-14T12:34:56.789Z"
}
```
