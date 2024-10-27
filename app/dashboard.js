







// CREATING THE DATA STRUCTURES	AND UTILS ------------------------------------------------

class HistorialNode {
	constructor(type, node, id, pos, selected, links) {
		this.type = type;
		this.node = node;
		this.id = id;
		this.pos = pos;
		this.links = links;
		this.selected = selected;
		this.prev = null;
	}
}

class Stack {
	constructor() {
		this.first = null;
		this.last = null;
		this.length = 0;
	}

	push(type, node, id, pos, selected, links) {
		const nodo = new HistorialNode(type, node, id, pos, selected, links);
		if (this.length == 0) {
			this.first = nodo;
		} else {
			const last = this.last;
			nodo.prev = last;
		}
		this.last = nodo;
		this.length++;
		return this;
	}

	pop() {
		if (!this.length) return null;

		const nodo = this.last;

		if (this.length == 1) {
			this.first = null;
			this.last = null;
		} else {
			this.last = nodo.prev;
		}

		this.length--;

		return nodo;
	}
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

// VARIABLE INSTANSIATION ----------------------------------------------------------------

const colorBtns = document.querySelectorAll(".color-button");
const moveBtns = document.querySelectorAll(".move-speed-button");
const toolBtns = document.querySelectorAll(".tool-button");
const linkBtns = document.querySelectorAll(".link-type");
const nodeBtns = document.querySelectorAll(".node-type");

const saveBtn = document.querySelector(".save-button");
const newFileBtn = document.querySelector(".newfile");
const searchBtn = document.querySelector(".search");
const refreshBtn = document.querySelector(".refresh");

const profileBtn = document.querySelector(".profile-button");
const settingsBackground = document.querySelector(".profile-background");
const settingsBox = document.querySelector(".profile-box");

const aside = document.getElementById("main-article");
const projectsBox = document.getElementById("main-section");
const projectSection = document.getElementById("main-section");
const sectionColor = document.getElementById("section-color");
const body = document.querySelector("body");
const speedSwitchBtn = document.querySelector(".move-speed-button-switch");
const colorSwitchBtn = document.querySelector(".color-button-switch");
const colorSpace = document.querySelector(".space-section-color");
const asideSwitchBtn = document.querySelector(".switch-aside");
const errorLog = document.querySelector(".error-log-message");
const noProjectSelectedPanel = document.querySelector(".noProjectSelected");

const surface = document.getElementById("surface");
const svg = document.getElementById("lines-surface", 'svg');

const themeBtn = document.querySelector(".theme-btn")
const langBtn = document.querySelector(".lang-btn")
const linkAuth = document.getElementById("linkAuth")

let Historial = new Stack();
let HistorialReverse = new Stack();



let moving, x1, y1, d = 0, mod = 1, buttonPressed,
	movingNode, nodeToMove, mouseOffsetX,
	mouseOffsetY, moved, actualTool = 1,
	selected = [], isASelected = false,
	nodeToLink = null, linkType = "",
	nodeType = "square", currentProject = null,
	idToDelete, isSave = true, LangNodeName = "Untitled Node",
	LangProjectName = "Untitled Project";

window.scrollTo({
	left: (surface.offsetWidth / 2) - (screen.width / 2),
	top: (surface.offsetHeight / 2) - (screen.height / 2) + 50
})



/*
window.addEventListener("load",()=>{
	Projects = loadProjectsFromUsers(obtenerCookie("hs"))
	createProjectButtons(Projects);
	currentProject = Projects[0][1];
	loadProjectOnAction(currentProject);
})
*/


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

function toggleSpeedButtons() {
	moveBtns.forEach((b) => {
		b.classList.toggle("translateSpeedx" + b.dataset.id)
	})
}

function cleanActual() {
	moveBtns.forEach((b) => {
		b.classList.remove("actual-tool")
	})
}

function cleanActualTool() {
	toolBtns.forEach((b) => {
		b.classList.remove("actual-tool")
	})
}

function cleanSelected() {
	selected.forEach((s) => {
		s.classList.remove("selected");
	})
	selected = [];
}

function cleanSelectedToLink() {
	const selectedToLink = document.querySelectorAll(".selectedToLink");
	selectedToLink.forEach((s) => {
		s.classList.remove("selectedToLink");
	})
	nodeToLink = null;
}

function changeButtonSpan(form, e) {
	if (form == "square") {
		e.classList.add("fa-square-o");
		e.classList.remove("fa-circle-o");
	} else {
		e.classList.remove("fa-square-o");
		e.classList.add("fa-circle-o");
	}
}

function hideToolBtns() {
	linkBtns.forEach((b) => {
		b.classList.remove("translateLink" + b.dataset.id);
	})
	nodeBtns.forEach((b) => {
		b.classList.remove("translateLink" + b.dataset.id);
	})
}

function deselectAllLinkType() {
	linkBtns.forEach((b) => {
		b.classList.remove("actual-tool");
	})
}

function deselectAllNodeType() {
	nodeBtns.forEach((b) => {
		b.classList.remove("actual-tool");
	})
}

function showModifiButtons(element) {
	element.lastElementChild.classList.remove("hideMod")
}

function hideModifiButtons(element) {
	element.lastElementChild.classList.add("hideMod")
}

function setIsSaveToFalse() {
	if (isSave) {
		isSave = false;
		saveBtn.classList.add("unsave")
	}
}

function setIsSaveToTrue() {
	if (!isSave) {
		isSave = true;
		saveBtn.classList.remove("unsave")
	}
}

function setProjectName(e) {
	document.querySelector(".actual-project").children[0].textContent = e.value;
	e.textContent = "";
	e.classList.add("hideInput")
	setIsSaveToFalse();
}

function editProjectName(e) {

	let box = e.parentNode.parentNode;
	let input = box.children[1];
	let p = box.children[0];
	input.value = p.textContent;
	p.textContent = "";
	input.classList.remove("hideInput");
	input.focus()

	input.addEventListener("keypress", (e) => {
		if (e.code == "Enter") {
			setProjectName(e.currentTarget)
		}
	})
	input.addEventListener("blur", (e) => {
		setProjectName(e.currentTarget)
	})

}

function cleanSurface() {
	surface.innerHTML = "";
	svg.innerHTML = `<defs>
						<marker id="arrow" markerWidth="10" markerHeight="10" refX="32" refY="3" 
						orient="auto" markerUnits="strokeWidth">
						<path d="M0,0 L2,3 0,6 9,3" fill="#000" />
						</marker>
					</defs>`;
}

function cleanActualProject() {

	const projectsBtns = document.querySelectorAll(".project-box");

	projectsBtns.forEach((p) => {
		p.classList.remove("actual-project")
	})
}

function setActualProject(e) {
	cleanActualProject();
	e.classList.add("actual-project")
	currentProject = e.dataset.id;
	localStorage.setItem("selectedNw", e.dataset.id)
}

function openFirstProject() {
	cleanSurface();
	loadProjectOnAction(projectsBox.firstChild.dataset.id, obtenerCookie("hs"))
	cleanActualProject();
	setActualProject(projectsBox.firstChild);
}

function openSelectedProjectOrFirstProject() {
	if (localStorage.getItem("selectedNw") == null) {
		openFirstProject();
		return;
	}
	let projectos = document.querySelectorAll(".project-box"), found = false;
	projectos.forEach((p) => {
		if (p.dataset.id == localStorage.getItem("selectedNw")) {
			loadProjectOnAction(p.dataset.id, obtenerCookie("hs"));
			cleanActualProject();
			setActualProject(p);
			found = true;
		}
	})
	if (!found) {
		openFirstProject();
	}

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
	}, 12000)
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
	} else if (error == "") {

	} else if (error == "") {

	} else if (error == "") {

	} else if (error == "") {

	}
}

