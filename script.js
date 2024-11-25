// Elements
const cityForm = document.getElementById("cityForm");
const resultDiv = document.getElementById("result");
const searchesList = document.getElementById("searchesList");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");

// Load previous data from localStorage
function loadPreviousData() {
  const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];
  const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));

  // Populate the previous searches list
  searchesList.innerHTML = "";
  previousSearches.forEach((search) => {
    const li = document.createElement("li");
    li.textContent = `${search.city}, ${search.state} - Population: ${search.population}`;
    searchesList.appendChild(li);
  });

  // Populate the input fields with the last search (if available)
  if (lastSearch) {
    cityInput.value = lastSearch.city;
    stateInput.value = lastSearch.state;
    resultDiv.textContent = `The population of ${lastSearch.city}, ${lastSearch.state.toUpperCase()} is ${lastSearch.population.toLocaleString()}.`;
  }
}

// Save search to localStorage
function saveSearch(city, state, population) {
  const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];
  const newSearch = { city, state, population };

  // Add the new search to the array
  previousSearches.unshift(newSearch);

  // Keep only the last 5 searches
  if (previousSearches.length > 5) {
    previousSearches.pop();
  }

  // Save to localStorage
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
  localStorage.setItem("lastSearch", JSON.stringify(newSearch));
}

// Fetch population data
cityForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  const state = stateInput.value.trim();

  // Clear previous result
  resultDiv.textContent = "";

  if (!city || !state) {
    resultDiv.textContent = "Please enter both city and state.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/city?name=${city}&state=${state}`,
      {
        headers: { 'X-Api-Key': 'kHlSOqsOdmCMfgo+/CJiTg==CbKnkjCn0Zijsjtg' } // Replace with your API key
      }
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    if (data.length > 0 && data[0].population) {
      const population = data[0].population;
      resultDiv.textContent = `The population of ${city}, ${state.toUpperCase()} is ${population.toLocaleString()}.`;

      // Save search
      saveSearch(city, state, population);

      // Reload previous searches
      loadPreviousData();
    } else {
      resultDiv.textContent = "Population data not found.";
    }
  } catch (error) {
    resultDiv.textContent = "An error occurred: " + error.message;
  }
});

// Load data on page load
document.addEventListener("DOMContentLoaded", loadPreviousData);
