const dropdownItems = [
  { navigationdesc: iddesc1, navigationlink: idhref1 },
  { navigationdesc: iddesc2, navigationlink: idhref2 },
  { navigationdesc: iddesc3, navigationlink: idhref3 },
  { navigationdesc: iddesc4, navigationlink: idhref4 },
  { navigationdesc: iddesc5, navigationlink: idhref5 },
  { navigationdesc: iddesc6, navigationlink: idhref6 },
  { navigationdesc: iddesc7, navigationlink: idhref7 },
  { navigationdesc: iddesc8, navigationlink: idhref8 },
  { navigationdesc: iddesc9, navigationlink: idhref9 },
  { navigationdesc: iddesc10, navigationlink: idhref10 },
];

const icons = [
  { icon: icon1, desc: desc1, href: href1 },
  { icon: icon2, desc: desc2, href: href2 },
  { icon: icon3, desc: desc3, href: href3 },
  { icon: icon4, desc: desc4, href: href4 },
  { icon: icon5, desc: desc5, href: href5 }
];

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
