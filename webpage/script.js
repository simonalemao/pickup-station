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