async function testFunction() {
   const fet = await fetch("/", {
      headers: {
         "x-user": "app"
      }
   });
   document.getElementById("theDiv").innerHTML = JSON.stringify(await fet.json());
}