const fs = require('fs');
const axios = require('axios');

//Load the list of websites from the JSON file
const sites = require('./sites.json');

//Function to check the uptime of a website
async function checkWebsite(site) {
  try {
    const startTime = Date.now();
    const response = await axios.get(site.url);
    const endTime = Date.now();
    const uptime = endTime - startTime;

    const statusRecord = {
      status: 'UP',
      responseTime: uptime,
      timestamp: new Date().toISOString(),
    };

//Add the current status record to the site's history
    site.history.unshift(statusRecord);

//Keep only the last 10 status records
    site.history = site.history.slice(0, 10);

    console.log(`${site.name} is UP - Response Time: ${uptime}ms`);
  } catch (error) {
    const statusRecord = {
      status: 'DOWN',
      error: error.message,
      timestamp: new Date().toISOString(),
    };

//Add the current status record to the site's history
    site.history.unshift(statusRecord);

//Keep only the last 10 status records
    site.history = site.history.slice(0, 10);

    console.error(`${site.name} is DOWN - Error: ${error.message}`);
  }
}

//Function to monitor all websites
function monitorWebsites() {
  console.log('Monitoring Uptime...\n');

//Check each website in the list
  sites.forEach((site) => {
    checkWebsite(site);
  });

//Run every minute
  setInterval(() => {
    console.log('\nMonitoring Uptime...\n');
    sites.forEach((site) => {
      checkWebsite(site);
    });

//Update the sites.json file with the latest status
    fs.writeFileSync('./sites.json', JSON.stringify(sites, null, 1));
  }, 60 * 1000);
}

//Start monitoring
monitorWebsites();

