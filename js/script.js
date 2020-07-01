$(document).ready( function() {

  // click sul bottone per prendere il valore dell'input
  $('.film-button').click( function(){
    // resetto la lista di film prima di iniziare la ricerca
    $('.list-film').html(' ');
    // variabile in cui inserisco il valore del input
    var filmSearched = $('.input-film').val();

    // richiamo la funzione con la chiamata ajax
    // e stampo a schermo i risultati con handlebars
    searchFilm(filmSearched)

  });








// FUNZIONI

// funzione per prendere il valore dell'input
// e inserirlo come argomento della chiamata ajax
// ---- filmSearched: variabile con l'input
function searchFilm(filmSearched) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
    method: 'GET',
    data: {
      api_key: '9223e97f95bb1fdb0b5ae958392fe3c8',
      query: filmSearched, // variabile con all'interno il valore dell'input
      language: 'it-IT'
    },
    success: function(data) {
      var arrayFilm = data.results;
      // richiamo la funzione handlebars per stampare a
      // schermo tutti i film che contengono la ricerca dell'utente
      printFilm(arrayFilm)
    },
    error: function() {
      alert('Errore')
    }
  });
}


// funzione handlebars per stampare i film trovati
// ----arrayFilm: lista di film richiamati da api Ajax
function printFilm(arrayFilm) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrayFilm.length; i++) {
    var singoloFilm = arrayFilm[i];
    // stampo con handlebars le chiavi che mi interessano
    var context =
    {
      title: singoloFilm.title,
      titleOriginal: singoloFilm.original_title,
      language: singoloFilm.original_language,
      vote: singoloFilm.vote_average,
    };
    var html = template(context);
    $('.list-film').append(html);
  }
}

}); // !! close document ready !!
