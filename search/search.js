$(document).ready(function() {
    // Handle the input event in the search bar
    $("#searchInput").on("input", function() {
        const query = $(this).val().toLowerCase();
        const content = $("#content").text().toLowerCase();

        const results = content.match(new RegExp(query, "g"));

        // Display the search results
        displayResults(results);
    });

    // Function to display search results
    function displayResults(results) {
        const searchResults = $("#searchResults");

        searchResults.empty();

        if (results) {
            results.forEach(function(result) {
                searchResults.append("<li>" + result + "</li>");
            });
        } else {
            searchResults.html("<li>No results found</li>");
        }
    }
});
