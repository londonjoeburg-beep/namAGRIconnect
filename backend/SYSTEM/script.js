// Configuration & Mock Student Activity Pools
const students = ["Alice Smith", "Bryan Jones", "Chidi Anagonye", "Dana Scully", "Ethan Hunt"];
const activities = [
    "opened assignment drafts.",
    "completed quiz: Introduction to Neural Networks.",
    "submitted a code block for compilation evaluation.",
    "spent 15 minutes reviewing reading materials.",
    "started a new peer code review session.",
    "updated their workspace profile repository."
];

// Interface Hooks
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const scanLoader = document.getElementById('scan-loader');
const loaderText = document.getElementById('loader-text');
const resultsDashboard = document.getElementById('results-dashboard');
const activityLog = document.getElementById('activity-log');

// Elements for results injection
const metricScore = document.getElementById('metric-score');
const metricPlagiarism = document.getElementById('metric-plagiarism');
const metricReadability = document.getElementById('metric-readability');
const extractedTextContainer = document.getElementById('extracted-text');
const aiFeedbackContainer = document.getElementById('ai-feedback');

// 1. Generate Live Background Student Activities
function generateLiveActivity() {
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const timestamp = new Date().toLocaleTimeString();

    const entry = document.createElement('div');
    entry.className = 'activity-item';
    entry.innerHTML = `<strong>${randomStudent}</strong> ${randomActivity} <span class="time">${timestamp}</span>`;

    activityLog.insertBefore(entry, activityLog.firstChild);

    // Keep log trimmed to last 15 elements
    if (activityLog.children.length > 15) {
        activityLog.removeChild(activityLog.lastChild);
    }
}
setInterval(generateLiveActivity, 3500); // Trigger every 3.5 seconds
generateLiveActivity(); // Trigger baseline entries immediately
generateLiveActivity();

// 2. File Upload Listeners
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
        handleAssignmentScan(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleAssignmentScan(e.target.files[0]);
    }
});

// 3. Document Processing Pipelines & AI Assessment Emulator
function handleAssignmentScan(file) {
    resultsDashboard.classList.add('hidden');
    scanLoader.classList.remove('hidden');
    loaderText.innerText = `Reading file structural metadata: "${file.name}"...`;

    const reader = new FileReader();

    reader.onload = function(e) {
        const fileContent = e.target.result || "No legible text found inside document framework.";
        
        // Phase 2 of loader animation
        setTimeout(() => {
            loaderText.innerText = "Running Natural Language Parsing (NLP) and vector match scanning...";
        }, 1200);

        // Phase 3 calculations complete
        setTimeout(() => {
            scanLoader.classList.add('hidden');
            displayScanResults(file.name, fileContent);
        }, 2500);
    };

    reader.onerror = function() {
        scanLoader.classList.add('hidden');
        alert("Critical IO Exception reading document contents.");
    };

    // Reads local files as standard string layouts
    reader.readAsText(file);
}

// 4. Report Rendering Engine
function displayScanResults(fileName, fileText) {
    // Basic algorithmic text validation metrics computed locally
    const wordCount = fileText.trim().split(/\s+/).length;
    const aiConfidence = Math.min(98, Math.max(45, Math.floor(Math.random() * 30) + 65));
    const plagiarismMetric = Math.floor(Math.random() * 18); // Simulated standard probability index
    
    let readabilityIndex = "Optimal";
    if (wordCount < 40) readabilityIndex = "Insufficient Dataset";
    else if (wordCount > 400) readabilityIndex = "Complex/Academic";

    // Set UI metrics
    metricScore.innerText = `${aiConfidence}%`;
    metricPlagiarism.innerText = `${plagiarismMetric}%`;
    metricReadability.innerText = readabilityIndex;

    // Display string text contents safely 
    extractedTextContainer.innerText = fileText;

    // Build automated response layout text matrix
    aiFeedbackContainer.innerHTML = `
<strong>File Handled:</strong> ${fileName}<br>
<strong>Calculated Word Length:</strong> ${wordCount} words.<br><br>
<strong>Structural Assessment:</strong><br>
• Document displays correct assignment formatting rules.<br>
• Conceptual logic flows standardly throughout paragraph sets.<br><br>
<strong>AI Recommendations:</strong><br>
• Verify contextual support evidence on structural lines 3-5.<br>
• Vocabulary matches appropriate target parameters for this academic grade level.
    `;

    resultsDashboard.classList.remove('hidden');
}