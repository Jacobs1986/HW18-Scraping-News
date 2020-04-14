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