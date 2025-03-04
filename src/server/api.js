
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// API endpoint to scan a website for accessibility issues
app.get('/api/scan', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Starting accessibility scan for URL: ${url}`);
    
    // Launch headless browser
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set timeout and size
    await page.setDefaultNavigationTimeout(30000);
    await page.setViewport({ width: 1280, height: 800 });
    
    // Bypass CSP to allow axe to run
    await page.setBypassCSP(true);
    
    console.log(`Navigating to ${url}...`);
    
    // Go to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    console.log(`Running axe analysis...`);
    
    // Run axe accessibility scan
    const results = await new AxePuppeteer(page).analyze();
    
    await browser.close();
    
    // Process the violations to match our application's format
    const violations = results.violations
      .filter(violation => 
        violation.impact && ['critical', 'serious', 'moderate'].includes(violation.impact)
      )
      .flatMap(violation => {
        return violation.nodes.map(node => {
          // Generate a simple ID
          const id = Math.random().toString(36).substring(2, 11);
          
          // Get location info
          let location = 'Unknown location';
          if (node.target && node.target.length > 0) {
            const target = node.target[0];
            if (typeof target === 'string') {
              location = target.replace(/html > body > /, '');
            } else if (typeof target === 'object') {
              location = target.toString();
            }
          }
          
          // Get remediation suggestion
          let remediation = `Fix according to WCAG guidelines: ${violation.help}`;
          switch (violation.id) {
            case 'image-alt':
              remediation = `Add descriptive alt text to the image: ${node.html.replace('<img', '<img alt="Description of image"')}`;
              break;
            case 'label':
              remediation = `Associate a label with the input: <label for="input-id">Label text</label>${node.html.replace('<input', '<input id="input-id"')}`;
              break;
            case 'color-contrast':
              remediation = 'Increase the contrast ratio between foreground and background colors.';
              break;
            // Add more specific remediation suggestions as needed
          }
          
          return {
            id,
            impact: violation.impact,
            description: violation.description || violation.help,
            element: node.html,
            help: violation.help,
            helpUrl: violation.helpUrl,
            remediation,
            location
          };
        });
      });
    
    console.log(`Scan completed. Found ${violations.length} issues.`);
    
    res.json({
      violations,
      scanDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'An error occurred during the scan', 
      message: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

module.exports = app;
