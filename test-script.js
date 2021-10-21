const fs = require('fs')

const v1 = {
   a: 1,
   b: 2,
   c: 3
}

console.log({ ...v1, a: 4 });
console.log({ a: 4, ...v1 });

fs.stat("~/webapp", (err, stats) => {
   if (err) { console.error(err); }
   console.log(stats);
});
