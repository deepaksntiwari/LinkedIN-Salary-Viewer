
document.addEventListener('DOMContentLoaded', () => {
    const dbContainer = document.getElementById('dbContainer');

    chrome.storage.local.get({ mockDB: [] }, (data) => {
        if (data.mockDB.length === 0) {
            dbContainer.innerHTML = "<p>No saved data found.</p>";
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Job Title</th>
                <th>Company Name</th>
                <th>Salary Data</th>
                <th>Date Saved</th>
            </tr>
        `;

        data.mockDB.forEach((entry) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.companyName}</td>
                <td>${entry.jobTitle}</td>
                <td>${entry.salaryData}</td>
                <td>${new Date(entry.dateSaved).toLocaleString()}</td>
            `;
            table.appendChild(row);
        });

        dbContainer.appendChild(table);
    });
});
