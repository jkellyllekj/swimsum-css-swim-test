function formatMinSec(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function parseTimeInput(rawValue) {
  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  if (value.includes(":")) {
    const parts = value.split(":");
    if (parts.length !== 2) {
      return null;
    }
    const mins = Number.parseInt(parts[0], 10);
    const secs = Number.parseInt(parts[1], 10);
    if (Number.isNaN(mins) || Number.isNaN(secs) || mins < 0 || secs < 0 || secs > 59) {
      return null;
    }
    return mins * 60 + secs;
  }

  const secondsOnly = Number.parseInt(value, 10);
  if (Number.isNaN(secondsOnly) || secondsOnly <= 0) {
    return null;
  }
  return secondsOnly;
}

function getEngine(dropoff) {
  if (dropoff < 3) {
    return {
      type: "Diesel",
      advice: "You hold pace well over distance — spice in power and speed so you can change gears when races ask for it.",
    };
  }
  if (dropoff > 8) {
    return {
      type: "Sprinter",
      advice: "You have pop — layer in longer, steady aerobic blocks so that speed carries deeper into races and practice.",
    };
  }
  return {
    type: "Balanced",
    advice: "Nice blend of speed and endurance — keep touching both systems each week.",
  };
}

const SKYLINE_REFERENCES = [
  {
    label: "Olympian\nvicinity",
    example: "~1:02",
    sec: 62,
    gradient: "linear-gradient(180deg, #fde047 0%, #ca8a04 100%)",
  },
  {
    label: "College /\nnational",
    example: "~1:12",
    sec: 72,
    gradient: "linear-gradient(180deg, #93c5fd 0%, #1d4ed8 100%)",
  },
  {
    label: "Strong club /\nAG",
    example: "~1:25",
    sec: 85,
    gradient: "linear-gradient(180deg, #6ee7b7 0%, #047857 100%)",
  },
  {
    label: "Masters\nfitness",
    example: "~1:40",
    sec: 100,
    gradient: "linear-gradient(180deg, #c4b5fd 0%, #6d28d9 100%)",
  },
  {
    label: "Tri steady\nfork",
    example: "~1:48",
    sec: 108,
    gradient: "linear-gradient(180deg, #fdba74 0%, #ea580c 100%)",
  },
];

function towerHeightPercent(sec) {
  const slowest = 132;
  const fastest = 58;
  const clamped = Math.min(slowest, Math.max(fastest, sec));
  return Math.round(18 + ((slowest - clamped) / (slowest - fastest)) * 82);
}

function friendlyTier(cssSec) {
  if (cssSec <= 68) {
    return {
      toneClass: "tone-olympic",
      title: "You're brushing up against olympian / world-championship pace territory on this model.",
      detail:
        "That is rare air — most humans never get close. If this is you: protect recovery, celebrate consistency, and race the clock that matters to your journey.",
    };
  }
  if (cssSec <= 80) {
    return {
      toneClass: "tone-elite",
      title: "Elite college or national-age-group style aerobic power.",
      detail:
        "Think programmes that travel to big meets — and swimmers who treat threshold work as craft. Compare mostly to your own last test.",
    };
  }
  if (cssSec <= 95) {
    return {
      toneClass: "tone-strong",
      title: "Strong club, fast masters, or punchy multi-sport swimmer energy.",
      detail:
        "A pace coaches use for real work — many competitors would happily call this home base. Keep the long view.",
    };
  }
  if (cssSec <= 112) {
    return {
      toneClass: "tone-solid",
      title: "Solid fitness swimmer — spirited masters lanes or a capable triathlon swim.",
      detail:
        "Typical strong recreational forks land here; medal-winning masters span huge age brackets at similar speeds. Progress is yours to stack.",
    };
  }
  return {
    toneClass: "tone-build",
    title: "Fitness builder — generous runway (that is a good thing).",
    detail:
      "New swimmers, returners, and long-course converts often start here and see exciting jumps early. Aim for smooth repeats just under today’s CSS, then retest.",
  };
}

function userGradientForTone(toneClass) {
  const map = {
    "tone-olympic": "linear-gradient(180deg, #fef08a 0%, #eab308 55%, #b45309 100%)",
    "tone-elite": "linear-gradient(180deg, #7dd3fc 0%, #2563eb 55%, #1e3a8a 100%)",
    "tone-strong": "linear-gradient(180deg, #6ee7b7 0%, #059669 55%, #047857 100%)",
    "tone-solid": "linear-gradient(180deg, #c4b5fd 0%, #7c3aed 55%, #5b21b6 100%)",
    "tone-build": "linear-gradient(180deg, #fdba74 0%, #fb923c 55%, #ea580c 100%)",
  };
  return map[toneClass] || map["tone-solid"];
}

function renderSkyline(userSec, toneClass) {
  const root = document.getElementById("skyline-root");
  if (!root) return;
  root.replaceChildren();

  SKYLINE_REFERENCES.forEach((ref) => {
    const tower = document.createElement("div");
    tower.className = "sky-tower";
    const h = towerHeightPercent(ref.sec);
    tower.innerHTML = `
      <div class="sky-block" style="height:${h}%;background:${ref.gradient}"></div>
      <span class="sky-cap">${ref.label.replace(/\n/g, " ")}</span>
      <span class="sky-pace">${ref.example}</span>
    `;
    root.appendChild(tower);
  });

  const you = document.createElement("div");
  you.className = "sky-tower sky-tower--you";
  const yh = towerHeightPercent(userSec);
  const grad = userGradientForTone(toneClass);
  you.innerHTML = `
    <div class="sky-block sky-block--you" style="height:${yh}%;background:${grad}"></div>
    <span class="sky-cap sky-cap--you">You</span>
    <span class="sky-pace">${formatMinSec(userSec)}</span>
  `;
  root.appendChild(you);
}

function setInputFromSeconds(inputEl, seconds) {
  inputEl.value = formatMinSec(Math.max(1, seconds));
}

function applyTimeDelta(targetId, delta) {
  const input = document.getElementById(targetId);
  const parsed = parseTimeInput(input.value || "");
  const nextValue = (parsed || 60) + delta;
  setInputFromSeconds(input, nextValue);
}

function normalizeInput(event) {
  const parsed = parseTimeInput(event.target.value || "");
  if (parsed !== null) {
    setInputFromSeconds(event.target, parsed);
  }
}

document.querySelectorAll(".time-nudge").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const delta = Number.parseInt(button.getAttribute("data-delta") || "0", 10);
    applyTimeDelta(targetId, delta);
  });
});

