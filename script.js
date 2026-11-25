/**
 * AMIT & MAYURI ROYAL WEDDING INVITATION SCRIPT
 * Features: Background Music (Alfaaz - Hamza Malik), Equalizer animation,
 * Dual Countdown, Calendar Sync (.ics & Google), HD Photo Lightbox, WhatsApp RSVP
 */

// Event Configuration
const EVENT_DATES = {
  wedding: {
    title: "Wedding Ceremony of Amit & Mayuri",
    target: new Date("January 10, 2027 18:00:00").getTime(),
    label: "Counting down to Sunday, 10 January 2027 • 6:00 PM (Mahad)",
    location: "B.S. Butala Bhavan Sundarwadi, Mahad, Raigad, Maharashtra",
    description: "Sacred Wedding Ceremony of Amit & Mayuri. Nearest station: Mangaon (32km) on Mumbai-Goa Highway.",
    startDate: "20270110T123000Z", // 18:00 IST is 12:30 UTC
    endDate: "20270110T173000Z"
  },
  reception: {
    title: "Wedding Reception of Amit & Mayuri",
    target: new Date("January 13, 2027 18:00:00").getTime(),
    label: "Counting down to Wednesday, 13 January 2027 • 6:00 PM (Nagpur)",
    location: "Queen's Land Celebration Lawn & Banquet, Hudkeshwar Outer Ring Road, Nagpur, Maharashtra",
    description: "Grand Wedding Reception celebration of Amit & Mayuri with dinner and music.",
    startDate: "20270113T123000Z",
    endDate: "20270113T173000Z"
  }
};

let currentCountdownMode = 'wedding';

/* ==========================================================================
   1. COUNTDOWN TIMER
   ========================================================================== */
