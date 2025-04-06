// Load problems when page loads
window.addEventListener('load', () => {
    const storedProblems = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];
    renderTable(storedProblems);
});

// Handle form submission
document.getElementById('problemForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('problemName').value;
    const link = document.getElementById('solutionLink').value;
    const date = document.getElementById('dateSolved').value;

    const problem = { name, link, date };

    const stored = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];
    stored.push(problem);
    localStorage.setItem('leetcodeProblems', JSON.stringify(stored));

    renderTable(stored);

    document.getElementById('problemForm').reset();
});

// Renders the whole table
function renderTable(problems) {
    const tbody = document.getElementById('problemsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear old rows

    problems.forEach((problem, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${problem.name}</td>
            <td><a href="${problem.link}" target="_blank">${problem.link}</a></td>
            <td>${problem.date}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            const updated = problems.filter((_, i) => i !== index);
            localStorage.setItem('leetcodeProblems', JSON.stringify(updated));
            renderTable(updated); // Refresh the table
        });

        tbody.appendChild(row);
    });
}
