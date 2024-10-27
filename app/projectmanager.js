

import Dialog from './dialogs.js';
import Request from './request.js';



// CREATING THE DATA STRUCTURES	AND UTILS ------------------------------------------------

function newFechaUTC(dias) {
	let fecha = new Date();
	fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
	return fecha.toUTCString();
}

function crearCookie(name, dias) {
	let exp = newFechaUTC(dias);
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

const body = document.querySelector("body")

const groupBox = document.querySelector(".group-boxes")
const groupBtn = document.querySelectorAll(".group-button")

const checkboxs = document.querySelectorAll(".list-element-checkbox");
const listbox = document.querySelectorAll(".list-element-box");
const listInput = document.querySelectorAll(".list-element-texta");

const staticLinks = document.querySelectorAll(".static-link");
const linkAuth = document.getElementById("link-auth");
const langBtn = document.getElementById("lang-btn");
const themeBtn = document.getElementById("theme-btn");
const links = document.querySelectorAll(".option-btn");

const dialog = document.querySelector(".dialog")
const dialogB = document.querySelector(".dialog-background")
const menu = document.querySelector(".popupMenu")

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
const options = document.getElementById("lists-options");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");

const joinGroupBtn = document.getElementById("joinGroup")
const createGroupBtn = document.getElementById("createGroup")

const joinBackground = document.querySelector(".join-background")
const joinDialog = document.querySelector(".join-dialog")
const joinButtons = document.querySelectorAll(".join-button")
const joinBtn = document.querySelector(".join-btn")
const joinInput = document.querySelector(".join-input")


const createBackground = document.querySelector(".create-background")
const createDialog = document.querySelector(".create-dialog")
const createButtons = document.querySelectorAll(".create-button")
const createBtn = document.querySelector(".create-btn")
const createInput = document.getElementById("group-name-input")
const uploadImageDiv = document.querySelector(".uploadImage");
const uploadLabel = document.querySelector(".uploadLabel");
const uploadImageBox = document.querySelector(".uploadImage-box");
const file = document.getElementById("file");



const aside = document.querySelector(".aside");

const errorLog = document.querySelector(".error-log-message");

const websocketUrl = "http:/localhost:8080/notify-channels"
const topic = "/group/";
var client = null;

let currentProject = null, isSave = true, actualPosition = 0
	, daysToForward = 0, daysToBackward = 0, currentSurface,
	temp, currentGroup, calendarWidth = 480, userPermiss = null, userId = null,
	Timeout;

let today = new Date();
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


function connect(gid) {
	const sock = new SockJS(websocketUrl);
	client = Stomp.over(sock);
	client.connect({}, () => {
		client.subscribe(topic + gid, payload => {
			updateInfo(JSON.parse(payload.body));
		});
	});
	console.log("Connected");
};

function disconnect() {
	if (client !== null) {
		client.disconnect();
		console.log("Disconnected");
	};
}

function updateInfo(message) {
	console.log(message)
	// if (message.userId != userId) {
	// 	loadProject(surfaceList, message, true);
	// }
};







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
	} else if (error == "groupMustHaveName") {
		buildErrorLog("red", "Pongale un nombre al grupo")
	} else if (error == "userAlreadyBelongToTheGroup") {
		buildErrorLog("red", "El usuario ya pertenece al grupo")
	} else if (error == "errorFindingUser") {
		buildErrorLog("red", "El usuario no existe")
	} else {
		buildErrorLog("red", "Ha ocurrido un error")
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

function cleanActualGroup() {
	const projectsBtns = document.querySelectorAll(".group-box");

	projectsBtns.forEach((p) => {
		p.firstElementChild.classList.remove("actual-group")
	})
}

function toggleOptions() {
	menu.classList.toggle("hide")
}
function hideOptions() {
	menu.classList.add("hide")
}

function setActualProject(e) {
	cleanActualProject();
	e.classList.add("actual-list")
	currentProject = e.dataset.id;
	localStorage.setItem("selected", e.dataset.id)
}

function setActualGroup(e) {
	cleanActualGroup();
	e.classList.add("actual-group")
	currentGroup = e.dataset.id;
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




function cleanSurface(surface, condition) {
	surface.innerHTML = "";
	if (condition == true) {
		surface.previousElementSibling.firstElementChild.textContent = "";
	}
}

function cleanListBox() {
	projectsBox.innerHTML = "";
}

function showModifiButtons(element) {
	element.lastElementChild.classList.add("show")
	element.lastElementChild.classList.remove("hide")
}

function hideModifiButtons(element) {
	element.lastElementChild.classList.remove("show")
	element.lastElementChild.classList.add("hide")
}

function toggleJoinDialog() {
	joinBackground.classList.toggle("hide")
}

function toggleCreateDialog() {
	createBackground.classList.toggle("hide")
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

function disableCalendar() {
	cleanSurface(calendarSurface)
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), null, true));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang(), null, true));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), null, true));
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
	div.classList.add("modifi-btn-box", "hide", "theme");
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
	let noProjects = document.createElement("LABEL");
	noProjects.setAttribute("style", "margin-top: 18px")
	noProjects.dataset.id = "nop";
	noProjects.id = "nop";
	noProjects.textContent = "No hay ninguna lista";
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

