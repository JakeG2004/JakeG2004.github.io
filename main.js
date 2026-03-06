var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
    highlightCurrentPageButton();
}
ready(() => {
    try {
        document.querySelector(".header").style.height = window.innerHeight + "px";
    } catch (error) {
        
    }
})

function highlightCurrentPageButton()
{
    const curPath = document.URL;
    const curPage = curPath.split("/")[3].split(".")[0];

    var navButton = document.getElementById(curPage);

    console.log(navButton);
    if(!navButton)
    {
        return;
    }

    navButton.classList.add("current-page");
}