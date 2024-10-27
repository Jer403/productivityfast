// CREATING THE DATA STRUCTURES	AND UTILS ------------------------------------------------

function newFechaUTC(dias) {
	let fecha = new Date();
	fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
	return fecha.toUTCString();
}

function crearCookie(name, dias) {
	exp = newFechaUTC(dias);
	document.cookie = `${name};expires=${exp}`;
}

function obtenerCookie(cookieName) {
	let cookies = document.cookie;
	cookies = cookies.split(";");
	for (let i = 0; cookies.length > i; i++) {
		let cookie = cookies[i].trim();
		if (cookie.startsWith(cookieName)) {
			return cookie.split("=")[1];
		} else {
			"No se ha encontrado una cookie con ese nombre"
		}
	}

}

function crearSessionCookie(name) {
	document.cookie = `${name};expires=session`;
}

function eliminarCookie(cookieName) {
	document.cookie = `${cookieName}=0;max-age=0`
}

function getLang() {
	let lang = localStorage.getItem("lang");
	if (lang != "es" && lang != "en") {
		return "en";
	}
	return lang;
}

function replace(string, textToR, textR) {
	let stringMod;
	if (string != null) {
		stringMod = string[0];
		for (let i = 0; i < string.length; i++) {
			if (string[i] == textToR) {
				stringMod += textR;
			} else {
				stringMod += string[i];
			}
		}
		return stringMod;
	}

}

function convertStringDateToStringEs(date) {
	let split = date.split("-");
	return split[0] + " de " + monthsEs[split[1]][0] + " de " + split[2];
}

function convertStringDateToStringEn(date) {
	let split = date.split("-");
	return monthsEn[split[1]][0] + " " + split[0] + ", " + split[2];
}

function convertDateToString(date) {
	return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
}

const monthsEs = [["Enero", 31], ["Febrero", 28], ["Marzo", 31], ["Abril", 30], ["Mayo", 31], ["Junio", 30], ["Julio", 31], ["Agosto", 31], ["Septiembre", 30], ["Octubre", 31], ["Noviembre", 30], ["Diciembre", 31]]
const monthsEn = [["January", 31], ["Febrary", 28], ["March", 31], ["April", 30], ["May", 31], ["June", 30], ["July", 31], ["August", 31], ["September", 30], ["October", 31], ["November", 30], ["December", 31]]


// VARIABLE INSTANSIATION ----------------------------------------------------------------


const checkboxs = document.querySelectorAll(".list-element-checkbox");
const listbox = document.querySelectorAll(".list-element-box");
const listInput = document.querySelectorAll(".list-element-texta");

const staticLinks = document.querySelectorAll(".static-link");
const linkAuth = document.getElementById("link-auth");
const langBtn = document.getElementById("lang-btn");
const themeBtn = document.getElementById("theme-btn");
const links = document.querySelectorAll(".option-btn");

const projectsBox = document.querySelector(".lists-aside-section");
const surfaceList = document.getElementById("elements-list");
const calendarSurface = document.getElementById("calendar-lists");
const listName = document.getElementById("list-name");
const plus = document.getElementById("plus");
const saveList = document.getElementById("save");
const edit = document.getElementById("edit");
const paste = document.getElementById("paste");
const listsPlus = document.getElementById("lists-plus");
const search = document.getElementById("search");
const refresh = document.getElementById("refresh");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");

const aside = document.querySelector(".aside");

const errorLog = document.querySelector(".error-log-message");

let currentProject = null, isSave = true, actualPosition = 0
	, daysToForward = 0, daysToBackward = 0, currentSurface,
	temp;

let date = new Date();
let dateForward = new Date();
let dateBackward = new Date();
dateBackward.setDate(date.getDate() - 1)
dateForward.setDate(date.getDate() + 1)


// FUNCTIONS INSTANSIATION  --------------------------------------------------------------


//  D D D D     D D D D D D    DD        D       D D D D              D D D D D D 
//	D       D        D         D D       D     D         D            D
//	D       D        D         D  D      D    D                       D
//	D      D         D         D   D     D     D                      D 
//	D D D D          D         D    D    D       D D D D              D D D D
//	D      D         D         D     D   D               D            D
//	D       D        D         D      D  D                D           D
//	D       D        D         D       D D     D         D            D
//	D D D D          D         D        DD       D D D D              D


// BUTTONS FUNCTIONS ------------------

function appearInput(e) {
	let input = e.children[2];
	let text = e.children[1];
	input.classList.remove("hide");
	input.value = text.textContent;
	text.textContent = "";
	if (input.value.length > 112) {
		input.style.height = (input.scrollHeight) + "px";
	}
	e.parentNode.classList.add("list-element-open")
	input.focus();
}