function updateDate() {
	actualPosition = 0;
	daysToBackward = 0;
	daysToForward = 0;
	dateBackward.setDate(date.getDate() - 1)
	dateForward = null;
	dateForward = new Date();
	dateForward.setDate(date.getDate() + 1)
}

function loadCalendars(id) {
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), id, false));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang(), id, false));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), id, false));
}


function removeDisableToDateBtns() {
	forward.classList.remove("disabled")
	backward.classList.remove("disabled")
}

function removeNoProjectFound() {
	const nop = document.getElementById("nop")
	if (nop != null) {
		projectsBox.removeChild(nop)
	}
}

function dialogBackgroundToggle() {
	dialogB.classList.toggle("hide")
}

function getGroupName(gid) {
	const groups = document.querySelectorAll(".group-button")
	let name = null;
	groups.forEach((g) => {
		if (g.dataset.id == gid) {
			name = g.parentNode.lastElementChild.firstElementChild.textContent;
		}
	})
	return name;
}

function getGroupButton(gid) {
	let group;
	const groups = document.querySelectorAll(".group-button")
	groups.forEach((g) => {
		if (g.dataset.id == gid) {
			group = g;
		}
	})
	return group;
}

function updateGroup(gid, img, gname) {
	const groups = document.querySelectorAll(".group-button")
	groups.forEach((g) => {
		if (g.dataset.id == gid) {
			g.nextElementSibling.src = img;
			g.parentNode.lastElementChild.firstElementChild.textContent = gname;
		}
	})

}

function groupInfoEvent() {
	let name = getGroupName(currentGroup)
	let box = document.getElementById("groupInfo");
	let adm = box.dataset.adm;
	Dialog.createGroupInfoDialog(adm, dialog, dialogB, name, currentGroup, obtenerCookie("hs"));
	dialogBackgroundToggle();
}


function inviteEvent() {
	Dialog.createInviteDialog(dialog, dialogB, currentGroup, obtenerCookie("hs"));
	dialogBackgroundToggle();
}

function changeGroupInfoEvent() {
	let name = getGroupName(currentGroup)
	Dialog.createChangeGroupInfoDialog(dialog, dialogB, name, currentGroup, obtenerCookie("hs"));
	dialogBackgroundToggle();
}

function permissEvent() {
	Dialog.createPermissionsDialog(dialog, dialogB, currentGroup, obtenerCookie("hs"));
	dialogBackgroundToggle();
}


function leaveEvent() {

	let box = getGroupButton(currentGroup);
	leaveGroup(currentGroup, box.parentNode, obtenerCookie("hs"))

}

function deleteEvent() {
	let box = getGroupButton(currentGroup);
	deleteGroup(currentGroup, box.parentNode, obtenerCookie("hs"));
}


function cleanMenuOptions() {
	menu.innerHTML = "";
}

