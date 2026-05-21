const COURSES = [
  {
    id: "linkedin-workshop-hannah",
    title: "LinkedIn Workshop",
    instructor: "Hannah",
    notice: "1 week",
    blurb: "Need help polishing your LinkedIn profile and presence? Learn profile glow-ups, networking basics, and practical tips to stand out. Click redeem."
  },
  {
    id: "office-hours-hannah",
    title: "No Jingjing Office Hours",
    instructor: "Hannah",
    notice: "No notice necessary - just schedule to your heart's content",
    blurb: "Ever had an essay that you wanted someone to read over? Ever had a text or an email that you needed a second pair of eyes for? Ever wonder if there was anyone who could help you look over something? Look no further. Click redeem."
  },
  {
    id: "office-hours-amy",
    title: "No Jingjing Office Hours",
    instructor: "Amy",
    notice: "No notice necessary - just schedule to your heart's content",
    blurb: "1 hour no 찡찡 office hours. Bring all your concerns and questions :) Click redeem."
  },
  {
    id: "office-hours-hannah-amy",
    title: "No Jingjing Office Hours",
    instructor: "Hannah & Amy",
    notice: "No notice necessary - just schedule to your heart's content",
    blurb: "Double the trouble, but triple the eyes! We will look over anything you desire. Amy+Hannah combined. Click redeem."
  },
  {
    id: "english-grammar-amy",
    title: "No Jingjing English Grammar",
    instructor: "Amy",
    notice: "24 hours + document she wants edited/help on",
    blurb: "She\'s spoken English for 23+ years. Pretty much an expert at this point. Click redeem."
  },
  {
    id: "social-media-hannah",
    title: "Social Media Workshop",
    instructor: "Hannah",
    notice: "1 week",
    blurb: "You\'ve heard about the inistagramies or the youvietubs or whatever it\'s called. Learn what it\'s called and more. warning: this may require you to dance Click redeem."
  },
  {
    id: "english-slang-hannah-amy",
    title: "English Slang Lesson",
    instructor: "Hannah & Amy",
    notice: "1 week",
    blurb: "Ready to not be cooked and have aura for reals? You gotta lock in Click redeem."
  },
  {
    id: "photo-editing-hannah",
    title: "Photo Editing",
    instructor: "Hannah",
    notice: "1 week",
    blurb: "Roses are red, violets are blue, your pictures can be better and I got you. Click redeem."
  },
  {
    id: "ai-usage-amy",
    title: "AI Usage Workshop",
    instructor: "Amy",
    notice: "1 week",
    blurb: "U WANNA KNOW HOW WE MADE THIS WEBSITE? Click redeem."
  },
  {
    id: "fashion-amy",
    title: "Fashion",
    instructor: "Amy",
    notice: "1 week",
    blurb: "내 티, five bucks, 바지는 만원 My vision 몇 억s, 몇 조s, Bezos. CLICK REDEEM."
  },
  {
    id: "girl-talk-hannah-amy",
    title: "1 Hour Yap Session - Girl Talk",
    instructor: "Hannah & Amy",
    notice: "No notice necessary - just schedule to your heart's content",
    blurb: "Ready to spill the tea? Click redeem."
  }
];

const form = document.getElementById("profile-form");
const input = document.getElementById("profile-key");
const activeProfileText = document.getElementById("active-profile");
const availableEl = document.getElementById("available-courses");
const usedEl = document.getElementById("used-courses");
const template = document.getElementById("course-template");

let activeProfile = "";
let state = { redeemed: [] };

function storageKey(profileName) {
  return `mothers-day-2026:${profileName.toLowerCase()}`;
}

function loadProfile(profileName) {
  const key = storageKey(profileName);
  const raw = localStorage.getItem(key);

  if (!raw) {
    state = { redeemed: [] };
    saveProfile();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state = {
      redeemed: Array.isArray(parsed.redeemed) ? parsed.redeemed : []
    };
  } catch {
    state = { redeemed: [] };
    saveProfile();
  }
}

function saveProfile() {
  if (!activeProfile) {
    return;
  }

  localStorage.setItem(storageKey(activeProfile), JSON.stringify(state));
}

function getInstructorButtonClass(instructor) {
  if (instructor === "Hannah") {
    return "btn-hannah";
  }
  if (instructor === "Amy") {
    return "btn-amy";
  }
  return "btn-both";
}

function makeCard(course, isUsed) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".course-title").textContent = course.title;
  node.querySelector(".course-instructor").textContent = course.instructor;
  node.querySelector(".course-notice").textContent = course.notice;
  node.querySelector(".course-blurb").textContent = course.blurb;

  const details = node.querySelector(".course-details");
  const toggleBtn = node.querySelector(".toggle-details");
  const redeemBtn = node.querySelector(".redeem-btn");
  toggleBtn.classList.add(getInstructorButtonClass(course.instructor));

  if (isUsed) {
    details.classList.remove("hidden");
    redeemBtn.remove();
    toggleBtn.textContent = "Redeemed";
    toggleBtn.disabled = true;
    return node;
  }

  toggleBtn.addEventListener("click", () => {
    details.classList.toggle("hidden");
    toggleBtn.textContent = details.classList.contains("hidden")
      ? "View Instructions"
      : "Hide Instructions";
  });

  redeemBtn.addEventListener("click", () => {
    const confirmed = window.confirm(
      `Redeem "${course.title}" with ${course.instructor}? Only redeem after taking the course.`
    );
    if (!confirmed) {
      return;
    }

    if (!state.redeemed.includes(course.id)) {
      state.redeemed.push(course.id);
      saveProfile();
      renderCourses();
    }
  });

  return node;
}

function renderCourses() {
  availableEl.innerHTML = "";
  usedEl.innerHTML = "";

  const availableCourses = COURSES.filter((c) => !state.redeemed.includes(c.id));
  const usedCourses = COURSES.filter((c) => state.redeemed.includes(c.id));

  availableCourses.forEach((course) => {
    availableEl.appendChild(makeCard(course, false));
  });

  usedCourses.forEach((course) => {
    usedEl.appendChild(makeCard(course, true));
  });

  if (usedCourses.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No courses redeemed yet.";
    usedEl.appendChild(empty);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const profileName = input.value.trim();
  if (!profileName) {
    return;
  }

  activeProfile = profileName;
  loadProfile(profileName);
  activeProfileText.textContent = `Profile loaded: ${activeProfile}`;
  renderCourses();
});

(function init() {
  const lastProfile = localStorage.getItem("mothers-day-2026:last-profile");
  if (lastProfile) {
    activeProfile = lastProfile;
    input.value = lastProfile;
    loadProfile(lastProfile);
    activeProfileText.textContent = `Profile loaded: ${activeProfile}`;
  }

  form.addEventListener("submit", () => {
    localStorage.setItem("mothers-day-2026:last-profile", activeProfile);
  });

  renderCourses();
})();
