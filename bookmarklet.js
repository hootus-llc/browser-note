(function () {
    // Function to calculate color contrast ratio
    function calculateColorContrast(background, text) {
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

    // Function to perform an accessibility audit
    // Function to create a link to WCAG
    function createWCAGLink(url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = 'WCAG Guidelines';
        link.title = 'WCAG Guidelines';
        return link;
    }

    // Function to perform an accessibility audit
    function performAccessibilityAudit() {
        const auditResults = [];

        // Check for missing 'alt' attributes on images
        const images = document.querySelectorAll('img');
        images.forEach(image => {
            if (!image.getAttribute('alt')) {
                auditResults.push({
                    element: image,
                    issue: 'Image is missing alt text',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#images-of-text'
                });
            }
        });

        // Check for missing 'aria-label' or 'aria-labelledby' on form elements
        const formControls = document.querySelectorAll('input, textarea, select');
        formControls.forEach(control => {
            if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
                auditResults.push({
                    element: control,
                    issue: 'Form control is missing aria-label or aria-labelledby',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#input-purposes'
                });
            }
        });

        // Check for missing 'role' attributes on custom components
        const customComponents = document.querySelectorAll('[role]');
        customComponents.forEach(component => {
            if (!component.getAttribute('role')) {
                auditResults.push({
                    element: component,
                    issue: 'Custom component is missing a role attribute',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#roles'
                });
            }
        });

        // Check for missing 'tabindex' attributes on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], [role="link"], [tabindex]');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('tabindex')) {
                auditResults.push({
                    element: element,
                    issue: 'Interactive element is missing a tabindex attribute',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#keyboard'
                });
            }
        });

        // Check for low color contrast on text elements
        const textElements = document.querySelectorAll('p, span, a, button, [role="text"]');
        textElements.forEach(element => {
            const computedStyle = getComputedStyle(element);
            const backgroundColor = computedStyle.backgroundColor;
            const color = computedStyle.color;

            if (calculateColorContrast(backgroundColor, color) < 4.5) {
                auditResults.push({
                    element: element,
                    issue: 'Low color contrast on text element',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#contrast-minimum'
                });
            }
        });

        // Add 10 more accessibility checks
        // Example 1: Check for empty links
        const emptyLinks = document.querySelectorAll('a[href=""]');
        emptyLinks.forEach(link => {
            auditResults.push({
                element: link,
                issue: 'Empty link (href attribute is empty)',
                wcagLink: 'https://www.w3.org/TR/WCAG21/#links'
            });
        });

        // Example 2: Check for empty buttons
        const emptyButtons = document.querySelectorAll('button:empty');
        emptyButtons.forEach(button => {
            auditResults.push({
                element: button,
                issue: 'Empty button',
                wcagLink: 'https://www.w3.org/TR/WCAG21/#buttons'
            });
        });

        // Example 3: Check for missing 'alt' attributes on image maps
        const imageMaps = document.querySelectorAll('map[name] area[href]');
        imageMaps.forEach(area => {
            if (!area.getAttribute('alt')) {
                auditResults.push({
                    element: area,
                    issue: 'Image map area is missing alt text',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#non-text-content'
                });
            }
        });
        
        // Example 4: Check for missing 'title' attributes on iframes
        const iframes = document.querySelectorAll('iframe:not([title])');
        iframes.forEach(iframe => {
            auditResults.push({
                element: iframe,
                issue: 'Iframe is missing a title attribute',
                wcagLink: 'https://www.w3.org/TR/WCAG21/#page-titled'
            });
        });
        
        // Example 5: Check for empty table headers (th elements)
        const emptyHeaders = document.querySelectorAll('th:empty');
        emptyHeaders.forEach(header => {
            auditResults.push({
                element: header,
                issue: 'Empty table header (th element)',
                wcagLink: 'https://www.w3.org/TR/WCAG21/#tables'
            });
        });
        
        // Example 6: Check for missing 'alt' attributes on decorative images
        const decorativeImages = document.querySelectorAll('img[role="presentation"], img[aria-hidden="true"]');
        decorativeImages.forEach(image => {
            if (!image.getAttribute('alt')) {
                auditResults.push({
                    element: image,
                    issue: 'Decorative image is missing alt text',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#img-element'
                });
            }
        });
        
        // Example 7: Check for missing 'lang' attributes on language changes
        const languageChanges = document.querySelectorAll('[lang]:not(html)');
        languageChanges.forEach(element => {
            if (!element.getAttribute('lang')) {
                auditResults.push({
                    element: element,
                    issue: 'Language change element is missing a lang attribute',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#meaningful-sequence'
                });
            }
        });
        
        // Example 8: Check for missing 'aria-hidden' on decorative elements
        const decorativeElements = document.querySelectorAll('[aria-hidden="false"]');
        decorativeElements.forEach(element => {
            auditResults.push({
                element: element,
                issue: 'Decorative element should have aria-hidden="true"',
                wcagLink: 'https://www.w3.org/TR/WCAG21/#content-structure-separation'
            });
        });
        
        // Example 9: Check for missing 'label' elements for form controls
        const labeledFormControls = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
        labeledFormControls.forEach(control => {
            const label = control.closest('label');
            if (!label) {
                auditResults.push({
                    element: control,
                    issue: 'Form control is missing a corresponding label element',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#label'
                });
            }
        });
        
        // Example 10: Check for missing 'alt' attributes on image buttons
        const imageButtons = document.querySelectorAll('input[type="image"]');
        imageButtons.forEach(button => {
            if (!button.getAttribute('alt')) {
                auditResults.push({
                    element: button,
                    issue: 'Image button is missing alt text',
                    wcagLink: 'https://www.w3.org/TR/WCAG21/#input-image'
                });
            }
        });

        return auditResults;
    };

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

            const issueText = document.createElement('span');
            issueText.textContent = result.issue;
            issueText.style.cursor = 'pointer';
            issueText.style.textDecoration = 'underline';
            issueText.style.marginRight = '5px';
            
            const wcagLink = createWCAGLink(result.wcagLink);

            resultElement.appendChild(issueText);
            resultElement.appendChild(wcagLink);

            issueText.addEventListener('mouseover', () => {
                wcagLink.style.display = 'inline';
            });

            issueText.addEventListener('mouseout', () => {
                wcagLink.style.display = 'none';
            });

            auditResultsContainer.appendChild(resultElement);
        });

        document.body.appendChild(auditResultsContainer);
    }

    // Trigger the audit immediately when invoked
    const auditResults = performAccessibilityAudit();
    displayAuditResults(auditResults);
})();
