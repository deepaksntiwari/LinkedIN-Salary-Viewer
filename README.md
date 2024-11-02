# LinkedInSalaryViewer
## Overview

**LinkedIn Job Salary Viewer** is a Chrome extension that allows users to view estimated salary information for job listings directly on LinkedIn. By simply navigating to a LinkedIn job post and clicking the "Get Salary Info" button, users can retrieve estimated salary details without manually searching on salary research websites. This extension aims to streamline job research for professionals by integrating with AmbitionBox for salary data retrieval.

## Features

- **Instant Salary Information**: Retrieve and display estimated salary data from AmbitionBox on any LinkedIn job posting page.
- **Persistent Logging**: Store all fetched data in a local mock database, making the information readily available for future reference.
- **Smart Caching**: Avoid redundant data requests by checking the local mock database before fetching.
- **In-App Logs**: Track and log all events and errors, viewable directly from the extension's popup.
- **Overlay Display**: Easily view job title, company name, and estimated salary information in an overlay on the LinkedIn page.

## How to Use

1. **Install the Extension**:
   - Clone or download this repository.
   - Go to `chrome://extensions` in your Chrome browser.
   - Enable **Developer mode**.
   - Click on **Load unpacked** and select the extension's folder.

2. **Use the Extension**:
   - Navigate to any LinkedIn job posting page.
   - Click the "Get Salary Info" button located at the bottom right of the page.
   - The extension will either display the salary information (from the local cache if available) or fetch it from AmbitionBox if it’s the first time for that job and company combination.
   - If the salary data is successfully retrieved, it will be shown in an overlay on the page.

3. **View Saved Data**:
   - Click the extension icon in your Chrome toolbar.
   - In the popup window, view all saved salary data from your local mock database, including job title, company name, salary, and the date it was fetched.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select the extension's directory.
5. The extension should now appear in your Chrome toolbar.

## Technical Details

### Mock Database

The extension utilizes Chrome’s `chrome.storage.local` to store salary data for each unique combination of job title and company. This data includes:
- **Job Title**
- **Company Name**
- **Salary Information**
- **Date Fetched**

### Background and Content Script Communication

The extension uses `chrome.runtime.sendMessage` to communicate between the content and background scripts. This is essential for:
- Fetching salary data only when necessary.
- Updating the local mock database if new salary data is retrieved.
- Displaying information and error logs for seamless user interaction.

### Error Handling

- **No Salary Data Found**: If salary data isn’t available on AmbitionBox, the extension will display an error message in the overlay.
- **Debugging Logs**: Logs are stored in `chrome.storage.local` for easy access and can be viewed by clicking on the extension icon.

## Troubleshooting

- **"Salary Information Not Found" Error**: If you encounter this message, the job title or company name may not have salary information available on AmbitionBox.
- **Data Not Saving**: Ensure that Chrome has permissions enabled for local storage.
- **Mock Database Not Displaying**: Check that you have the latest version of the extension loaded and that `popup.html` is correctly configured to display saved data.

## Contributing

1. **Fork the repository**.
2. **Create a feature branch**: `git checkout -b feature-name`.
3. **Commit your changes**: `git commit -m 'Add new feature'`.
4. **Push to the branch**: `git push origin feature-name`.
5. **Open a pull request**.


