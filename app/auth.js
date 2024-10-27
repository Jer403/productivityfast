
// Variables

const logCase = document.getElementById("log-case");

const switchBtns = document.querySelectorAll(".switch-btn");

const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");

const loginSwitchBtn = document.getElementById("login-switch-btn");
const registerSwitchBtn = document.getElementById("register-switch-btn");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

const nameLogin = document.getElementById("mid-box_name-input-login");
const passwordLogin = document.getElementById("mid-box_password-input-login");

const nameRegister = document.getElementById("mid-box_name-input-register");
const passwordRegister = document.getElementById("mid-box_password-input-register");
const password2Register = document.getElementById("mid-box_password2-input-register");
const emailRegister = document.getElementById("mid-box_email-input-register");
const keep = document.getElementById("keep");

const keepLabel = document.querySelector(".keep-label");

let campos = {};

let values = ["home", "todo", "network", "projectmanager"];

// Event Listeners

switchBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        clean();
        cleanLog();
        if (e.currentTarget.dataset.id == "login") {
            clickLogin();
        } else if (e.currentTarget.dataset.id == "register") {
            clickRegister();
        }
    });
})


backBtn.addEventListener("click", () => {
    backFunction();
})


nextBtn.addEventListener("click", (e) => {
    if (e.currentTarget.dataset.id == "login") {
        let campo = crearCampos("login", campos);
        auth(validateLogin(campo), campo);
    } else if (e.currentTarget.dataset.id == "register") {
        let campo = crearCampos("register", campos);
        register(validateRegister(campo), campo);
    }

})

window.addEventListener("load", () => {
    checkSignup();
    checkLang();
})

keepLabel.addEventListener("click", (e) => {
    e.currentTarget.previousElementSibling.checked = !e.currentTarget.previousElementSibling.checked;
})


// Functions

// validates login data
function validateLogin(campo) {
    cleanLog();
    let logMessage = "";
    if (campo.password == "") { logMessage += `<h1 class= "log-message">Escriba su contraseña</h1>` };
    if (campo.username.lengt < 4) { logMessage += `<h1 class= "log-message">El nombre debe de tener mínimo 4 caracteres</h1>` };
    if (campo.username == "") { logMessage += `<h1 class= "log-message">Escriba su nombre</h1>` };
    if (logMessage != "") {
        aggLog(logMessage);
        getRed();
        return false
    };
    return true;
}

// validates register data
function validateRegister(campo) {
    cleanLog();
    let logMessage = "";
    if (checkEmail(campo.email)) logMessage += `<h1 class="log-message">El email es incorrecto</h1>`;
    if (passwordRegister.value != password2Register.value) logMessage += `<h1 class="log-message">Las contraseñas no coinciden</h1>`;
    if (campo.password == "") logMessage += `<h1 class="log-message">Ponga su contraseña</h1>`;
    if (campo.username.length < 4) logMessage += `<h1 class="log-message">El nombre debe de tener mínimo 4 caracteres</h1>`;
    if (campo.username == "") logMessage += `<h1 class="log-message">Ponga su nombre</h1>`;
    if (logMessage != "") {
        aggLog(logMessage);
        getRed();
        return false
    };
    return true;
}


//cleans the switch buttons
function clean() {
    loginSwitchBtn.classList.remove("actual")
    registerSwitchBtn.classList.remove("actual")
    loginBox.classList.remove("hide")
    registerBox.classList.remove("hide")
    nextBtn.dataset.id = "";
}


// authentication
async function auth(bool, campos) {
    if (bool) {
        const peticion = await fetch("http://localhost:8080/auth/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campos)
        });
        peticion.json().then(data => {
            if ((data.token != undefined || data.token != null) && data.error == null) {
                eliminarCookie("keep")
                crearCookie(`hs=${data.token}`, 2);
                if (keep.checked) crearCookie(`keep=true`, 365);
                cleanInput()
                getGreen();
                aggLog(`<h1 class="log-message">Inicio de sesión realizado exitosamente</h1>`);
                nextFunction();
                setTimeout(() => {
                    cleanLog();
                }, 10000)
            } else if (data.error != null) {
                if (data.error == "usernameNotFound") {
                    getRed();
                    aggLog(`<h1 class="log-message">Ese usuario no existe</h1>`);
                }
                else if (data.error == "unableToAuthenticate") {
                    getRed();
                    aggLog(`<h1 class="log-message">El usuario o la contraseña son incorrectos</h1>`);
                }
                else {
                    getRed();
                    aggLog(`<h1 class="log-message">Ha ocurrido algun error</h1>`);
                }
            }
            console.log(data)
        });
    }

}

