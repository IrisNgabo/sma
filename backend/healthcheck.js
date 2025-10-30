// Import the built-in HTTP module from Node.js
const http = require('http');

// Define options for the HTTP request
const options = {
  hostname: 'localhost',            
  port: process.env.PORT || 4000,   
  path: '/',                       
  method: 'GET',                    
  timeout: 2000                    
};

// Create an HTTP request using the options defined above
const req = http.request(options, (res) => {
  
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    // If response is not 200, exit with failure (code 1)
    process.exit(1);
  }
});

// Handle network errors (e.g., server not reachable)
req.on('error', () => {
  process.exit(1);
});

// Handle timeout errors if the server takes too long to respond
req.on('timeout', () => {
  req.destroy();   
  process.exit(1); // Exit with failure
});

req.end();
