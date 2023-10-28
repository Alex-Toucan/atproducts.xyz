$(document).ready(function() {
    // Get the content to be searched
    const content = $("#content").text().toLowerCase();
    
    // Split the content into words
    const words = content.split(/\s+/);

    // Handle the input event in the search bar
    $("#searchInput").on("input", function() {
        const query = $(this).val().toLowerCase();
        const results = [];

        if (query) {
            // Use a loop to search for words that contain the query
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
