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
    key: "oly",
    label: "Olympian\nvicinity",
    example: "~1:02",
    sec: 62,
    gradient: "linear-gradient(180deg, #fde047 0%, #ca8a04 100%)",
    tagline: "Example: Olympic-distance finalist–level aerobic pace (not a ranking).",
    explain:
      "Gold ≈ very fast threshold — think Olympic-distance finalists’ kind of aerobic speed (public example only). Hover any column for the full note.",
  },
  {
    key: "college",
    label: "College /\nnational",
    example: "~1:12",
    sec: 72,
    gradient: "linear-gradient(180deg, #93c5fd 0%, #1d4ed8 100%)",
    tagline: "Example: elite college / national-age aerobic territory.",
    explain:
      "Blue ≈ elite college / national-age aerobic territory — still rare; not a label on you.",
  },
  {
    key: "club",
    label: "Strong club /\nAG",
    example: "~1:25",
    sec: 85,
    gradient: "linear-gradient(180deg, #6ee7b7 0%, #047857 100%)",
    tagline: "Example: strong club or age-group racer.",
    explain:
      "Green ≈ strong club or age-group racer threshold — serious training, many meets.",
  },
  {
    key: "masters",
    label: "Masters\nfitness",
    example: "~1:40",
    sec: 100,
    gradient: "linear-gradient(180deg, #c4b5fd 0%, #6d28d9 100%)",
    tagline: "Example: fit masters or adult fitness swimmer.",
    explain:
      "Purple ≈ spirited masters or fit adult swimmer — wide age range can land here.",
  },
  {
    key: "tri",
    label: "Tri steady\nfork",
    example: "~1:48",
    sec: 108,
    gradient: "linear-gradient(180deg, #fdba74 0%, #ea580c 100%)",
    tagline: "Example: steady iron-distance swim training pace (broad range).",
    explain:
      "Orange ≈ steady iron-distance swim training fork for many triathletes (huge individual spread).",
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

function nearestReference(userSec) {
  let best = SKYLINE_REFERENCES[0];
  let bestDiff = Math.abs(userSec - best.sec);
  for (const ref of SKYLINE_REFERENCES) {
    const d = Math.abs(userSec - ref.sec);
    if (d < bestDiff) {
      best = ref;
      bestDiff = d;
    }
  }
  return best;
}

function renderSkyline(userSec, toneClass) {
  const root = document.getElementById("skyline-root");
  if (!root) return;
  root.replaceChildren();

  SKYLINE_REFERENCES.forEach((ref) => {
    const tower = document.createElement("div");
    tower.className = "sky-tower";
    tower.setAttribute("role", "img");
    tower.setAttribute("aria-label", `${ref.label.replace(/\n/g, " ")}: ${ref.explain}`);
    tower.title = ref.explain;
    const h = towerHeightPercent(ref.sec);
    const sub = document.createElement("div");
    sub.className = "sky-mean";
    sub.textContent = ref.tagline;
    tower.innerHTML = `
      <div class="sky-block" style="height:${h}%;background:${ref.gradient}"></div>
      <span class="sky-cap">${ref.label.replace(/\n/g, " ")}</span>
      <span class="sky-pace">${ref.example}</span>
    `;
    tower.appendChild(sub);
    root.appendChild(tower);
  });

  const you = document.createElement("div");
  you.className = "sky-tower sky-tower--you";
  you.setAttribute("role", "img");
  you.title = "Your CSS from your 400 m and 200 m trials — this block’s height matches your pace.";
  const yh = towerHeightPercent(userSec);
  const grad = userGradientForTone(toneClass);
  const near = nearestReference(userSec);
  const youSub = document.createElement("div");
  youSub.className = "sky-mean sky-mean--you";
  youSub.textContent = `Your pace — near the “${near.label.replace(/\n/g, " ")}” example on this chart.`;
  you.innerHTML = `
    <div class="sky-block sky-block--you" style="height:${yh}%;background:${grad}"></div>
    <span class="sky-cap sky-cap--you">You</span>
    <span class="sky-pace">${formatMinSec(userSec)}</span>
  `;
  you.appendChild(youSub);
  root.appendChild(you);

  const narr = document.getElementById("skyline-narration");
  if (narr) {
    const userLabel = formatMinSec(userSec);
    narr.innerHTML = `
      <strong>Reading this for your swimmer:</strong>
      Each coloured column is a <em>fictional example swimmer’s</em> CSS (threshold pace per 100 m), not a league or medal.
      <strong>Taller = faster</strong> (less time per 100 m).
      Your CSS is <strong>${userLabel}</strong> per 100 m — on this toy map you sit closest to the
      <strong>${near.label.replace(/\n/g, " ")}</strong> column (~${near.example}).
      Use it as a conversation starter; your age group and sport change what “great” means.
    `;
  }
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
