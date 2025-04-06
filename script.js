let count = 1;

// Load existing problems from localStorage when the page loads
window.addEventListener('load', () => {
    const storedProblems = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];
    storedProblems.forEach(problem => addRowToTable(problem, false));
});

// Add event listener for form submission
document.getElementById('problemForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('problemName').value;
    const link = document.getElementById('solutionLink').value;
    const date = document.getElementById('dateSolved').value;

    const problem = { name, link, date };
    addRowToTable(problem, true);

    // Clear form
    document.getElementById('problemForm').reset();
});

function addRowToTable(problem, saveToStorage) {
    const table = document.getElementById('problemsTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${count}</td>
        <td>${problem.name}</td>
        <td><a href="${problem.link}" target="_blank">${problem.link}</a></td>
        <td>${problem.date}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    // Add delete event
    newRow.querySelector('.delete-btn').addEventListener('click', () => {
        newRow.remove(); // Remove from table

        let stored = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];
        stored = stored.filter(p => !(p.name === problem.name && p.date === problem.date));
        localStorage.setItem('leetcodeProblems', JSON.stringify(stored));
    });

    table.appendChild(newRow);

    if (saveToStorage) {
        let stored = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];
        stored.push(problem);
        localStorage.setItem('leetcodeProblems', JSON.stringify(stored));
    }

    count++;
}