function createPopoupMenuOption(text, func, adm) {
	const div = document.createElement("DIV");
	const p = document.createElement("P");
	div.classList.add("popupMenu-option")
	p.classList.add("popupMenu-p")
	p.textContent = text;
	div.appendChild(p)
	div.id = "groupInfo";
	div.addEventListener("click", () => {
		func();
		hideOptions();
	})
	if (adm == true) {
		div.dataset.adm = "true";
	}
	return div;
}



function createMemberOptions() {
	cleanMenuOptions();
	menu.appendChild(createPopoupMenuOption("Group Info", groupInfoEvent))
	menu.appendChild(createPopoupMenuOption("Invite people", inviteEvent))
	menu.appendChild(createPopoupMenuOption("Leave group", leaveEvent))
}

function createAdminOptions() {
	cleanMenuOptions();
	menu.appendChild(createPopoupMenuOption("Group Info", groupInfoEvent, true))
	menu.appendChild(createPopoupMenuOption("Invite people", inviteEvent))
	menu.appendChild(createPopoupMenuOption("Change group info", changeGroupInfoEvent))
	menu.appendChild(createPopoupMenuOption("Permission Settings", permissEvent))
	menu.appendChild(createPopoupMenuOption("Delete group", deleteEvent))
}

function setUserPermiss(proj) {
	if (proj.admin == "true") {
		userPermiss = "admin"
	} else {
		userPermiss = proj.membersPermis;
	}
}

function showGroupName(e, condition) {
	let l = e.nextElementSibling.nextElementSibling;
	if (condition) {
		e.classList.add("group-img-hover");
		l = e.nextElementSibling;
	}
	let value = (l.firstElementChild.scrollWidth + 62) + "px";
	l.style.width = value;
}

function hideGroupName(e) {
	e.nextElementSibling.nextElementSibling.style.width = "";
	e.nextElementSibling.classList.remove("group-img-hover")
}

async function groupButtonClickEvent(e) {
	setActualGroup(e);
	cleanSurface(surfaceList, true)
	cleanSurface(calendarSurface, false)
	updateDate()
	removeDisableToDateBtns();
	loadCalendars(e.dataset.id);
	removeNoProjectFound();
	let proj = await loadProjectsFromGroup(e.dataset.id, obtenerCookie("hs"));
	setUserPermiss(proj);
	createProjectButtons(proj);
}