function setValue(e) {
	let input = e;
	let text = e.previousElementSibling;
	text.textContent = input.value;
	input.value = "";
	input.classList.add("hide");
	e.parentNode.parentNode.classList.remove("list-element-open")
}

function checkTheBox(e) {
	e.nextElementSibling.classList.toggle("check");
	e.classList.toggle("fa-check-square-o");
	e.classList.toggle("fa-square-o");
}

function checkFromBox(e) {
	e.firstElementChild.nextElementSibling.classList.toggle("check");
	e.firstElementChild.classList.toggle("fa-check-square-o");
	e.firstElementChild.classList.toggle("fa-square-o");
}

function appearModBtns(e) {
	e.lastElementChild.classList.remove("disappear");
}

function disappearModBtns(e) {
	e.lastElementChild.classList.add("disappear");
}

function OnInput(e) {
	let limit, height;

	if (e.currentTarget.classList.contains("calendar-texta")) {
		limit = 48;
		height = 18;
	} else {
		limit = 128;
		height = 23;
	}
	this.style.height = 'auto';
	if (this.value.length < limit) {
		this.style.height = (height) + "px";
		return;
	}
	this.style.height = (this.scrollHeight) + "px";
}

function setIsSaveToFalse(e) {
	e.classList.add("unsave")
}

function setIsSaveToTrue(e) {
	e.classList.remove("unsave")
}

function setErrorLogToDefault() {
	errorLog.classList.remove("move-log");
}

function buildErrorLog(color, text) {
	if (color == "red") {
		errorLog.classList.add("red");
		errorLog.classList.remove("green");
	} else {
		errorLog.classList.remove("red");
		errorLog.classList.add("green");
	}
	errorLog.classList.add("move-log");
	errorLog.textContent = text;
	setTimeout(() => {
		setErrorLogToDefault();
	}, 10000)
}

function showErrors(error) {
	if (error == "TypeError: Failed to fetch") {
		buildErrorLog("red", "Por favor conectese a internet para cargar sus projectos")
	} else if (error == "usernameNotFoundFromToken") {
		buildErrorLog("red", "Inicie sesion, por favor")
	} else if (error == "repositoryCouldNotSave") {
		buildErrorLog("red", "No se pudo guardar el projecto")
	} else if (error == "Internal Server Error") {
		buildErrorLog("red", "Ha ocurrido un error")
	} else if (error == "JWT") {
		buildErrorLog("red", "Inicie Sesión para cargar sus listas")
	}
}

function loading(e) {
	const span = document.createElement("SPAN")
	span.classList.add("loading", "fa", "fa-spinner")
	e.appendChild(span);
}

function cleanActualProject() {

	const projectsBtns = document.querySelectorAll(".list-box");

	projectsBtns.forEach((p) => {
		p.classList.remove("actual-list")
	})
}

function setActualProject(e) {
	cleanActualProject();
	e.classList.add("actual-list")
	currentProject = e.dataset.id;
	localStorage.setItem("selected", e.dataset.id)
}

function openFirstProject() {
	loadListOnAction(projectsBox.firstChild.dataset.id, obtenerCookie("hs"))
	cleanActualProject();
	setActualProject(projectsBox.firstChild);
}

function openSelectedProjectOrFirstProject() {
	if (localStorage.getItem("selected") == null) {
		openFirstProject();
		return;
	}
	let projectos = document.querySelectorAll(".list-box"), found = false;
	projectos.forEach((p) => {
		if (p.dataset.id == localStorage.getItem("selected")) {
			loadListOnAction(p.dataset.id, obtenerCookie("hs"));
			cleanActualProject();
			setActualProject(p);
			found = true;
		}
	})
	if (!found) {
		openFirstProject();
	}

}




function cleanSurface(surface) {
	surface.innerHTML = "";
}

function showModifiButtons(element) {
	element.lastElementChild.classList.add("show")
	element.lastElementChild.classList.remove("hide")
}

function hideModifiButtons(element) {
	element.lastElementChild.classList.remove("show")
	element.lastElementChild.classList.add("hide")
}

function setListName(e) {
	document.querySelector(".actual-list").children[0].textContent = e.value;
	document.getElementById("list-name").textContent = e.value;
	e.textContent = "";
	e.classList.add("hide")
	setIsSaveToFalse(saveList);
}

function editProjectName(e) {
	let box = e;
	let input = box.children[1];
	let p = box.children[0];
	input.value = p.textContent;
	p.textContent = "";
	input.classList.remove("hide");
	input.focus()

	input.addEventListener("keypress", (e) => {
		if (e.code == "Enter") {
			setListName(e.currentTarget)
		}
	})
	input.addEventListener("blur", (e) => {
		setListName(e.currentTarget)
	})

}

