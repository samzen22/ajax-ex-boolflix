$(document).ready( function() {

  //click sul logo per tornare all'homepage
  $('.logo').click( function(){
    // resetto la lista di film//serietv
    reset();
  });

  // // click sul bottone per prendere il valore dell'input
  // $('.film-button').click( function(){
  //   // resetto la lista di film//serietv prima di iniziare la ricerca
  //   reset();
  //   // variabile in cui inserisco il valore del input
  //   var filmTvSearched = $('.input-film').val();
  //   // richiamo la funzione con la chiamata ajax
  //   // e stampo a schermo i risultati con handlebars
  //   searchFilmTvSeries(filmTvSearched)
  //   // pulisco la search bar
  //   $('.input-film').val('');
  // });

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

  // evento mouse enter/leave per mostrare le info del film/serietv
  $(document).on('mouseenter', '.film', function() {
    $(this).children('.info-film-tv').removeClass('hidden').toggleClass('border-white');
  });
  $(document).on('mouseleave', '.film', function() {
    $(this).children('.info-film-tv').addClass('hidden').toggleClass('border-white');
  });




///////////////////////// FUNZIONI ///////////////////////////


// funzione per prendere il valore dell'input
// e inserirlo come argomento della chiamata ajax
// ---- filmTvSearched: variabile con l'input
function searchFilmTvSeries(filmTvSearched) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/multi',
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
      printFilmTvSeries(arrayFilmTv)
    },
    error: function() {
      alert('Errore')
    }
  });
}


// funzione handlebars per stampare i film trovati
// ----arrayFilmTv: array richiamato da api Ajax
function printFilmTvSeries(arrayFilmTV) {
  var source = $("#film-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrayFilmTV.length; i++) {
    var singoloFilmTv = arrayFilmTV[i];
    //controllo che il media_type non sia person,
    //stampa solo film e serietv
    if (singoloFilmTv.media_type !== 'person') {
      // stampo con handlebars le chiavi che mi interessano
      var context =
      {
        poster: posterOrNot(singoloFilmTv.poster_path),
        title: singoloFilmTv.title || singoloFilmTv.name,
        titleOriginal: singoloFilmTv.original_title || singoloFilmTv.original_name,
        language: flags(singoloFilmTv.original_language),
        vote: starsVote(singoloFilmTv.vote_average),
        overview: singoloFilmTv.overview,
      };
      var html = template(context);
      $('.list-film').append(html);
    }
  }
}


// funzione per la creazione delle stelline in sostituzione del voto numerico
// ---- vote: argomento vote della chiamata api
// ----- return: StarsVote, icone stelle in base al voto numerico
function starsVote(vote) {
  var fullStar = '<i class="fas fa-star"></i>';
  var emptyStar = '<i class="far fa-star"></i>';
  var newVote = Math.ceil(vote / 2);
  var starsVote = '';
  for (var i = 1; i <= 5; i++) {
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

// funzione per gestire l'immagine di copertina
// se da valore null allego immagine standard (sorry img not avaiable)
// se invece è presente un poster allego il poster_path
function posterOrNot(poster_path) {
  posterImg = '';
  if (poster_path == null){
    posterImg = "img/poster-null.jpg"
  }
  else {
    posterImg = "https://image.tmdb.org/t/p/w342" + poster_path;
  }
  return posterImg
}


}); // !! close document ready !!
