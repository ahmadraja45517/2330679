// Import the custom logger from the middleware folder
const logger = require('../logging_middleware/logger'); 

async function getTopNotifications() {
  const url = 'http://4.224.186.213/evaluation-service/notifications';
  
  // ⚠️ PASTE YOUR ACTUAL ACCESS TOKEN HERE ⚠️
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhaG1hZHJhemE0NTUxN0BnbWFpbC5jb20iLCJleHAiOjE3ODA0Nzg5NDksImlhdCI6MTc4MDQ3ODA0OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIwODgwOWFhLWJiZWEtNDhkMi05NWFjLTFlOGVjYTdhMzc1YiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFobWFkIHJhamEiLCJzdWIiOiJlMmViZDEzYy02MmU1LTRhM2MtOTM0ZC02ZTdhYmY4MzhlYWIifSwiZW1haWwiOiJhaG1hZHJhemE0NTUxN0BnbWFpbC5jb20iLCJuYW1lIjoiYWhtYWQgcmFqYSIsInJvbGxObyI6IjIzMzA2NzkiLCJhY2Nlc3NDb2RlIjoibnd3c0t4IiwiY2xpZW50SUQiOiJlMmViZDEzYy02MmU1LTRhM2MtOTM0ZC02ZTdhYmY4MzhlYWIiLCJjbGllbnRTZWNyZXQiOiJkWHd3ak1xUlJGV3JIeWJmIn0.vxTVcyrysayf1yX7rBSiOMMj8SZus6a0kjpd9cAnzkc'; 

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const notifications = data.notifications;

    // 1. Define priority weights (Placement > Result > Event)
    const weightMap = {
      "Placement": 3,
      "Result": 2,
      "Event": 1
    };

    // 2. Sort by Weight (Descending), then by Recency (Descending Timestamp)
    notifications.sort((a, b) => {
      if (weightMap[a.Type] !== weightMap[b.Type]) {
        return weightMap[b.Type] - weightMap[a.Type];
      }
      // If weights are identical, parse and compare the timestamps
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    // 3. Extract the top 10
    const top10 = notifications.slice(0, 10);

    // 4. Output the result using the MANDATORY custom logger
    logger.info("=== Top 10 Priority Notifications ===");
    logger.info(JSON.stringify(top10, null, 2));

  } catch (error) {
    logger.error("Failed to fetch or process notifications: " + error.message);
  }
}

getTopNotifications();