function copyText(e) {
	localStorage.setItem("clipboard", e.parentNode.parentNode.children[1].textContent);
	e.classList.add("bounce");
	setTimeout(() => {
		e.classList.remove("bounce");
	}, 400);
}


function createModifiBtns() {
	const div = document.createElement("DIV");
	div.classList.add("modifi-btn-box", "hide");
	if (localStorage.getItem("theme") == "d") {
		div.classList.add("modifi-btn-box-dark");
	}

	const spanDel = document.createElement("SPAN");
	spanDel.addEventListener("click", (e) => {
		e.stopPropagation();
		deleteProject(e, obtenerCookie("hs"))
	});
	const spanEdit = document.createElement("SPAN");
	spanEdit.addEventListener("click", (e) => {
		editProjectName(e.currentTarget.parentNode.parentNode);
	})

	spanDel.classList.add("list-modifi-btn", "del", "fa", "fa-trash")
	spanEdit.classList.add("list-modifi-btn", "edit", "fa", "fa-edit")


	div.appendChild(spanEdit);
	div.appendChild(spanDel);

	return div;
}

function noProjectsFound() {
	projectsBox.innerHTML = "";
	let noProjects = document.createElement("LABEL");
	noProjects.setAttribute("style", "margin-top: 8px")
	noProjects.dataset.id = "nop";
	noProjects.textContent = "No tienes ningun projecto";
	projectsBox.appendChild(noProjects);
}


function createOneProjectButton(nombre, id, token) {
	const button = document.createElement("DIV");
	const p = document.createElement("P");
	const input = document.createElement("INPUT");
	input.classList.add("list-input", "hide");
	input.setAttribute("maxlength", "50");
	button.classList.add("list-box");
	button.appendChild(p);
	button.appendChild(input);
	p.classList.add("list-name");
	p.textContent = nombre;
	button.dataset.id = id;
	button.appendChild(createModifiBtns());
	button.addEventListener("mouseenter", (e) => { showModifiButtons(e.currentTarget); })
	button.addEventListener("mouseleave", (e) => { hideModifiButtons(e.currentTarget); })
	button.addEventListener("click", (e) => {
		if (saveList.classList.contains("unsave") && e.currentTarget.dataset.id != currentProject) {
			update(currentProject, token)
		}
		loadListOnAction(e.currentTarget.dataset.id, obtenerCookie("hs"));
		setActualProject(e.currentTarget);
		setIsSaveToTrue(saveList);
	})
	projectsBox.appendChild(button);
	return button
}





function setLoginToLogout() {
	linkAuth.dataset.id = "logout";
	linkAuth.firstElementChild.classList.remove("fa-sign-in-alt");
	linkAuth.firstElementChild.classList.add("fa-sign-out-alt");
	linkAuth.nextElementSibling.classList.toggle("hide");
	linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}

function setLogoutToLogin() {
	linkAuth.dataset.id = "login";
	linkAuth.firstElementChild.classList.add("fa-sign-in-alt");
	linkAuth.firstElementChild.classList.remove("fa-sign-out-alt");
	linkAuth.nextElementSibling.classList.toggle("hide");
	linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}



function logout() {
	setLogoutToLogin();
	eliminarCookie("hs");
	eliminarCookie("keep");
	location.reload();
}


function authenticate(token) {
	setLoginToLogout();
	if (obtenerCookie("keep") == "true") {
		crearCookie(`hs=${token}`, 365)
	} else {
		crearCookie(`hs=${token}`, 2)
	}
}






function setInputEventListener(l, txHeight, saveBtn) {


	if (l.value == '') {
		l.setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
	} else {
		l.setAttribute("style", "height:" + (l.scrollHeight) + "px;overflow-y:hidden;");
	}

	l.addEventListener("input", OnInput, false);

	l.addEventListener("click", (e) => {
		e.stopPropagation();
	})
	l.addEventListener("dblclick", (e) => {
		e.stopPropagation();
	})
	l.addEventListener("dragstart", (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("a")
	})
	l.addEventListener("blur", (e) => {
		setValue(e.currentTarget);
		setIsSaveToFalse(saveBtn);

	})
	l.addEventListener("keypress", (e) => {
		if (e.code == "Enter") {
			e.currentTarget.blur();
		}
	})
}

function setLiEventListener(l, saveBtn) {
	l.addEventListener("dblclick", (e) => {
		appearInput(e.currentTarget);
		setIsSaveToFalse(saveBtn);
	})
	l.addEventListener("click", (e) => {
		checkFromBox(e.currentTarget)
		setIsSaveToFalse(saveBtn);
	})
	l.addEventListener("mouseenter", (e) => {
		appearModBtns(e.currentTarget);
	})
	l.addEventListener("mouseleave", (e) => {
		disappearModBtns(e.currentTarget);
	})



}