function noProjectsFound() {
	projectsBox.innerHTML = "";
	let noProjects = document.createElement("LABEL");
	noProjects.classList.add("noProject")
	noProjects.setAttribute("style", "margin-top: 8px")
	noProjects.textContent = "No tienes ningun projecto";
	projectsBox.appendChild(noProjects);
}

function loading(e) {
	const span = document.createElement("SPAN")
	span.classList.add("loading")
	e.appendChild(span);
}

function createOneProjectButton(nombre, id, token) {
	const button = document.createElement("DIV");
	const p = document.createElement("P");
	const input = document.createElement("INPUT");
	input.classList.add("project-input", "hideInput");
	input.setAttribute("maxlength", "50");
	button.appendChild(p);
	button.appendChild(input);
	p.classList.add("project-name");
	p.textContent = nombre;
	button.classList.add("project-box");
	button.dataset.id = id;
	button.appendChild(createModifiBtns());
	button.addEventListener("mouseenter", (e) => { showModifiButtons(e.currentTarget); })
	button.addEventListener("mouseleave", (e) => { hideModifiButtons(e.currentTarget); })
	button.addEventListener("click", (e) => {
		if (!isSave && e.currentTarget.dataset.id != currentProject) {
			update(currentProject, token)
		}
		loadProjectOnAction(e.currentTarget.dataset.id, obtenerCookie("hs"));
		setActualProject(e.currentTarget);
		setIsSaveToTrue();
	})
	projectsBox.appendChild(button);
	return button;
}

function toggleSettings() {
	settingsBackground.classList.toggle("hideDisplay")
	settingsBackground.classList.toggle("appearS")
	settingsBox.classList.toggle("appearSB")
}



function langChange() {
	let lang;
	if (getLang() == "en") {
		lang = "es";
		LangNodeName = "Nodo sin título";
		LangProjectName = "Projecto sin título";
		localStorage.setItem("lang", "es")
	} else {
		lang = "en";
		LangNodeName = "Untitled node";
		LangProjectName = "Untitled Project";
		localStorage.setItem("lang", "en")
	}


	const langElements = document.querySelectorAll(".lang");

	langElements.forEach((e) => {
		if (e.dataset == "logout") {
			e.textContent = e.getAttribute(lang + "l");
		} else {
			e.textContent = e.getAttribute(lang);
		}
	})
}



