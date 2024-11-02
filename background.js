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

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { companyName, jobTitle } = message;
    await logMessage(`Received message: companyName=${companyName}, jobTitle=${jobTitle}`);

    const url = `https://www.ambitionbox.com/salaries/${encodeURIComponent(companyName)}-salaries/${encodeURIComponent(jobTitle)}`;

    chrome.tabs.create({ url, active: false }, async (tab) => {
        await logMessage(`Opened tab with URL: ${url}`);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.querySelector('.row-left__salary')?.innerText || null
        }, async (results) => {
            if (results && results[0]?.result) {
                const salaryData = results[0].result;
                await logMessage(`Extracted salary data: ${salaryData}`);

                if (sender && sender.tab && sender.tab.id) {
                    chrome.tabs.sendMessage(sender.tab.id, { salaryData });
                    await logMessage(`Sent salary data to tab ID ${sender.tab.id}`);
                }
            } else {
                const errorMessage = "Salary information not found";
                await logMessage(errorMessage);

                if (sender && sender.tab && sender.tab.id) {
                    chrome.tabs.sendMessage(sender.tab.id, { error: errorMessage, redirect: `https://www.ambitionbox.com/salaries/${encodeURIComponent(companyName)}-salaries` });
                    await logMessage(`Sent error message to tab ID ${sender.tab.id}`);
                }
            }

            // Close the AmbitionBox tab
            chrome.tabs.remove(tab.id);
            await logMessage("Closed AmbitionBox tab");
        });
    });
    return true;
});
