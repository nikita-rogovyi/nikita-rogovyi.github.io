// Мінімальний тестовий фреймворк (describe / it / expect).
// Запускається в браузері через test/runner.html. Без залежностей.

(function () {
  const Runner = {
    suites: [],
    _current: null,
    passed: 0,
    failed: 0,
    failures: [],

    describe(name, fn) {
      const suite = { name, tests: [] };
      this.suites.push(suite);
      this._current = suite;
      try { fn(); } catch (e) {
        console.error(`describe(${name}) threw:`, e);
      }
      this._current = null;
    },

    it(name, fn) {
      if (!this._current) throw new Error('it() called outside describe()');
      this._current.tests.push({ name, fn });
    },

    beforeEach(fn) {
      if (!this._current) throw new Error('beforeEach() outside describe()');
      this._current.beforeEach = fn;
    },

    async run(rootEl) {
      this.passed = 0; this.failed = 0; this.failures = [];
      rootEl.innerHTML = '';
      const summary = document.createElement('div');
      summary.id = 'summary';
      summary.textContent = 'Виконуються тести...';
      rootEl.appendChild(summary);

      for (const suite of this.suites) {
        const block = document.createElement('section');
        block.className = 'suite';
        block.innerHTML = `<h2>${escapeHtml(suite.name)}</h2>`;
        rootEl.appendChild(block);

        for (const t of suite.tests) {
          const line = document.createElement('div');
          line.className = 'test';
          try {
            if (suite.beforeEach) await suite.beforeEach();
            await t.fn();
            line.innerHTML = `<span class="mark">✓</span> ${escapeHtml(t.name)}`;
            line.classList.add('pass');
            this.passed++;
          } catch (e) {
            line.innerHTML = `<span class="mark">✗</span> ${escapeHtml(t.name)}<div class="err">${escapeHtml(e.message)}</div>`;
            line.classList.add('fail');
            this.failed++;
            this.failures.push({ suite: suite.name, test: t.name, error: e });
            console.error(`FAIL: ${suite.name} > ${t.name}`, e);
          }
          block.appendChild(line);
        }
      }

      const total = this.passed + this.failed;
      summary.className = this.failed === 0 ? 'summary ok' : 'summary fail';
      summary.innerHTML = `
        <strong>${this.passed} / ${total}</strong> пройдено
        ${this.failed > 0 ? `<span class="bad">— ${this.failed} провалено</span>` : '— ✅ усе ок'}
      `;
    },
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected)
          throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected))
          throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
      toBeTruthy() { if (!actual) throw new Error(`expected truthy, got ${JSON.stringify(actual)}`); },
      toBeFalsy()  { if (actual)  throw new Error(`expected falsy, got ${JSON.stringify(actual)}`); },
      toBeGreaterThan(n) { if (!(actual > n))  throw new Error(`expected > ${n}, got ${actual}`); },
      toBeGreaterThanOrEqual(n) { if (!(actual >= n)) throw new Error(`expected ≥ ${n}, got ${actual}`); },
      toBeLessThan(n)    { if (!(actual < n))  throw new Error(`expected < ${n}, got ${actual}`); },
      toBeLessThanOrEqual(n) { if (!(actual <= n)) throw new Error(`expected ≤ ${n}, got ${actual}`); },
      toContain(item) {
        if (typeof actual === 'string') {
          if (!actual.includes(item)) throw new Error(`expected string to contain ${JSON.stringify(item)}, got ${JSON.stringify(actual)}`);
        } else if (Array.isArray(actual)) {
          if (!actual.some(x => x === item || JSON.stringify(x) === JSON.stringify(item)))
            throw new Error(`expected array to contain ${JSON.stringify(item)}`);
        } else throw new Error('toContain: actual must be string or array');
      },
      toMatch(regex) {
        if (!regex.test(actual)) throw new Error(`expected to match ${regex}, got ${JSON.stringify(actual)}`);
      },
      toHaveLength(n) { if (actual.length !== n) throw new Error(`expected length ${n}, got ${actual.length}`); },
      toBeDefined()   { if (actual === undefined) throw new Error('expected defined'); },
      toBeUndefined() { if (actual !== undefined) throw new Error(`expected undefined, got ${JSON.stringify(actual)}`); },
      toBeNull()      { if (actual !== null)      throw new Error(`expected null, got ${JSON.stringify(actual)}`); },
    };
  }

  window.TestRunner = Runner;
  window.describe = Runner.describe.bind(Runner);
  window.it = Runner.it.bind(Runner);
  window.beforeEach = Runner.beforeEach.bind(Runner);
  window.expect = expect;
})();
