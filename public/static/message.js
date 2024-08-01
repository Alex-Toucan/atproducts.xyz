$(document).ready(function() {
  // Function to get the current text color based on the color scheme
  function getTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text-color') || 'white';
  }

  // Function to log the message with the current text color
  function logMessage() {
    const whiteColor = getTextColor();
    console.log('%cHello there fellow traveler!%c\nFeel free to explore and experiment with the console. Rest assured, nothing on this site can compromise your security, and your cookies do not contain personally identifiable information.\n\nThis website is open source, and we welcome you to check out the code at %chttps://github.com/Alex-Toucan/atproducts.xyz',
                'font-weight: bold; font-size: 24px; color: green;',  // Style for header
                `font-size: 16px; color: ${whiteColor};`,              // Style for body text with dynamic color
                'font-size: 16px; color: blue; text-decoration: underline;' // Style for link
               );
  }

  // Initial log
  logMessage();

  // Listen for changes in the color scheme
  const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeMediaQuery.addEventListener('change', (event) => {
    logMessage();
  });
});
