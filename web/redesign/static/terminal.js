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
    var avatar = document.getElementById("avatar")
    var footer = document.getElementById("footer")
    var toggleButton = document.getElementById("toggle-dark")
    var toggleButtonIcon = document.getElementById("toggle-dark-icon")

    // First, check if it's already enabled.
    if (body.classList.contains("dark")) {
        // It is enabled, so disable it.
        body.classList.remove("dark")
        footer.classList.remove("dark")
        body.classList.add("light")
        footer.classList.add("light")
        // Set the avatar to the non-transparent ASCII one (only if Linux mode is enabled)
        if (avatar.src.includes("transparentAscii")) {
            avatar.src = "/bleeding/avatar/ascii"
        }
        // TODO - Fancy gradient animation while toggling

        toggleButtonIcon.classList.remove("fa-moon")
        toggleButtonIcon.classList.add("fa-sun")
    } else {
        // It is disabled, so enable it.
        body.classList.add("dark")
        footer.classList.add("dark")
        body.classList.remove("light")
        footer.classList.remove("light")
        // Set the avatar to the transparent ASCII one (only if Linux mode is enabled)
        if (avatar.src.includes("transparentAscii")) {
            avatar.src = "/bleeding/avatar/transparentAscii"
        }
        // TODO - Fancy gradient animation while toggling
        toggleButtonIcon.classList.remove("fa-sun")
        toggleButtonIcon.classList.add("fa-moon")
    }

    // TODO - Light switch noise when toggling
}