async function createAGroupButton(nombre, id) {
	const div = document.createElement("DIV");
	const button = document.createElement("BUTTON");
	const divp = document.createElement("DIV");
	const p = document.createElement("P");
	const img = document.createElement("IMG");
	p.classList.add("group-label-p")
	divp.classList.add("group-label", "theme")
	div.classList.add("group-box")
	button.classList.add("group-button", "theme");
	img.classList.add("group-img")
	divp.appendChild(p);
	div.appendChild(button);
	div.appendChild(img);
	div.appendChild(divp);
	button.dataset.id = id;
	p.textContent = nombre;
	button.addEventListener("mouseenter", (e) => { showGroupName(e.currentTarget.nextElementSibling, true); })
	button.addEventListener("mouseleave", (e) => { hideGroupName(e.currentTarget); })
	button.addEventListener("click", (e) => {
		if (currentGroup != e.currentTarget.dataset.id) {
			groupButtonClickEvent(e.currentTarget)
		}

	})
	groupBox.appendChild(div);
	getGroupImg(button, id, obtenerCookie("hs"));
	return button;
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


function checkCreateGroupValues() {
	if (createInput.value == "") {
		return "groupMustHaveName";
	}
	return null;
}






function saveImgInLocal(filename, file, groupId, element) {
	const fr = new FileReader();
	fr.readAsDataURL(file)

	fr.addEventListener("load", () => {
		let dataToStorage = `${filename}, ${fr.result}`;
		localStorage.setItem(groupId, dataToStorage);

		element.src = fr.result;
	})
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
	})
	l.addEventListener("blur", (e) => {
		setValue(e.currentTarget);
		setIsSaveToFalse(saveBtn);
		clearTimeout(Timeout)
		Timeout = setTimeout(() => {
			update(currentProject, obtenerCookie("hs"))
		}, 500);
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
		clearTimeout(Timeout)
	})
	l.addEventListener("click", (e) => {
		checkFromBox(e.currentTarget)
		setIsSaveToFalse(saveBtn);
		clearTimeout(Timeout)
		Timeout = setTimeout(() => {
			update(currentProject, obtenerCookie("hs"))
		}, 500);
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

	li.classList.add("list-element", "theme");
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
		setIsSaveToFalse(saveBtn);
		clearTimeout(Timeout)
		Timeout = setTimeout(() => {
			console.log("Updated list")
			update(currentProject, obtenerCookie("hs"))
		}, 500);
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











function createCalendarList(date, month, lang, groupId, condition) {
	const list = document.createElement("DIV");
	const box = document.createElement("DIV");
	const ul = document.createElement("UL");
	const h = document.createElement("H2");
	const p = document.createElement("P");
	const div = document.createElement("DIV");
	const plus = document.createElement("SPAN");
	const save = document.createElement("SPAN");

	plus.classList.add("calendar-action-btn", "fa", "fa-plus", "calendar-plus", "theme");
	save.classList.add("calendar-action-btn", "fa", "fa-save", "save-calendar", "theme");
	plus.setAttribute("style", "display:flex;")
	save.setAttribute("style", "display:flex;")

	div.classList.add("action-btns-box");

	p.classList.add("calendar-date");
	h.classList.add("calendar-month");

	box.classList.add("top-calendar", "theme");
	ul.classList.add("elements-list", "calendar-element-list");

	list.classList.add("calendar-list", "theme");

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
			let updated = updateCalendar(e.currentTarget.parentNode.parentNode.parentNode.lastElementChild, date, obtenerCookie("hs"), currentGroup)
			if (updated) {
				setIsSaveToTrue(e.currentTarget)
			}
		} else {
			showErrors("usernameNotFoundFromToken")
		}
	})

	if (condition) {
		list.classList.add("unable")

		const plate = document.createElement("DIV");
		plate.classList.add("plate");
		list.appendChild(plate);
		return list;
	}


	loadCalendarList(date, obtenerCookie("hs"), ul, groupId)

	return list;
}









function calendarForwardMove(id) {
	if (!(calendarSurface.scrollLeft % calendarWidth == 0)) {
		return;
	}
	if (actualPosition == daysToForward) {
		dateForward.setDate(dateForward.getDate() + 1);
		calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), id, false));
		daysToForward++;
	}

	calendarSurface.scrollLeft = calendarSurface.scrollLeft + (calendarWidth);
	actualPosition++;
}

function calendarBackwardMove(id) {
	if (!(calendarSurface.scrollLeft % calendarWidth == 0)) {
		return;
	}
	if (actualPosition == daysToBackward) {
		dateBackward.setDate(dateBackward.getDate() - 1);
		calendarSurface.insertBefore(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), id, false), calendarSurface.firstChild);
		calendarSurface.classList.add("noscroll");
		calendarSurface.scrollLeft = calendarSurface.scrollLeft + (calendarWidth);
		calendarSurface.classList.remove("noscroll");
		daysToBackward--;
	}

	calendarSurface.scrollLeft = calendarSurface.scrollLeft - (calendarWidth);
	actualPosition--;
}







function langChange(lang) {
	localStorage.setItem("lang", lang)
}

function checkLang() {
	if (localStorage.getItem("lang") == "es") {
		location.href += "/es/";
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










function themeChange(fromWindow) {
	let theme;
	const elementsToChange = document.querySelectorAll(".theme");

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
			localStorage.setItem("theme", theme)
		} else {
			theme = "l";
			localStorage.setItem("theme", theme)
		}
	}

	if (theme == "d") {
		elementsToChange.forEach((e) => {
			const [classToChange] = e.classList;
			e.classList.add(classToChange + "-dark")
		})
	} else if (theme == "l") {
		elementsToChange.forEach((e) => {
			const [classToChange] = e.classList;
			e.classList.remove(classToChange + "-dark")
		})
	}
}














