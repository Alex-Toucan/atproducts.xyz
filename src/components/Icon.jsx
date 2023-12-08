<:astro>
  export default function Icon({ href, icon, desc }) {
    {#if href && icon && desc}
      return (
        <a href={href} target='_blank' rel='noopener noreferrer' class='link-hero fs-7'>
          <i class={`bi bi-${icon}`}></i>
          <span>{desc}</span>
        </a>
      );
    {/if}
    return null;
  }
</:astro>
