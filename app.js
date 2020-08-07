let search = document.querySelector("input"),
    div = document.querySelectorAll("div")[2],
    a = document.querySelector(".again"),
    title = document.querySelector("h1"),
    link = document.querySelector("link");
    message = document.querySelector(".message");

    let style = document.createElement("link");

    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'style2.css');

search.addEventListener("keyup", async (e) => {
    if(e.keyCode == 13){
        try {
            let uri = `https://kitsu.io/api/edge/anime?filter[text]=${search.value}`;
            let res = await fetch(uri, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Accept': 'application/vnd.api+json'
                }
            });
            let anime = await res.json();
            filter(anime);
        } catch (err){
            console.log(err);
        }
    }
});

function filter(anime){
    let matches = anime['data'].filter(data => {
        let regex = new RegExp(`${data.attributes.canonicalTitle}`, 'gi');
        if(search.value.match(regex)){
            return data;
        }
    });
    if(matches.length > 0){
        getHtml(matches[0]);
    }else if(matches.length == 0){
        message.textContent = `Could Not Find ${search.value} Please Try Something else`;
    }
}

function getHtml(matched){
    styles();
    let animeDiv = document.createElement("div");
    animeDiv.classList.add("anime");
    animeDiv.innerHTML = `
    <img src="${matched.attributes.posterImage['medium']}">
    <a class="title">${matched.attributes.canonicalTitle}</a>
    <button class="btn">Show More</button>
    <div class="plot"></div>
    <ul>
        <li>Episodes: ${matched.attributes.episodeCount}</li>
        <li>Status: ${matched.attributes.status}</li>
        <li>Age Rating: ${matched.attributes.ageRating}</li>
    </ul>`;
    div.appendChild(animeDiv);

    buttonEvent(matched);
}

function styles(){
    search.style.display = "none";
    div.style.display = "block";
    title.style.display = "none";
    message.style.display = "none";
    message.textContent = null;
    if(document.head.contains(link)){
        document.head.replaceChild(style, link);
    }
}

// Event Listeners

a.addEventListener("click", () => {
    let animeDiv = document.querySelectorAll(".anime");
    div.style.display = "none";
    search.style.display = "block";
    title.style.display = "block";
    message.style.display = "block";
    if(document.head.contains(style)){
        document.head.replaceChild(link, style);
    }
    animeDiv.forEach(anime => {
        anime.remove();
    });
});

function buttonEvent(matched){
    let btn = document.querySelectorAll(".btn");
    let plot = document.querySelector(".plot");
    btn.forEach(button => {
        button.addEventListener("click", function(){
            if(this.textContent === "Show More"){
               plot.innerHTML = `<p class="plot">${matched.attributes.synopsis}</p>`;
               this.textContent = "Show less";
            }else if(this.textContent === "Show less"){
                plot.innerHTML = '';
                this.textContent = 'Show More';
            }
        });
    })
}