function checkLang() {
	if (localStorage.getItem("lang") == "es") {
		const langElements = document.querySelectorAll(".lang");

		langElements.forEach((e) => {
			if (e.dataset == "logout") {
				e.textContent = e.getAttribute("esl");
			} else {
				e.textContent = e.getAttribute("es");
			}

		})

		LangNodeName = "Nodo sin título";
		LangProjectName = "Projecto sin título";
	}
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
.main-article
.tools-box
.tool-type-box
.surface
.profile-button
.profile-box
.profile-mid-button
.profile-bottom-button
.project-box
.project-input
.tool-button
.modifi-btn-box
.nodo
.line
*/



function themeChange(fromWindow) {
	let theme;
	const main = document.querySelector(".main-article");
	const tools = document.querySelectorAll(".tools-box");
	const toolsBtns = document.querySelectorAll(".tool-button");
	const toolsTypes = document.querySelectorAll(".tool-type-box");
	const modifi = document.querySelectorAll(".modifi-btn-box");
	const surface = document.querySelector(".surface");
	const profileBtn = document.querySelector(".profile-button");
	const profileBox = document.querySelector(".profile-box");
	const profileMidBtn = document.querySelectorAll(".profile-mid-button");
	const profileBottomBtn = document.querySelectorAll(".profile-bottom-button");
	const projectBoxs = document.querySelectorAll(".project-box");
	const projectInput = document.querySelectorAll(".project-input");
	const nodes = document.querySelectorAll(".nodo");
	const lines = document.querySelectorAll(".line");

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
		main.classList.add("main-article-dark")

		surface.classList.add("surface-dark")

		profileBtn.classList.add("profile-button-dark")

		profileBox.classList.add("profile-box-dark")

		tools.forEach((l) => { l.classList.add("tools-box-dark") })

		toolsBtns.forEach((l) => { l.classList.add("tool-button-dark") })

		toolsTypes.forEach((l) => { l.classList.add("tool-type-box-dark") })

		modifi.forEach((l) => { l.classList.add("modifi-btn-box-dark") })

		profileMidBtn.forEach((l) => { l.classList.add("profile-mid-button-dark") })

		profileBottomBtn.forEach((l) => { l.classList.add("profile-bottom-button-dark") })

		projectBoxs.forEach((l) => { l.classList.add("project-box-dark") })

		projectInput.forEach((l) => { l.classList.add("project-input-dark") })

		nodes.forEach((l) => { l.classList.add("nodo-dark") })

		lines.forEach((l) => { l.classList.add("line-dark") })

	} else if (theme == "l") {
		main.classList.remove("main-article-dark")

		surface.classList.remove("surface-dark")

		profileBtn.classList.remove("profile-button-dark")

		profileBox.classList.remove("profile-box-dark")

		tools.forEach((l) => { l.classList.remove("tools-box-dark") })

		toolsBtns.forEach((l) => { l.classList.remove("tool-button-dark") })

		toolsTypes.forEach((l) => { l.classList.remove("tool-type-box-dark") })

		modifi.forEach((l) => { l.classList.remove("modifi-btn-box-dark") })

		profileMidBtn.forEach((l) => { l.classList.remove("profile-mid-button-dark") })

		profileBottomBtn.forEach((l) => { l.classList.remove("profile-bottom-button-dark") })

		projectBoxs.forEach((l) => { l.classList.remove("project-box-dark") })

		projectInput.forEach((l) => { l.classList.remove("project-input-dark") })

		nodes.forEach((l) => { l.classList.remove("nodo-dark") })

		lines.forEach((l) => { l.classList.remove("line-dark") })
	}
}


function setLoginToLogout() {
	linkAuth.dataset.id = "logout";
	if (getLang() == "es") {
		linkAuth.textContent = linkAuth.getAttribute("esl");
	} else if (getLang() == "en" || getLang() == null) {
		linkAuth.textContent = linkAuth.getAttribute("enl");
	}
}

function setLogoutToLogin() {
	linkAuth.dataset.id = "login";
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























async function createNewProject(token) {

	let bodyContent = {};
	bodyContent.token = token;
	let peticion = await fetch("http://localhost:8080/api/nw/create", {
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
			btn = createOneProjectButton(LangProjectName, data.projects, obtenerCookie("hs"))
		} else {
			projectsBox.innerHTML = "";
			btn = createOneProjectButton(LangProjectName, data.projects, obtenerCookie("hs"))
		}
		if (!isSave) {
			update(currentProject, token)
		}
		loadProjectOnAction(btn.dataset.id, obtenerCookie("hs"));
		setActualProject(btn);
		setIsSaveToTrue();

	})
}


