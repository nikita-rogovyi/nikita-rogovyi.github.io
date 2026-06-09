// Тести гри «Задачі» (problems-game.js). Перевіряє генератор чисел і шаблони.

const P = () => window.Games.problems._test;

describe('problems: PATTERNS coverage', () => {
  it('has all 4 sign patterns: pp, pm, mp, mm', () => {
    const pats = P().PATTERNS.slice().sort();
    expect(pats).toEqual(['mm', 'mp', 'pm', 'pp']);
  });
});

describe('problems: genNumbers — no negatives, within range', () => {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const pat of ['pp', 'pm', 'mp', 'mm']) {
      it(`${diff} / ${pat}: result and intermediate are non-negative`, () => {
        const d = P().PDIFF[diff];
        for (let i = 0; i < 50; i++) {
          const n = P().genNumbers(pat, d);
          expect(n.inter).toBeGreaterThanOrEqual(0);
          expect(n.result).toBeGreaterThanOrEqual(0);
          expect(n.result).toBeLessThanOrEqual(d.resultMax);
          // Перевіряємо, що арифметика збігається з шаблоном
          const s1 = pat[0] === 'p' ? 1 : -1;
          const s2 = pat[1] === 'p' ? 1 : -1;
          expect(n.x + s1 * n.a + s2 * n.b).toBe(n.result);
        }
      });
    }
  }
});

describe('problems: genNumbers — x and a/b in configured ranges', () => {
  it('uses x within [xMin, xMax]', () => {
    const d = P().PDIFF.medium;
    for (let i = 0; i < 50; i++) {
      const n = P().genNumbers('pm', d);
      expect(n.x).toBeGreaterThanOrEqual(d.xMin);
      expect(n.x).toBeLessThanOrEqual(d.xMax);
    }
  });
  it('uses a,b within [abMin, abMax]', () => {
    const d = P().PDIFF.medium;
    for (let i = 0; i < 50; i++) {
      const n = P().genNumbers('mp', d);
      expect(n.a).toBeGreaterThanOrEqual(d.abMin);
      expect(n.a).toBeLessThanOrEqual(d.abMax);
      expect(n.b).toBeGreaterThanOrEqual(d.abMin);
      expect(n.b).toBeLessThanOrEqual(d.abMax);
    }
  });
});

describe('problems: opChar', () => {
  it('positive sign → "+"', () => { expect(P().opChar(1)).toBe('+'); });
  it('negative sign → "−"', () => { expect(P().opChar(-1)).toBe('−'); });
});

describe('problems: SCENARIOS shape', () => {
  it('every pattern has ≥3 scenarios with story+labels for all 3 languages', () => {
    for (const pat of ['pp', 'pm', 'mp', 'mm']) {
      const arr = P().SCENARIOS[pat];
      expect(Array.isArray(arr)).toBeTruthy();
      expect(arr.length).toBeGreaterThanOrEqual(3);
      arr.forEach(scn => {
        ['uk','ru','es'].forEach(lng => {
          const obj = scn[lng];
          expect(typeof obj).toBe('object');
          expect(typeof obj.story).toBe('function');
          expect(typeof obj.lx).toBe('string');
          expect(typeof obj.la).toBe('string');
          expect(typeof obj.lb).toBe('string');
          // дзвонимо story, щоб переконатись, що шаблон не падає
          const s = obj.story(10, 4, 3);
          expect(typeof s).toBe('string');
          expect(s.length).toBeGreaterThan(10);
        });
      });
    }
  });
});

describe('problems: I18N keys', () => {
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: has gameProblems + problem* labels`, () => {
      const I = window.I18N[lang];
      expect(typeof I.gameProblems).toBe('string');
      expect(typeof I.problemDatos).toBe('string');
      expect(typeof I.problemSolution).toBe('string');
      expect(typeof I.problemHint).toBe('string');
      expect(typeof I.problemCheckData).toBe('string');
    });
    it(`${lang}: taskTypeNames covers problemPP/PM/MP/MM`, () => {
      const t = window.I18N[lang].taskTypeNames;
      ['problemPP','problemPM','problemMP','problemMM'].forEach(k => {
        if (!t[k]) throw new Error(`Missing taskTypeNames.${k} in ${lang}`);
      });
    });
  }
});

describe('problems: Games registry', () => {
  it('Games.problems is registered with required fields', () => {
    const g = window.Games.problems;
    expect(g).toBeDefined();
    expect(g.id).toBe('problems');
    expect(typeof g.icon).toBe('string');
    expect(typeof g.getName).toBe('function');
    expect(typeof g.newRound).toBe('function');
  });
});
