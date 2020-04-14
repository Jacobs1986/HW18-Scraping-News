console.log("The file is linked up!")

$.getJSON("/articles", data => {
    console.log(data);
    data.forEach(article => {
        let card = $("<div>").addClass("row");
        card.append(`<h4 id='${article._id}'>${article.title}</h4>`);
        card.append(`<p>${article.summary}</p>`);
        card.append(`<a target="_blank" href='${article.link}'>Click here for full article</a>`)
        $("#article-list").append(card);
    })
})

$(document).on("click", "h4", function() {
    $("#notes").empty();
    var thisId = $(this).attr("id");
    console.log(`The id for this article is ${thisId}`);

    // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
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
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
})