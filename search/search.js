$(document).ready(function() {
    // Get the content to be searched
    const content = $("#content").text().toLowerCase();

    // Handle the input event in the search bar
    $("#searchInput").on("input", function() {
        const query = $(this).val().toLowerCase();
        const results = [];

        if (query) {
            // Use regular expression to match whole words
            const regExp = new RegExp("\\b" + query + "\\b", "g");
            const matches = content.match(regExp);

            if (matches) {
                results.push(...matches);
            }
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