async function createNewProject(token, lang, groupid) {
	removeNoProjectFound();

	let bodyContent = {};
	bodyContent.groupId = groupid;
	bodyContent.token = token;
	bodyContent.lang = lang;
	let peticion = await fetch("http://localhost:8080/api/pm/createGroupList", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(bodyContent)
	});
	peticion.json().then(data => {
		console.log(data.error)
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


async function deleteProject(e, token, groupId) {

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
		data.groupId = groupId;
		let peticion = await fetch("http://localhost:8080/api/pm/deleteGroupList", {
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
	datos.groupListId = id;
	datos.listProject = JSON.stringify(listDoc);
	datos.listProjectName = projectName;


	let peticion = await fetch("http://localhost:8080/api/pm/updateGroupList", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(datos)
	});

	peticion.json().then(data => {
		if (data.error != null) {
			showErrors(data.error)

		}
	})

}








async function updateCalendar(e, date, token, groupId) {                     //Updates the project in the DB

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
	datos.groupId = groupId;

	let peticion = await fetch("http://localhost:8080/api/pm/updateGroupCalendarDate", {
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


async function loadCalendarList(date, token, surface, groupId) {  //When you click in a project button or onload

	let bodyContent = {};
	bodyContent.date = date;
	bodyContent.groupId = groupId;
	try {
		let peticion = await fetch("http://localhost:8080/api/pm/getGroupCalendarDate", {
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
	disconnect();
	let bodyContent = {};
	bodyContent.groupListId = parseInt(id);
	bodyContent.token = token;

	connect(id);

	let peticion = await fetch("http://localhost:8080/api/pm/getGroupListData", {
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
		if (Lists == null) {
			noProjectsFound()
		}
		else if (Lists.projects != "") {
			let nombres = Lists.listProjectName.split("/");
			let ids = Lists.projects.split("/");

			for (let i = 0; i < ids.length; i++) {
				createOneProjectButton(nombres[i], ids[i], obtenerCookie("hs"));
			}

			openSelectedProjectOrFirstProject();
		} else {
			noProjectsFound()
		};
	}

}





























async function joinGroup(token, joinlink) {
	let data = {};
	data.joinlink = joinlink;
	data.token = token;
	let peticion = await fetch("http://localhost:8080/api/pm/joinGroup", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(data)
	});

	peticion.json().then(data => {
		console.log(data)
		if (data == null) {
			return;
		}
		if (data.error == null) {
			createAGroupButton(data.groupName, data.groupId);
			toggleJoinDialog();
		}
	})

}




async function leaveGroup(groupId, boxToDelete, token) {  //When you click in a project button or onload


	let confirmText = "Are you sure you want to get out of that project?";
	if (localStorage.getItem("lang") == "es") {
		confirmText = "¿Esta seguro/a de que quiere salir de ese projecto?";
	}

	let pregunta = confirm(confirmText)
	if (pregunta) {

		currentGroup = null;
		currentProject = null;
		cleanSurface(surfaceList);
		cleanSurface(projectsBox);
		disableCalendar();

		let data = {};
		data.groupId = groupId;
		data.token = token;
		let peticion = await fetch("http://localhost:8080/api/pm/leaveGroup", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		});
		let res = await peticion.json()
		console.log(res.error)

		if (res.error != null) {
			console.log("error")
			showErrors(res.error)
		}

		listName.textContent = "";
		groupBox.removeChild(boxToDelete);


	}

}





async function uploadImg(nombre, lang, token, file) {
	let bodyContent = {};
	bodyContent.token = token;

	const form = new FormData();
	form.append("file", file);
	form.append("content", JSON.stringify(bodyContent));

	let peticion = await fetch("http://localhost:8080/api/pm/uploadFile", {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + token
		},
		body: form
	});
	peticion.json().then(data => {
		console.log(data.error)

	})
}


async function createNewGroup(nombre, lang, token, file) {
	let error = checkCreateGroupValues();
	if (error != null) {
		showErrors(error);
		return;
	}
	let bodyContent = {};
	bodyContent.groupName = nombre;
	bodyContent.token = token;
	bodyContent.lang = lang;
	bodyContent = JSON.stringify(bodyContent)
	if (file == undefined) {
		let peticion = await fetch("http://localhost:8080/api/pm/createGroup", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: bodyContent
		});
		peticion.json().then(data => {
			console.log(data)
			if (data.error == null) {
				let btn = createAGroupButton(data.groupName, data.groupId)
				btn.then(btn => {
					groupButtonClickEvent(btn)
					toggleCreateDialog();
				})


			}

		})
	} else {
		const form = new FormData();
		form.append("file", file);
		form.append("content", bodyContent);

		let peticion = await fetch("http://localhost:8080/api/pm/createGroupImg", {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			body: form
		});
		peticion.json().then(data => {
			console.log(data)
			if (data.error == null) {
				let btn = createAGroupButton(data.groupName, data.groupId)
				btn.then(btn => {
					groupButtonClickEvent(btn)
					toggleCreateDialog();
				})
			}

		})
	}
}




async function getGroupImg(button, groupId, token) {
	let data = localStorage.getItem(groupId);
	let imgStored;
	if (data == null) {
		imgStored = null;
	} else {
		imgStored = data.split(", ")[0];
	}

	const form = new FormData();
	form.append("id", groupId);
	form.append("imgname", imgStored);

	let peticion = await fetch("http://localhost:8080/api/pm/getGroupImg", {
		method: 'POST',
		headers: {
			'Accept': 'multipart/form-data',
			'Authorization': 'Bearer ' + token
		},
		body: form
	});
	peticion.formData().then(data => {
		if (data != null) {
			const log = data.get("log");
			if (log == "imageIsTheSame") {
				let imgurl = localStorage.getItem(groupId).split(", ")
				button.nextElementSibling.src = imgurl[1];
				return;
			}

			const file = data.get("file");
			saveImgInLocal(file.name, file, groupId, button.nextElementSibling);


		}

	})
}











async function deleteGroup(groupId, boxToDelete, token) {


	let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese grupo?")
	if (!pregunta) return;
	let pregunta2 = confirm("¿Esta completamente seguro/a de que quiere eliminar ese grupo?")
	if (pregunta2) {

		currentGroup = null;
		currentProject = null;
		cleanSurface(surfaceList);
		cleanSurface(projectsBox);
		disableCalendar()

		let data = {};
		data.groupId = groupId;
		data.token = token;
		let peticion = await fetch("http://localhost:8080/api/pm/deleteGroup", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		});
		let res = peticion.json()
		if (res.error == undefined) {
			buildErrorLog("green", "Group deleted successfully")
		}

		groupBox.removeChild(boxToDelete);


	}
}





async function loadProjectsFromGroup(groupid, token) {   //Gets all the projects ids
	let bodyContent = {}
	bodyContent.groupId = groupid;
	bodyContent.token = token;

	loading(projectsBox)


	try {
		let peticion = await fetch("http://localhost:8080/api/pm/getAllGroupLists", {
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

		if (lists.admin == "true") {
			createAdminOptions()
		} else {
			createMemberOptions()
		}

		return lists;
	} catch (e) {
		console.log(e)
		return null;
	}
}


function createGroupButtons(Lists) {       //This needs the next one
	projectsBox.innerHTML = "";
	if (Lists != null) {
		Lists.then(data => {
			if (data == null) {
				return;
			}
			else if (data.groups != "" && data.groups != null) {
				let nombres = data.groupNames.split("/");
				let ids = data.groups.split("/");

				for (let i = 0; i < ids.length; i++) {
					createAGroupButton(nombres[i], ids[i]);
				}
			}

		});
	}

}



async function loadGroupFromUsers(token) {   //Gets all the projects ids
	let bodyContent = {}
	bodyContent.token = token;
	bodyContent.tiempo = "" + obtenerCookie("keep");

	try {
		let peticion = await fetch("http://localhost:8080/api/pm/getAllGroups", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(bodyContent)
		});

		let groups = await peticion.json();
		if (groups.error != null) {
			if (groups.error == "Forbidden") {
				showErrors("JWT")
				return null;
			} else {
				showErrors(groups.error)
				return null;
			}
		}

		userId = groups.userId;
		authenticate(groups.token);

		return groups;
	} catch (e) {

		showErrors(e.error)

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
	createGroupButtons(loadGroupFromUsers(obtenerCookie("hs")))
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), null, true));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang(), null, true));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), null, true));
	themeChange(true);
})



