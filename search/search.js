$(document).ready(function() {
    // Handle the input event in the search bar
    $("#searchInput").on("input", function() {
        const query = $(this).val().toLowerCase();
        const content = $("#content").text().toLowerCase();

        const results = [];

        // Search for the query within the content
        if (content.indexOf(query) !== -1) {
            results.push(query);
        }

        // Display the search results
        displayResults(results);
    });

    // Function to display search results
    function displayResults(results) {
        const searchResults = $("#searchResults");

        searchResults.empty();

        if (results.length > 0) {
            results.forEach(function(result) {
                searchResults.append("<li>" + result + "</li>");
            });
        } else {
            searchResults.html("<li>No results found</li>");
        }
    }
});
