// Grab the articles as a json

console.log("client running ok here");

var savenoteid;
var notecount = 0;

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

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  //$(document).on("click", "sn", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  //$("#comment").empty();
  // Save the id from the p tag
  //var thisId = $(this).attr("data-id");
  var thidID = savednoteid;
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      console.log("notes added to modal here");
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

function AddNote(note) {

  //  This function adds note to pop-up modal.

  notecount++;
  $("#notes").append("<div id = \"" + notecount +
    "n\" class=\"card\"><div class=\"card-body\"><button type=\"button\" id = \"" + notecount +
    "\" class=\"close\" aria-label=\"Close\">" + "<span aria-hidden=\"true\">&times;</span></button><p>" + note + "</p></div></div>");
  $("#comment").empty();

}

//----------------------------------------------------------------------------------

//  This function adds note to pop-up note window after save note button is clicked.

/*$(document).on("click", "#sn", function () {
  console.log("save note is called.");
  $("#comment").empty();
});*/

$("#sn").click(function () {
  console.log("save note is called.");
  console.log("saved note id: " + savenoteid);
  var note = $("#comment").val();
  console.log("saved note: " + note);

  if (note != "") {
    AddNote(note);
    //notecount++;

    /*
    $("#notes").append("<div id = \"" + notecount +
      "n\" class=\"card\"><div class=\"card-body\"><button type=\"button\" id = \"" + notecount +
      "\" class=\"close\" aria-label=\"Close\">" + "<span aria-hidden=\"true\">&times;</span></button><p>" + note + "</p></div></div>");
    $("#comment").empty();*/

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + savenoteid,
      data: {
        // Value taken from note textarea
        //body: $("#bodyinput").val()
        body: note
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        //$("#notes").empty();
      });
    /*$("#notes").append("<p>" + note + "</p><button type=\"button\" class=\"close\" aria-label=\"Close\">" + 
                       "<span aria-hidden=\"true\">&times;</span></button>");*/
    //location.reload();
    // Now make an ajax call for the Article
    /*$.ajax({
      method: "GET",
      url: "/articles/" + savenoteid
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        console.log("note return");
      });*/
  }
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
  $.ajax({
    method: "GET",
    url: "/articles/" + savenoteid
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log("Here is data");
      console.log(data);
      if (data.note) {
        AddNote(data.note.body);
      }
    });
    $("#myModal").modal();
});

//-------------------------------------------------------------------------------------

$(document).on("click", ".close", function () {
  console.log("close button is clicked.");
  var noteid = $(this).attr("id");
  console.log("note id is " + noteid);
  var nid = "#" + noteid + "n";
  console.log("nid is " + nid);
  $(nid).empty();
});
