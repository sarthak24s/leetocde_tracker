let problems = [];
let editIndex = -1;

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkszfdfkQ5J10dkcty5lAsls_psbcUcg0",
  authDomain: "leetcode-tracker-dcf63.firebaseapp.com",
  databaseURL: "https://leetcode-tracker-dcf63-default-rtdb.firebaseio.com",
  projectId: "leetcode-tracker-dcf63",
  storageBucket: "leetcode-tracker-dcf63.firebasestorage.app",
  messagingSenderId: "1088259628036",
  appId: "1:1088259628036:web:1f73d1f03250755238e951",
  measurementId: "G-BNR2QJBF9C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const problemsRef = db.ref("problems");

function renderProblems(problemList = problems) {
  const tbody = document.querySelector("#problemsTable tbody");
  tbody.innerHTML = "";

  problemList.forEach((problem, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${problem.name}</td>
      <td><a href="${problem.link}" target="_blank">Link</a></td>
      <td>${problem.date}</td>
      <td>${problem.difficulty}</td>
      <td>${problem.tags}</td>
    `;

    const actionsCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editProblem(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteProblem(index));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    const notesCell = document.createElement("td");
    const viewNotesBtn = document.createElement("button");
    viewNotesBtn.textContent = "View Notes";
    viewNotesBtn.classList.add("view-notes-btn");
    viewNotesBtn.addEventListener("click", () => showNotes(problem.notes));

    notesCell.appendChild(viewNotesBtn);
    row.appendChild(notesCell);

    tbody.appendChild(row);
  });
}

function showNotes(notes) {
  const modal = document.getElementById("notesModal");
  const modalText = document.getElementById("modalNotes");
  modalText.textContent = notes || "No notes added.";
  modal.style.display = "block";
}

document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("notesModal").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("notesModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function editProblem(index) {
  const problem = problems[index];
  document.getElementById("problemName").value = problem.name;
  document.getElementById("solutionLink").value = problem.link;
  document.getElementById("dateSolved").value = problem.date;
  document.getElementById("difficulty").value = problem.difficulty;
  document.getElementById("tags").value = problem.tags;
  document.getElementById("notes").value = problem.notes || "";
  editIndex = index;
  document.querySelector("#problemForm button[type='submit']").textContent = "Update Problem";
}

function deleteProblem(index) {
  if (confirm("Are you sure you want to delete this problem?")) {
    problems.splice(index, 1);
    problemsRef.set(problems);
  }
}

document.getElementById("problemForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const problem = {
    name: document.getElementById("problemName").value,
    link: document.getElementById("solutionLink").value,
    date: document.getElementById("dateSolved").value,
    difficulty: document.getElementById("difficulty").value,
    tags: document.getElementById("tags").value,
    notes: document.getElementById("notes").value,
  };

  if (editIndex > -1) {
    problems[editIndex] = problem;
    editIndex = -1;
    document.querySelector("#problemForm button[type='submit']").textContent = "Add Problem";
  } else {
    problems.push(problem);
  }

  problemsRef.set(problems);
  this.reset();
  alert("Problem added successfully!");

});

document.getElementById("searchBox").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = problems.filter((p) => p.name.toLowerCase().includes(query));
  renderProblems(filtered);
});

document.getElementById("exportBtn").addEventListener("click", function () {
  let csvContent = "data:text/csv;charset=utf-8,#,Problem Name,Link,Date,Difficulty,Tags,Notes\n";
  problems.forEach((p, i) => {
    const row = [i + 1, p.name, p.link, p.date, p.difficulty, p.tags, p.notes];
    csvContent += row.map((v) => `"${v}"`).join(",") + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "leetcode_problems.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Listen to Firebase changes and render the UI
problemsRef.on("value", (snapshot) => {
  problems = snapshot.val() || [];
  renderProblems();
});