function dropEvent(e) {

	let parent = e.currentTarget.parentNode;

	let pos = JSON.parse(e.dataTransfer.getData("element"));

	parent.insertBefore(parent.children[pos], e.currentTarget);

	setIsSaveToFalse(parent.previousElementSibling.lastElementChild.lastElementChild);


}


function createListElement(text, check, main, surface) {
	let saveBtn = saveList;
	let txHeight = 23;
	const li = document.createElement("LI");
	const box = document.createElement("DIV");
	const span = document.createElement("SPAN");
	const p = document.createElement("P");
	const texta = document.createElement("TEXTAREA");
	const div = document.createElement("DIV");
	const edit = document.createElement("SPAN")
	const del = document.createElement("SPAN");
	const copy = document.createElement("SPAN");

	edit.classList.add("fa", "fa-edit", "list-element-edit");
	del.classList.add("fa", "fa-trash", "list-element-del");
	copy.classList.add("fa", "fa-copy", "list-element-copy");

	div.classList.add("modifi-box", "disappear");
	texta.classList.add("list-element-texta", "hide");
	p.classList.add("list-element-text");
	if (main) {
		p.classList.add("list-element-text-main")
		span.classList.add("list-element-checkbox-main");
		li.classList.add("list-element-main");
	} else {
		texta.classList.add("calendar-texta");
		txHeight = 18;
		saveBtn = surface.previousElementSibling.lastElementChild.lastElementChild;
	}
	span.classList.add("fa", "fa-square-o", "list-element-checkbox");

	box.classList.add("list-element-box");

	li.classList.add("list-element");
	li.setAttribute("draggable", "true")

	if (localStorage.getItem("theme") == "d") {
		li.classList.add("list-element-dark");
	}

	div.appendChild(copy);
	div.appendChild(edit);
	div.appendChild(del);

	box.appendChild(span);
	box.appendChild(p);
	box.appendChild(texta);
	box.appendChild(div);

	li.appendChild(box);


	p.textContent = text;


	edit.addEventListener("click", (e) => {
		e.stopPropagation();
		appearInput(e.currentTarget.parentNode.parentNode);
	})
	del.addEventListener("click", (e) => {
		e.stopPropagation();
		setIsSaveToFalse(saveBtn)
		surface.removeChild(e.currentTarget.parentNode.parentNode.parentNode)
	})

	if (check == "t") {
		checkFromBox(box);
	}

	span.addEventListener("click", (e) => {
		e.stopPropagation();
		checkTheBox(e.currentTarget);
	})

	copy.addEventListener("click", (e) => {
		e.stopPropagation();
		copyText(e.currentTarget);
	});

	setLiEventListener(box, saveBtn);
	setInputEventListener(texta, txHeight, saveBtn);

	li.addEventListener("dragstart", (e) => {
		let pos = Array.from(e.currentTarget.parentNode.children).findIndex(item => item === e.currentTarget);
		e.dataTransfer.setData("element", pos)
	})
	li.addEventListener("dragover", (e) => {
		e.preventDefault();
	})
	li.addEventListener("drop", (e) => {
		dropEvent(e)
	})

	return li;
}











function createCalendarList(date, month, lang) {
	const list = document.createElement("DIV");
	const box = document.createElement("DIV");
	const ul = document.createElement("UL");
	const h = document.createElement("H2");
	const p = document.createElement("P");
	const div = document.createElement("DIV");
	const plus = document.createElement("SPAN");
	const save = document.createElement("SPAN");

	plus.classList.add("fa", "fa-plus", "calendar-action-btn", "calendar-plus");
	save.classList.add("fa", "fa-save", "calendar-action-btn", "save-calendar");
	plus.setAttribute("style", "display:flex;")
	save.setAttribute("style", "display:flex;")
	plus.setAttribute("title", "Add calendar task")
	save.setAttribute("title", "Save calendar list")

	div.classList.add("action-btns-box");

	p.classList.add("calendar-date");
	h.classList.add("calendar-month");

	box.classList.add("top-calendar");
	ul.classList.add("elements-list", "calendar-element-list");

	list.classList.add("calendar-list");

	if (localStorage.getItem("theme") == "d") {
		box.classList.add("top-calendar-dark")
		div.classList.add("action-btns-box-dark")
		list.classList.add("calendar-list-dark");
		plus.classList.add("calendar-action-btn-dark");
		save.classList.add("calendar-action-btn-dark");
	}

	div.appendChild(plus);
	div.appendChild(save);

	box.appendChild(h);
	box.appendChild(p);
	box.appendChild(div);

	list.appendChild(box);
	list.appendChild(ul);

	if (lang == "es") {
		p.textContent = convertStringDateToStringEs(date);
		h.textContent = monthsEs[month][0];
	} else {
		p.textContent = convertStringDateToStringEn(date);
		h.textContent = monthsEn[month][0];
	}


	list.dataset.id = date;

	plus.addEventListener("click", (e) => {
		if (currentProject != null) {
			ul.appendChild(createListElement("", "f", false, ul))
			e.currentTarget.nextElementSibling.classList.add("unsave")
		}

	})

	save.addEventListener("click", (e) => {
		if (currentProject != null) {
			let updated = updateCalendar(e.currentTarget.parentNode.parentNode.parentNode.lastElementChild, date, obtenerCookie("hs"))
			if (updated) {
				setIsSaveToTrue(e.currentTarget)
			}
		} else {
			showErrors("usernameNotFoundFromToken")
		}
	})

	loadCalendarList(date, obtenerCookie("hs"), ul)

	return list;
}









