// تبدیل textarea ها به CodeMirror

const editors = {};

// تنظیم برای هر ادیتور
function initEditor(textareaId, mode) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return null;

  return CodeMirror.fromTextArea(textarea, {
    mode: mode,
    theme: 'dracula',
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: true,
    autofocus: false,
    matchBrackets: true,
    autoCloseBrackets: true,
  });
}

// ادیتورهای کد
editors.htmlCode = initEditor("htmlCode", "htmlmixed");
editors.jqueryCode = initEditor("jqueryCode", "javascript");
editors.backendCode = initEditor("backendCode", "php");

// ادیتورهای فانکشن (هم jQuery و هم Backend فانکشن)
editors.htmlFunctions = initEditor("htmlFunctionsTextarea", "javascript");
editors.jqueryFunctions = initEditor("jqueryFunctionsTextarea", "javascript");
editors.backendFunctions = initEditor("backendFunctionsTextarea", "php");

// دکمه های باز و بسته کردن فانکشن‌ها
document.querySelectorAll(".toggle-functions-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const container = document.getElementById(targetId);
    if (!container) return;

    if (container.style.display === "none" || container.style.display === "") {
      container.style.display = "block";
      btn.textContent = "مخفی کردن فانکشن‌های " + targetId.replace("Functions", "");
      // اگر ادیتور وجود دارد، اندازه اش را تازه کن
      if (editors[targetId]) editors[targetId].refresh();
    } else {
      container.style.display = "none";
      btn.textContent = "نمایش/مخفی فانکشن‌های " + targetId.replace("Functions", "");
    }
  });
});

// DOM اصلی
const taskInput = document.getElementById("task");
const contextInput = document.getElementById("context");
const formatInput = document.getElementById("format");
const personaInput = document.getElementById("persona");
const toneInput = document.getElementById("tone");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const outputBox = document.getElementById("output");

// رویدادها
generateBtn.addEventListener("click", generatePrompt);
copyBtn.addEventListener("click", copyPrompt);

// ساخت پرامپت
function generatePrompt() {
  const task = taskInput.value.trim();
  const context = contextInput.value.trim();
  const format = formatInput.value.trim();
  const persona = personaInput.value.trim();
  const tone = toneInput.value.trim();

  if (!task || !context || !format || !persona || !tone) {
    showNotification("لطفا فیلدهای اصلی را پر کنید", "error");
    return;
  }

  let prompt = `TASK: ${task}

CONTEXT: ${context}

FORMAT: ${format}

PERSONA: ${persona}

TONE: ${tone}
`;

  // اضافه کردن کد و فانکشن ها فقط اگر چیزی نوشته شده باشه
  if (editors.htmlCode && editors.htmlCode.getValue().trim()) {
    prompt += `

---\nHTML Code:\n${editors.htmlCode.getValue()}`;
  }
  if (editors.htmlFunctions && editors.htmlFunctions.getValue().trim()) {
    prompt += `

---\nHTML Functions:\n${editors.htmlFunctions.getValue()}`;
  }
  if (editors.jqueryCode && editors.jqueryCode.getValue().trim()) {
    prompt += `

---\njQuery Code:\n${editors.jqueryCode.getValue()}`;
  }
  if (editors.jqueryFunctions && editors.jqueryFunctions.getValue().trim()) {
    prompt += `

---\njQuery Functions:\n${editors.jqueryFunctions.getValue()}`;
  }
  if (editors.backendCode && editors.backendCode.getValue().trim()) {
    prompt += `

---\nBackend Code:\n${editors.backendCode.getValue()}`;
  }
  if (editors.backendFunctions && editors.backendFunctions.getValue().trim()) {
    prompt += `

---\nBackend Functions:\n${editors.backendFunctions.getValue()}`;
  }

  outputBox.textContent = prompt;
  copyBtn.disabled = false;
  showNotification("پرامپت با موفقیت تولید شد!", "success");
}

// کپی پرامپت
async function copyPrompt() {
  const promptText = outputBox.textContent;

  if (!promptText.trim()) {
    showNotification("ابتدا پرامپتی تولید کنید", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(promptText);
    showNotification("پرامپت در کلیپ‌بورد کپی شد!", "success");

    copyBtn.classList.add("copy-success");
    setTimeout(() => {
      copyBtn.classList.remove("copy-success");
    }, 300);
  } catch (err) {
    // پشتیبانی مرورگرهای قدیمی
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showNotification("پرامپت در کلیپ‌بورد کپی شد!", "success");
  }
}

// نمایش نوتیفیکیشن
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

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

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 300);
  }, 3000);
}
