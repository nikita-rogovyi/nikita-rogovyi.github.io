// ============ HUNTR/X: Гра ваг (1/4, 1/2, 1 кг) ============
// Працює всередині того ж DOM (#taskText, #taskArea, #controls, #feedback).
// Користується глобальними утилітами зі script.js: T(), D(), $, rand, choice,
// win(), lose(), state, fillPlaceholders, playClickSound, playRemoveSound.

(function () {
  // Одиниця виміру = чверть кг. 1=¼kg, 2=½kg, 4=1kg.
  const PIECES = [
    { q: 1, size: "14", frac: "¼" },
    { q: 2, size: "12", frac: "½" },
    { q: 4, size: "1", frac: "1" },
  ];

  // Складність: max кількість предметів одного типу + загальний max у "чвертях"
  // bias = 'large-first' — спочатку 1кг, потім ½, потім ¼ (легко рахувати)
  // bias = 'small-first' — спочатку ¼ (форсує усвідомлення: 4×¼ = 1кг)
  const WDIFF = {
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
    // На складному змусимо часто використовувати ¼-гирі та ½-гирі,
    // мінімізуючи "просто 1кг" варіанти.
    hard: {
      maxDup: 5,
      totalMin: 6,
      totalMax: 24,
      enableInput: true,
      bias: "small-first",
      spread: [1, -1, 2, -2],
    },
  };

  // ===== I18N: додаємо ключі до існуючого I18N (визначеного у script.js) =====
  const ADD = {
    uk: {
      kg: "кг",
      weightAnd: "та",
      weightHowMuch: "Скільки тут важить?",
      weightChooseAnswer: "Обери правильну відповідь.",
      weightEnterAnswer: "Введи цілу частину та дріб.",
      weightZero: "0",
      weightScenarios: [
        "🏋️ Допоможи Мірі підготуватися до бою — скільки важить її набір гокком?",
        "🐯 Деркі приніс зважити трофеї HUNTR/X!",
        "⚖️ Зважимо здобич, що випала з демонів Saja Boys!",
        "🍜 Зої замовила рамен — скільки важить замовлення?",
        "🧋 Бабл-ті для всієї HUNTR/X — який загальний вантаж?",
        "🗡️ Скільки важить меч-саінгом Румі?",
        "💎 Кристали-хонмун зібрано на сцені — зважимо!",
        "📦 Посилка з мерчем HUNTR/X — скільки кг?",
        "🐅 Тигр-дух Деркі грається з гирями — допоможи порахувати!",
        "🎤 Багаж HUNTR/X перед концертом — який сумарний вантаж?",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "без дробу",
      buildTarget: (str) =>
        `Збери рівно <span class="price">${str}</span> з доступних гир!`,
      tooMuch: (str) => `Забагато на ${str}`,
      notEnough: (str) => `Не вистачає ${str}`,
      correctIs: (str) => `Правильно: ${str}`,
    },
    ru: {
      kg: "кг",
      weightAnd: "и",
      weightHowMuch: "Сколько здесь весит?",
      weightChooseAnswer: "Выбери правильный ответ.",
      weightEnterAnswer: "Введи целую часть и дробь.",
      weightZero: "0",
      weightScenarios: [
        "🏋️ Помоги Мире подготовиться к бою — сколько весит её набор гоккомов?",
        "🐯 Дерки принёс взвесить трофеи HUNTR/X!",
        "⚖️ Взвесим добычу, выпавшую из демонов Saja Boys!",
        "🍜 Зои заказала рамен — сколько весит заказ?",
        "🧋 Бабл-ти для всей HUNTR/X — общий вес?",
        "🗡️ Сколько весит меч-саингом Руми?",
        "💎 Кристаллы хонмуна собраны на сцене — взвесим!",
        "📦 Посылка с мерчем HUNTR/X — сколько кг?",
        "🐅 Тигр-дух Дерки играет с гирями — посчитай!",
        "🎤 Багаж HUNTR/X перед концертом — общий вес?",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "без дроби",
      buildTarget: (str) =>
        `Собери ровно <span class="price">${str}</span> из доступных гирь!`,
      tooMuch: (str) => `Слишком много на ${str}`,
      notEnough: (str) => `Не хватает ${str}`,
      correctIs: (str) => `Правильно: ${str}`,
    },
    es: {
      kg: "kg",
      weightAnd: "y",
      weightHowMuch: "¿Cuánto pesa todo esto?",
      weightChooseAnswer: "Elige la respuesta correcta.",
      weightEnterAnswer: "Introduce la parte entera y la fracción.",
      weightZero: "0",
      weightScenarios: [
        "🏋️ ¡Ayuda a Mira a preparar su entrenamiento — cuánto pesa su set de gokgeoms?",
        "🐯 ¡Derpy trajo los trofeos de HUNTR/X para pesar!",
        "⚖️ ¡Pesemos el botín que dejaron los Saja Boys derrotados!",
        "🍜 ¡Zoey pidió ramen — cuánto pesa el pedido?",
        "🧋 ¡Bubble tea para toda HUNTR/X — peso total?",
        "🗡️ ¿Cuánto pesa la espada saingeom de Rumi?",
        "💎 ¡Los cristales del honmoon recogidos del escenario — pesemos!",
        "📦 Un paquete con merch de HUNTR/X — ¿cuántos kg?",
        "🐅 ¡El tigre Derpy juega con las pesas — ayuda a contar!",
        "🎤 ¡El equipaje de HUNTR/X antes del concierto — peso total?",
      ],
      fracLabels: { 0: "", 1: "¼", 2: "½" },
      fracNone: "sin fracción",
      buildTarget: (str) =>
        `¡Reúne exactamente <span class="price">${str}</span> con las pesas disponibles!`,
      tooMuch: (str) => `Te has pasado por ${str}`,
      notEnough: (str) => `Te faltan ${str}`,
      correctIs: (str) => `Correcto: ${str}`,
    },
  };

  // Доливаємо ключі в існуючий I18N
  for (const lang in ADD) {
    if (window.I18N && window.I18N[lang])
      Object.assign(window.I18N[lang], ADD[lang]);
  }

  // ===== Утиліти форматування =====
  function quartersToParts(q) {
    const whole = Math.floor(q / 4);
    const fracIdx = q % 4; // 0,1,2,3 → '', ¼, ½, ¾
    return { whole, fracIdx };
  }
  function formatWeight(q) {
    const t = T();
    if (q === 0) return `0 ${t.kg}`;
    const { whole, fracIdx } = quartersToParts(q);
    const fracLabel = t.fracLabels[fracIdx];
    if (whole === 0) return `${fracLabel} ${t.kg}`;
    if (fracIdx === 0) return `${whole} ${t.kg}`;
    return `${whole} ${fracLabel} ${t.kg}`;
  }

  // ===== Рендер елемента-гирі =====
  function weightHtml(piece, extra = "") {
    const t = T();
    return `<div class="weight-item size-${piece.size} ${extra}" data-q="${piece.q}">
        <svg class="w-shape" viewBox="0 0 100 120" aria-hidden="true"><use href="#kettlebell"/></svg>
        <span class="w-label">${piece.frac} ${t.kg}</span>
      </div>`;
  }

  // ===== Генерація списку гир для цільового q =====
  // bias = 'small-first' — пріоритет ¼-гирям (форсує комбінацію 4×¼=1кг)
  // bias = 'large-first' — пріоритет 1кг (легша візуальна структура)
  function makeWeightMix(targetQ, maxDup, bias) {
    const used = { 1: 0, 2: 0, 4: 0 };
    const items = [];
    let remaining = targetQ;

    // Для small-first ставимо «природні блоки»:
    //   до 4×¼ (= 1кг), до 2×½ (= 1кг), а 1кг — за залишковим принципом.
    // Це повторно демонструє лекцію «4 чверті = 1 кг», «2 половини = 1 кг».
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

  // Допустиме значення (не дає ¾): q%4 ∈ {0,1,2}
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

  // ===== Тип 1: «Скільки тут важить?» (варіанти або введення) =====
  function renderCountTask(withOptions) {
    const t = T();
    const d = WDIFF[state.difficulty] || WDIFF.medium;
    // Унікальний таргет (без повторів останніх 5)
    let target;
    for (let i = 0; i < 30; i++) {
      target = randAllowedQ(d.totalMin, d.totalMax);
      if (
        window.taskMemory.accept(
          "weights-count-" + (withOptions ? "O" : "I"),
          target,
          5
        )
      )
        break;
    }
    const items = makeWeightMix(target, d.maxDup, d.bias);
    state.currentTask = { type: "weightCount", target };

    let scenario;
    for (let i = 0; i < 20; i++) {
      scenario = choice(t.weightScenarios);
      if (window.taskMemory.accept("weights-scenario", scenario, 4)) break;
    }
    const hint = withOptions ? t.weightChooseAnswer : t.weightEnterAnswer;
    $(
      "#taskText"
    ).innerHTML = `${scenario}<br><b>${t.weightHowMuch}</b><br><small style="opacity:0.8;font-size:0.85em;">${hint}</small>`;

    const area = $("#taskArea");
    area.innerHTML = "";
    // Сортуємо від більшого до меншого, для зручності
    items
      .slice()
      .sort((a, b) => b.q - a.q)
      .forEach((p) => {
        const wrap = document.createElement("div");
        wrap.innerHTML = weightHtml(p);
        area.appendChild(wrap.firstChild);
      });

    const controls = $("#controls");
    if (withOptions) {
      const options = generateOptions(target, d.spread);
      controls.innerHTML = options
        .map(
          (q) =>
            `<button class="btn option" data-val="${q}">${formatWeight(
              q
            )}</button>`
        )
        .join("");
      controls.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          const v = parseInt(b.dataset.val, 10);
          if (v === target) win(t.exactHit);
          else lose(t.correctIs(formatWeight(target)));
        };
      });
    } else {
      controls.innerHTML = `
          <div class="weight-input-row">
            <input class="answer eur" id="weightWhole" type="number" min="0" max="20"
                   inputmode="numeric" placeholder="0" autocomplete="off"/>
            <span class="unit">${t.kg}</span>
            <span class="unit">+</span>
            <div class="frac-buttons" id="weightFracBtns">
              <button type="button" class="frac-btn" data-frac="0">— ${t.fracNone}</button>
              <button type="button" class="frac-btn" data-frac="1">¼ ${t.kg}</button>
              <button type="button" class="frac-btn" data-frac="2">½ ${t.kg}</button>
            </div>
          </div>
          <button class="btn" id="checkWeightBtn">${t.check}</button>
        `;
      const whole = $("#weightWhole");
      whole.focus();
      let selFrac = null;
      document.querySelectorAll("#weightFracBtns .frac-btn").forEach((b) => {
        b.addEventListener("click", () => {
          selFrac = parseInt(b.dataset.frac, 10);
          document
            .querySelectorAll("#weightFracBtns .frac-btn")
            .forEach((x) => x.classList.toggle("active", x === b));
        });
      });
      whole.addEventListener("keydown", (e) => {
        if (e.key === "Enter") $("#checkWeightBtn").click();
      });
      $("#checkWeightBtn").onclick = () => {
        const w = parseInt(whole.value || "0", 10);
        if (isNaN(w) || w < 0 || selFrac === null) {
          lose(t.enterNumber || "");
          return;
        }
        const q = w * 4 + selFrac;
        if (q === target) win(t.bullseye);
        else lose(t.correctIs(formatWeight(target)));
      };
    }
  }

  // ===== Тип 2: «Збери рівно X кг» (як «купи за N» у грошах) =====
  function renderBuildTask() {
    const t = T();
    const d = WDIFF[state.difficulty] || WDIFF.medium;
    let target;
    for (let i = 0; i < 30; i++) {
      target = randAllowedQ(d.totalMin, d.totalMax);
      if (window.taskMemory.accept("weights-build", target, 5)) break;
    }
    state.currentTask = { type: "weightBuild", target };
    state.selected = [];

    let scenario;
    for (let i = 0; i < 20; i++) {
      scenario = choice(t.weightScenarios);
      if (window.taskMemory.accept("weights-scenario", scenario, 4)) break;
    }
    $("#taskText").innerHTML = `${scenario}<br>${t.buildTarget(
      formatWeight(target)
    )}`;

    const area = $("#taskArea");
    area.innerHTML = `
        <div class="pay-zone">
          <div class="zone-label">👛 ${t.walletLabel || ""}</div>
          <div class="wallet" id="wWallet"></div>
        </div>
        <div class="pay-zone tray-zone">
          <div class="zone-label">⚖️ ${t.trayLabel || ""}</div>
          <div class="tray weight-tray" id="wTray"><div class="tray-empty">${
            t.trayEmpty || ""
          }</div></div>
        </div>
      `;

    // Гаманець — по 1 екземпляру кожного типу, клацаєш — додаєш у тацю (можна багато)
    const wallet = $("#wWallet");
    [...PIECES].reverse().forEach((p) => {
      const wrap = document.createElement("div");
      wrap.innerHTML = weightHtml(p);
      const el = wrap.firstChild;
      el.addEventListener("click", () => {
        addToTray(p);
      });
      wallet.appendChild(el);
    });

    const controls = $("#controls");
    const showSum = state.difficulty !== "hard";
    controls.innerHTML = `
        ${
          showSum
            ? `<div class="current-sum">${t.currentSum} <span class="val" id="wCurrentSum">0 ${t.kg}</span></div>`
            : ""
        }
        <button class="btn" id="wPayBtn">✅ ${t.check}</button>
        <button class="btn secondary" id="wClearBtn">${t.clear}</button>
      `;
    $("#wPayBtn").onclick = checkBuild;
    $("#wClearBtn").onclick = () => {
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
    const tray = $("#wTray");
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
      wrap.innerHTML = weightHtml(
        s,
        animateLast && s.idx === state.selected.length - 1 ? "drop-in" : ""
      );
      const el = wrap.firstChild;
      el.addEventListener("click", () => removeFromTray(s.idx));
      tray.appendChild(el);
    });
  }

  function updateSum() {
    const t = T();
    const el = $("#wCurrentSum");
    if (!el) return;
    const total = state.selected.reduce((a, b) => a + b.q, 0);
    el.textContent = formatWeight(total);
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
          ? t.tooMuch(formatWeight(diff))
          : t.notEnough(formatWeight(-diff));
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
      // не дозволяємо варіанти з ¾ — діти ще не вивчили
      if (c > 0 && c !== correct && isAllowedQ(c)) set.add(c);
    }
    return [...set].sort(() => Math.random() - 0.5);
  }

  // ===== Диспетчер раундів цієї гри =====
  function newRound() {
    const d = WDIFF[state.difficulty] || WDIFF.medium;
    const types = ["countOptions", "build"];
    if (d.enableInput) types.push("countInput");
    const type = choice(types);
    if (type === "countOptions") renderCountTask(true);
    else if (type === "countInput") renderCountTask(false);
    else renderBuildTask();
  }

  // Реєструємо в загальному реєстрі ігор
  window.Games = window.Games || {};
  window.Games.weights = {
    id: "weights",
    icon: "⚖️",
    getName: (lang) =>
      (window.I18N && window.I18N[lang] && window.I18N[lang].gameWeights) ||
      "Weights",
    newRound,
    // Експорт для тестів
    _test: {
      PIECES,
      WDIFF,
      isAllowedQ,
      randAllowedQ,
      makeWeightMix,
      formatWeight,
      quartersToParts,
      generateOptions,
    },
  };
})();