function calendarForwardMove() {
	if (!(calendarSurface.scrollLeft % 500 == 0)) {
		return;
	}
	if (actualPosition == daysToForward) {
		dateForward.setDate(dateForward.getDate() + 1);
		calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang()));
		daysToForward++;
	}

	calendarSurface.scrollLeft = calendarSurface.scrollLeft + (500);
	actualPosition++;
}

function calendarBackwardMove() {
	if (!(calendarSurface.scrollLeft % 500 == 0)) {
		return;
	}
	if (actualPosition == daysToBackward) {
		dateBackward.setDate(dateBackward.getDate() - 1);
		calendarSurface.insertBefore(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang()), calendarSurface.firstChild);
		calendarSurface.classList.add("noscroll");
		calendarSurface.scrollLeft = calendarSurface.scrollLeft + (500);
		calendarSurface.classList.remove("noscroll");
		daysToBackward--;
	}

	calendarSurface.scrollLeft = calendarSurface.scrollLeft - (500);
	actualPosition--;
}







function langChange() {
	let lang;
	if (getLang() == "en") {
		lang = "es";
		localStorage.setItem("lang", "es")
	} else {
		lang = "en";
		localStorage.setItem("lang", "en")
	}


	const langElements = document.querySelectorAll(".lang");

	langElements.forEach((e) => {
		e.textContent = e.getAttribute(lang);
	})

	const calendarElements = document.querySelectorAll(".calendar-list");

	calendarElements.forEach((c) => {
		const name = c.firstElementChild.firstElementChild;
		const date = name.nextElementSibling;
		if (lang == "es") {
			date.textContent = convertStringDateToStringEs(c.dataset.id);
			name.textContent = monthsEs[c.dataset.id.split("-")[1]][0]
		} else {
			date.textContent = convertStringDateToStringEn(c.dataset.id);
			name.textContent = monthsEn[c.dataset.id.split("-")[1]][0]
		}

	})


}



function checkLang() {
	if (localStorage.getItem("lang") == "es") {
		const langElements = document.querySelectorAll(".lang");

		langElements.forEach((e) => {
			e.textContent = e.getAttribute("es");
		})

		const calendarElements = document.querySelectorAll(".calendar-list");

		calendarElements.forEach((c) => {
			const name = c.firstElementChild.firstElementChild;
			const date = name.nextElementSibling;
			date.textContent = convertStringDateToStringEs(c.dataset.id);
			name.textContent = monthsEs[c.dataset.id.split("-")[1]][0];
		})
	}
}





function listNameLang() {
	if (localStorage.getItem("lang") == "es") {
		return "Lista sin nombre";
	}
	return "Untitled List";
}



function sunset(e) {
	let first = e.firstElementChild;
	const current = e;
	const moon = document.createElement("SPAN");
	moon.classList.add("fas", "fa-moon", "option-icon", "arise")
	first.classList.remove("arise");
	first.classList.add("sunset");
	e.insertBefore(moon, first);
	setTimeout(() => {
		current.removeChild(first)
	}, 800);
}

function moonset(e) {
	let first = e.firstElementChild;
	const current = e;
	const sun = document.createElement("SPAN");
	sun.classList.add("fas", "fa-sun", "option-icon", "arise")
	first.classList.remove("arise");
	first.classList.add("sunset");
	e.insertBefore(sun, first);
	setTimeout(() => {
		current.removeChild(first)
	}, 800);
}









/*
.aside
.top-aside-section
.list-element
.info-elements-list
.elements-list
.calendar-list
.top-calendar
.calendar-action-btn
.action-btn
.settings-aside
.option-btn
.option-label
.date-btns
*/



