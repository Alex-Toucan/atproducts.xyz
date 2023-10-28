// Function to perform the search on the current page
function performSearch(query) {
    query = query.toLowerCase();
    const results = [];

    // Get all the text content on the page
    const pageText = $("body").text().toLowerCase();

    // Find all occurrences of the query in the page text
    const matches = pageText.match(new RegExp(query, "g"));

    if (matches) {
        results.push(...matches);
    }

    return results;
}

// Function to update the search results list
function updateSearchResults(results) {
    const resultsList = $("#search-results");
    resultsList.empty();

    if (results.length === 0) {
        resultsList.append("<li>No results found</li>");
    } else {
        results.forEach(result => {
            resultsList.append("<li>" + result + "</li>");
        });
    }
}

$(document).ready(function() {
    $("#search").on("input", function() {
        const query = $(this).val();
        const results = performSearch(query);
        updateSearchResults(results);
    });
});
