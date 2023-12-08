export default function Icon({ href, icon, desc }) {
    {href && icon && desc (
      render() (
        <a href={href} target='_blank' rel='noopener noreferrer' class='link-hero fs-7'>
          <i class={`bi bi-${icon}`}></i>
          <span>{desc}</span>
        </a>
    ) : (
    return null;
     )};
}