function themeChange(fromWindow) {
	let theme;
	const main = document.querySelector(".main");
	const aside = document.querySelector(".aside");
	const topAsideSection = document.querySelector(".top-aside-section");
	const mainSection = document.querySelector(".main-section");
	const topSection = document.querySelector(".top-section");
	const listElement = document.querySelectorAll(".list-element");
	const listModifiBtn = document.querySelectorAll(".modifi-btn-box");
	const infoElementsList = document.querySelector(".info-elements-list");
	const elementsList = document.querySelector(".elements-list");
	const calendarList = document.querySelectorAll(".calendar-list");
	const topCalendar = document.querySelectorAll(".top-calendar");
	const calendarActionBtn = document.querySelectorAll(".calendar-action-btn");
	const actionBtn = document.querySelectorAll(".action-btn");
	const settingsAside = document.querySelector(".settings-aside");
	const optionBtn = document.querySelectorAll(".option-btn");
	const topIcons = document.querySelectorAll(".top-icon");
	const optionLabel = document.querySelectorAll(".option-label");
	const dateBtns = document.querySelectorAll(".date-btns");

	if (fromWindow) {
		if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
			theme = "l";
		} else {
			theme = "d";
			moonset(themeBtn, fromWindow);
		}
	} else {
		if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
			theme = "d";
			localStorage.setItem("theme", "d")
		} else {
			theme = "l";
			localStorage.setItem("theme", "l")
		}
	}

	if (theme == "d") {
		aside.classList.add("aside-dark")

		main.classList.add("main-dark")

		topAsideSection.classList.add("top-aside-section-dark")

		mainSection.classList.add("main-section-dark")

		topSection.classList.add("top-section-dark")

		listElement.forEach((l) => { l.classList.add("list-element-dark") })

		listModifiBtn.forEach((l) => { l.classList.add("modifi-btn-box-dark") })

		infoElementsList.classList.add("info-elements-list-dark")

		elementsList.classList.add("elements-list-dark")

		calendarList.forEach((l) => { l.classList.add("calendar-list-dark") })

		topCalendar.forEach((l) => { l.classList.add("top-calendar-dark") })

		calendarActionBtn.forEach((l) => { l.classList.add("calendar-action-btn-dark") })

		actionBtn.forEach((l) => { l.classList.add("action-btn-dark") })

		settingsAside.classList.add("settings-aside-dark")

		optionBtn.forEach((l) => { l.classList.add("option-btn-dark") })

		topIcons.forEach((l) => { l.classList.add("top-icon-dark") })

		optionLabel.forEach((l) => { l.classList.add("option-label-dark") })

		dateBtns.forEach((l) => { l.classList.add("date-btns-dark") })

	} else if (theme == "l") {
		aside.classList.remove("aside-dark")

		main.classList.remove("main-dark")

		topAsideSection.classList.remove("top-aside-section-dark")

		mainSection.classList.remove("main-section-dark")

		topSection.classList.remove("top-section-dark")

		listElement.forEach((l) => { l.classList.remove("list-element-dark") })

		listModifiBtn.forEach((l) => { l.classList.remove("modifi-btn-box-dark") })

		infoElementsList.classList.remove("info-elements-list-dark")

		elementsList.classList.remove("elements-list-dark")

		calendarList.forEach((l) => { l.classList.remove("calendar-list-dark") })

		topCalendar.forEach((l) => { l.classList.remove("top-calendar-dark") })

		calendarActionBtn.forEach((l) => { l.classList.remove("calendar-action-btn-dark") })

		actionBtn.forEach((l) => { l.classList.remove("action-btn-dark") })

		settingsAside.classList.remove("settings-aside-dark")

		optionBtn.forEach((l) => { l.classList.remove("option-btn-dark") })

		topIcons.forEach((l) => { l.classList.remove("top-icon-dark") })

		optionLabel.forEach((l) => { l.classList.remove("option-label-dark") })

		dateBtns.forEach((l) => { l.classList.remove("date-btns-dark") })
	}
}


















async function createNewProject(token, lang) {
	if (projectsBox.firstElementChild.dataset.id == "nop") {
		projectsBox.removeChild(projectsBox.firstElementChild);
	}
	let bodyContent = {};
	bodyContent.token = token;
	bodyContent.lang = lang;
	let peticion = await fetch("http://localhost:8080/api/tm/createList", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(bodyContent)
	});
	peticion.json().then(data => {
		let btn;
		if (projectsBox.children.length != 0 && !projectsBox.firstElementChild.classList.contains("noProjects")) {
			btn = createOneProjectButton(listNameLang(), data.projects, obtenerCookie("hs"))
		} else {
			projectsBox.innerHTML = "";
			btn = createOneProjectButton(listNameLang(), data.projects, obtenerCookie("hs"))
		}
		setActualProject(btn)
		loadListOnAction(btn.dataset.id, obtenerCookie("hs"));

	})
}


