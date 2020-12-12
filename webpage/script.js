async function testFunction() {
   const fet = await fetch("/testjson", {
      headers: {
         "x-user": "app"
      }
   });
   document.getElementById("theDiv").innerHTML = JSON.stringify(await fet.json());
}

function formEval() {
   var fileInput = document.getElementById("userfile");

   // files is a FileList object (similar to NodeList)
   var files = fileInput.files;
   var file;

   // loop through files
   file = files[0];

   (uplaodPicture(file))
}

async function uplaodPicture(pic) {
   const fet = await fetch("/upload", {
      headers: {
         "x-user": "app"
      },
      method: "POST",
      body: pic
   })
   console.log(fet);
   return fet;
}

async function foo() {
   var req = new Request("https://pickup-station.stec.fh-wedel.de");

   var fet = await fetch(req);

   document.getElementById("f_button").innerHTML = "done";

   var bdy = await fet.text();



   console.log("Status:\n", fet.status);
   console.log("Body:\n");
   console.log(bdy);
}