// Utility function to log messages with an IST timestamp
async function logMessage(message) {
    const date = new Date();
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    const logEntry = `[${istDate.toISOString().replace('T', ' ').slice(0, 19)} IST] ${message}`;
    chrome.storage.local.get({ logs: [] }, (data) => {
        const logs = data.logs;
        logs.push(logEntry);
        chrome.storage.local.set({ logs }, () => console.log("Log saved:", logEntry));
    });
}

// Function to extract job details
function extractJobDetails() {
    try {
        const jobTitleElement = document.getElementsByClassName('job-details-jobs-unified-top-card__job-title')[0];
        const companyNameElement = document.getElementsByClassName('job-details-jobs-unified-top-card__company-name')[0];

        const jobTitle = jobTitleElement ? jobTitleElement.innerText.split('·')[0].trim().replace(' ', '-') : null;
        const companyName = companyNameElement ? companyNameElement.innerText.split('·')[0].trim().replace(' ', '-') : null;

        if (!jobTitle || !companyName) throw new Error("Missing job title or company name");

        return { jobTitle, companyName };
    } catch (error) {
        logMessage("Failed to extract job details: " + error.message);
        return null;
    }
}

// Check for existing salary data in mock DB
async function checkMockDB(jobDetails) {
    return new Promise((resolve) => {
        chrome.storage.local.get({ mockDB: [] }, (data) => {
            const existingEntry = data.mockDB.find(entry =>
                entry.companyName === jobDetails.companyName &&
                entry.jobTitle === jobDetails.jobTitle
            );
            resolve(existingEntry || null);
        });
    });
}

// Save job details with salary data to mock DB
async function saveToMockDB(jobDetails, salaryData) {
    chrome.storage.local.get({ mockDB: [] }, (data) => {
        const mockDB = data.mockDB;

        // Add a new entry to mockDB
        const newEntry = {
            ...jobDetails,
            salaryData,
            dateSaved: new Date().toISOString()
        };
        mockDB.push(newEntry);

        chrome.storage.local.set({ mockDB }, () => {
            console.log("Saved to mockDB:", newEntry);
        });
    });
}

// Show loading message in overlay
function showLoading() {
    overlay.innerHTML = "<div>Loading salary data...</div>";
}
var jobDetails;

// Handle button click to fetch or display salary data
async function handleButtonClick() {
    jobDetails = extractJobDetails();
    if (jobDetails) {
        await logMessage(`Extracted job details: ${JSON.stringify(jobDetails)}`);

        const existingData = await checkMockDB(jobDetails);

        if (existingData) {
            logMessage("Using cached salary data");
            updateOverlay(existingData.salaryData, null);
        } else {
            showLoading();
            chrome.runtime.sendMessage({ action: "get_data", ...jobDetails });
        }
    } else {
        await logMessage("No job details found.");
    }
}


// Listen for messages from the background script with fetched salary data or an error
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.salaryData) {
        if (jobDetails) {
            updateOverlay(message.salaryData, null);
            await saveToMockDB(jobDetails, message.salaryData); // Save only when salary data is successfully fetched
            await logMessage(`Fetched and saved salary data: ${message.salaryData}`);
        }
    } else if (message.error) {
        updateOverlay(null, message.redirect); // Clear overlay or show an error if required
        await logMessage(`Failed to fetch salary data: ${message.redirect}`);
    }
});


// Create button and overlay for display
const button = document.createElement("button");
button.innerText = "Get Salary";
button.style.position = "fixed";
button.style.bottom = "120px";
button.style.right = "20px";
button.style.zIndex = "1000";
button.style.padding = "10px 20px";
button.style.backgroundColor = "#0073b1";
button.style.color = "white";
button.style.border = "none";
button.style.fontSize = "16px";
button.style.fontWeight = "bold";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
document.body.appendChild(button);
button.addEventListener("click", handleButtonClick);
const overlay = document.createElement('div');
overlay.id = "OverLay";



// Function to update overlay
function updateOverlay(salary = null, error = null) {
    if (jobDetails) {
        overlay.style.position = 'fixed';
        overlay.style.bottom = '170px';
        overlay.style.right = '20px';
        overlay.style.width = '250px';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        overlay.style.border = '8px solid #ddd';
        overlay.style.borderRadius = '5px';
        overlay.style.padding = '10px';
        overlay.style.zIndex = '1000';
        overlay.style.fontSize = '16px';
        overlay.style.color = 'black';
        document.body.appendChild(overlay);
        document.getElementById('OverLay').style.display = 'block';

        overlay.innerHTML = `
            <div>        <span id='close'>x</span>
<strong>Job Title:</strong> ${jobDetails.jobTitle}</div>
            <div><strong>Company Name:</strong> ${jobDetails.companyName}</div>
            ${salary ? `<div><strong>Estimated Salary:</strong> ${salary}</div>` : `<div><strong>Estimated Salary:</strong> Couldnt find salary, please check here:-\n <a href=${error} target="_blank">Link</a> </div>`}
        `;
        document.getElementById('close').onclick = () => {
            document.getElementById('OverLay').style.display = 'none';
            return false;
        };
    } else {
        overlay.innerHTML = `<div><strong>Job Details Not Found</strong></div>`;
    }
}
