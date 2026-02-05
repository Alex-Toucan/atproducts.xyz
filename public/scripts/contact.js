document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('attachment');
  const filename = document.getElementById('attachment-filename');
  const label = document.getElementById('attachment-label');
  const feedback = document.getElementById('attachment-feedback');

  input.addEventListener('change', () => {
    label.classList.remove("is-invalid");
    feedback.classList.add("d-none");

    if (input.files.length > 0) {
      const file = input.files[0];
      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        input.value = "";
        filename.textContent = "Select a File";

        label.classList.add("is-invalid");
        feedback.classList.remove("d-none");

        return;
      }
      filename.textContent = file.name;
    } else {
      filename.textContent = "Select a File";
    }
  });
});