document.getElementById("t400").addEventListener("blur", normalizeInput);
document.getElementById("t200").addEventListener("blur", normalizeInput);

function resetToneClasses() {
  const hub = document.getElementById("calc-hub");
  if (!hub) return;
  hub.classList.remove("tone-olympic", "tone-elite", "tone-strong", "tone-solid", "tone-build");
}

document.getElementById("recalc-btn").addEventListener("click", () => {
  document.getElementById("results-phase").classList.add("hidden");
  document.getElementById("calc-phase").classList.remove("hidden");
  document.getElementById("error").textContent = "";
  resetToneClasses();
});

document.getElementById("css-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const t400 = parseTimeInput(document.getElementById("t400").value || "");
  const t200 = parseTimeInput(document.getElementById("t200").value || "");

  const errorEl = document.getElementById("error");
  errorEl.textContent = "";

  if (t400 === null || t200 === null) {
    errorEl.textContent =
      "Use m:ss for each swim (e.g. 6:40 and 3:10). Only digits and one colon per field.";
    return;
  }

  if (t400 <= 0 || t200 <= 0) {
    errorEl.textContent = "Both times must be greater than zero.";
    return;
  }

  if (t200 >= t400) {
    errorEl.textContent =
      "Check your entries: the full 200 m time should be quicker than the full 400 m time (200 m is shorter).";
    return;
  }

  const cssSecondsPer100 = (t400 - t200) / 2;
  const est1500 = cssSecondsPer100 * 15;
  const pace400 = t400 / 4;
  const dropoff = cssSecondsPer100 - pace400;
  const engine = getEngine(dropoff);
  const cssFormatted = formatMinSec(cssSecondsPer100);
  const tier = friendlyTier(cssSecondsPer100);

  document.getElementById("cssDisplay").textContent = cssFormatted;
  document.getElementById("est1500").textContent = formatMinSec(est1500);
  document.getElementById("engineType").textContent = engine.type;
  document.getElementById("adviceText").textContent = engine.advice;
  document.getElementById("levelText").textContent = tier.title;
  document.getElementById("gapText").textContent = tier.detail;

  resetToneClasses();
  const hub = document.getElementById("calc-hub");
  hub.classList.add(tier.toneClass);

  renderSkyline(cssSecondsPer100, tier.toneClass);

  document.getElementById("calc-phase").classList.add("hidden");
  document.getElementById("results-phase").classList.remove("hidden");
});
