// Grab the articles as a json

console.log("client running ok here");

var savenoteid;
var notecount = 0;

//  This function prints all scraped articles when page is loaded.

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

      console.log("saved article is added");

      $("#savedarticles").append("<div data-id = '" + data[i]._id + "'class=\"card\"><div class=\"card-header\">" + data[i].title +

        "</div><div class=\"card-body\">" + "<p class=\"card-text\">" + data[i].summary + "</p><a href=\"" +

        data[i].link + "\" id = \"delete\" class=\"btn btn-primary\" data-id = '" + data[i]._id + "'>" +

        "Delete</a><a href=\"#\" class=\"btn btn-primary\" id = \"note\" data-id = '" + data[i]._id +

        "'>Notes</a></div></div>");
    }
  }
});

//----------------------------------------------------------------------------------

function AddNote(data) {

  //  This function adds note to pop-up modal.

  console.log("add note is opened.");
  console.log("notes length is " + data.notes.length);
  console.log("notes are " + data.notes);
  console.log("first note is " + data.notes[0]);
  for (var c = 0; c < data.notes.length; c++) {
    $("#notes").append("<div id = \"" + c +
    "n\" class=\"card\"><div class=\"card-body\"><button type=\"button\" id = \"" + c + "\" data-id = \"" + savenoteid +
    "\" note = \"" + data.notes[c] + 
    "\" class=\"close btn pull-right\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><p>" + data.notes[c] + 
    "</p></div></div>");
  }

}

//----------------------------------------------------------------------------------

//  This function adds note to pop-up note window after save note button is clicked.

$("#sn").click(function () {
  var n = $("#comment").val();
  var note = n;

  $("#notes").empty();
  console.log("save note is called.");
  console.log("saved note id: " + savenoteid);
  console.log("saved note: " + n);
  if (note != "") {
    // Run a POST request to change the note, using what's entered in the inputs
    console.log("save note that is being sent is below");
    console.log(note);
    $.ajax({
      method: "POST",
      url: "/notes/save/" + savenoteid,
      data: {
        text: note
      }
    }).done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        location.reload();
    });
  }
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

//------------------------------------------------------------------------------------

$(document).on("click", "#delete", function () {

  //  When delete button is clicked, this function deletes the article.

  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  })
    .then(function (data) {
      location.reload();
    });
});

//-------------------------------------------------------------------------------------

//  This function opens pop-up window with option to make notes for an article when article notes button is clicked.

$(document).on("click", "#note", function () {
  savenoteid = $(this).attr("data-id");
  console.log("save note id is when notes button is clicked: " + savenoteid);
  $.ajax({
    method: "GET",
    url: "/articles/" + savenoteid
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $("#notes").empty();
      console.log("Here is data");
      console.log(data);
      //console.log("note id is " + data.note._id);
      if (data.notes) {
        console.log("data has notes!");
        AddNote(data);
      }
    });
    $("#myModal").modal();
});

//-------------------------------------------------------------------------------------
//  This function removes note from db and modal when close button is clicked.

$(document).on("click", ".close", function () {
  var noteid = $(this).attr("id");
  var articleid = $(this).attr("data-id");
  var articlenote = $(this).attr("note");

  console.log("close button is clicked.");
  console.log("note id is " + noteid);
  console.log("article id is " + articleid);
  console.log("note is " + articlenote)
  $.ajax({
    method: "DELETE",
    url: "/deleteNote/" + articleid,
    data: {
      note: articlenote
    }
  })
    .then(function (data) {
      location.reload();
    });
});