async function deleteProject(e, token) {

	idToDelete = e.currentTarget.parentNode.parentNode.dataset.id;

	let boxToDelete = e.currentTarget.parentNode.parentNode;
	console.log(idToDelete)

	let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese projecto?")
	if (pregunta) {
		if (currentProject == idToDelete) {
			currentProject = null;
		}
		let data = {};
		data.nodeId = idToDelete;
		data.token = token;
		let peticion = await fetch("http://localhost:8080/api/nw/delete", {
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


		if (projectsBox.children.length != 0 && currentProject == null) {
			openFirstProject();
		} else if (projectsBox.children.length == 0) {
			noProjectsFound();
		}
	}




}


function createModifiBtns() {
	const div = document.createElement("DIV");
	div.classList.add("modifi-btn-box", "hideMod");

	const spanDel = document.createElement("SPAN");
	spanDel.addEventListener("click", (e) => {
		e.stopPropagation();
		deleteProject(e, obtenerCookie("hs"))
	});
	const spanEdit = document.createElement("SPAN");
	spanEdit.addEventListener("click", (e) => {
		if (e.currentTarget.parentNode.parentNode.dataset.id == currentProject) {
			e.stopPropagation();
		}
		editProjectName(e.currentTarget);
	})

	spanDel.classList.add("modifi-btn", "del", "fa", "fa-trash")
	spanEdit.classList.add("modifi-btn", "edit", "fa", "fa-edit")

	div.appendChild(spanEdit);
	div.appendChild(spanDel);

	return div;
}


async function update(id, token) {                     //Updates the project in the DB

	let nodeDoc = JSON.parse("[]");
	let linkDoc = JSON.parse("[]");
	let projectName = "";

	const nodos = document.querySelectorAll(".nodo");
	const lines = document.querySelectorAll(".line");
	const projects = document.querySelectorAll(".project-box");

	projects.forEach((p) => {
		if (p.dataset.id == id) {
			projectName = p.textContent;
		}
	})

	nodos.forEach((n) => {
		let type = "sq";
		let check = "f";
		if (n.classList.contains("check")) check = "t";
		if (n.classList.contains("circle")) type = "cir";
		nodeDoc[nodeDoc.length] = JSON.parse(`
		   {"i": "${n.dataset.id}", 
			"x":"${n.getAttribute("x")}", 
			"y":"${n.getAttribute("y")}", 
			"c":"${check}",
			"tx":"${n.firstChild.value}",
			"tp":"${type}"}`);
	})

	lines.forEach((l) => {
		linkDoc[linkDoc.length] = JSON.parse(`
			{"i1": "${l.getAttribute("id1")}", 
			 "i2": "${l.getAttribute("id2")}", 
			 "arw":"${(l.classList.contains("arrow"))}"}`);
	})



	let datos = {};
	datos.nodeId = id;
	datos.nodeProject = JSON.stringify(nodeDoc);
	datos.nodeProjectName = projectName;
	datos.linkProject = JSON.stringify(linkDoc);


	let peticion = await fetch("http://localhost:8080/api/nw/update", {
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


async function loadProjectOnAction(id, token) {  //When you click in a project button or onload

	let bodyContent = {};
	bodyContent.nodeId = parseInt(id);
	bodyContent.token = token;
	let peticion = await fetch("http://localhost:8080/api/nw/getData", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify(bodyContent)
	});
	let project = await peticion.json();

	loadProject(project);
	document.querySelectorAll(".project-box").forEach((p) => {
		if (p.dataset.id == id) {
			setActualProject(p);
		}
	})

}
function loadProject(Project) {       		   //This is needed in the above one  
	cleanSurface();
	let nodeDoc = JSON.parse(Project.nodeProject);
	let linkDoc = JSON.parse(Project.linkProject);
	if (nodeDoc != null) {
		nodeDoc.forEach((d) => {
			if (d.tp == "circle") {
				d.y = 70;
			}
			const node = createNode(d.x, d.y, d.tp, d.tx);
			node.dataset.id = d.i;
			node.firstChild.textContent = d.tx;
			if (d.c == "t") node.classList.add("check");
			surface.appendChild(node);
		})
		if (linkDoc != null) {
			const nodos = document.querySelectorAll(".nodo");
			linkDoc.forEach((l) => {
				generateLink(l.i1, l.i2, l.arw, nodos);
			})
		}
	}



}


function createProjectButtons(Projects) {       //This needs the next one
	projectsBox.innerHTML = "";
	if (Projects != null) {
		Projects.then(data => {
			if (data == null) {
				return;
			}
			else if (data.projects != "") {
				let nombres = data.nodeProjectName.split("/");
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
	console.log(bodyContent.tiempo)

	loading(projectsBox)


	try {
		let peticion = await fetch("http://localhost:8080/api/nw/getAllProjects", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(bodyContent)
		});


		let projects = await peticion.json();
		if (projects.error != null) {
			if (projects.error == "Internal Server Error" && projects.message.startsWith("JWT")) {
				showErrors("JWT")
				return null;
			} else {
				showErrors(projects.error)
				return null;
			}
		}

		authenticate(projects.token);

		return projects;
	} catch (e) {
		console.log(e)
		return null;
	}

}


//  DD        D      D D D      D D D D       D D D D D            D D D D D D
//  D D       D    D       D    D       D     D                    D
//  D  D      D   D         D   D        D    D                    D
//  D   D     D   D         D   D        D    D                    D 
//  D    D    D   D         D   D        D    D D D                D D D D
//  D     D   D   D         D   D        D    D                    D
//  D      D  D   D         D   D        D    D                    D
//  D       D D    D       D    D       D     D                    D
//  D        DD      D D D      D D D D       D D D D D            D


// NODE FUNCTIONS ---------------------

function move(x1, y1, x2, y2) {
	if (y1 < y2) {
		window.scrollTo({
			top: window.scrollY - ((y2 - y1) * mod)
		})
	} else {
		window.scrollTo({
			top: window.scrollY + ((y1 - y2) * mod)
		})
	}
	if (x1 < x2) {
		window.scrollTo({
			left: window.scrollX - ((x2 - x1) * mod)
		})
	} else {
		window.scrollTo({
			left: window.scrollX + ((x1 - x2) * mod)
		})
	}
}

function moveNode(x, y) {
	nodeToMove.setAttribute("style", "top:" + (y) + "px;left:" + (x) + "px");
	nodeToMove.setAttribute("x", x);
	nodeToMove.setAttribute("y", y);
	setIsSaveToFalse();
}

function moveMultiNode(x1, y1, x2, y2) {
	x1 = parseInt(x1),
		y1 = parseInt(y1),
		x2 = parseInt(x2),
		y2 = parseInt(y2);
	nodeToMove.setAttribute("style", "top:" + (y1 + y2) + "px;left:" + (x1 + x2) + "px");
	nodeToMove.setAttribute("x", x1 + x2);
	nodeToMove.setAttribute("y", y1 + y2);
	setIsSaveToFalse();
}

function nodeMouseDownEvent(e) {
	movingNode = true;
	nodeToMove = e.currentTarget;
	mouseOffsetX = e.offsetX;
	mouseOffsetY = e.offsetY;
	if (!selected.length == 0) {
		selected.forEach((s) => {
			let x1 = e.pageX - mouseOffsetX, y1 = e.pageY - mouseOffsetY, x2 = s.getAttribute("x"), y2 = s.getAttribute("y"), difx, dify;
			difx = (x2 - x1);
			dify = (y2 - y1);
			s.setAttribute("difx", difx);
			s.setAttribute("dify", dify);
		})
	}
}

function nodeMouseMoveEvent(e) {
	e.stopPropagation();
	if (movingNode && buttonPressed == 0) {
		selected.forEach((s) => {
			if (s == nodeToMove) {
				isASelected = true;
			}
		})
		if (!selected.length == 0 && isASelected) {
			if (!moved) {

				let selectedHistorial = [];
				for (let i = 0; i < selected.length; i++) {
					selectedHistorial[i] = selected[i].dataset.id + "/" + selected[i].getAttribute("x") + "/" + selected[i].getAttribute("y");
				}
				Historial.push("moveMulti", null, null, null, selectedHistorial, null);
				setHistorialReverseToDefault();
			}
			moved = true;
			selected.forEach((s) => {
				nodeToMove = s;
				moveMultiNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY, s.getAttribute("difx"), s.getAttribute("dify"));
				updateLinkPositions(nodeToMove);
			})
		} else {
			if (!moved) {
				let pos = nodeToMove.getAttribute("x") + "/" + nodeToMove.getAttribute("y");
				Historial.push("moveSingle", nodeToMove, nodeToMove.dataset.id, pos, null, null);
				setHistorialReverseToDefault();
			}
			moved = true;
			moveNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY);
			updateLinkPositions(nodeToMove);
		}
	}
}

function nodeMouseUpEvent(e) {
	if (movingNode && moved) {
		moved = false;
	} else if (!moved && actualTool == 1 && e.button == 0 && e.shiftKey) {
		cleanSelected();
	} else if (!moved && actualTool == 1) {
		if (document.querySelectorAll(".selected") && selected.length == 0) {
			cleanSelected();
		}
		if (!e.currentTarget.classList.contains("selected")) {
			let encontrado = false;
			selected.forEach((s) => {
				if (s.dataset.id == e.currentTarget.dataset.id) {
					encontrado = true;
				}
			})
			if (!encontrado) {
				selected.push(e.currentTarget);
			}
		} else {
			let selectedNew = [];
			selected.forEach((s) => {
				if (s.dataset.id != e.currentTarget.dataset.id) {
					selectedNew.push(s);
				}
			})
			selected = selectedNew;
		}
		e.currentTarget.classList.toggle("selected");

	} else if (!moved && actualTool == 2) {
		let links = [];
		const lines = document.querySelectorAll(".line");
		lines.forEach((l) => {
			if (l.getAttribute("id1") == e.currentTarget.dataset.id || l.getAttribute("id2") == e.currentTarget.dataset.id) {
				links.push(l);
			}
		})
		deleteLinks(links);
		let pos = e.currentTarget.getAttribute("x") + "/" + e.currentTarget.getAttribute("y");
		Historial.push("delete", e.currentTarget, e.currentTarget.dataset.id, pos, null, links)
		surface.removeChild(e.currentTarget);
		setHistorialReverseToDefault();

	} else if (!moved && actualTool == 3) {

		e.currentTarget.classList.toggle("check");
		Historial.push("check", e.currentTarget, e.currentTarget.dataset.id, null, null, null);

	} else if (!moved && actualTool == 4) {

		if (nodeToLink == null) {
			cleanSelected();
			nodeToLink = e.currentTarget;
			e.currentTarget.classList.add("selectedToLink");
		} else if (nodeToLink != e.currentTarget) {
			let encontrado = false;
			const lines = document.querySelectorAll(".line");
			lines.forEach((l) => {
				if (l.getAttribute("id1") == nodeToLink.dataset.id && l.getAttribute("id2") == e.currentTarget.dataset.id) {
					cleanSelectedToLink();
					encontrado = true;
				}
			})
			if (!encontrado) {
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				createLink(line, calcPositions
					(nodeToLink, e.currentTarget),
					"black", 5, nodeToLink.dataset.id, e.currentTarget.dataset.id, linkType);
				line.addEventListener("click", (e) => {
					svg.removeChild(e.currentTarget)
				})
				svg.appendChild(line);
				cleanSelectedToLink();
				Historial.push("link", line, null, null, null, null);
				hideToolBtns();
			}


		} else {
			cleanSelectedToLink();
		}

	}
	isASelected = false;

	setIsSaveToFalse();
}

function setAttributes(el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

function nodeDoubleClickEvent(e) {
	if (actualTool == 1) {
		let texta = e.currentTarget.children[0];
		texta.classList.remove("hide")
		texta.removeAttribute("readonly");
		texta.focus();
	}

}

function unselectTextArea() {
	const areas = document.querySelectorAll(".nodoTextArea");
	areas.forEach((a) => {
		a.classList.add("hide")
		a.setAttribute("readonly", "readonly")
	})
}

function createNode(x, y, tp, tx) {
	let type = "square";
	if (tp == "cir" || tp == "circle") type = "circle";
	const div = document.createElement("DIV");
	const area = document.createElement("TEXTAREA");
	area.classList.add("nodoTextArea", "hide", type + "-text")
	area.setAttribute("readonly", "readonly")
	area.value = tx;
	div.classList.add("nodo", type);
	if (localStorage.getItem("theme") == "d") div.classList.add("nodo-dark");
	div.setAttribute("style", "top:" + (y) + "px;left:" + (x) + "px");
	div.setAttribute("x", x);
	div.setAttribute("y", y);
	div.appendChild(area);
	div.dataset.id = Math.floor(Math.random() * 10000);


	area.addEventListener("keypress", (e) => {
		if (e.code == "Enter") {
			unselectTextArea();
		}
	})
	div.addEventListener("dblclick", (e) => {
		Historial.push("rename", nodeToMove.children[0].value, nodeToMove.dataset.id, null, null, null);
		nodeDoubleClickEvent(e);
		cleanSelected();
	})
	div.addEventListener("mousedown", (e) => {
		nodeMouseDownEvent(e);
	});

	div.addEventListener("mousemove", (e) => {
		nodeMouseMoveEvent(e);
	});

	div.addEventListener("mouseup", (e) => {
		nodeMouseUpEvent(e);
	});
	return div;
}

function generateLink(id1, id2, isArrow, nodes) {
	let first, second, arrow = "";
	if (isArrow == "true") arrow = "arrow";

	nodes.forEach((n) => {
		if (n.dataset.id == id1) {
			first = n;
		}
	})
	nodes.forEach((n) => {
		if (n.dataset.id == id2) {
			second = n;
		}
	})


	if (first != null && second != null) {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		createLink(line, calcPositions(first, second), "black", 5, first.dataset.id,
			second.dataset.id, arrow);
		svg.appendChild(line)
	}
}

function createLink(line, dots, color, width, id1, id2, isArrow) {
	setAttributes(line, {
		'class': `line ${isArrow}`,
		'id1': id1,
		'id2': id2,
		'x1': dots[0],
		'y1': dots[1],
		'x2': dots[2],
		'y2': dots[3],
		'stroke': color,
		'stroke-width': width
	});
}

function updateLinkAttribute(line, dots, part) {
	if (part == "start") {
		setAttributes(line, {
			'x1': dots[0],
			'y1': dots[1],
		});
	} else {
		setAttributes(line, {
			'x2': dots[0],
			'y2': dots[1],
		});
	}
}

function updateAllLinks() {
	const nodos = document.querySelectorAll(".nodo");
	nodos.forEach((n) => {
		updateLinkPositions(n);
	})
}

function updateLinkPositions(obj) {
	const lines = document.querySelectorAll(".line");
	lines.forEach((l) => {
		if (l.getAttribute("id1") == obj.dataset.id) {
			updateLinkAttribute(l, calcPos(obj), "start");
		}
	})
	lines.forEach((l) => {
		if (l.getAttribute("id2") == obj.dataset.id) {
			updateLinkAttribute(l, calcPos(obj), "end");
		}
	})
}

function calcPositions(obj1, obj2) {
	let difx = 70, dify = 55;
	if (obj1.classList.contains("circle")) {
		dify = 70;
	}
	let dot1x = parseInt(obj1.getAttribute("x")) + difx;
	let dot1y = parseInt(obj1.getAttribute("y")) + dify;

	difx = 70; dify = 55;

	if (obj2.classList.contains("circle")) {
		dify = 70;
	}
	let dot2x = parseInt(obj2.getAttribute("x")) + difx;
	let dot2y = parseInt(obj2.getAttribute("y")) + dify;

	return [dot1x, dot1y, dot2x, dot2y];
}

function calcPos(obj1) {
	let difx = 70, dify = 55;
	if (obj1.classList.contains("circle")) {
		dify = 70;
	}
	let dotx = parseInt(obj1.getAttribute("x")) + difx;
	let doty = parseInt(obj1.getAttribute("y")) + dify;

	return [dotx, doty];
}


function createLinks(links) {
	if (links == null) return;

	const lines = document.querySelectorAll(".line");
	let encontrado = false;

	if (lines.length == 0) {
		links.forEach((link) => {
			svg.appendChild(link);
		})
	} else {
		links.forEach((link) => {
			lines.forEach((line) => {
				if (link.getAttribute("id1") == line.getAttribute("id1") && link.getAttribute("id2") == line.getAttribute("id2")) {
					encontrado = true;
				}
			})

			if (!encontrado) {
				svg.appendChild(link);
			}
			encontrado = false;
		})
	}

}

function deleteLinks(links) {
	const lines = document.querySelectorAll(".line");

	if (lines.length == 0) {
		return;
	}

	lines.forEach((line) => {
		links.forEach((link) => {
			if (link.getAttribute("id1") == line.getAttribute("id1") && link.getAttribute("id2") == line.getAttribute("id2")) {
				svg.removeChild(link);
			}
		})
	})
}







//     D D D D     D         D   D D D D      D D D D D D              D D D D D D 
//   D         D   D         D   D       D    D                        D
//  D              D         D   D        D   D                        D
//   D             D         D   D       D    D D D D                  D
//     D D D D     D         D   D D D D      D                        D D D D
//             D   D         D   D      D     D                        D
//              D  D         D   D       D    D                        D
//   D         D    D       D    D        D   D                        D
//     D D D D        D D D      D        D   D                        D


// SURFACE FUNCTIONS ------------------

function surfaceMouseDownEvent(e) {
	x1 = e.clientX;
	y1 = e.clientY;
	moving = true;
	buttonPressed = e.button;
}

function surfaceMouseMoveEvent(e) {
	if (moving && buttonPressed == 2) {
		move(x1, y1, e.clientX, e.clientY)
		x1 = e.clientX;
		y1 = e.clientY;
	} else if (movingNode && buttonPressed == 0) {
		selected.forEach((s) => {
			if (s == nodeToMove) {
				isASelected = true;
			}
		})
		if (!selected.length == 0 && isASelected) {
			moved = true;
			selected.forEach((s) => {
				nodeToMove = s;
				moveMultiNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY, s.getAttribute("difx"), s.getAttribute("dify"));
			})
		} else {
			moved = true;
			moveNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY);
		}
	}
}

function surfaceMouseUpEvent(e) {
	moving = false;
	if (buttonPressed == 0 && !movingNode && actualTool == 1 && currentProject != null) {
		let difx = 70, dify = 55;
		if (nodeType == "circle") {
			dify = 70;
		}
		const div = createNode(e.offsetX - difx, e.offsetY - dify, nodeType, LangNodeName);
		surface.appendChild(div);
		let pos = div.getAttribute("x") + "/" + div.getAttribute("y");
		Historial.push("create", div, div.dataset.id, "" + pos, null, null);
		setHistorialReverseToDefault();
		hideToolBtns();
		setIsSaveToFalse();
	}
	movingNode = false;
	moved = false;
}

function bodyKeyPressEvent(e) {
	if (e.code == "KeyZ" && e.ctrlKey && e.shiftKey && HistorialReverse.length != 0) {
		updateHistorial(HistorialReverse.last, "Historial");
		goBack(HistorialReverse.last, "HistorialReverse");
		setIsSaveToFalse();
	}
	else if (e.code == "KeyZ" && e.ctrlKey && !e.shiftKey && Historial.length != 0) {
		updateHistorial(Historial.last, "HistorialReverse")
		goBack(Historial.last, "Historial");
		setIsSaveToFalse();
	}
}







//  D       D   D D D D      D D D D     D D D D D D              D D D D D D
//  D       D      D       D         D        D                   D
//  D       D      D      D                   D                   D
//  D       D      D       D                  D                   D
//  D D D D D      D         D D D D          D                   D D D D 
//  D       D      D                 D        D                   D
//  D       D      D                  D       D                   D  
//  D       D      D       D         D        D                   D 
//  D       D   D D D D      D D D D          D                   D


// Historial FUNCTIONS ------------------

function updateHistorial(last, which) {
	if (last.type == "moveSingle") {

		updateHistorialMoveSingle(last, which);

	} else if (last.type == "moveMulti") {

		updateHistorialMoveMulti(last, which);

	} else if (last.type == "create") {

		updateHistorialCreate(last, which);

	} else if (last.type == "delete") {

		updateHistorialDelete(last, which);

	} else if (last.type == "rename") {

		(which == "Historial") ? Historial.push(last.type, nodeToMove.children[0].value, last.id, last.pos, last.selected, last.links) : HistorialReverse.push(last.type, nodeToMove.children[0].value, last.id, last.pos, last.selected, last.links);

	} else {

		(which == "Historial") ? Historial.push(last.type, last.node, last.id, last.pos, last.selected, last.links) : HistorialReverse.push(last.type, last.node, last.id, last.pos, last.selected, last.links);

	}
}

function goBack(last, which) {
	if ((last.type == "create" && which == "Historial") || (last.type == "delete" && which == "HistorialReverse")) {
		const nodos = document.querySelectorAll(".nodo");
		nodos.forEach((n) => {
			if (last.id == n.dataset.id) {
				surface.removeChild(n);
			}
		})
		deleteLinks(last.links);
		updateAllLinks();
	}
	else if ((last.type == "delete" && which == "Historial") || (last.type == "create" && which == "HistorialReverse")) {
		let split = last.pos.split("/");
		last.node.setAttribute("style", "top:" + (split[1]) + "px;left:" + (split[0]) + "px");
		last.node.setAttribute("x", split[0]);
		last.node.setAttribute("y", split[1]);
		surface.appendChild(last.node);
		createLinks(last.links);
		updateAllLinks();
	}
	else if (last.type == "moveSingle") {
		let split = last.pos.split("/");
		last.node.setAttribute("style", "top:" + (split[1]) + "px;left:" + (split[0]) + "px");
		last.node.setAttribute("x", split[0]);
		last.node.setAttribute("y", split[1]);
		updateLinkPositions(last.node);
	}
	else if (last.type == "moveMulti") {
		last.selected.forEach((s) => {
			let split = s.split("/");
			const nodos = document.querySelectorAll(".nodo");
			nodos.forEach((n) => {
				if (split[0] == n.dataset.id) {
					n.setAttribute("style", "top:" + (split[2]) + "px;left:" + (split[1]) + "px");
					n.setAttribute("x", split[1]);
					n.setAttribute("y", split[2]);
					updateLinkPositions(n);
				}
			})
		})
	}
	else if (last.type == "rename") {
		const nodos = document.querySelectorAll(".nodo");
		nodos.forEach((n) => {
			if (n.dataset.id == last.id) {
				n.children[0].value = last.node;
			}
		})
	}
	else if (last.type == "check") {
		last.node.classList.toggle("check");
	}
	else if (last.type == "link") {
		(which == "Historial") ? svg.removeChild(last.node) : svg.appendChild(last.node);

	}
	(which == "Historial") ? Historial.pop() : HistorialReverse.pop();
}

function updateHistorialMoveSingle(last, which) {
	const nodos = document.querySelectorAll(".nodo");
	nodos.forEach((n) => {
		if (n.dataset.id == last.id) {
			let pos = n.getAttribute("x") + "/" + n.getAttribute("y");
			(which == "Historial") ? Historial.push(last.type, n, last.id, pos, last.selected, last.links) : HistorialReverse.push(last.type, n, last.id, pos, last.selected, last.links);
		}
	})
}

function updateHistorialMoveMulti(last, which) {
	let selectedNew = [];
	for (let i in last.selected) {
		let split = last.selected[i].split("/")
		const nodos = document.querySelectorAll(".nodo");
		nodos.forEach((n) => {
			if (n.dataset.id == split[0]) {
				selectedNew[i] = split[0] + "/" + n.getAttribute("x") + "/" + n.getAttribute("y");
			}
		})
	}
	(which == "Historial") ? Historial.push("moveMulti", null, null, null, selectedNew, last.links) : HistorialReverse.push("moveMulti", null, null, null, selectedNew, last.links);

	//HistorialReverse.push("moveMulti", null, null, null,  last.selected);
}

function updateHistorialDelete(last, which) {
	if (which == "Historial") {
		const nodos = document.querySelectorAll(".nodo");
		nodos.forEach((n) => {
			if (n.dataset.id == last.id) {
				let pos = n.getAttribute("x") + "/" + n.getAttribute("y");
				Historial.push(last.type, n, last.id, pos, last.selected, last.links);
			}
		})
	} else {
		HistorialReverse.push(last.type, last.node, last.id, last.pos, last.selected, last.links);
	}
}

function updateHistorialCreate(last, which) {
	let pos = last.node.getAttribute("x") + "/" + last.node.getAttribute("y");
	(which == "Historial") ? Historial.push(last.type, last.node, last.id, pos, last.selected, last.links) : HistorialReverse.push(last.type, last.node, last.id, pos, last.selected, last.links);
}


function setHistorialReverseToDefault() {
	HistorialReverse.first = null;
	HistorialReverse.last = null;
	HistorialReverse.length = 0;
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

// BUTTONS LISTENERS ------------------

body.addEventListener("click", (e) => {
	unselectTextArea();
})

nodeBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		nodeType = e.currentTarget.dataset.type;
		deselectAllNodeType();
		e.currentTarget.classList.add("actual-tool");
		hideToolBtns();
		changeButtonSpan(e.currentTarget.dataset.type, e.currentTarget.parentNode.parentNode.firstElementChild);
	})
})


moveBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		mod = e.currentTarget.dataset.id;
		cleanActual();
		e.currentTarget.classList.add("actual-tool")
		toggleSpeedButtons();
	})
})