function updateCountdown() {
  const targetTime = EVENT_DATES[currentCountdownMode].target;
  const now = Date.now();
  const diff = targetTime - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

function switchCountdown(mode) {
  currentCountdownMode = mode;
  
  const tabWedding = document.getElementById("tabWedding");
  const tabReception = document.getElementById("tabReception");
  const labelEl = document.getElementById("countdownTargetLabel");

  if (mode === 'wedding') {
    tabWedding.classList.add("active");
    tabReception.classList.remove("active");
    labelEl.textContent = EVENT_DATES.wedding.label;
  } else {
    tabReception.classList.add("active");
    tabWedding.classList.remove("active");
    labelEl.textContent = EVENT_DATES.reception.label;
  }

  updateCountdown();
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ==========================================================================
   2. AUDIO CONTROLLER (ALFAAZ - HAMZA MALIK)
   ========================================================================== */
const audio = document.getElementById("weddingAudio");
const musicController = document.getElementById("musicController");
const musicDisc = document.getElementById("musicDisc");
const musicStatusText = document.getElementById("musicStatusText");
const navMusicBtn = document.getElementById("navMusicBtn");
const navMusicText = document.getElementById("navMusicText");

let userToggledAudio = false;

if (audio) {
  audio.volume = 0.6;

  function syncAudioUI(isPlaying) {
    if (isPlaying) {
      if (musicDisc) musicDisc.classList.add("playing");
      if (musicStatusText) musicStatusText.textContent = "Playing • Tap to Pause ⏸";
      if (navMusicBtn) {
        navMusicBtn.classList.add("playing");
        if (navMusicText) navMusicText.textContent = "Pause Song";
      }
    } else {
      if (musicDisc) musicDisc.classList.remove("playing");
      if (musicStatusText) musicStatusText.textContent = "Paused • Tap to Play ▶";
      if (navMusicBtn) {
        navMusicBtn.classList.remove("playing");
        if (navMusicText) navMusicText.textContent = "Play Song";
      }
    }
  }

  function toggleMusic() {
    if (audio.paused) {
      audio.play().then(() => {
        userToggledAudio = true;
        syncAudioUI(true);
      }).catch(err => {
        console.log("Audio waiting for user gesture:", err);
      });
    } else {
      audio.pause();
      userToggledAudio = true;
      syncAudioUI(false);
    }
  }

  if (musicController) {
    musicController.addEventListener("click", toggleMusic);
  }
  if (navMusicBtn) {
    navMusicBtn.addEventListener("click", toggleMusic);
  }

  // Gentle autoplay on first interaction anywhere on page
  const interactionEvents = ["click", "touchstart", "scroll", "keydown"];
  function initiateAudioOnInteraction() {
    if (!userToggledAudio && audio.paused) {
      audio.play().then(() => {
        syncAudioUI(true);
        cleanupInteractionListeners();
      }).catch(() => {
        // Will trigger on next explicit tap
      });
    }
  }

  function cleanupInteractionListeners() {
    interactionEvents.forEach(evt => document.removeEventListener(evt, initiateAudioOnInteraction));
  }

  interactionEvents.forEach(evt => {
    document.addEventListener(evt, initiateAudioOnInteraction, { once: false, passive: true });
  });

  audio.addEventListener("play", () => syncAudioUI(true));
  audio.addEventListener("pause", () => syncAudioUI(false));
}

/* ==========================================================================
   3. CALENDAR INTEGRATION (GOOGLE CALENDAR & ICAL .ICS)
   ========================================================================== */
function addToGoogleCalendar(eventKey) {
  const key = eventKey === 'current' ? currentCountdownMode : eventKey;
  const event = EVENT_DATES[key];
  if (!event) return;

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  window.open(url, "_blank");
}

function downloadICal(eventKey) {
  const key = eventKey === 'current' ? currentCountdownMode : eventKey;
  const event = EVENT_DATES[key];
  if (!event) return;

  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amit & Mayuri Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `DTSTART:${event.startDate}`,
    `DTEND:${event.endDate}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${key}-amit-mayuri.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   4. LIGHTBOX MODAL (FOR HD PHOTOS & INVITATION CARDS)
   ========================================================================== */
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxDownload = document.getElementById("lightboxDownload");

function openLightbox(imgSrc) {
  if (!lightboxModal) return;
  lightboxImg.src = imgSrc;
  lightboxDownload.href = imgSrc;
  lightboxModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e && e.target !== lightboxModal && !e.target.classList.contains("lightbox-close")) {
    return;
  }
  if (!lightboxModal) return;
  lightboxModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("active")) {
    closeLightbox();
  }
});

/* ==========================================================================
   5. WHATSAPP CARD SHARING
   ========================================================================== */
function shareCard(cardType) {
  const cardName = cardType === 'wedding' 
    ? "Wedding Ceremony on 10th Jan 2027 in Mahad" 
    : "Grand Wedding Reception on 13th Jan 2027 in Nagpur";
    
  const text = `✨ You are cordially invited to celebrate the Wedding of Amit & Mayuri! ✨\n\n📌 Event: ${cardName}\n🌐 View our interactive wedding website & pre-wedding gallery here:\n${window.location.href}`;
  
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
}

/* ==========================================================================
   6. INTERACTIVE RSVP & WHATSAPP DISPATCH
   ========================================================================== */
const rsvpForm = document.getElementById("weddingRsvpForm");
const formStatusMsg = document.getElementById("formStatusMsg");

function getRsvpData() {
  const name = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("guestPhone").value.trim();
  const attending = document.getElementById("eventAttending").value;
  const count = document.getElementById("guestCount").value;
  const message = document.getElementById("blessingMessage").value.trim();

  return { name, phone, attending, count, message };
}

function sendRsvpViaWhatsApp() {
  const data = getRsvpData();
  if (!data.name) {
    alert("Please enter your name first to send RSVP via WhatsApp.");
    document.getElementById("guestName").focus();
    return;
  }

  let text = `🙏 Namaste! Here is my RSVP for Amit & Mayuri's Wedding:\n\n` +
             `👤 Guest Name: ${data.name}\n` +
             `📞 Contact: ${data.phone || 'Not provided'}\n` +
             `🎉 Attending: ${data.attending || 'Will let you know'}\n` +
             `👥 Total Guests: ${data.count || '1'}\n`;

  if (data.message) {
    text += `💬 Wishes / Message: "${data.message}"\n`;
  }

  text += `\n❤️ Looking forward to celebrating together!`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");

  recordWishOnWall(data.name, data.message);
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getRsvpData();

    if (!data.name || !data.attending) {
      alert("Please complete the required fields.");
      return;
    }

    recordWishOnWall(data.name, data.message);

    if (formStatusMsg) {
      formStatusMsg.className = "form-status-msg success";
      formStatusMsg.innerHTML = `❤️ Thank you, <strong>${data.name}</strong>! Your RSVP for <em>${data.attending}</em> (${data.count} guests) has been lovingly noted!`;
    }

    setTimeout(() => {
      rsvpForm.reset();
    }, 4000);
  });
}

function recordWishOnWall(name, message) {
  if (!message || message.length < 3) return;

  const wishesGrid = document.getElementById("wishesGrid");
  if (!wishesGrid) return;

  const card = document.createElement("div");
  card.className = "wish-card";
  card.innerHTML = `
    <p class="wish-text">&ldquo;${message}&rdquo;</p>
    <span class="wish-author">— ${name}</span>
  `;

  wishesGrid.insertBefore(card, wishesGrid.firstChild);
}

/* ==========================================================================
   7. SCROLL REVEAL OBSERVER
   ========================================================================== */
const revealElements = document.querySelectorAll(".reveal");

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.08
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));