async function deleteProject(e, token) {

	idToDelete = e.currentTarget.parentNode.parentNode.dataset.id;

	let boxToDelete = e.currentTarget.parentNode.parentNode;

	let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese projecto?")
	if (pregunta) {
		if (currentProject == idToDelete) {
			currentProject = null;
			cleanSurface(surfaceList);
		}
		let data = {};
		data.listId = idToDelete;
		data.token = token;
		let peticion = await fetch("http://localhost:8080/api/tm/deleteList", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		});
		idToDelete = null;
		projectsBox.removeChild(boxToDelete);

		peticion.json().then(data => console.log(data))


		if (projectsBox.children.length != 0 && currentProject == null) {
			openFirstProject();
		} else if (projectsBox.children.length == 0) {
			noProjectsFound();
		}
	}




}





async function update(id, token) {                     //Updates the project in the DB

	let listDoc = JSON.parse("[]");
	let projectName = "";

	const tasksText = document.querySelectorAll(".list-element-text-main");

	projectName = listName.textContent;


	tasksText.forEach((t) => {
		let check = "f";
		if (t.previousElementSibling.classList.contains("fa-check-square-o")) check = "t";
		listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${t.textContent}"}`);
	})



	let datos = {};
	datos.listId = id;
	datos.listProject = JSON.stringify(listDoc);
	datos.listProjectName = projectName;


	let peticion = await fetch("http://localhost:8080/api/tm/updateList", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(datos)
	});

	peticion.json().then(data => {
		if (data.error == null) {
			buildErrorLog("green", "Datos guardados exitosamente");

		} else {
			showErrors(data.error)

		}
	})

}










async function updateCalendar(e, date, token) {                     //Updates the project in the DB

	let listDoc = JSON.parse("[]");

	const tsks = e.children;


	for (let i = 0; i < tsks.length; i++) {
		let check = "f";
		if (tsks[i].firstChild.firstChild.classList.contains("fa-check-square-o")) check = "t";
		listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${tsks[i].firstChild.firstChild.nextElementSibling.textContent}"}`);
	}



	let datos = {};
	datos.listProject = JSON.stringify(listDoc);
	datos.date = date;
	datos.token = token;

	let peticion = await fetch("http://localhost:8080/api/tm/updateCalendarDate", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(datos)
	});

	peticion.json().then(data => {
		if (data.error == null) {
			buildErrorLog("green", "Datos guardados exitosamente");
			return true;
		} else {
			showErrors(data.error)

		}
	})

}


async function loadCalendarList(date, token, surface) {  //When you click in a project button or onload

	let bodyContent = {};
	bodyContent.date = date;
	bodyContent.token = token;
	try {
		let peticion = await fetch("http://localhost:8080/api/tm/getCalendarDate", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(bodyContent)
		});
		let project = await peticion.json();

		loadProject(surface, project, false);
	} catch (e) {
	}
	if (surface.children.length == 0) {
		surface.appendChild(createListElement("", "f", false, surface))
	}

}

























async function loadListOnAction(id, token) {  //When you click in a project button or onload

	let bodyContent = {};
	bodyContent.listId = parseInt(id);
	bodyContent.token = token;

	let peticion = await fetch("http://localhost:8080/api/tm/getListData", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(bodyContent)
	});
	let project = await peticion.json();

	loadProject(surfaceList, project, true);
	document.querySelectorAll(".list-box").forEach((p) => {
		if (p.dataset.id == id) {
			setActualProject(p);
		}
	})

}
function loadProject(surface, Project, main) {       		   //This is needed in the above one  
	cleanSurface(surface);
	let listDoc = JSON.parse(Project.listProject);
	if (listDoc != null) {
		listDoc.forEach((l) => {
			const element = createListElement(l.txt, l.check, main, surface);
			surface.appendChild(element);
		})
	}
	if (surface == surfaceList) {
		listName.textContent = Project.listProjectName;
	}


}


