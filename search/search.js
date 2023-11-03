function performSearch(query) {
    query = query.toLowerCase();
    const results = [];

    // Get all the text nodes on the page
    const textNodes = getTextNodesIn(document.body);

    textNodes.forEach(function(node) {
        const text = node.textContent.toLowerCase();
        if (text.includes(query)) {
            results.push(text);
        }
    });

    return results;
}

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

function getTextNodesIn(elements) {
    const textNodes = [];
    elements.forEach(element => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
    });
    return textNodes;
}

$(document).ready(function() {
    $("#search").on("input", function() {
        const query = $(this).val();
        const results = performSearch(query);
        updateSearchResults(results);
    });
});
