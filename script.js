// ============ NAVBAR SHADOW ON SCROLL ============
// যখন পেজ scroll হবে, তখন এই function run হবে
const header = document.querySelector("header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop().toLowerCase();

function setActiveLinkByHref(href) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === href);
  });
}

if (currentPage === "blog.html") {
  setActiveLinkByHref("blog.html");
} else if (currentPage === "index.html" || currentPage === "") {
  setActiveLinkByHref("index.html");
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

window.addEventListener("scroll", () => {
  // window.scrollY মানে আমরা কতটুকু scroll করেছি উপর থেকে
  if (window.scrollY > 20) {
    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  } else {
    header.style.boxShadow = "none";
  }
});

// ============ ACTIVE NAV LINK HIGHLIGHT ============
// প্রতিটা section আর প্রতিটা nav link কে ধরে রাখছি
window.addEventListener("scroll", () => {
  let current = "";

  // প্রতিটা section-এর position চেক করছি, কোনটা এখন viewport-এ আছে
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // একটু আগে থেকেই ধরব
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  // সব nav link থেকে "active" class সরিয়ে দিয়ে,
  // শুধু current section-এর link-এ সেটা যোগ করছি
  if (current) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  } else if (currentPage === "index.html" || currentPage === "") {
    setActiveLinkByHref("index.html");
  } else if (currentPage === "blog.html") {
    setActiveLinkByHref("blog.html");
  }
});

const downloadCvBtn = document.getElementById("download-cv-btn");

if (downloadCvBtn) {
  downloadCvBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const cvUrl = downloadCvBtn.getAttribute("href");
    if (!cvUrl) {
      return;
    }

    window.open(cvUrl, "_blank", "noopener,noreferrer");

    const tempLink = document.createElement("a");
    tempLink.href = cvUrl;
    tempLink.download = "Shahariar_Kabir_SQA.pdf";
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();
  });
}

const EMAILJS_CONFIG = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID",
  toEmail: "shahariarkabir.cse@gmail.com"
};

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm && contactStatus) {
  const configValues = [
    EMAILJS_CONFIG.publicKey,
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId
  ];
  const hasPlaceholderConfig = configValues.some((value) =>
    value.startsWith("YOUR_EMAILJS_")
  );

  if (window.emailjs && !hasPlaceholderConfig) {
    window.emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey
    });
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (hasPlaceholderConfig) {
      contactStatus.textContent =
        "Please set your EmailJS public key, service ID, and template ID in script.js.";
      return;
    }

    if (!window.emailjs) {
      contactStatus.textContent =
        "Email service is not loaded. Please check your internet connection and try again.";
      return;
    }

    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");

    if (!(emailInput instanceof HTMLInputElement) || !(messageInput instanceof HTMLTextAreaElement)) {
      contactStatus.textContent = "Contact form fields are not available.";
      return;
    }

    const senderEmail = emailInput.value.trim();
    const senderMessage = messageInput.value.trim();

    if (!senderEmail || !senderMessage) {
      contactStatus.textContent = "Please enter both your email and message.";
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!(submitButton instanceof HTMLButtonElement)) {
      contactStatus.textContent = "Submit button is not available.";
      return;
    }

    submitButton.disabled = true;
    contactStatus.textContent = "Sending message...";

    try {
      await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_email: senderEmail,
          message: senderMessage,
          reply_to: senderEmail,
          to_email: EMAILJS_CONFIG.toEmail
        }
      );

      contactStatus.textContent = "Message sent successfully.";
      contactForm.reset();
    } catch (error) {
      console.error("Failed to send message via EmailJS:", error);
      contactStatus.textContent = "Message sending failed. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}