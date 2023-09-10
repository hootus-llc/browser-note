// @ts-ignore
(function () {
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
        issues.push(`Semantic Error: ${tagName} is not a semantic element.`);
        element.style.border = '2px solid red'; // Highlight non-semantic elements
      }
    });

    return issues;
  };

  const checkFontSizes = () => {
    const issues = [];
    const minFontSize = 16; // Adjust as needed

    document.querySelectorAll('*').forEach((element) => {
      const computedFontSize = parseFloat(
        window.getComputedStyle(element).fontSize
      );

      if (computedFontSize < minFontSize) {
        issues.push(
          `Font Size Error: Font size too small (${computedFontSize}px): ${element.tagName}`
        );
        element.style.border = '2px solid red'; // Highlight elements with small font size
      }
    });

    return issues;
  };

  const checkColorContrast = () => {
    const issues = [];
    const minContrastRatio = 4.5; // Adjust as needed

    const getContrastRatio = (color1, color2) => {
      // Function to calculate color contrast ratio
      const luminance1 = calculateLuminance(color1);
      const luminance2 = calculateLuminance(color2);
      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const calculateLuminance = (color) => {
      // Function to calculate color luminance
      const rgb = parseColor(color);
      const r = gammaCorrect(rgb[0] / 255);
      const g = gammaCorrect(rgb[1] / 255);
      const b = gammaCorrect(rgb[2] / 255);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const gammaCorrect = (value) => {
      // Gamma correction for color luminance calculation
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const parseColor = (color) => {
      // Function to parse color values
      const tempElem = document.createElement('div');
      tempElem.style.color = color;
      document.body.appendChild(tempElem);
      const computedColor = window.getComputedStyle(tempElem).color;
      document.body.removeChild(tempElem);
      const matches = computedColor.match(/(\d+(\.\d+)?)/g);
      if (matches && matches.length === 3) {
        return [parseFloat(matches[0]), parseFloat(matches[1]), parseFloat(matches[2])];
      }
      return [0, 0, 0];
    };

    document.querySelectorAll('*').forEach((element) => {
      const backgroundColor = window.getComputedStyle(element).backgroundColor;
      const color = window.getComputedStyle(element).color;
      const contrastRatio = getContrastRatio(backgroundColor, color);

      if (contrastRatio < minContrastRatio) {
        issues.push(
          `Contrast Error: Low contrast ratio (${contrastRatio.toFixed(2)}): ${element.tagName} - ${element.textContent}`
        );
        element.style.border = '2px solid red'; // Highlight elements with low color contrast
      }
    });

    return issues;
  };

  const checkAriaLabels = () => {
    const issues = [];

    document.querySelectorAll('[aria-label]').forEach((element) => {
      const ariaLabel = element.getAttribute('aria-label');
      if (!ariaLabel || ariaLabel.trim() === '') {
        issues.push(`ARIA Error: Element is missing a meaningful aria-label attribute: ${element.outerHTML}`);
        element.style.border = '2px solid red'; // Highlight elements with missing aria-label
      }
    });

    return issues;
  };

  const checkAltTags = () => {
    const issues = [];

    document.querySelectorAll('img').forEach((image) => {
      const altText = image.getAttribute('alt');
      if (!altText || altText.trim() === '') {
        issues.push(`Image missing alt text: ${image.outerHTML}`);
        image.style.border = '2px solid red'; // Highlight images with missing alt text
      }
    });

    return issues;
  };

  const printIssues = (issues) => {
    if (issues.length > 0) {
      issues.forEach((issue) => {
        console.log(issue);
      });
    } else {
      console.log('No accessibility issues found.');
    }
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

  printIssues(allIssues);
})();

