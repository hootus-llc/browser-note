// Function to perform an accessibility audit
function performAccessibilityAudit() {
    const auditResults = [];

    // Check for missing 'alt' attributes on images
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        if (!image.getAttribute('alt')) {
            auditResults.push({
                element: image,
                issue: 'Image is missing alt text'
            });
        }
    });

    // Check for missing 'aria-label' or 'aria-labelledby' on form elements
    const formControls = document.querySelectorAll('input, textarea, select');
    formControls.forEach(control => {
        if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
            auditResults.push({
                element: control,
                issue: 'Form control is missing aria-label or aria-labelledby'
            });
        }
    });

    // Check for missing 'role' attributes on custom components
    const customComponents = document.querySelectorAll('[role]');
    customComponents.forEach(component => {
        if (!component.getAttribute('role')) {
            auditResults.push({
                element: component,
                issue: 'Custom component is missing a role attribute'
            });
        }
    });

    // Check for missing 'tabindex' attributes on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], [role="link"], [tabindex]');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex')) {
            auditResults.push({
                element: element,
                issue: 'Interactive element is missing a tabindex attribute'
            });
        }
    });

    // Check for low color contrast on text elements
    const textElements = document.querySelectorAll('p, span, a, button, [role="text"]');
    textElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;

        if (colorContrastRatio(backgroundColor, color) < 4.5) {
            auditResults.push({
                element: element,
                issue: 'Low color contrast on text element'
            });
        }
    });

    // Add more checks as needed

    return auditResults;
}

// Function to calculate color contrast ratio
function colorContrastRatio(background, text) {
    const bg = getRGBValues(background);
    const fg = getRGBValues(text);

    const l1 = luminance(bg.r, bg.g, bg.b);
    const l2 = luminance(fg.r, fg.g, fg.b);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (brighter + 0.05) / (darker + 0.05);
}

// Function to get RGB values from a color string
function getRGBValues(color) {
    const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }
    return null;
}

// Function to calculate luminance
function luminance(r, g, b) {
    const a = [r, g, b].map(value => {
        value /= 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Function to display audit results in the DOM
function displayAuditResults(results) {
    const auditResultsContainer = document.createElement('div');
    auditResultsContainer.id = 'audit-results';
    auditResultsContainer.style.position = 'fixed';
    auditResultsContainer.style.top = '0';
    auditResultsContainer.style.right = '0';
    auditResultsContainer.style.backgroundColor = '#333';
    auditResultsContainer.style.color = '#fff';
    auditResultsContainer.style.padding = '10px';
    auditResultsContainer.style.maxHeight = '100%';
    auditResultsContainer.style.overflowY = 'auto';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.textContent = result.issue;
        auditResultsContainer.appendChild(resultElement);
    });

    document.body.appendChild(auditResultsContainer);
}

// Trigger the audit when the page loads
window.addEventListener('load', () => {
    const auditResults = performAccessibilityAudit();
    displayAuditResults(auditResults);
});
