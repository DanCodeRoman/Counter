document.getElementById("cityForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const resultDiv = document.getElementById("result");

  // Clear previous result
  resultDiv.textContent = "";

  if (!city || !state) {
    resultDiv.textContent = "Please enter both city and state.";
    return;
  }

  try {
    // Fetch population data (using a placeholder API endpoint)
    const response = await fetch(
      `https://api.api-ninjas.com/v1/city?name=${city}&state=${state}`,
      {
        headers: { 'X-Api-Key': 'kHlSOqsOdmCMfgo+/CJiTg==CbKnkjCn0Zijsjtg
' } // Replace with your API key
      }
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    if (data.length > 0 && data[0].population) {
      resultDiv.textContent = `The population of ${city}, ${state.toUpperCase()} is ${data[0].population.toLocaleString()}.`;
    } else {
      resultDiv.textContent = "Population data not found.";
    }
  } catch (error) {
    resultDiv.textContent = "An error occurred: " + error.message;
  }
});