// document.addEventListener("readystatechange", (event) => {
// 	if (document.readyState === 'complete' && getLang() == "es") {
// 		location.href += "/es/"
// 	}
// });


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
		e.currentTarget.nextElementSibling.nextElementSibling.classList.add("unsave")
	}
})

refresh.addEventListener("click", () => {
	createProjectButtons(loadProjectsFromGroup(currentGroup, obtenerCookie("hs")))
})

listsPlus.addEventListener("click", () => {
	if (currentGroup == null) return;
	if (linkAuth.dataset.id == "logout") {
		createNewProject(obtenerCookie("hs"), getLang(), currentGroup)
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
	if (currentGroup != null && !e.currentTarget.classList.contains("disabled")) {
		calendarForwardMove(currentGroup);
	}
})


backward.addEventListener("click", (e) => {
	if (currentGroup != null && !e.currentTarget.classList.contains("disabled")) {
		calendarBackwardMove(currentGroup);
	}
})


staticLinks.forEach((s) => {
	s.addEventListener("click", (e) => {
		location.href = "https://productivityfast.pages.dev/" + e.currentTarget.dataset.id;
	})
})

linkAuth.addEventListener("click", (e) => {
	if (e.currentTarget.dataset.id == "login") {
		location.href = "https://productivityfast.pages.dev/auth?from=projectmanager";
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




groupBtn.forEach((button) => {
	button.addEventListener("mouseenter", (e) => { showGroupName(e.currentTarget, false); })
	button.addEventListener("mouseleave", (e) => { e.currentTarget.nextElementSibling.nextElementSibling.style.width = "" })
})


joinGroupBtn.addEventListener("click", () => {
	if (linkAuth.dataset.id == "logout") {
		toggleJoinDialog();
	}

})
joinBackground.addEventListener("click", () => {
	toggleJoinDialog();
})

joinDialog.addEventListener("click", (e) => {
	e.stopPropagation();
})
joinButtons.forEach((j) => {
	j.addEventListener("click", (e) => {
		if (e.currentTarget.dataset.id == "back") {
			toggleJoinDialog();
		}
	})
})
joinBtn.addEventListener("click", () => {
	if (linkAuth.dataset.id == "logout") {
		joinGroup(obtenerCookie("hs"), joinInput.value);
	}

})





createGroupBtn.addEventListener("click", () => {
	if (linkAuth.dataset.id == "logout") {
		toggleCreateDialog();
	}
})
createBackground.addEventListener("click", () => {
	toggleCreateDialog();
})

createDialog.addEventListener("click", (e) => {
	e.stopPropagation();
})
createButtons.forEach((j) => {
	j.addEventListener("click", (e) => {
		if (e.currentTarget.dataset.id == "back") {
			toggleCreateDialog();
		}
	})
})


createBtn.addEventListener("click", () => {
	if (linkAuth.dataset.id == "logout") {
		createNewGroup(createInput.value, "es", obtenerCookie("hs"), file.files[0]);
	}

})




file.addEventListener("change", (e) => {
	let image = e.currentTarget.files[0];
	uploadImageBox.removeChild(uploadImageDiv)
	const img = document.createElement("IMG")
	img.src = URL.createObjectURL(e.currentTarget.files[0])
	img.classList.add("uploadImage")
	img.addEventListener("click", () => { file.click(); })
	uploadImageBox.insertBefore(img, e.currentTarget)
	uploadLabel.textContent = image.name;
})



uploadImageDiv.addEventListener("click", () => {
	file.click();
})



menu.addEventListener("click", (e) => {
	e.stopPropagation();
})

body.addEventListener("click", () => {
	hideOptions();
})

options.addEventListener("click", (e) => {
	e.stopPropagation();
	if (currentGroup != null) {
		toggleOptions();
	}

})


dialogB.addEventListener("click", (e) => {
	dialogBackgroundToggle()
})

dialog.addEventListener("click", (e) => {
	e.stopPropagation()
})






export default {
	toggleJoinDialog, loading, obtenerCookie, updateGroup, saveImgInLocal, getGroupButton
	, showErrors, buildErrorLog
};