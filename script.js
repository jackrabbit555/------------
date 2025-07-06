// -------------------- AI Prompt Writer JavaScript --------------------

// DOM Elements
const taskInput = document.getElementById("task");
const contextInput = document.getElementById("context");
const formatInput = document.getElementById("format");
const personaInput = document.getElementById("persona");
const toneInput = document.getElementById("tone");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const outputBox = document.getElementById("output");

// Event Listeners
generateBtn.addEventListener("click", generatePrompt);
copyBtn.addEventListener("click", copyPrompt);

// Generate Prompt Function
function generatePrompt() {
  const task = taskInput.value.trim();
  const context = contextInput.value.trim();
  const format = formatInput.value.trim();
  const persona = personaInput.value.trim();
  const tone = toneInput.value.trim();

  if (!task || !context || !format || !persona || !tone) {
    showNotification("لطفا تمام فیلدها را پر کنید", "error");
    return;
  }

  const prompt = `TASK: ${task}

CONTEXT: ${context}

FORMAT: ${format}

PERSONA: ${persona}

TONE: ${tone}`;

  outputBox.textContent = prompt;
  copyBtn.disabled = false;
  showNotification("پرامپت با موفقیت تولید شد!", "success");
}

// Copy Prompt Function
async function copyPrompt() {
  const promptText = outputBox.textContent;

  if (!promptText.trim()) {
    showNotification("ابتدا پرامپتی تولید کنید", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(promptText);
    showNotification("پرامپت در کلیپ‌بورد کپی شد!", "success");

    // Add copy success animation
    copyBtn.classList.add("copy-success");
    setTimeout(() => {
      copyBtn.classList.remove("copy-success");
    }, 300);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    showNotification("پرامپت در کلیپ‌بورد کپی شد!", "success");
  }
}

// Notification Function
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background =
        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
      break;
    case "error":
      notification.style.background =
        "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)";
      break;
    default:
      notification.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Auto-save to localStorage
function saveToLocalStorage() {
  const data = {
    task: taskInput.value,
    context: contextInput.value,
    format: formatInput.value,
    persona: personaInput.value,
    tone: toneInput.value,
  };
  localStorage.setItem("promptWriterData", JSON.stringify(data));
}

// Load from localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem("promptWriterData");
  if (saved) {
    const data = JSON.parse(saved);
    taskInput.value = data.task || "";
    contextInput.value = data.context || "";
    formatInput.value = data.format || "";
    personaInput.value = data.persona || "";
    toneInput.value = data.tone || "";
  }
}

// Add auto-save event listeners
taskInput.addEventListener("input", saveToLocalStorage);
contextInput.addEventListener("input", saveToLocalStorage);
formatInput.addEventListener("input", saveToLocalStorage);
personaInput.addEventListener("input", saveToLocalStorage);
toneInput.addEventListener("input", saveToLocalStorage);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to generate prompt
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    generatePrompt();
  }

  // Ctrl/Cmd + C to copy (when output is focused)
  if (
    (e.ctrlKey || e.metaKey) &&
    e.key === "c" &&
    document.activeElement === outputBox
  ) {
    e.preventDefault();
    copyPrompt();
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  copyBtn.disabled = true;

  // Add some helpful tooltips
  addTooltips();
});

// Add tooltips to inputs
function addTooltips() {
  const inputs = [
    taskInput,
    contextInput,
    formatInput,
    personaInput,
    toneInput,
  ];
  const tooltips = [
    "کار مورد نظر خود را اینجا توضیح دهید",
    "زمینه و اطلاعات مربوط به پروژه را وارد کنید",
    "فرمت مورد انتظار پاسخ را مشخص کنید",
    "نقش و تخصص مورد نظر را تعیین کنید",
    "لحن و سبک پاسخ را انتخاب کنید",
  ];

  inputs.forEach((input, index) => {
    input.title = tooltips[index];
  });
}

// Add CSS for notifications
const style = document.createElement("style");
style.textContent = `
    .notification {
        font-family: inherit;
    }
    
    .copy-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .output-box:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);
