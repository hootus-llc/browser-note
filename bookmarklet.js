// @ts-ignore
(function () {
  const createPopover = (element, issue, wcagLink) => {
    const popover = document.createElement('div');
    popover.className = 'accessibility-popover';
    popover.style.position = 'absolute';
    popover.style.background = 'rgba(255, 0, 0, 0.9)';
    popover.style.color = '#fff';
    popover.style.padding = '8px';
    popover.style.borderRadius = '4px';
    popover.style.zIndex = '9999';
    popover.style.top = `${element.getBoundingClientRect().top - 30}px`;
    popover.style.left = `${element.getBoundingClientRect().left}px`;

    const issueText = document.createElement('div');
    issueText.textContent = issue;

    const wcagLinkElement = document.createElement('a');
    wcagLinkElement.textContent = 'WCAG Guidelines';
    wcagLinkElement.href = wcagLink;
    wcagLinkElement.target = '_blank';
    wcagLinkElement.style.color = '#fff';
    wcagLinkElement.style.textDecoration = 'underline';
    wcagLinkElement.style.marginTop = '4px';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.marginTop = '8px';
    removeButton.addEventListener('click', () => {
      element.style.border = '';
      popover.remove();
    });

    popover.appendChild(issueText);
    popover.appendChild(wcagLinkElement);
    popover.appendChild(removeButton);
    document.body.appendChild(popover);
  };

  const checkSemanticMarkup = () => {
    const issues = [];
    const semanticElements = [
      'header',
      'nav',
      'main',
      'article',
      'section',
      'aside',
      'footer',
      'figure',
      'figcaption',
      'details',
      'summary',
      'mark',
      'time',
      'code',
    ];

    document.querySelectorAll('*').forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      if (!semanticElements.includes(tagName)) {
        issues.push({
          element,
          issue: `Semantic Error: ${tagName} is not a semantic element.`,
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        });
        element.style.border = '2px solid red';
        element.addEventListener('mouseover', () => {
          createPopover(element, `Semantic Error: ${tagName} is not a semantic element.`, 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html');
        });
      }
    });

    return issues;
  };

  const checkFontSizes = () => {
    const issues = [];
    const minFontSize = 16;

    document.querySelectorAll('*').forEach((element) => {
      const computedFontSize = parseFloat(
        window.getComputedStyle(element).fontSize
      );

      if (computedFontSize < minFontSize) {
        issues.push({
          element,
          issue: `Font Size Error: Font size too small (${computedFontSize}px): ${element.tagName}`,
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/visual-audio-contrast-text-presentation.html',
        });
        element.style.border = '2px solid red';
        element.addEventListener('mouseover', () => {
          createPopover(
            element,
            `Font Size Error: Font size too small (${computedFontSize}px): ${element.tagName}`,
            'https://www.w3.org/WAI/WCAG21/Understanding/visual-audio-contrast-text-presentation.html'
          );
        });
      }
    });

    return issues;
  };

  const checkColorContrast = () => {
    const issues = [];
    const minContrastRatio = 4.5;

    const getContrastRatio = (color1, color2) => {
      const luminance1 = calculateLuminance(color1);
      const luminance2 = calculateLuminance(color2);
      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const calculateLuminance = (color) => {
      const rgb = parseColor(color);
      const r = gammaCorrect(rgb[0] / 255);
      const g = gammaCorrect(rgb[1] / 255);
      const b = gammaCorrect(rgb[2] / 255);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const gammaCorrect = (value) => {
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const parseColor = (color) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d');
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const data = context.getImageData(0, 0, 1, 1).data;
      return [data[0], data[1], data[2]];
    };

    document.querySelectorAll('*').forEach((element) => {
      const backgroundColor = window.getComputedStyle(element).backgroundColor;
      const color = window.getComputedStyle(element).color;
      const contrastRatio = getContrastRatio(backgroundColor, color);

      if (contrastRatio < minContrastRatio) {
        issues.push({
          element,
          issue: `Contrast Error: Low contrast ratio (${contrastRatio.toFixed(
            2
          )}): ${element.tagName} - ${element.textContent}`,
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/visual-audio-contrast-text-presentation.html',
        });
        element.style.border = '2px solid red';
        element.addEventListener('mouseover', () => {
          createPopover(
            element,
            `Contrast Error: Low contrast ratio (${contrastRatio.toFixed(
              2
            )}): ${element.tagName} - ${element.textContent}`,
            'https://www.w3.org/WAI/WCAG21/Understanding/visual-audio-contrast-text-presentation.html'
          );
        });
      }
    });

    return issues;
  };

  const checkAriaLabels = () => {
    const issues = [];

    document.querySelectorAll('*[aria-label]').forEach((element) => {
      const ariaLabel = element.getAttribute('aria-label');
      if (!ariaLabel.trim()) {
        issues.push({
          element,
          issue: `ARIA Label Error: Empty aria-label attribute: ${element.tagName}`,
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
        });
        element.style.border = '2px solid red';
        element.addEventListener('mouseover', () => {
          createPopover(
            element,
            `ARIA Label Error: Empty aria-label attribute: ${element.tagName}`,
            'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
          );
        });
      }
    });

    return issues;
  };

  const checkAltTags = () => {
    const issues = [];

    document.querySelectorAll('img').forEach((element) => {
      const altText = element.getAttribute('alt');
      if (!altText || altText.trim() === '') {
        issues.push({
          element,
          issue: `Image Error: Image missing alt text: ${element.outerHTML}`,
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        });
        element.style.border = '2px solid red';
        element.addEventListener('mouseover', () => {
          createPopover(
            element,
            `Image Error: Image missing alt text: ${element.outerHTML}`,
            'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html'
          );
        });
      }
    });

    return issues;
  };

  const removePopover = (element) => {
    element.style.border = '';
    const popover = element.querySelector('.accessibility-popover');
    if (popover) {
      popover.remove();
    }
  };

  const handleMouseOut = (element) => {
    element.addEventListener('mouseout', () => {
      removePopover(element);
    });
  };

  const semanticMarkupIssues = checkSemanticMarkup();
  const fontSizesIssues = checkFontSizes();
  const colorContrastIssues = checkColorContrast();
  const ariaLabelIssues = checkAriaLabels();
  const altTagIssues = checkAltTags();

  const allIssues = [
    ...semanticMarkupIssues,
    ...fontSizesIssues,
    ...colorContrastIssues,
    ...ariaLabelIssues,
    ...altTagIssues,
  ];

  allIssues.forEach((issueItem) => {
    handleMouseOut(issueItem.element);
  });
})();
