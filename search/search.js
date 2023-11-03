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

function performSearch(query) {
    query = query.toLowerCase();
    const results = [];

    // Get all the text nodes within elements with the class 'searchable'
    const textNodes = getTextNodesIn(document.querySelectorAll(".searchable"));

    textNodes.forEach(function(node) {
        const text = node.textContent.toLowerCase();
        if (text.includes(query)) {
            results.push(text);
        }
    });

    return results;
}

function updateSearchResults(results) {
    const resultsList = document.getElementById("search-results");
    resultsList.innerHTML = '';

    if (results.length === 0) {
        resultsList.innerHTML = "<li>No results found</li>";
    } else {
        results.forEach(result => {
            const li = document.createElement("li");
            li.textContent = result;
            resultsList.appendChild(li);
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", function() {
        const query = searchInput.value;
        const results = performSearch(query);
        updateSearchResults(results);
    });
});
