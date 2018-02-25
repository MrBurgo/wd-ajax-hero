(function () {
  'use strict';

  const movies = [];

  const renderMovies = function () {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };
  // ADD YOUR CODE HERE
  // EVENT LISTENER TO FILL PAGE ON BUTTON CLICK
  $('.btn-large').on('click', function (event){
    event.preventDefault();

    // START BY EMPTYING THE MOVIES ARRAY, IF ANY MOVIES WERE ALREADY POPULATED
    movies.length = 0;

    // GET JSON BASED ON USER INPUT IN SEARCH BOX
    var input = $('#search').val();
    var $xhr = $.getJSON(`https://omdb-api.now.sh/?s=${input}`)

    // ONCE JSON HAS BEEN RETURNED, BEGIN BUILDING THE INDIVIDUAL MOVIE OBJECTS. ONLY CONTINUES OF STATUS CODE RETURNED IS 200.
    $xhr.done(() => {
      let results = $xhr.responseJSON.Search;
      if ($xhr.status !== 200){
        return;
      } else {
        for (let i = 0; i < results.length; i++){
          let movie = results[i];
          let obj = {};
          let id = movie.imdbID;

          // POPULATES INDIVIDUAL MOVIE OBJECTS WITH ID, POSTER, TITLE, AND YEAR KEY VALUE PAIRS.
          obj.id = movie.imdbID;
          obj.poster = movie.Poster;
          obj.title = movie.Title;
          obj.year = movie.Year;

          // SEARCHES FOR A NEW JSON OBJECT BASED ON EACH MOVIE'S UNIQUE ID
          let $newURL = $.getJSON(`https://omdb-api.now.sh/?i=${id}&plot=full`);

          // ONCE OBJECT IS RETURNED, POPULATES ALREADY EXISTING OBJECTS WITH NEW KEY VALUE PAIR FOR PLOT INFO. ONCE POPULATED, PUSHES OBJECT INTO MOVIES ARRAY AND RENDERS PAGE.
          $newURL.done(() => {
            if ($newURL.status !== 200){
              return;
            } else {
              let plot = $newURL.responseJSON.Plot;
              obj.plot = plot
              movies.push(obj);
              renderMovies();
            }
          })
        }
      }
    })
  })
})();
