// Assuming you have fetched 'icons' and 'dropdownItems' from an API or another source

// Fetching the lengths of the arrays
const numItems = Math.min(dropdownItems.length, 10); // Set the number of items you want in the dropdown, up to a maximum of 10
const numLinks = Math.min(icons.length, 10); // Set the number of links you want in the icon bar, up to a maximum of 10

// Filtered icons based on the number of links required
const filteredIcons = icons.slice(0, numLinks).filter(({ icon, desc, href }) => icon && desc && href);

// Filtered dropdown items based on the number of items required
const filteredDropdownItems = dropdownItems.slice(0, numItems).filter(({ navigationdesc, navigationlink }) => navigationdesc && navigationlink);

// Rendering the filtered icons
filteredIcons.forEach(({ icon, desc, href }, index) => {
  const linkElement = document.createElement('a');
  linkElement.href = href;
  linkElement.target = '_blank';
  linkElement.rel = 'noopener noreferrer';
  linkElement.classList.add('link-hero', 'fs-7');
  linkElement.setAttribute('data-bs-toggle', 'tooltip');
  linkElement.setAttribute('data-bs-placement', 'bottom');
  linkElement.setAttribute('data-bs-title', desc);

  const iconElement = document.createElement('i');
  iconElement.classList.add(`bi`, `bi-${icon}`);

  linkElement.appendChild(iconElement);
  document.getElementById('icons').appendChild(linkElement);
});

// Rendering the filtered dropdown items
filteredDropdownItems.forEach(({ navigationdesc, navigationlink }, index) => {
  const listItem = document.createElement('li');
  const linkElement = document.createElement('a');
  linkElement.classList.add('dropdown-item');
  linkElement.href = navigationlink;
  linkElement.textContent = navigationdesc;
  listItem.appendChild(linkElement);
  document.querySelector('.dropdown-menu').appendChild(listItem);
});
