// Тести гри ваг (weights-game.js). Використовує Games.weights._test експорти.

const W = () => window.Games.weights._test;

describe('weights: isAllowedQ', () => {
  it('rejects ¾ values (q%4 === 3)', () => {
    expect(W().isAllowedQ(3)).toBeFalsy();
    expect(W().isAllowedQ(7)).toBeFalsy();
    expect(W().isAllowedQ(11)).toBeFalsy();
    expect(W().isAllowedQ(23)).toBeFalsy();
  });
  it('accepts whole + halves + quarters', () => {
    [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16].forEach(q => {
      expect(W().isAllowedQ(q)).toBeTruthy();
    });
  });
  it('rejects negative', () => {
    expect(W().isAllowedQ(-1)).toBeFalsy();
  });
});

describe('weights: randAllowedQ', () => {
  it('never returns ¾ values', () => {
    for (let i = 0; i < 100; i++) {
      const q = W().randAllowedQ(2, 24);
      expect(W().isAllowedQ(q)).toBeTruthy();
    }
  });
  it('stays within range', () => {
    for (let i = 0; i < 50; i++) {
      const q = W().randAllowedQ(4, 12);
      expect(q).toBeGreaterThanOrEqual(4);
      expect(q).toBeLessThanOrEqual(12);
    }
  });
});

describe('weights: formatWeight', () => {
  beforeEach(() => { state.lang = 'uk'; });
  it('formats zero', () => {
    expect(W().formatWeight(0)).toBe('0 кг');
  });
  it('formats whole kg', () => {
    expect(W().formatWeight(4)).toBe('1 кг');
    expect(W().formatWeight(8)).toBe('2 кг');
  });
  it('formats fractions only', () => {
    expect(W().formatWeight(1)).toBe('¼ кг');
    expect(W().formatWeight(2)).toBe('½ кг');
  });
  it('formats mixed (whole + fraction)', () => {
    expect(W().formatWeight(5)).toBe('1 ¼ кг');
    expect(W().formatWeight(6)).toBe('1 ½ кг');
    expect(W().formatWeight(9)).toBe('2 ¼ кг');
  });
  it('respects current language unit', () => {
    state.lang = 'es';
    expect(W().formatWeight(4)).toBe('1 kg');
  });
});

describe('weights: makeWeightMix', () => {
  it('sum equals target', () => {
    for (let t = 1; t <= 24; t++) {
      if (!W().isAllowedQ(t)) continue;
      const items = W().makeWeightMix(t, 4, 'large-first');
      const sum = items.reduce((a, p) => a + p.q, 0);
      expect(sum).toBe(t);
    }
  });
  it('large-first prefers 1kg pieces', () => {
    const items = W().makeWeightMix(4, 4, 'large-first');
    expect(items.length).toBe(1);
    expect(items[0].q).toBe(4);
  });
  it('small-first prefers quarters (forces 4×¼=1kg lesson)', () => {
    const items = W().makeWeightMix(4, 4, 'small-first');
    // 4×¼ = 4 items of q=1
    const quarters = items.filter(p => p.q === 1);
    expect(quarters.length).toBeGreaterThanOrEqual(4);
  });
  it('small-first for 8q: includes 4×¼ + 2×½', () => {
    const items = W().makeWeightMix(8, 4, 'small-first');
    const sum = items.reduce((a, p) => a + p.q, 0);
    expect(sum).toBe(8);
    const q1 = items.filter(p => p.q === 1).length;
    const q2 = items.filter(p => p.q === 2).length;
    expect(q1).toBe(4);
    expect(q2).toBe(2);
  });
  it('respects maxDup per denomination', () => {
    const items = W().makeWeightMix(12, 3, 'large-first');
    // For 12q with maxDup=3, ideal is 3×1kg
    const ones = items.filter(p => p.q === 4).length;
    expect(ones).toBeLessThanOrEqual(3);
  });
});

describe('weights: generateOptions', () => {
  it('returns 4 unique allowed values including correct', () => {
    for (const target of [4, 8, 12, 16]) {
      const opts = W().generateOptions(target, [1, -1, 2, -2]);
      expect(opts).toHaveLength(4);
      expect(opts).toContain(target);
      const uniq = new Set(opts);
      expect(uniq.size).toBe(4);
      opts.forEach(o => {
        if (!W().isAllowedQ(o)) throw new Error(`Option ${o} has ¾`);
      });
    }
  });
  it('all options positive', () => {
    const opts = W().generateOptions(2, [1, -1, 2, -2]);
    expect(opts.every(o => o > 0)).toBeTruthy();
  });
});

describe('weights: WDIFF config', () => {
  it('easy is large-first, simple', () => {
    expect(W().WDIFF.easy.bias).toBe('large-first');
    expect(W().WDIFF.easy.enableInput).toBeFalsy();
  });
  it('hard is small-first (forces fractions)', () => {
    expect(W().WDIFF.hard.bias).toBe('small-first');
    expect(W().WDIFF.hard.enableInput).toBeTruthy();
  });
  it('medium allows input', () => {
    expect(W().WDIFF.medium.enableInput).toBeTruthy();
  });
});

describe('weights: I18N additions', () => {
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: has unit kg`, () => {
      expect(typeof window.I18N[lang].kg).toBe('string');
    });
    it(`${lang}: has weightScenarios (≥ 8)`, () => {
      expect(window.I18N[lang].weightScenarios.length).toBeGreaterThanOrEqual(8);
    });
    it(`${lang}: fracLabels excludes ¾`, () => {
      const fl = window.I18N[lang].fracLabels;
      expect(fl[3]).toBeUndefined();
      expect(fl[0]).toBe('');
      expect(fl[1]).toBe('¼');
      expect(fl[2]).toBe('½');
    });
  }
});
