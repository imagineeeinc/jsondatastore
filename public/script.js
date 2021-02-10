//document.getElementById("1h").innerHTML = "https://" + window.location.hostname + "/api/" + uuid1h
//document.getElementById("24h").innerHTML = "https://" + window.location.hostname + "/api/" + uuid24h
document.getElementById("7d").innerHTML = "https://" + window.location.hostname + "/api/" + uuid7d
document.getElementById("30d").innerHTML = "https://" + window.location.hostname + "/api/" + uuid30d

// fetch the initial list of dreams
/*
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  
    // listen for the form to be submitted and add a new dream when it is
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newDream = dreamsForm.elements.dream.value;
      dreams.push(newDream);
      appendNewDream(newDream);

      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
  });
*/