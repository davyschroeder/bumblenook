// Every text added in src/life.js must have a Dutch version.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({});
  await page.click('#s-new'); await page.waitForTimeout(800); await page.click('#coach-skip');
  const miss = await page.evaluate(() => {
    const { G, BT, JOBS, RES, CHOICES, SCENARIOS, TRACKS, NEW_RES, SET, api } = __hh; SET.lang = 'nl';
    const out = [], chk = (s) => { if (s && /[a-z]{3}/.test(s) && api.tr(s) === s) out.push(s); };
    for (const t of ['coop', 'cowshed', 'pastry', 'tailor', 'brazier', 'garden', 'flag', 'arch']) { chk(BT[t].name); chk(BT[t].desc); }
    for (const j of ['confectioner', 'tailor', 'poulterer', 'dairy']) { chk(JOBS[j].title); chk(JOBS[j].plural); }
    for (const r of NEW_RES) chk(RES[r]);
    G.res.coins = 900; G.res.food = 900; G.res.honey = 50; G.level = 3;
    for (const c of CHOICES) { chk(c.title); chk(c.text); chk(c.a[0]); chk(c.b[0]); for (let q = 0; q < 6; q++) { G.res.coins = 900; G.res.food = 900; G.res.honey = q % 2 ? 50 : 0; chk(c.a[1]()); chk(c.b[1]()); } }
    for (const s of SCENARIOS) { chk(s.name); chk(s.desc); chk(s.goal); chk(s.tiers); chk('Challenge: ' + s.goal); chk('Challenge · ' + s.goal + ' (3/17)'); chk('Challenge lost: ' + s.name + '. You can keep building, or start it again from the title screen.'); chk('Challenge won: ' + s.name + '. Gold medal!'); }
    for (const t of TRACKS) for (const q of t.goals) { chk(q.text); chk(q.hint); }
    for (const s of ['Challenge · Gold medal won', 'Challenge · lost', 'Won with a silver medal.', 'Child, 2 days in Bumblenook.', 'Elder, 1 day in Bumblenook.', 'Grown-up, 12 days in Bumblenook.', 'Crews at work: 2 of 3', 'Salt (5 a day each)', 'Clay (9 a day each)',
      'The Quarry Hut close by is noisy. Homes sleep better away from workshops.', 'Ivy was born in Bumblenook! Ben\'s cottage has a new voice.', 'Ivy has grown up and is ready to work.', 'Ivy has grown up and is ready to work, quick and clever from school.', 'Ivy is now one of the village elders.',
      'The supply boat from the Far Isle brought 10 salt, 9 clay, 5 grapes.', 'The supply boat from the Far Isle brought 5 salt. There was no food to send, so the crews worked at half strength.', 'The supply boat from the Far Isle brought nothing: the stores are full.',
      'Day 7: Ivy was born.', 'Day 9: Ivy grew up.', 'Not in this challenge', 'Neighbourhood', 'The Far Isle', 'Found an outpost', 'Enlarge: 5 crews', 'Challenges', 'Play', 'Still open.']) chk(s);
    return { n: out.length, out: [...new Set(out)].slice(0, 20), sample: [api.tr('The supply boat from the Far Isle brought 10 salt, 9 clay, 5 grapes.'), api.tr('Ivy was born in Bumblenook! Ben\'s cottage has a new voice.'), api.tr('Challenge · Have 40 honey in store (12/40)')] };
  });
  console.log('untranslated:', miss.n, miss.out.join(' || ')); console.log(miss.sample.join(' || ')); console.log('errors', errors.length);
  await browser.close();
})();
