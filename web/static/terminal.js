function toggleLinux () {
    // Toggle the nerd-y aesthetic
    var aboutMe = document.getElementById("about-me")
    var avatar = document.getElementById("avatar")
    var projectsAbout = document.getElementById("projects-about")
    var projectsFrostbyte = document.getElementById("projects-frostbyte")
    var projectsTWB = document.getElementById("projects-theworldsbreak")
    var contactMe = document.getElementById("contact-me")
    var socials = document.getElementById("socials")
    var toggleButton = document.getElementById("toggle-linux")
    var toggleButtonIcon = document.getElementById("toggle-linux-icon")

    // First, check if it's already enabled.
    if (avatar.src.toLowerCase().includes("ascii")) {
        // It is enabled, so disable it.
        avatar.src = "/bleeding/avatar/normal"
        aboutMe.innerHTML = "About Me"
        projectsAbout.innerHTML = "Projects"
        projectsFrostbyte.innerHTML = "Frostbyte"
        projectsTWB.innerHTML = "The World's Break"
        contactMe.innerHTML = "Contact Me"
        socials.innerHTML = "Socials"
        // TODO - Fancy gradient animation while toggling
        toggleButtonIcon.classList.remove("fa-terminal")
        toggleButtonIcon.classList.add("fa-desktop")
    } else {
        // It is disabled, so enable it.
        avatar.src = "/bleeding/avatar/transparentAscii"
        aboutMe.innerHTML = "~/about-me.txt"
        projectsAbout.innerHTML = "~/projects/about.txt"
        projectsFrostbyte.innerHTML = "~/projects/frostbyte.txt"
        projectsTWB.innerHTML = "~/projects/the-worlds-break.txt"
        contactMe.innerHTML = "~/contact-me.txt"
        socials.innerHTML = "~/socials.txt"
        // TODO - Fancy gradient animation while toggling
        toggleButtonIcon.classList.remove("fa-desktop")
        toggleButtonIcon.classList.add("fa-terminal")
    }
}

function toggleDark() {
    // Toggle the dark mode
    var body = document.getElementById("body")
    var html = document.getElementById("html")
    var avatar = document.getElementById("avatar")
    var footer = document.getElementById("footer")
    var toggleButton = document.getElementById("toggle-dark")
    var toggleButtonIcon = document.getElementById("toggle-dark-icon")

    // First, check if it's already enabled.
    if (body.classList.contains("dark")) {
        // It is enabled, so disable it.
        body.classList.remove("dark")
        html.classList.remove("dark")
        footer.classList.remove("dark")
        body.classList.add("light")
        html.classList.add("light")
        footer.classList.add("light")
        // TODO - Fancy gradient animation while toggling

        toggleButtonIcon.classList.remove("fa-moon")
        toggleButtonIcon.classList.add("fa-sun")
    } else {
        // It is disabled, so enable it.
        body.classList.add("dark")
        html.classList.add("dark")
        footer.classList.add("dark")
        body.classList.remove("light")
        html.classList.remove("light")
        footer.classList.remove("light")
        // TODO - Fancy gradient animation while toggling
        toggleButtonIcon.classList.remove("fa-sun")
        toggleButtonIcon.classList.add("fa-moon")
    }

    // TODO - Light switch noise when toggling
}

function toggleFooter() {
    // Toggle the footer
    var footer = document.getElementById("footer")
    var toggleButton = document.getElementById("toggle-footer")
    var toggleButtonIcon = document.getElementById("toggle-footer-icon")

    // First, check if it's already enabled.
    if (footer.classList.contains("hidden")) {
        // It is enabled, so disable it.
        footer.classList.remove("hidden")
        toggleButtonIcon.classList.remove("fa-angle-up")
        toggleButtonIcon.classList.add("fa-angle-down")
    } else {
        // It is disabled, so enable it.
        footer.classList.add("hidden")
        toggleButtonIcon.classList.remove("fa-angle-down")
        toggleButtonIcon.classList.add("fa-angle-up")
    }
}

// Auto toggle dark mode if the user has dark mode enabled
if (window.matchMedia && !(window.matchMedia('(prefers-color-scheme: dark)')).matches) {
    toggleDark()
}
