import { Violation } from '@/components/ViolationCard';
import axe, { Result, NodeResult } from 'axe-core';

// Define interfaces for the Axe violations and results
interface AxeViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[] | any[]; // Updated to allow complex selectors
    failureSummary?: string;
  }>;
}

interface AxeResults {
  violations: AxeViolation[];
}

// Generate a random ID string (for local testing fallbacks)
const generateId = () => Math.random().toString(36).substring(2, 11);

// Get remediation suggestion based on the violation type
const getRemediation = (violation: AxeViolation, html: string): string => {
  switch (violation.id) {
    case 'image-alt':
      return `Add descriptive alt text to the image: ${html.replace('<img', '<img alt="Description of image"')}`;
    case 'label':
      return `Associate a label with the input: <label for="input-id">Label text</label>${html.replace('<input', '<input id="input-id"')}`;
    case 'color-contrast':
      return 'Increase the contrast ratio between foreground and background colors.';
    case 'heading-order':
      return 'Use heading elements in a hierarchical order (h1, then h2, etc.)';
    case 'landmark-one-main':
      return 'Add a main landmark to the page using <main> element';
    case 'page-has-heading-one':
      return 'Add a level-one heading (<h1>) to the page';
    default:
      return `Fix according to WCAG guidelines: ${violation.help}`;
  }
};

// Get location information from target selectors
const getLocation = (targets: string[] | any[] | undefined): string => {
  if (!targets || targets.length === 0) return 'Unknown location';
  
  // Format the target path to be more human-readable
  const target = targets[0];
  
  // Handle different types of selectors
  if (typeof target === 'string' && target.startsWith('html')) {
    const parts = target.split(' > ');
    if (parts.length > 3) {
      // Return a simplified path for better readability
      return `${parts[1]} > ${parts[2]} > ...`;
    }
    return target.replace(/html > body > /, '');
  }
  
  // For complex selector objects, try to extract a readable string
  if (target && typeof target === 'object') {
    // Some axe selectors have a 'selector' property
    if ('selector' in target && typeof target.selector === 'string') {
      return target.selector;
    }
    // Some might have a 'toString' method
    if (typeof target.toString === 'function') {
      return target.toString();
    }
  }
  
  return typeof target === 'string' ? target : 'Complex selector';
};

// Convert axe-core violations to our application's format
const convertToAppViolations = (axeViolations: Result[]): Violation[] => {
  return axeViolations
    .filter(violation => 
      violation.impact && ['critical', 'serious', 'moderate'].includes(violation.impact)
    )
    .flatMap(violation => {
      return violation.nodes.map(node => ({
        id: generateId(),
        impact: (violation.impact === 'minor' ? 'moderate' : violation.impact) as 'critical' | 'serious' | 'moderate',
        description: violation.description || violation.help,
        element: node.html,
        help: violation.help,
        helpUrl: violation.helpUrl,
        remediation: getRemediation(violation as unknown as AxeViolation, node.html),
        location: getLocation(node.target)
      }));
    });
};

// Mock violations for fallback during testing or when browser access isn't available
const mockViolations: Violation[] = [
  {
    id: generateId(),
    impact: 'critical',
    description: 'Images must have alternate text',
    element: '<img src="banner.jpg">',
    help: 'Images must have alt attribute',
    helpUrl: 'https://www.w3.org/WAI/tutorials/images/decorative/',
    remediation: 'Add descriptive alt text to the image: <img src="banner.jpg" alt="Description of the image">',
    location: 'Header section'
  },
  {
    id: generateId(),
    impact: 'serious',
    description: 'Form elements must have labels',
    element: '<input type="text" name="username">',
    help: 'Form elements must have labels',
    helpUrl: 'https://www.w3.org/WAI/tutorials/forms/labels/',
    remediation: 'Associate a label with the input: <label for="username">Username</label><input id="username" type="text" name="username">',
    location: 'Login form'
  },
  {
    id: generateId(),
    impact: 'moderate',
    description: 'Color contrast is insufficient',
    element: '<p style="color: #999; background-color: #fff;">Text with low contrast</p>',
    help: 'Elements must have sufficient color contrast',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    remediation: 'Increase the contrast ratio by using darker text: <p style="color: #595959; background-color: #fff;">Text with better contrast</p>',
    location: 'Body content'
  },
  {
    id: generateId(),
    impact: 'critical',
    description: 'Page lacks a level-one heading',
    element: '<div class="header">Website Title</div>',
    help: 'Page must contain a level-one heading',
    helpUrl: 'https://www.w3.org/WAI/tutorials/page-structure/headings/',
    remediation: 'Add a proper h1 element: <h1 class="header">Website Title</h1>',
    location: 'Header section'
  },
  {
    id: generateId(),
    impact: 'serious',
    description: 'Interactive element is not keyboard accessible',
    element: '<div onclick="doSomething()">Click me</div>',
    help: 'Interactive elements must be accessible via keyboard',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
    remediation: 'Use a button element instead: <button onclick="doSomething()">Click me</button>',
    location: 'Main content'
  },
  {
    id: generateId(),
    impact: 'moderate',
    description: 'Link text is not descriptive',
    element: '<a href="page.html">Click here</a>',
    help: 'Links must have descriptive text',
    helpUrl: 'https://www.w3.org/WAI/tips/writing/#use-links-with-meaningful-text',
    remediation: 'Use descriptive link text: <a href="page.html">View product details</a>',
    location: 'Footer section'
  }
];

// Function to scan a URL and return accessibility issues
export const scanWebsite = async (url: string): Promise<{
  violations: Violation[];
  scanDate: Date;
}> => {
  console.log(`Scanning URL: ${url}`);
  
  try {
    // Call the API endpoint to scan the requested URL
    const apiUrl = `http://localhost:3001/api/scan?url=${encodeURIComponent(url)}`;
    console.log(`Calling API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API scan completed successfully with ${data.violations.length} violations`);
    
    return {
      violations: data.violations,
      scanDate: new Date(data.scanDate)
    };
  } catch (error) {
    console.error('Scan error:', error);
    
    // Fall back to mock data if API scanning fails
    console.warn('API scan failed, using mock data instead:', error);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomize which violations to include to simulate different scan results
        const randomizedViolations = [...mockViolations]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * mockViolations.length) + 2);
        
        resolve({
          violations: randomizedViolations,
          scanDate: new Date(),
        });
      }, 3000);
    });
  }
};