// register a new account
async function register(bool, datos) {
    if (bool) {
        const peticion = await fetch("http://localhost:8080/auth/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        peticion.json().then(data => {
            if ((data.token != undefined || data.token != null) && data.error == null) {
                eliminarCookie("keep")
                crearCookie(`hs=${data.token}`, 2);
                if (keep.checked) crearCookie(`keep=true`, 365);
                cleanInput()
                getGreen();
                aggLog(`<h1 class="log-message">Cuenta creada correctamente</h1>`);
                nextFunction();
                setTimeout(() => {
                    cleanLog();
                }, 10000)
            } else if (data.error != null) {
                if (data.error == "DuplicatedUserKey") {
                    getRed();
                    aggLog(`<h1 class="log-message">El nombre ya esta en uso, elija otro por favor</h1>`);
                }
                else if (data.error == "DuplicatedEmailKey") {
                    getRed();
                    aggLog(`<h1 class="log-message">El email ya esta en uso, elija otro por favor</h1>`);
                }
                else {
                    getRed();
                    aggLog(`<h1 class="log-message">Ha ocurrido algun error</h1>`);
                }
            }
            console.log(data);
        });
    }

}

function nextFunction() {
    let from = getUrlParams("from");

    if (from != null && values.indexOf(from) > -1) {
        location.href = "https://productivityfast.pages.dev/" + from;
    } else {
        location.href = "https://productivityfast.pages.dev/home";
    }
}

function backFunction() {
    let from = getUrlParams("from");
    if (from != null && values.indexOf(from) > -1) {
        location.href = "https://productivityfast.pages.dev/" + from;
    } else {
        location.href = "https://productivityfast.pages.dev/home";
    }
}

function checkSignup() {
    let signup = getUrlParams("signup");
    if (signup == "true") {
        clean();
        cleanLog();
        clickRegister();
    }
}


function checkLang() {
    if (localStorage.getItem("lang") == "es") {
        const langElements = document.querySelectorAll(".lang");

        langElements.forEach((e) => {
            e.textContent = e.getAttribute("es");
        })

        const langInput = document.querySelectorAll(".lang-i");

        langInput.forEach((e) => {
            e.placeholder = e.getAttribute("es");
        })

    }
}


// mini functions

function getUrlParams(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function checkEmail(email) {
    let arrobas = 0;
    let ultimos = "" + email[email.length - 4] + email[email.length - 3] + email[email.length - 2] + email[email.length - 1];
    for (let i = 0; i < email.length; i++) {
        if (email[i] == "@") {
            arrobas++;
        }
    }
    if (ultimos == ".com" && (arrobas < 2 && arrobas > 0)) {
        return false;
    }
    return true;
}

function crearCampos(accion, campo) {
    campo.tiempo = "" + keep.checked;
    if (accion == "login") {
        campo.username = nameLogin.value;
        campo.password = passwordLogin.value;
        return campo;
    } else if (accion == "register") {
        campo.username = nameRegister.value;
        campo.password = passwordRegister.value;
        campos.email = emailRegister.value;
        campos.projects = "PUTAAS";
        return campo;
    }
}

function cleanInput() {
    const inputs = document.querySelectorAll(".mid-box_input");
    inputs.forEach((i) => {
        i.value = "";
    })
}

function newFechaUTC(dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
    return fecha.toUTCString();
}

function crearCookie(name, dias) {
    exp = newFechaUTC(dias);
    document.cookie = `${name};expires=${exp}`;
}

function crearSessionCookie(name) {
    document.cookie = `${name};expires=session`;
}

function obtenerCookie(cookieName) {
    let cookies = document.cookies;
    cookies = cookies.split(";");
    for (let i = 0; cookies.lenght > i; i++) {
        cookie = cookies[i].trim();
        if (cookie.starsWith(cookieName)) {
            return cookie.split("=")[1];
        } else {
            "No se ha encontrado una cookie con ese nombre"
        }
    }
}

function eliminarCookie(cookieName) {
    document.cookie = `${cookieName}=0;max-age=0`
}


function getGreen() {
    logCase.classList.remove("red", "disappear");
    logCase.classList.add("green", "move");
}

function getRed() {
    logCase.classList.remove("green", "disappear");
    logCase.classList.add("red", "move");
}

function cleanLog() {
    logCase.classList.remove("move");
    logCase.classList.add("disappear");
}

function aggLog(text) {
    logCase.innerHTML = text;
}


function clickLogin() {
    loginSwitchBtn.classList.add("actual")
    registerBox.classList.add("hide")
    nextBtn.dataset.id = "login";
    if (localStorage.getItem("lang") == "es") {
        nextBtn.textContent = "Entrar";
        return;
    }
    nextBtn.textContent = "Log in";
}

function clickRegister() {
    console.log("1")
    registerSwitchBtn.classList.add("actual")
    loginBox.classList.add("hide")
    nextBtn.dataset.id = "register";
    if (localStorage.getItem("lang") == "es") {
        nextBtn.textContent = "Crear cuenta";
        return;
    }
    nextBtn.textContent = "Create account"
}