
$( document ).ready(function() {
    
    var artistName = "";
    var savedSearches = [];
        if (localStorage.getItem('savedSearches') !== null) {
            savedSearches = JSON.parse(localStorage.getItem('savedSearches'));  
        } 
    

    $(document).on('keypress',function(event) {
        if(event.which == 13) {
            event.preventDefault();
            artistName = $("#getArtistName").val().trim();
            getBand();
        }
    });
    $("#topNavSearch").on("click", function(event) {
        event.preventDefault();
        artistName = $("#getArtistName").val().trim();
        getBand();
    });

    $("#loveThisBand").on("click", function(e) {
        e.preventDefault();
        myFavorites()
    });


    // function myFavorites() {
    //     var loveTheseGuys = $("#bandName").text
    //     var favoriteBands = {
    //         name: loveTheseGuys,
    //         value: ""
    //     }
    //     console.log(loveTheseGuys)
    //     console.log(favoriteBands)
    //     savedSearches.unshift(favoriteBands)
    //     localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
    //     $(".dropdown-header").empty();
    //     for (i=0; i<savedSearches.length; i++) {
    //         var newAnchor = $("<a>", {"class": "dropdown-item"})
    //         $(".dropdown-header").append(newAnchor);
    //         newAnchor.text(savedSearches[i]);
    //     }
    // }



    function getBand() {
        var lastFMURLbio = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&api_key=7ee5b384da21658ce5fd68901750d490&format=json";        
        var lastFMURLTopTracks = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artistName + "&api_key=7ee5b384da21658ce5fd68901750d490&format=json";
        var lastFMURLTopAlbum = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + artistName + "&api_key=7ee5b384da21658ce5fd68901750d490&format=json";
        var tasteURL = "https://tastedive.com/api/similar?q=" + artistName + "&k=353205-Lively-TT1A0QYZ&verbose=1"
        $.ajax({
            url: lastFMURLbio,
            method: "GET"
        }).then(function(response) {
            $("h4").remove();
            var theBand = $("<h4>", {"class": "ml-2 d-inline-block my-auto"});
            $("#bandName").append(theBand)
            theBand.empty()
            theBand.text(response.artist.name);
            var bandBioTest = response.artist.bio.content;
            bandBioTest = bandBioTest.split(', C')[0];
            console.log(bandBioTest)
            if (bandBioTest === "WRONG NAME") {
                bandBioTest = "Sorry, this artist is lacking an up to date Bio."
                $("#bandBio").text(bandBioTest)
            }
            else {
                $("#bandBio").text(response.artist.bio.content);
            }
            console.log(response.artist.name);
            console.log(response.artist.bio.content);
            $.ajax({
                url: lastFMURLTopTracks,
                method: "GET"
            }).then(function(response) {
                var trackGold = response.toptracks.track[0].name;
                var scrobblesOne = response.toptracks.track[0].playcount;
                var trackSilver = response.toptracks.track[1].name;
                var scrobblesTwo = response.toptracks.track[1].playcount;
                var trackBronze = response.toptracks.track[2].name;
                var scrobblesThree = response.toptracks.track[2].playcount;
                $(".oneTrack").text(trackGold);
                $(".oneScrobble").text (scrobblesOne + " times!");
                $(".twoTrack").text(trackSilver);
                $(".twoScrobble").text (scrobblesTwo + " times!");
                $(".threeTrack").text(trackBronze);
                $(".threeScrobble").text (scrobblesThree + " times!");
                $.ajax({
                    url: lastFMURLTopAlbum,
                    method: "GET"
                }).then(function(response) {
                    var albumName = response.topalbums.album[0].name;
                    var lastFMURLAlbumInfo = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + artistName + "&album=" + albumName + "&api_key=7ee5b384da21658ce5fd68901750d490&format=json"
                    console.log(response.topalbums.album[0].name)
                    $.ajax({
                        url: lastFMURLAlbumInfo,
                        method: "GET"
                    }).then(function(response) {
                        var albumImg = response.album.image[2]["#text"];
                        $("#topAlbum").attr("src", albumImg)
                        console.log(albumImg)
                        // document.querySelector("#kvov2 > span.blockInner > span:nth-child(3) > span.blockInner > span:nth-child(1) > span.s > span > a")
                                                    $.ajax({
                                                        url: tasteURL,
                                                        crossOrigin: true,
                                                        dataType: "jsonp",
                                                        method: "GET"
                                                    }).then(
                                                        $.ajax({
                                                            url: tasteURL,
                                                            crossOrigin: true,
                                                        dataType: "jsonp",
                                                            method: "GET"
                                                        }).then(function(response) {
                                                            var similarArtistOne = response.Similar.Results[0].Name;
                                                            var similarArtistTwo = response.Similar.Results[1].Name;
                                                            var similarArtistThree = response.Similar.Results[2].Name;
                                                            var mainSearchArtistYURL = response.Similar.Info[0].yUrl;
                                                               $("#youtube-left").attr("data-theVideo", "mainSearchArtistYURL");
                                                            console.log(response.Similar)

                                                        }));
                
                });
            });
        });
    });
};
});

autoPlayYouTubeModal();

//FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
function autoPlayYouTubeModal() {
    var trigger = $("body").find('[data-toggle="modal"]');
    trigger.click(function () {
        var theModal = $(this).data("target"),
            videoSRC = $(this).attr("data-theVideo"),
            videoSRCauto = videoSRC + "?autoplay=1";
        $(theModal + ' iframe').attr('src', videoSRCauto);
        $(theModal + ' button.close').click(function () {
            $(theModal + ' iframe').attr('src', videoSRC);
        });
    });
}

