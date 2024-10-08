import "./style.css";

// Add a button to the HTML
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="dashboard-list" class="dashboard-list">

  </div>

  <div id="error-output"></div>
`;

// Function to fetch data from localhost:3001
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3001/api/get-dashboards");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Assuming JSON response
    const dashboardList = document.getElementById("dashboard-list")!;

    data.forEach(
      (dashboard: {
        title: string;
        description: string;
        rawThumbnail: string;
        thumbnail: string;
      }) => {
        const dashboardItem = document.createElement("div");
        dashboardItem.classList.add("dashboard-item");

        dashboardItem.innerHTML = `
        <img src="${dashboard.thumbnail}" alt="${dashboard.title}" class="dashboard-thumbnail" />
        <h3>${dashboard.title}</h3>
        <p>${dashboard.description}</p>
      `;

        dashboardList.appendChild(dashboardItem);
      }
    );
  } catch (error: any) {
    document.getElementById(
      "error-output"
    )!.textContent = `Error: ${error.message}`;
  }
}

fetchData();
