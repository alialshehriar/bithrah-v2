import fetch from 'node-fetch';

const response = await fetch('http://localhost:3000/api/trpc/ideas.quickEvaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "0": {
      "json": {
        "ideaName": "تطبيق توصيل طعام صحي",
        "ideaDescription": "منصة لتوصيل وجبات صحية ومتوازنة للأشخاص المهتمين بالصحة واللياقة"
      }
    }
  })
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
