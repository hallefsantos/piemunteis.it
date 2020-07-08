/* UI Variables -------------------------- */
const dicSpecialCaracteres = document.getElementById('dicionario__special-caracteres'),
   dicInput = document.querySelector('.uk-input'),
   dicOptItaliano = document.querySelector('.dicionario__opt-italiano'),
   dicForm = document.getElementById('dicionario__form'),
   dicFormOptions = document.getElementById('dicionario__opt'),
   dicFormResults = document.getElementById("dicionario__results");

/* Event Listeners -------------------------- */
/* An event when click on button of Special Caracteres -- */
dicSpecialCaracteres.addEventListener('click', (e) => {
   if (e.target.classList.contains('uk-button')) {
      e.preventDefault();
      insertSpecialCaractere(e.target);
      searchStates(dicInput.value);
   }
});

/* An event to change the background color of form add/remove class -- */
dicFormOptions.addEventListener('click', e => {
   if (e.target.parentElement.classList.contains('dicionario__opt-italiano')) {
      dicForm.classList.add('italiano');
      dicInput.placeholder = "Serca in italiano";
   } else {
      dicInput.placeholder = "Serca in piemunteis";
      dicForm.classList.remove('italiano');
   }
});

/* An event to request api when something is add ou removed in search input -- */
dicInput.addEventListener('input', () => searchStates(dicInput.value));

/* Functions -------------------------- */

/* Made a get request on API and return a array with the match values -- */
const searchStates = async searchText => {
   const res = await fetch('http://localhost:3000/dicionaty');
   const words = await res.json();
   const result = [];

   if (dicForm.classList.contains('italiano')) {
      words.forEach(word => {
         if (word.lemma_it.startsWith(searchText)) result.push(word);
      });
   } else {
      words.forEach(word => {
         if (word.lemma.startsWith(searchText)) result.push(word);
      });
   }
   insertResultsSearchUI(result);
};

/* Insert results under the input form -- */
function insertResultsSearchUI(results, origin) {
   if (dicInput.value.trim() !== '' && dicInput.value.length > 1) {

      dicFormResults.classList.add('active');
      dicFormResults.innerHTML = '';

      if (results.length === 0) {
         dicFormResults.innerHTML = `<p>Nessun risultato trovato per <strong>${dicInput.value}</strong>.</p>`;
      } else {
         results.forEach(result => {

            const wordMeanings = result.glosses;
            let wordMeaningsHtml = '';

            for (let index = 0; index < 5; index++) {
               if (result.glosses[index]) {
                  wordMeaningsHtml += `<li>${result.glosses[index].semantics}</li>`;
               }
            }

            if (wordMeanings.length > 5) wordMeaningsHtml += `<li>Altri significati</li>`;

            dicFormResults.innerHTML += `
            <div class="dicionario__result">
               <p>${result.lemma} - ${result.lemma_it}</p>
               <ul>${wordMeaningsHtml}</ul>
            </div>`;
         });

         dicFormResults.innerHTML += '<a href="#">Tutti i risultati</a>';
      }

   } else {
      dicFormResults.classList.remove('active');
   }
}

/* Add to search input the special caractere when it was clicked -- */
function insertSpecialCaractere(button) {
   dicInput.value = dicInput.value + button.innerText;
   dicInput.focus();
}