function createProjectButtons(Lists) {       //This needs the next one
	projectsBox.innerHTML = "";
	if (Lists != null) {
		Lists.then(data => {
			if (data == null) {
				return;
			}
			else if (data.projects != "") {
				let nombres = data.listProjectName.split("/");
				let ids = data.projects.split("/");

				for (let i = 0; i < ids.length; i++) {
					createOneProjectButton(nombres[i], ids[i], obtenerCookie("hs"));
				}

				openSelectedProjectOrFirstProject();
			} else {
				noProjectsFound()
			}

		});
	}

}
async function loadProjectsFromUsers(token) {   //Gets all the projects ids
	let bodyContent = {}
	bodyContent.token = token;
	bodyContent.tiempo = "" + obtenerCookie("keep");

	loading(projectsBox)


	try {
		let peticion = await fetch("http://localhost:8080/api/tm/getAllLists", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(bodyContent)
		});

		let lists = await peticion.json();
		if (lists.error != null) {
			if (lists.error == "Internal Server Error" && lists.message.startsWith("JWT")) {
				showErrors("JWT")
				return null;
			} else {
				showErrors(lists.error)
				return null;
			}
		}

		authenticate(lists.token);

		return lists;
	} catch (e) {
		console.log(e)
		return null;
	}
}



//  D D D D D D   D       D     DD        D   D D D D D D             D
//  D             D       D     D D       D        D                  D
//  D              D     D      D  D      D        D                  D
//  D              D     D      D   D     D        D                  D
//  D D D D         D   D       D    D    D        D                  D
//  D               D   D       D     D   D        D                  D
//  D                D D        D      D  D        D                  D
//  D                D D        D       D D        D                  D
//  D D D D D D       D         D        DD        D                  D D D D D D


// EVENT LISTENERS -----------------------------------------------------------------------

window.addEventListener("load", (e) => {
	createProjectButtons(loadProjectsFromUsers(obtenerCookie("hs")))
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang));
	checkLang();
	themeChange(true);
})

errorLog.addEventListener("click", () => {
	setErrorLogToDefault();
})

saveList.addEventListener("click", (e) => {
	if (currentProject != null) {
		let id = document.querySelector(".actual-list").dataset.id;
		update(id, obtenerCookie("hs"));
		setIsSaveToTrue(e.currentTarget);
	}
})

plus.addEventListener("click", (e) => {
	if (currentProject != null) {
		const element = createListElement("", "f", true, surfaceList);
		surfaceList.appendChild(element);
		e.currentTarget.nextElementSibling.classList.add("unsave")
	}
})

refresh.addEventListener("click", () => {
	createProjectButtons(loadProjectsFromUsers(obtenerCookie("hs")))
})

listsPlus.addEventListener("click", () => {
	if (linkAuth.dataset.id == "logout") {
		createNewProject(obtenerCookie("hs"), getLang())
	} else {
		showErrors("JWT")
	}
})

edit.addEventListener("click", (e) => {
	if (currentProject != null) {
		editProjectName(e.currentTarget.parentNode.parentNode);
	}
})

forward.addEventListener("click", (e) => {

	calendarForwardMove(e.currentTarget.parentNode.parentNode.parentNode.dataset.id);
})


backward.addEventListener("click", (e) => {
	calendarBackwardMove(e.currentTarget.parentNode.parentNode.parentNode.dataset.id);
})



linkAuth.addEventListener("click", (e) => {
	if (e.currentTarget.dataset.id == "login") {
		location.href = "https://productivityfast.pages.dev/auth?from=taskmanager";
	} else {
		logout();
	}
});


links.forEach((l) => {
	l.addEventListener("mouseenter", (e) => {
		let l = e.currentTarget.nextElementSibling, value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	})
	l.addEventListener("mouseleave", (e) => {
		e.currentTarget.nextElementSibling.style.width = "";
	})
})


linkAuth.addEventListener("mouseenter", (e) => {
	let l = e.currentTarget.nextElementSibling, l2 = e.currentTarget.nextElementSibling.nextElementSibling, value;
	if (l.classList.contains("hide")) {
		value = (l2.firstElementChild.scrollWidth + 60) + "px";
		l2.style.width = value;
	} else {
		value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	}
})
linkAuth.addEventListener("mouseleave", (e) => {
	e.currentTarget.nextElementSibling.style.width = "";
	e.currentTarget.nextElementSibling.nextElementSibling.style.width = "";
})



langBtn.addEventListener("click", () => {
	langChange();
})


themeBtn.addEventListener("click", (e) => {
	if (e.currentTarget.children.length > 1) {
		return;
	}

	if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
		moonset(e.currentTarget, false);
		themeChange(false);
	} else if (localStorage.getItem("theme") == "d") {
		sunset(e.currentTarget, false);
		themeChange(false);
	}
})


paste.addEventListener("click", () => {
	if (currentProject != null) {
		const element = createListElement(localStorage.getItem("clipboard"), "f", true, surfaceList);
		surfaceList.appendChild(element);
		saveList.classList.add("unsave")
	}
})


staticLinks.forEach((s) => {
	s.addEventListener("click", (e) => {
		location.href = "https://productivityfast.pages.dev/" + e.currentTarget.dataset.id;
	})
})