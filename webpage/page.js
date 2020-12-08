async function testFunction() {
   const fet = await fetch("/", {
      headers: {
         "x-user": "app"
      }
   });

   const response = await fet.text();

   document.getElementById("theDiv").innerHTML = response;
}