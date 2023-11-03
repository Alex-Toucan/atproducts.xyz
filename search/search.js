function performSearch(query) {
    query = query.toLowerCase();
    const results = [];
    const textNodes = getTextNodesIn(document.querySelector(".searchable"));
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

function getTextNodesIn(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    return textNodes;
}

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function() {
        const query = searchInput.value;
        const results = performSearch(query);
        updateSearchResults(results);
    });
});
