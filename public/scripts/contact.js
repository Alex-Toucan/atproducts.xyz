document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('attachment');
  const filename = document.getElementById('attachment-filename');
  const label = document.getElementById('attachment-label');

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      filename.textContent = input.files[0].name;
    } else {
      filename.textContent = "";
    }
  });
});
