// Wait for the page to load before running the script
$(document).ready(function() {
    // Get the content to be searched
    const content = $("#content").text().toLowerCase();

    // Handle the input event in the search bar
    $("#searchInput").on("input", function() {
        const query = $(this).val().toLowerCase();
        const results = [];

        if (query) {
            // Split the content into words and search for matches
            const words = content.split(' ');
            words.forEach(function(word) {
                if (word.includes(query)) {
                    results.push(word);
                }
            });
        }

        // Display the search results
        displayResults(results);
    });

    // Function to display search results
    function displayResults(results) {
        const searchResults = $("#searchResults");

        if (results.length > 0) {
            searchResults.empty();
            results.forEach(function(result) {
                searchResults.append("<li>" + result + "</li>");
            });
        } else {
            searchResults.html("<li>No results found</li>");
        }
    }
});
