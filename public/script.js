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
      advice: "You hold pace well over distance. Prioritize sprint and power work.",
    };
  }
  if (dropoff > 8) {
    return {
      type: "Sprinter",
      advice: "Strong speed profile. Build aerobic endurance to reduce fade.",
    };
  }
  return {
    type: "Balanced",
    advice: "You have a healthy speed-endurance blend. Keep both systems trained.",
  };
}

function userBarWidth(cssPer100) {
  const fastLimit = 60;
  const slowLimit = 160;
  let pct = 100 - ((cssPer100 - fastLimit) / (slowLimit - fastLimit)) * 80;
  if (pct < 10) pct = 10;
  if (pct > 100) pct = 100;
  return pct;
}

function classifyBenchmark(cssPer100) {
  if (cssPer100 <= 65) {
    return {
      level: "World Class band",
      gap: "You are in elite benchmark range.",
    };
  }
  if (cssPer100 <= 85) {
    const sec = Math.max(0, Math.round(cssPer100 - 65));
    return {
      level: "Competitive band",
      gap: `${sec}s/100m from World Class cutoff.`,
    };
  }
  if (cssPer100 <= 110) {
    const sec = Math.max(0, Math.round(cssPer100 - 85));
    return {
      level: "Intermediate band",
      gap: `${sec}s/100m from Competitive cutoff.`,
    };
  }
  return {
    level: "Novice band",
    gap: "Focus on aerobic consistency first, then pace progression.",
  };
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

document.getElementById("css-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const t400 = parseTimeInput(document.getElementById("t400").value || "");
  const t200 = parseTimeInput(document.getElementById("t200").value || "");

  const errorEl = document.getElementById("error");
  const resultsEl = document.getElementById("results");
  errorEl.textContent = "";

  if (t400 === null || t200 === null) {
    errorEl.textContent = "Enter valid times like 6:40 and 3:10.";
    resultsEl.classList.add("hidden");
    return;
  }

  if (t400 <= 0 || t200 <= 0) {
    errorEl.textContent = "Enter both 400m and 200m times.";
    resultsEl.classList.add("hidden");
    return;
  }

  if (t200 >= t400) {
    errorEl.textContent = "Check times: 200m should be faster than 400m.";
    resultsEl.classList.add("hidden");
    return;
  }

  const cssSecondsPer100 = (t400 - t200) / 2;
  const est1500 = cssSecondsPer100 * 15;
  const pace400 = t400 / 4;
  const dropoff = cssSecondsPer100 - pace400;
  const engine = getEngine(dropoff);
  const cssFormatted = formatMinSec(cssSecondsPer100);
  const benchmark = classifyBenchmark(cssSecondsPer100);

  document.getElementById("cssDisplay").textContent = cssFormatted;
  document.getElementById("est1500").textContent = formatMinSec(est1500);
  document.getElementById("engineType").textContent = engine.type;
  document.getElementById("adviceText").textContent = engine.advice;
  document.getElementById("userBarLabel").textContent = cssFormatted;
  document.getElementById("userBar").style.width = `${userBarWidth(cssSecondsPer100)}%`;
  document.getElementById("levelText").textContent = benchmark.level;
  document.getElementById("gapText").textContent = benchmark.gap;
  resultsEl.classList.remove("hidden");
});
