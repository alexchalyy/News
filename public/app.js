// Grab the articles as a json

console.log("client running ok here");

$.getJSON("/articles", function (data) {
  // For each one
  console.log("inside dynamic div function.");
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    console.log(data[i]);
    if (!data[i].saved) {

      $("#articles").append("<div data-id = '" + data[i]._id + "'div class=\"card\"><div class=\"card-header\">" + data[i].title +

        "</div><div class=\"card-body\">" + "<p class=\"card-text\">" + data[i].summary + "</p><a href=\"" +

        data[i].link + "\" class=\"btn btn-primary\">" +

        "Article Link</a><a href=\"#\" class=\"btn btn-primary\" id = \"save\" data-id = '" + data[i]._id +

        "'>Save Article</a></div></div>");

    } else {

      $("#savedarticles").append("<div data-id = '" + data[i]._id + "'class=\"card\"><div class=\"card-header\">" + data[i].title +

        "</div><div class=\"card-body\">" + "<p class=\"card-text\">" + data[i].summary + "</p><a href=\"" +

        data[i].link + "\" id = \"delete\" class=\"btn btn-primary\">" +

        "Delete</a><a href=\"#\" class=\"btn btn-primary\" id = \"note\" data-id = '" + data[i]._id +

        "'>Notes</a></div></div>");
    }
  }
});

//----------------------------------------------------------------------------------

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

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
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//----------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------

$("#scrape").click(function () {
  // When scrape link is clicked, articles are scraped and page is reloaded.
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function (data) {
      location.reload();
    });
});

//----------------------------------------------------------------------------------

$("#clear").click(function () {
  // When clear link is clicked, articles are cleared and page is reloaded.
  $.ajax({
    method: "GET",
    url: "/clear"
  })
    // With that done, add the note information to the page
    .then(function (data) {
      location.reload();
    });
});

//------------------------------------------------------------------------------------

$(document).on("click", "#save", function () {

  //  This function moves article from home to saved page when "Save" button is clicked.

  var thisId = $(this).attr("data-id");

  console.log("this id is " + thisId);
  $.ajax({
    method: "PUT",
    url: "/save/" + thisId,
    data: true
  })
    .then(function (data) {
      console.log("works!");
      location.reload();
    });
});