speedSwitchBtn.addEventListener("click", () => {
	toggleSpeedButtons();
})

toolBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		if (e.currentTarget.dataset.id != actualTool) {
			hideToolBtns();
		}
		if (e.currentTarget.dataset.id == 1) {
			cleanSelectedToLink();
			cleanActualTool();
			actualTool = e.currentTarget.dataset.id;
			e.currentTarget.classList.add("actual-tool")
			nodeBtns.forEach((b) => {
				b.classList.toggle("translateLink" + b.dataset.id);
			})
		} else if (e.currentTarget.dataset.id == 4) {
			linkBtns.forEach((b) => {
				b.classList.toggle("translateLink" + b.dataset.id);
			})
			cleanActualTool();
			actualTool = e.currentTarget.dataset.id;
			e.currentTarget.classList.add("actual-tool");

		} else if (e.currentTarget.dataset.id != 5 && e.currentTarget.dataset.id != 10) {
			cleanSelectedToLink();
			cleanActualTool();
			actualTool = e.currentTarget.dataset.id;
			e.currentTarget.classList.add("actual-tool")
		}

		else if (e.currentTarget.dataset.id == 5 && e.currentTarget.dataset.id != 10) {
			update(currentProject, obtenerCookie("hs"));
			setIsSaveToTrue();
		}
	})
})

linkBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		linkType = e.currentTarget.dataset.type;
		deselectAllLinkType();
		e.currentTarget.classList.add("actual-tool");
		hideToolBtns();
	})
})


asideSwitchBtn.addEventListener("click", (e) => {
	aside.classList.toggle("move-l")
})

newFileBtn.addEventListener("click", () => {
	createNewProject(obtenerCookie("hs"));
})

errorLog.addEventListener("click", () => {
	setErrorLogToDefault();
})

profileBtn.addEventListener("click", () => {
	toggleSettings();
})

settingsBackground.addEventListener("click", () => {
	toggleSettings();
})

settingsBox.addEventListener("click", (e) => {
	e.stopPropagation();
})

// SURFACE LISTENERS ------------------

surface.addEventListener("mousedown", (e) => {
	surfaceMouseDownEvent(e);
})

surface.addEventListener("mousemove", (e) => {
	surfaceMouseMoveEvent(e);
})

surface.addEventListener("mouseup", (e) => {
	surfaceMouseUpEvent(e);
})

surface.addEventListener("contextmenu", (e) => {
	e.preventDefault();
})

svg.addEventListener("mousedown", (e) => {
	surfaceMouseDownEvent(e);
})

svg.addEventListener("mousemove", (e) => {
	surfaceMouseMoveEvent(e);
})

svg.addEventListener("mouseup", (e) => {
	surfaceMouseUpEvent(e);
})

svg.addEventListener("contextmenu", (e) => {
	e.preventDefault();
})

window.addEventListener("keypress", (e) => {
	bodyKeyPressEvent(e);
})

window.addEventListener("load", (e) => {
	createProjectButtons(loadProjectsFromUsers(obtenerCookie("hs")));
	checkLang();
	themeChange(true);
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

langBtn.addEventListener("click", () => {
	langChange();
})

linkAuth.addEventListener("click", (e) => {
	e.preventDefault();
	if (e.currentTarget.dataset.id == "login") {
		location.href = "https://productivityfast.pages.dev/auth?from=network";
	} else {
		logout();
	}
});