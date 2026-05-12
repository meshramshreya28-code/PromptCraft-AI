const form = document.getElementById("promptForm");
const resultSection = document.getElementById("resultSection");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.querySelector(".generate-btn");

// Change this when deploying the backend
const API_URL = "http://localhost:5000/generate";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskType = document.getElementById("taskType").value;
  const topic = document.getElementById("topic").value;
  const tone = document.getElementById("tone").value;
  const outputFormat = document.getElementById("outputFormat").value;

  // Loading state
  generateBtn.disabled = true;
  generateBtn.textContent = "⏳ Generating...";

  resultSection.classList.add("hidden");
  resultText.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskType,
        topic,
        tone,
        outputFormat,
      }),
    });

    const data = await response.json();

    if (data.success) {
      resultText.textContent = data.result;
      resultSection.classList.remove("hidden");
      resultSection.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      alert(data.message || "Failed to generate prompt.");
    }
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the backend server.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "🚀 Generate Smart Prompt";
  }
});

// Copy to clipboard
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultText.textContent);

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";

    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    alert("Copy failed.");
  }
});