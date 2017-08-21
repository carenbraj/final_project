
  var $newsSource = $('#source');
  var $searchSection = $('#search');
  var $mainSection = $('#main')

  var $popUp = $('#popUp');
  var $closePopUp = $('.closePopUp');

//function to set parameters
  function newArticle(articleObj) {
    this.image = articleObj.image
    this.title = articleObj.title;
    this.link = articleObj.link;
    this.description = articleObj.description;

  }

  // Function constructs html
  function addArticle(article){
      var mainDisplay =
          '<article class="article">' +
              '<section class="featuredImage">' +
                  '<img src='+article.image+' alt="" />' +
              '</section>' +
              '<section class="articleContent">' +
                  '<a href="'+article.link+'"><h3>'+article.title+'</h3></a>' +
                  '<p class = "description">'+article.description+'</p>'+
                  //'<h6>'+article.category+'</h6>' +
              '</section>' +
              //'<section class="impressions">'+article.impressions+'</section>' +
          '<div class="clearfix"></div>' +
          '</article>';

      $mainSection.append(mainDisplay);
  }

  function displayPopUp(article){
          var $title= article.html();
          var $link= article.parent().attr("href");
          var $linkshare= "https://www.facebook.com/sharer/sharer.php?u="+$link;
          var $article = article.closest('article');
          var $desc=$article.find('.description').html()

          $popUp.find('h1').html($title);
          $popUp.find('p').html($desc);
          $popUp.find('#seeArticle').attr("href", $link);
          $popUp.find('#shareArticle').attr("href", $linkshare);
          $popUp.removeClass('loader hidden');

  }

  //Closes popUp when x is clicked
  $closePopUp.on('click', function(e) {
      e.preventDefault();
      $popUp.addClass("loader hidden")

  })

  //The main feedr functionality
$(function(){


  $('nav ul ul a').on("click", function(e) {
      e.preventDefault();

      //loader hidden
      $popUp.removeClass('hidden');
      $mainSection.html('');
      $source = $(this).html();
      $newsSource.html($source);

      //alert($source);

      //Function that fetches articles based on selected criteria (BBC, NYT, WP)
      if($newsSource.html() === 'BBC News'){

        $.get(config.BBCApi,function(response){
            $popUp.addClass('hidden')
            var articles = response.articles;
            for(var i =0; i<articles.length; i++ ){
                var curr = articles[i];
                var article = new newArticle(
                    {
                        image: curr.urlToImage,
                        title: curr.title,
                        link: curr.url,
                        description: curr.description
                    });
                addArticle(article);
            }

             $(".article .articleContent h3").on('click',function(e){
                e.preventDefault();
                displayPopUp($(this));

            })

        });

      }

      else if($newsSource.html() === 'New York Times'){
          $.get(config.NYTApi,function(response) {
              $popUp.addClass('hidden')
              console.log(response);
              var articles = response.results;
              for (var i = 0; i < articles.length; i++) {
                  var curr = articles[i];
                  //alert(curr);
                  var imgurl = ''
                  if (curr.multimedia)
                    imgurl = curr.multimedia[0].url;

                  var article = new newArticle(
                      {
                          image: imgurl,
                          title: curr.title,
                          link: curr.url,
                          description: curr.abstract
                      }
                  );
                  addArticle(article);
              }

              $(".article .articleContent h3").on('click',function(e){
                e.preventDefault();
                displayPopUp($(this));
            })
          });
      }

      //WP api
      else{
          $.get(config.WPApi, function(response){
              $popUp.addClass('hidden')
              console.log(response);
              var articles = response.articles;
              for (var i = 0; i < articles.length; i++) {
                  var curr = articles[i];
                  var article = new newArticle(
                      {
                          image: curr.urlToImage,
                          title: curr.title,
                          link: curr.url,
                          description: curr.description
                      }
                  );
                  addArticle(article);

              }
              $(".article .articleContent h3").on('click',function(e){
                e.preventDefault();
                displayPopUp($(this));

            })
          })
      }
  });
});
