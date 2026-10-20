const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

const source = fs.readFileSync(
  path.join(__dirname, '../layouts/partials/heatmap.html'),
  'utf8',
);
const helpersStart = source.indexOf('function padDatePart(');
const helpersEnd = source.indexOf('function getTooltip(', helpersStart);
const completeStart = source.indexOf('function completeContributionData(');
const completeEnd = source.indexOf('// 获取日期数据', completeStart);
const transformStart = source.indexOf('function transformArticlesData(');
const transformEnd = source.indexOf(
  'createCalendar(document.querySelector("#heatmap")',
  transformStart,
);

assert.ok(helpersStart >= 0 && helpersEnd > helpersStart);
assert.ok(completeStart >= 0 && completeEnd > completeStart);
assert.ok(transformStart >= 0 && transformEnd > transformStart);

const context = vm.createContext({
  getLevelFromWordCount: () => 1,
});
vm.runInContext(
  [
    source.slice(helpersStart, helpersEnd),
    source.slice(completeStart, completeEnd),
    source.slice(transformStart, transformEnd),
  ].join('\n'),
  context,
);

for (const zone of ['Asia/Shanghai', 'America/New_York']) {
  process.env.TZ = zone;
  assert.equal(context.dateKey(context.parseDateKey('2025-01-01')), '2025-01-01');
  assert.equal(context.dateKey(new Date(2025, 0, 1)), '2025-01-01');
}
process.env.TZ = 'Asia/Shanghai';

const today = new Date(2027, 0, 2);
const articles = [
  { date: '2025-01-01', wordcount: 120 },
  { date: '2026-01-01', wordcount: 80 },
  { date: '2026-10-20', wordcount: 40 },
  { date: '2027-01-01', wordcount: 20 },
  { date: '2027-01-03', wordcount: 999 },
];
const transformed = context.transformArticlesData(articles, today);
const data = context.completeContributionData(transformed, today);

assert.deepEqual(Object.keys(data), [
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
]);
assert.equal(Object.keys(data).at(-1), '2027');
assert.equal(context.dateKey(new Date(data['2027'][0].date)), '2027-01-01');
assert.equal(
  context.dateKey(new Date(data['2027'].at(-1).date)),
  '2027-01-02',
);
assert.equal(data['2027'].some((day) => context.dateKey(new Date(day.date)) === '2026-12-31'), false);
const article = data['2025'].find((day) => context.dateKey(new Date(day.date)) === '2025-01-01');
assert.equal(article?.count, 120);
assert.equal(article?.post, 1);

assert.equal(
  context.dateKey(new Date(transformed.find((day) => day.count === 120).date)),
  '2025-01-01',
);
assert.equal(transformed.length, 4);
assert.equal(transformed.some((day) => day.count === 999), false);
assert.equal(
  context.dateKey(new Date(transformed.find((day) => day.count === 20).date)),
  '2027-01-01',
);

console.log('PASS heatmap local dates, natural year and dynamic final year');
