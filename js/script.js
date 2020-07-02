$(document).ready( function() {

  // click sul bottone per prendere il valore dell'input
  $('.film-button').click( function(){
    // resetto la lista di film//serietv prima di iniziare la ricerca
    reset();
    // variabile in cui inserisco il valore del input
    var filmTvSearched = $('.input-film').val();
    // richiamo la funzione con la chiamata ajax
    // e stampo a schermo i risultati con handlebars
    searchFilmTvSeries(filmTvSearched)
    // pulisco la search bar
    $('.input-film').val('');
  });

  // evento col press invio
  $('.input-film').keyup( function(){
    if ( event.which == 13 ) {
      // resetto la lista di film//serietv prima di iniziare la ricerca
      reset();
      // variabile in cui inserisco il valore del input
      var filmTvSearched = $('.input-film').val();
      // richiamo la funzione con la chiamata ajax
      // e stampo a schermo i risultati con handlebars
      searchFilmTvSeries(filmTvSearched)
      // pulisco la search bar
      $('.input-film').val('');
    }
  });








///////////////////////// FUNZIONI ///////////////////////////


// funzione per prendere il valore dell'input
// e inserirlo come argomento della chiamata ajax (ricerca film)
// ---- filmTvSearched: variabile con l'input
function searchFilmTvSeries(filmTvSearched) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
    method: 'GET',
    data: {
      api_key: '9223e97f95bb1fdb0b5ae958392fe3c8',
      query: filmTvSearched, // variabile con all'interno il valore dell'input
      language: 'it-IT'
    },
    success: function(data) {
      var arrayFilmTv = data.results;
      // richiamo la funzione handlebars per stampare a
      // schermo tutti i film che contengono la ricerca dell'utente
      printFilm(arrayFilmTv)
    },
    error: function() {
      alert('Errore')
    }
  });
  // seconda chiamata all'Api per chiedere le serie tv
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/tv',
    method: 'GET',
    data: {
      api_key: '9223e97f95bb1fdb0b5ae958392fe3c8',
      query: filmTvSearched, // variabile con all'interno il valore dell'input
      language: 'it-IT'
    },
    success: function(data) {
      var arrayFilmTv = data.results;
      // richiamo la funzione handlebars per stampare a
      // schermo tutte le serie tv che contengono la ricerca dell'utente
      printSerieTv(arrayFilmTv)
    },
    error: function() {
      alert('Errore')
    }
  });
}


// funzione handlebars per stampare i film trovati
// ----arrayFilm: lista di film richiamati da api Ajax
function printFilm(arrayFilm) {
  var source = $("#film-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrayFilm.length; i++) {
    var singoloFilm = arrayFilm[i];
    var poster = 'https://image.tmdb.org/t/p/w185';
    // stampo con handlebars le chiavi che mi interessano
    var context =
    {
      poster: poster + singoloFilm.poster_path,
      title: singoloFilm.title,
      titleOriginal: singoloFilm.original_title,
      language: flags(singoloFilm.original_language),
      vote: starsVote(singoloFilm.vote_average),
    };
    var html = template(context);
    $('.list-film').append(html);
  }
}

// funzione handlebars per stampare le serie tv trovate
// ----arrayTV: lista di serie tv richiamati da api Ajax (stesso argomento dei film)
function printSerieTv(arrayTV) {
  var source = $("#seriesTv-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrayTV.length; i++) {
    var singolaSerie = arrayTV[i];
    var poster = 'https://image.tmdb.org/t/p/w185';
    // stampo con handlebars le chiavi che mi interessano
    var context =
    {
      poster: poster + singolaSerie.poster_path,
      title: singolaSerie.name,
      titleOriginal: singolaSerie.original_name,
      language: flags(singolaSerie.original_language),
      vote: starsVote(singolaSerie.vote_average),
    };
    var html = template(context);
    $('.list-film').append(html);
  }
}


// funzione per la creazione delle stelline in sostituzione del voto numerico
// ---- vote: argomento vote della chiamata api
// ----- return: StarsVote, icone stelle in base al voto numerico
function starsVote(vote) {
  var fullStar = '<i class="fas fa-star"></i>';
  var emptyStar = '<i class="far fa-star"></i>';
  var newVote = Math.round(vote / 2);
  var starsVote = '';
  for (var i = 0; i < 5; i++) {
    if (i < newVote) {
      starsVote += fullStar;
    } else {
      starsVote += emptyStar;
    }
  }
  return starsVote;
}


// funzione per la sostituzione della lingua con l'icona dello stato
// -----language: lingua del singolo film
// ------ return, flag: se la lingua è uguale ad una lista di lingue presenti
//  allego l'immagine dello stato, se no lascio scritto la lingua in caratteri
function flags(language) {
  var flag = '';
  if (language ==='it') {
    flag = '<img src="img/flag-it.png" alt="IT">';
  } else if (language ==='en'){
    flag = '<img src="img/flag-eng.png" alt="ENG">';
  } else if (language ==='fr'){
    flag = '<img src="img/flag-fr.png" alt="FR">';
  } else if (language ==='de'){
    flag = '<img src="img/flag-german.png" alt="DE">';
  } else if (language ==='es'){
    flag = '<img src="img/flag-spain.jpg" alt="ES">';
  } else {
    flag = language;
  }
  return flag
}


// funzione di reset
function reset() {
  $('.list-film').html(' ');
}


}); // !! close document ready !!
