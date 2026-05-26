// ============ HUNTR/X: Гра літрів (¼, ½, 1 L) ============
// Та сама механіка, що й гра ваг, але з пляшками та одиницею «л / L».

(function () {
  // Одиниця = чверть літра. 1=¼L, 2=½L, 4=1L.
  const PIECES = [
    { q: 1, size: "14", frac: "¼" },
    { q: 2, size: "12", frac: "½" },
    { q: 4, size: "1", frac: "1" },
  ];

  const VDIFF = {
    easy: {
      maxDup: 2,
      totalMin: 2,
      totalMax: 6,
      enableInput: false,
      bias: "large-first",
      spread: [1, 2, -1, -2, 3, -3, 4, -4],
    },
    medium: {
      maxDup: 3,
      totalMin: 3,
      totalMax: 12,
      enableInput: true,
      bias: "large-first",
      spread: [1, -1, 2, -2, 3, -3],
    },
    hard: {
      maxDup: 5,
      totalMin: 6,
      totalMax: 24,
      enableInput: true,
      bias: "small-first",
      spread: [1, -1, 2, -2],
    },
  };

  const ADD = {
    uk: {
      L: "л",
      volumeHowMuch: "Скільки тут літрів?",
      volumeChooseAnswer: "Обери правильну відповідь.",
      volumeEnterAnswer: "Введи цілу частину та дріб.",
      volumeScenarios: [
        "🧋 Скільки бабл-ті Зої замовила для всієї HUNTR/X?",
        "🍜 Скільки бульйону в казанах Джину перед концертом?",
        "🥤 Зважимо лимонад на фан-зустрічі!",
        "💧 Скільки чистої води для тренування Міри?",
        "🧃 Сік для HUNTR/X у гримерці — скільки літрів?",
        "☕ Кави для нічних репетицій — який обсяг?",
        "🍶 У карафах храму духів — скільки рідини?",
        "🍵 Скільки чаю Деркі заварив для всіх?",
        "🥛 Молоко у студії для перерви — скільки?",
        "🧴 Спортивні пляшки HUNTR/X після репетиції — порахуй!",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "без дробу",
      buildTarget: (str) =>
        `Налий рівно <span class="price">${str}</span> з доступних пляшок!`,
      tooMuch: (str) => `Забагато на ${str}`,
      notEnough: (str) => `Не вистачає ${str}`,
      correctIs: (str) => `Правильно: ${str}`,
    },
    ru: {
      L: "л",
      volumeHowMuch: "Сколько здесь литров?",
      volumeChooseAnswer: "Выбери правильный ответ.",
      volumeEnterAnswer: "Введи целую часть и дробь.",
      volumeScenarios: [
        "🧋 Сколько бабл-ти Зои заказала для всей HUNTR/X?",
        "🍜 Сколько бульона в котлах Джину перед концертом?",
        "🥤 Взвесим лимонад на фан-встрече!",
        "💧 Сколько чистой воды для тренировки Миры?",
        "🧃 Сок для HUNTR/X в гримёрке — сколько литров?",
        "☕ Кофе для ночных репетиций — какой объём?",
        "🍶 В кувшинах храма духов — сколько жидкости?",
        "🍵 Сколько чая Дерки заварил для всех?",
        "🥛 Молоко в студии на перерыв — сколько?",
        "🧴 Спортивные бутылки HUNTR/X после репетиции — посчитай!",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "без дроби",
      buildTarget: (str) =>
        `Налей ровно <span class="price">${str}</span> из доступных бутылок!`,
      tooMuch: (str) => `Слишком много на ${str}`,
      notEnough: (str) => `Не хватает ${str}`,
      correctIs: (str) => `Правильно: ${str}`,
    },
    es: {
      L: "L",
      volumeHowMuch: "¿Cuántos litros hay aquí?",
      volumeChooseAnswer: "Elige la respuesta correcta.",
      volumeEnterAnswer: "Introduce la parte entera y la fracción.",
      volumeScenarios: [
        "🧋 ¿Cuánto bubble tea pidió Zoey para toda HUNTR/X?",
        "🍜 ¿Cuánto caldo hay en las ollas de Jinu antes del concierto?",
        "🥤 ¡Pesemos la limonada del fan meeting!",
        "💧 ¿Cuánta agua pura para el entrenamiento de Mira?",
        "🧃 Zumo para HUNTR/X en el camerino — ¿cuántos litros?",
        "☕ Café para los ensayos nocturnos — ¿qué cantidad?",
        "🍶 En las jarras del templo de los espíritus — ¿cuánto líquido?",
        "🍵 ¿Cuánto té preparó Derpy para todos?",
        "🥛 Leche en el estudio durante el descanso — ¿cuánto?",
        "🧴 Botellas deportivas de HUNTR/X tras el ensayo — ¡cuenta!",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "sin fracción",
      buildTarget: (str) =>
        `¡Sirve exactamente <span class="price">${str}</span> con las botellas disponibles!`,
      tooMuch: (str) => `Te has pasado por ${str}`,
      notEnough: (str) => `Te faltan ${str}`,
      correctIs: (str) => `Correcto: ${str}`,
    },
  };
  for (const lang in ADD) {
    if (window.I18N && window.I18N[lang])
      Object.assign(window.I18N[lang], ADD[lang]);
  }

  function quartersToParts(q) {
    return { whole: Math.floor(q / 4), fracIdx: q % 4 };
  }
  function formatVolume(q) {
    const t = T();
    if (q === 0) return `0 ${t.L}`;
    const { whole, fracIdx } = quartersToParts(q);
    const fracLabel = t.fracLabels[fracIdx];
    if (whole === 0) return `${fracLabel} ${t.L}`;
    if (fracIdx === 0) return `${whole} ${t.L}`;
    return `${whole} ${fracLabel} ${t.L}`;
  }

  function volumeHtml(piece, extra = "") {
    const t = T();
    return `<div class="volume-item size-${piece.size} ${extra}" data-q="${piece.q}">
        <svg class="w-shape" viewBox="0 0 100 120" aria-hidden="true"><use href="#bottle"/></svg>
        <span class="w-label">${piece.frac} ${t.L}</span>
      </div>`;
  }

  function isAllowedQ(q) {
    return q >= 0 && q % 4 !== 3;
  }
  function randAllowedQ(min, max) {
    let q;
    let guard = 0;
    do {
      q = rand(min, max);
    } while (!isAllowedQ(q) && guard++ < 50);
    if (!isAllowedQ(q)) q = Math.max(min, q - (q % 4 === 3 ? 1 : 0));
    return q;
  }

  function makeVolumeMix(targetQ, maxDup, bias) {
    const used = { 1: 0, 2: 0, 4: 0 };
    const items = [];
    let remaining = targetQ;
    const dupBy =
      bias === "small-first"
        ? { 1: 4, 2: 2, 4: maxDup }
        : { 1: maxDup, 2: maxDup, 4: maxDup };
    const order = bias === "small-first" ? [1, 2, 4] : [4, 2, 1];
    for (const v of order) {
      while (remaining >= v && used[v] < dupBy[v]) {
        items.push(PIECES.find((p) => p.q === v));
        used[v]++;
        remaining -= v;
      }
    }
    while (remaining > 0) {
      items.push(PIECES[0]);
      remaining -= 1;
    }
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function renderCountTask(withOptions) {
    const t = T();
    const d = VDIFF[state.difficulty] || VDIFF.medium;
    let target;
    for (let i = 0; i < 30; i++) {
      target = randAllowedQ(d.totalMin, d.totalMax);
      if (
        window.taskMemory.accept(
          "volumes-count-" + (withOptions ? "O" : "I"),
          target,
          5
        )
      )
        break;
    }
    const items = makeVolumeMix(target, d.maxDup, d.bias);
    state.currentTask = { type: "volumeCount", target };

    let scenario;
    for (let i = 0; i < 20; i++) {
      scenario = choice(t.volumeScenarios);
      if (window.taskMemory.accept("volumes-scenario", scenario, 4)) break;
    }
    const hint = withOptions ? t.volumeChooseAnswer : t.volumeEnterAnswer;
    $(
      "#taskText"
    ).innerHTML = `${scenario}<br><b>${t.volumeHowMuch}</b><br><small style="opacity:0.8;font-size:0.85em;">${hint}</small>`;

    const area = $("#taskArea");
    area.innerHTML = "";
    items
      .slice()
      .sort((a, b) => b.q - a.q)
      .forEach((p) => {
        const wrap = document.createElement("div");
        wrap.innerHTML = volumeHtml(p);
        area.appendChild(wrap.firstChild);
      });

    const controls = $("#controls");
    if (withOptions) {
      const options = generateOptions(target, d.spread);
      controls.innerHTML = options
        .map(
          (q) =>
            `<button class="btn option" data-val="${q}">${formatVolume(
              q
            )}</button>`
        )
        .join("");
      controls.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          const v = parseInt(b.dataset.val, 10);
          if (v === target) win(t.exactHit);
          else lose(t.correctIs(formatVolume(target)));
        };
      });
    } else {
      controls.innerHTML = `
          <div class="weight-input-row">
            <input class="answer eur" id="volWhole" type="number" min="0" max="20"
                   inputmode="numeric" placeholder="0" autocomplete="off"/>
            <span class="unit">${t.L}</span>
            <span class="unit">+</span>
            <div class="frac-buttons" id="volFracBtns">
              <button type="button" class="frac-btn" data-frac="0">— ${t.fracNone}</button>
              <button type="button" class="frac-btn" data-frac="1">¼ ${t.L}</button>
              <button type="button" class="frac-btn" data-frac="2">½ ${t.L}</button>
            </div>
          </div>
          <button class="btn" id="checkVolBtn">${t.check}</button>
        `;
      const whole = $("#volWhole");
      whole.focus();
      let selFrac = null;
      document.querySelectorAll("#volFracBtns .frac-btn").forEach((b) => {
        b.addEventListener("click", () => {
          selFrac = parseInt(b.dataset.frac, 10);
          document
            .querySelectorAll("#volFracBtns .frac-btn")
            .forEach((x) => x.classList.toggle("active", x === b));
        });
      });
      whole.addEventListener("keydown", (e) => {
        if (e.key === "Enter") $("#checkVolBtn").click();
      });
      $("#checkVolBtn").onclick = () => {
        const w = parseInt(whole.value || "0", 10);
        if (isNaN(w) || w < 0 || selFrac === null) {
          lose(t.enterNumber || "");
          return;
        }
        const q = w * 4 + selFrac;
        if (q === target) win(t.bullseye);
        else lose(t.correctIs(formatVolume(target)));
      };
    }
  }

  function renderBuildTask() {
    const t = T();
    const d = VDIFF[state.difficulty] || VDIFF.medium;
    let target;
    for (let i = 0; i < 30; i++) {
      target = randAllowedQ(d.totalMin, d.totalMax);
      if (window.taskMemory.accept("volumes-build", target, 5)) break;
    }
    state.currentTask = { type: "volumeBuild", target };
    state.selected = [];

    let scenario;
    for (let i = 0; i < 20; i++) {
      scenario = choice(t.volumeScenarios);
      if (window.taskMemory.accept("volumes-scenario", scenario, 4)) break;
    }
    $("#taskText").innerHTML = `${scenario}<br>${t.buildTarget(
      formatVolume(target)
    )}`;

    const area = $("#taskArea");
    area.innerHTML = `
        <div class="pay-zone">
          <div class="zone-label">👛 ${t.walletLabel || ""}</div>
          <div class="wallet" id="vWallet"></div>
        </div>
        <div class="pay-zone tray-zone">
          <div class="zone-label">🍶 ${t.trayLabel || ""}</div>
          <div class="tray weight-tray" id="vTray"><div class="tray-empty">${
            t.trayEmpty || ""
          }</div></div>
        </div>
      `;

    const wallet = $("#vWallet");
    [...PIECES].reverse().forEach((p) => {
      const wrap = document.createElement("div");
      wrap.innerHTML = volumeHtml(p);
      const el = wrap.firstChild;
      el.addEventListener("click", () => addToTray(p));
      wallet.appendChild(el);
    });

    const controls = $("#controls");
    const showSum = state.difficulty !== "hard";
    controls.innerHTML = `
        ${
          showSum
            ? `<div class="current-sum">${t.currentSum} <span class="val" id="vCurrentSum">0 ${t.L}</span></div>`
            : ""
        }
        <button class="btn" id="vPayBtn">✅ ${t.check}</button>
        <button class="btn secondary" id="vClearBtn">${t.clear}</button>
      `;
    $("#vPayBtn").onclick = checkBuild;
    $("#vClearBtn").onclick = () => {
      state.selected = [];
      if (window.playRemoveSound) window.playRemoveSound();
      renderTray();
      updateSum();
    };
    renderTray();
  }

  function addToTray(piece) {
    state.selected.push({ q: piece.q, size: piece.size, frac: piece.frac });
    if (window.playClickSound) window.playClickSound(100 + piece.q * 50);
    renderTray(true);
    updateSum();
  }

  function removeFromTray(idx) {
    state.selected.splice(idx, 1);
    if (window.playRemoveSound) window.playRemoveSound();
    renderTray();
    updateSum();
  }

  function renderTray(animateLast) {
    const t = T();
    const tray = $("#vTray");
    if (!tray) return;
    if (state.selected.length === 0) {
      tray.innerHTML = `<div class="tray-empty">${t.trayEmpty || ""}</div>`;
      return;
    }
    const sorted = state.selected
      .map((s, i) => ({ ...s, idx: i }))
      .sort((a, b) => b.q - a.q);
    tray.innerHTML = "";
    sorted.forEach((s) => {
      const wrap = document.createElement("div");
      wrap.innerHTML = volumeHtml(
        s,
        animateLast && s.idx === state.selected.length - 1 ? "drop-in" : ""
      );
      const el = wrap.firstChild;
      el.addEventListener("click", () => removeFromTray(s.idx));
      tray.appendChild(el);
    });
  }

  function updateSum() {
    const el = $("#vCurrentSum");
    if (!el) return;
    const total = state.selected.reduce((a, b) => a + b.q, 0);
    el.textContent = formatVolume(total);
  }

  function checkBuild() {
    const t = T();
    const total = state.selected.reduce((a, b) => a + b.q, 0);
    if (total === state.currentTask.target) {
      win(t.bullseye);
    } else {
      const diff = total - state.currentTask.target;
      const hint =
        diff > 0
          ? t.tooMuch(formatVolume(diff))
          : t.notEnough(formatVolume(-diff));
      lose(hint);
    }
  }

  function generateOptions(correct, deltas) {
    const set = new Set([correct]);
    let guard = 0;
    while (set.size < 4 && guard++ < 60) {
      const delta = choice(deltas);
      let c = correct + delta;
      if (c < 0) c = correct + Math.abs(delta) * 2;
      if (c > 0 && c !== correct && isAllowedQ(c)) set.add(c);
    }
    return [...set].sort(() => Math.random() - 0.5);
  }

  function newRound() {
    const d = VDIFF[state.difficulty] || VDIFF.medium;
    const types = ["countOptions", "build"];
    if (d.enableInput) types.push("countInput");
    const type = choice(types);
    if (type === "countOptions") renderCountTask(true);
    else if (type === "countInput") renderCountTask(false);
    else renderBuildTask();
  }

  // I18N для назви гри (доливаємо до основних ключів)
  for (const lang in window.I18N || {}) {
    if (lang === "uk") window.I18N.uk.gameVolumes = "Літри";
    if (lang === "ru") window.I18N.ru.gameVolumes = "Литры";
    if (lang === "es") window.I18N.es.gameVolumes = "Litros";
  }

  window.Games = window.Games || {};
  window.Games.volumes = {
    id: "volumes",
    icon: "🥤",
    getName: (lang) =>
      (window.I18N && window.I18N[lang] && window.I18N[lang].gameVolumes) ||
      "Volumes",
    newRound,
    _test: {
      PIECES,
      VDIFF,
      isAllowedQ,
      randAllowedQ,
      makeVolumeMix,
      formatVolume,
      quartersToParts,
      generateOptions,
    },
  };
})();
