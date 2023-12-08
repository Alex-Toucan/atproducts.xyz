function iconrender(); {
  const icon = ({ href, icon, desc });
  return (
      {href && icon && desc ? (
       <a href={href} target="_blank" rel="noopener noreferrer" class="link-hero fs-7" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title={desc}>
          <i class={`bi bi-${icon}`}></i>
        </a>
      ) : (
        return null;
      )}
    </div>
  );
}

render(iconrender);
