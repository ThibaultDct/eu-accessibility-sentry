import { Violation } from '@/components/ViolationCard';

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Helper to get impact level text
const getImpactText = (impact: 'critical' | 'serious' | 'moderate'): string => {
  switch (impact) {
    case 'critical': return 'Critical';
    case 'serious': return 'Serious';
    case 'moderate': return 'Moderate';
    default: return 'Unknown';
  }
};

// Generate and download PDF report
export const generatePDFReport = (url: string, violations: Violation[], scanDate: Date): void => {
  // In a real implementation, this would use a PDF generation library
  // For the MVP, we'll create a simple HTML representation and convert it to a data URL
  
  // Create the simple report content
  const reportContent = generateReportContent(url, violations, scanDate);
  
  // Open the report in a new window for printing
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accessibility Report - ${url}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              color: #1a56db;
              margin-bottom: 8px;
            }
            .report-date {
              color: #666;
              margin-bottom: 20px;
            }
            .url {
              word-break: break-all;
              color: #1a56db;
              margin-bottom: 30px;
            }
            .summary {
              display: flex;
              margin-bottom: 30px;
            }
            .summary-box {
              padding: 20px;
              margin-right: 20px;
              border-radius: 5px;
              text-align: center;
              flex: 1;
            }
            .critical {
              background-color: #fee2e2;
              border: 1px solid #ef4444;
            }
            .serious {
              background-color: #ffedd5;
              border: 1px solid #f97316;
            }
            .moderate {
              background-color: #fef9c3;
              border: 1px solid #eab308;
            }
            .violation {
              margin-bottom: 40px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .violation-header {
              padding: 15px;
              border-bottom: 1px solid #e5e7eb;
              background-color: #f9fafb;
            }
            .impact-badge {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              color: white;
            }
            .impact-critical {
              background-color: #ef4444;
            }
            .impact-serious {
              background-color: #f97316;
            }
            .impact-moderate {
              background-color: #eab308;
              color: #1f2937;
            }
            .violation-content {
              padding: 15px;
            }
            .code-block {
              background-color: #f1f5f9;
              padding: 12px;
              border-radius: 6px;
              font-family: monospace;
              overflow-x: auto;
              white-space: pre-wrap;
              word-break: break-all;
              font-size: 14px;
            }
            .remediation {
              margin-top: 15px;
            }
            .help-link {
              display: block;
              margin-top: 10px;
              color: #1a56db;
              text-decoration: none;
            }
            .help-link:hover {
              text-decoration: underline;
            }
            .location {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
              margin-bottom: 10px;
            }
            @media print {
              body {
                margin: 1cm;
              }
              .violation {
                break-inside: avoid;
              }
              a {
                text-decoration: none;
              }
            }
          </style>
        </head>
        <body>
          ${reportContent}
          <script>
            // Auto-print when loaded
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
  }
};

// Generate and download HTML report
export const generateHTMLReport = (urlParam: string, violations: Violation[], scanDate: Date): void => {
  // Create the report content
  const reportContent = generateReportContent(urlParam, violations, scanDate);
  
  // Create a Blob with the HTML content
  const blob = new Blob([`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Accessibility Report - ${urlParam}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #1a56db;
            margin-bottom: 8px;
          }
          .report-date {
            color: #666;
            margin-bottom: 20px;
          }
          .url {
            word-break: break-all;
            color: #1a56db;
            margin-bottom: 30px;
          }
          .summary {
            display: flex;
            margin-bottom: 30px;
          }
          .summary-box {
            padding: 20px;
            margin-right: 20px;
            border-radius: 5px;
            text-align: center;
            flex: 1;
          }
          .critical {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
          }
          .serious {
            background-color: #ffedd5;
            border: 1px solid #f97316;
          }
          .moderate {
            background-color: #fef9c3;
            border: 1px solid #eab308;
          }
          .violation {
            margin-bottom: 40px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .violation-header {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            background-color: #f9fafb;
          }
          .impact-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
          }
          .impact-critical {
            background-color: #ef4444;
          }
          .impact-serious {
            background-color: #f97316;
          }
          .impact-moderate {
            background-color: #eab308;
            color: #1f2937;
          }
          .violation-content {
            padding: 15px;
          }
          .code-block {
            background-color: #f1f5f9;
            padding: 12px;
            border-radius: 6px;
            font-family: monospace;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 14px;
          }
          .remediation {
            margin-top: 15px;
          }
          .help-link {
            display: block;
            margin-top: 10px;
            color: #1a56db;
            text-decoration: none;
          }
          .help-link:hover {
            text-decoration: underline;
          }
          .location {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
            margin-bottom: 10px;
          }
          .location-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-right: 5px;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        ${reportContent}
      </body>
    </html>
  `], { type: 'text/html' });
  
  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.html`;
  
  // Append the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up by revoking the URL
  URL.revokeObjectURL(blobUrl);
};

// Generate the common report content
const generateReportContent = (url: string, violations: Violation[], scanDate: Date): string => {
  const criticalCount = violations.filter(v => v.impact === 'critical').length;
  const seriousCount = violations.filter(v => v.impact === 'serious').length;
  const moderateCount = violations.filter(v => v.impact === 'moderate').length;
  
  return `
    <h1>EU Accessibility Compliance Report</h1>
    <p class="report-date">Generated on ${formatDate(scanDate)}</p>
    <p class="url"><strong>URL Scanned:</strong> <a href="${url}" target="_blank">${url}</a></p>
    
    <div class="summary">
      <div class="summary-box critical">
        <h2>${criticalCount}</h2>
        <p>Critical Issues</p>
      </div>
      <div class="summary-box serious">
        <h2>${seriousCount}</h2>
        <p>Serious Issues</p>
      </div>
      <div class="summary-box moderate">
        <h2>${moderateCount}</h2>
        <p>Moderate Issues</p>
      </div>
    </div>
    
    <h2>Detailed Issues</h2>
    
    ${violations.map(violation => `
      <div class="violation">
        <div class="violation-header">
          <span class="impact-badge impact-${violation.impact}">
            ${getImpactText(violation.impact)}
          </span>
          <h3>${violation.description}</h3>
        </div>
        <div class="violation-content">
          ${violation.location ? `
            <div class="location">
              <svg class="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Location: ${violation.location}
            </div>
          ` : ''}
          <div class="code-block">${violation.element}</div>
          <div class="remediation">
            <h4>Recommended Fix:</h4>
            <p>${violation.remediation}</p>
          </div>
          <a href="${violation.helpUrl}" class="help-link" target="_blank">Learn more about this issue</a>
        </div>
      </div>
    `).join('')}
    
    <p>
      <strong>Note:</strong> This report was generated in accordance with WCAG 2.1 AA and EN 301 549 standards.
      For more information, visit <a href="https://www.w3.org/TR/WCAG21/" target="_blank">WCAG 2.1 Guidelines</a>.
    </p>
  `;
};
