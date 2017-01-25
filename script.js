var HandlebarsTemplateCache = {
  templates: {},
  get: function(selector) {
    var template = this.templates[selector];
    if (!template) {
      template = $(selector).html();
      template = Handlebars.compile(template);
      this.templates[selector] = template;
    }

    return template;
  }
}

$(document).ready(function() {
  var compiled = HandlebarsTemplateCache.get('#search-records-template');
  var context;
  var remoteUrlWithOrigin;
  var fsUrl;
  var pages;
  var content;
  var pageId;

  $("#searchBox").bind("enterKey", function(e) {
    remoteUrlWithOrigin = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=&list=search&meta=&titles=&srsearch=" + $("#searchBox").val() + "&sroffset=0&callback=?";
    $(".record").remove();
    $.ajax({
      url: remoteUrlWithOrigin,
      dataType: 'jsonp',
      headers: {
        'Api-User-Agent': 'Example/1.0'
      },
      success: function(data) {
        $("#randomArticle").css("margin-top", "0px");
        for (var i = 0; i < data.query.search.length; i++) {
          fsUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&list=&meta=&titles=" + data.query.search[i].title + "&exsentences=1&explaintext=1&exsectionformat=plain";
          $.ajax({
            url: fsUrl,
            dataType: 'jsonp',
            title: data.query.search[i].title,
            headers: {
              'Api-User-Agent': 'Example/1.0'
            },
            success: function(fsData) {
              pages = fsData.query.pages;
              content = pages[Object.keys(pages)[0]];
              pageId = content.pageid;
              context = {
                title: this.title,
                firstSentence: content.extract,
                pageId: pageId
              };
              $("#records").append(compiled(context));
            }
          });
        }
      }
    });
  });

  $("#searchBox").keyup(function(e) {
    if (e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });

});