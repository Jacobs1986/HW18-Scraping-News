// Functions

// Styling the article list
function articleStyling(article) {
  let card = $("<div>").addClass("row");
  card.append(`<h4 id='${article._id}'>${article.title}</h4>`);
  card.append(`<p>${article.summary}<br><a target="_blank" href='${article.link}'>Click here for full article</a></p>`);
  // card.append(`<a target="_blank" href='${article.link}'>Click here for full article</a>`)
  $("#article-list").append(card);
}


$.getJSON("/articles", data => {
  let dateArray = [];
  data.forEach(article => {
    if (dateArray.indexOf(article.date) === -1) {
      dateArray.push(article.date);
    };
  })
  console.log(dateArray);
})

$("#get-articles").on("click", event => {
  console.log("Button was clicked");
  $("#article-list").empty();
  $.ajax({
    method: "GET",
    url: "/scrape",
    success: function() {
      $.ajax({
        method: "GET",
        url: "/articles/date"
      }).then(data => {
        console.log(data);
        data.forEach(article => {
          articleStyling(article);
        })
      })
    }
  })
});


$(document).on("click", "h4", function () {
  $("#notes").empty();
  $("#note-entries").empty();
  var thisId = $(this).attr("id");
  console.log(`The id for this article is ${thisId}`);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        console.log(data.note);
        data.note.forEach(note => {
          let card = $("<div>");
          card.append(note.title);
          card.append(`<p>${note.body}</p>`);
          $("#note-entries").append(card);
        })
      }
    });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
})