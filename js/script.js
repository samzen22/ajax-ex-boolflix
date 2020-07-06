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
      searchFilmTvSeries(filmTvSearched, 'movie')
      searchFilmTvSeries(filmTvSearched, 'tv')
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
// ------ type: tipo di ricerca (tv o movies)
function searchFilmTvSeries(filmTvSearched, type) {
  if (type === 'movie') {
    var url = 'https://api.themoviedb.org/3/search/movie'
  } else if (type === 'tv'){
    url = 'https://api.themoviedb.org/3/search/tv'
  }
  $.ajax({
    url: url,
    method: 'GET',
    data: {
      api_key: '9223e97f95bb1fdb0b5ae958392fe3c8',
      query: filmTvSearched, // variabile con all'interno il valore dell'input
      language: 'it-IT'
    },
    success: function(data) {
      var arrayFilmTv = data.results;
      // richiamo la funzione handlebars per stampare a
      // schermo tutti i film/serie tv che contengono la ricerca dell'utente
      printFilmTvSeries(arrayFilmTv, type)
    },
    error: function() {
      alert('Errore')
    }
  });
}


// funzione handlebars per stampare i film trovati
// ----arrayFilmTv: array richiamato da api Ajax
//-----type: film o tv per url
function printFilmTvSeries(arrayFilmTV, type) {
  var source = $("#film-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrayFilmTV.length; i++) {
    var singoloFilmTv = arrayFilmTV[i];

    var singleId = singoloFilmTv.id
    //stampa solo film e serietv
    // stampo con handlebars le chiavi che mi interessano
    var context =
    {
      poster: posterOrNot(singoloFilmTv.poster_path),
      title: singoloFilmTv.title || singoloFilmTv.name,
      titleOriginal: singoloFilmTv.original_title || singoloFilmTv.original_name,
      language: flags(singoloFilmTv.original_language),
      vote: starsVote(singoloFilmTv.vote_average),
      overview: singoloFilmTv.overview,
      movie_id: singoloFilmTv.id
    };
    var html = template(context);
    $('.list-film').append(html);

    getGenere(singleId, type);
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
// ------ return, flagLanguage: utilizzo sito api countryflags. inserisco codice
//        language all'interno dell'url.
function flags(language) {
  if (language === 'en') {
    var flagLanguage = '<img src="https://www.countryflags.io/gb/shiny/64.png">';
  } else {
    flagLanguage = '<img src="https://www.countryflags.io/'+ language +'/shiny/64.png">';
  }
  return flagLanguage
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
  if (poster_path === null){
    posterImg = "img/poster-null.jpg"
  }
  else {
    posterImg = "https://image.tmdb.org/t/p/w342" + poster_path;
  }
  return posterImg
}


// funzione con chiamata all'API  per prendere il genere di film/serie tv
// ----id: argomento id che serve per prendere il genere
//-----type: film o tv per url
function getGenere(id, type) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/'+ type +'/' + id,
    method: 'GET',
    data: {
      api_key: '9223e97f95bb1fdb0b5ae958392fe3c8',
      language: 'it-IT'
    },
    success: function(data) {
      var objectGenre = data.genres;
      printGenres(objectGenre, id)
    },
    error: function() {
      alert('Errore')
    }
  });
}

// template handlebars per stampare il genere
// ---- objectGeneri: array di oggetti con id e nome del genere
function printGenres(objectGeneri, id) {
  var source = $("#genere-template").html();
  var template = Handlebars.compile(source);

  var dataId = $('.film[data-id="'+ id +'"]');
  var arrayGenres = [];

  for (var i = 0; i < objectGeneri.length; i++) {
    var singleGenre = objectGeneri[i];
    var genre = singleGenre.name;
    arrayGenres.push(genre)
  }
  var context =
  {
    generi: arrayGenres
  };

  var html = template(context);
  dataId.find('.genere').append(html);
}


}); // !! close document ready !!
