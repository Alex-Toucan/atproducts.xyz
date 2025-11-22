$(document).ready(function() {
  const searchInput = $("#searchInput");
  const items = $(".offcanvas .list-group-item");

  const numberWords = {
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
    "ten": "10"
  };

  function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function convertQuery(query) {
    return numberWords[query] || query;
  }

  searchInput.on("input", function() {
    let query = $(this).val().toLowerCase().trim();
    query = convertQuery(query);
    const maxDistance = 1;

    items.each(function() {
      const text = $(this).text().toLowerCase();

      // Exact match first
      let match = text.includes(query);

      if (!match && query.length > 0) {
        const words = text.split(/\s+/);
        match = words.some(word =>
          word === query || // exact word match
          word.includes(query) || // substring match
          levenshtein(query, word) <= maxDistance // fuzzy match
        );
      }

      $(this).toggle(match || query.length === 0);
    });
  });
});
