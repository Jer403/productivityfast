
import Request from './request.js';
import Main from './projectmanager.js';











function permissionSelector(permis) {
    let permision = "";
    switch (permis) {
        case "1": permision = "Check"
            break;
        case "2": permision = "Modify"
            break;
        case "3": permision = "Lists"
            break;
        case "4": permision = "Admin"
            break;
        default: "Undefined"
    }
    return permision;
}


function toggleElement(elem) {
    elem.classList.toggle("hide")
}


function showMembers(peticion, box) {
    box.innerHTML = "";
    let num = 0;
    if (peticion.error == null) {
        let ids = peticion.membersId.split("/");
        let names = peticion.membersName.split("/");
        let permisses = peticion.membersPermis.split("/");

        for (let i = 0; i < ids.length; i++) {
            let permis = permissionSelector(permisses[i])
            box.appendChild(createMember(names[i], permis))
            num++;
        }
    }
    return num;
}


function showModifiableMembers(peticion, box, gid, token) {
    box.innerHTML = "";
    if (peticion.error == null) {
        let ids = peticion.membersId.split("/");
        let names = peticion.membersName.split("/");
        let permisses = peticion.membersPermis.split("/");

        for (let i = 1; i < ids.length; i++) {
            console.log(permisses[i])
            box.appendChild(createModifiableMember(names[i], ids[i], permisses[i], gid, token))
        }
    }
}



function createJoinDialog(div, dialogB) {
    const joinBtns = document.createElement("DIV")
    const back = document.createElement("BUTTON");
    const join = document.createElement("BUTTON");
    back.classList.add("join-button");
    back.dataset.id = "back";
    back.textContent = "Back";
    join.classList.add("join-button", "join-btn");
    join.dataset.id = "join";
    join.textContent = "Join group";
    joinBtns.classList.add("join-button-box")


    joinBtns.appendChild(back)
    joinBtns.appendChild(join)

    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p for="" class="dialog-top-p">Join group</p>
                </div>
                <div class="join-p-box">
                    <p class="join-p">Unete a un grupo y descubre las oportunidades que ofrece trabajar en equipo.</p>
                    <p class="join-p">Puedes unirte a un grupo introduciendo el codigo de grupo abajo o si lo prefieres ir al a direccion productivity.com/groups/*codigo del grupo*</p>
                </div>
                <label for="" class="join-label">Group Code</label>
                <input type="text" name="" id="" class="join-input">`;

    div.appendChild(joinBtns);
}


function createCreateDialog(div, dialogB) {
    const Btns = document.createElement("DIV")
    const back = document.createElement("BUTTON");
    const next = document.createElement("BUTTON");
    back.classList.add("create-button");
    back.dataset.id = "back";
    back.textContent = "Back";
    next.classList.add("create-button", "create-btn");
    next.dataset.id = "create";
    next.textContent = "Create group";
    Btns.classList.add("create-button-box")


    Btns.appendChild(back)
    Btns.appendChild(next)


    const uploadBox = document.createElement("DIV");
    uploadBox.classList.add("uploadImage-box");

    const uploadImage = document.createElement("DIV");
    const uploadSpan = document.createElement("SPAN");
    const uploadInput = document.createElement("INPUT");
    const uploadLabel = document.createElement("LABEL");
    uploadSpan.classList.add("uploadImage-icon", "fa", "fa-cloud-upload")
    uploadImage.classList.add("uploadImage", "uploadImage-Box")

    uploadInput.classList.add("uploadInput");
    uploadInput.type = "file";
    uploadInput.id = "file";
    uploadInput.accept = ".jpg, .jpeg, .png";

    uploadLabel.classList.add("uploadLabel");
    uploadLabel.for = "file";
    uploadLabel.textContent = "Upload Image";

    uploadImage.appendChild(uploadSpan)
    uploadBox.appendChild(uploadImage)
    uploadBox.appendChild(uploadInput)
    uploadBox.appendChild(uploadLabel)

    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Create group</p>
                </div>
                <div class="create-p-box">
                    <p class="create-p">Crea un grupo y comparte las oportunidades que ofrece trabajar en equipo.La imagen debe de ser menor a 5MB.</p>
                </div>
                <label for="" class="create-label">Group Name</label>
                <input type="text" name="Group name" id="group-name-input" class="create-input">`;

    div.appendChild(uploadBox);

    div.innerHTML += `
                <label for="" class="create-label">Group Name</label>
                <input type="text" name="Group name" id="group-name-input" class="create-input">`;


    div.appendChild(Btns);
}



function createMember(memberName, memberPermission) {
    const div = document.createElement("DIV");
    const name = document.createElement("P");
    const permission = document.createElement("P");

    div.classList.add("groupMember")
    name.classList.add("groupMember-name")
    permission.classList.add("groupMember-permission")

    div.appendChild(name)
    div.appendChild(permission)

    name.textContent = memberName;
    permission.textContent = memberPermission;

    return div;
}





function createModifiableMember(memberName, id, memberPermission, gid, token) {
    const div = document.createElement("DIV");
    const name = document.createElement("P");
    const actions = document.createElement("DIV");
    const select = document.createElement("SELECT");
    const kickBtn = document.createElement("BUTTON");

    select.classList.add("permissSelector")
    kickBtn.classList.add("kick-btn", "red")
    actions.classList.add("member-actions")

    actions.appendChild(select)
    actions.appendChild(kickBtn)


    kickBtn.textContent = "Kick"

    select.innerHTML = `
    <option value="1">Check</option>
    <option value="2">Modify</option>
    <option value="3">Lists</option>`;

    select.value = memberPermission;

    div.classList.add("groupMember")
    name.classList.add("groupMember-name")

    div.dataset.id = id;
    div.appendChild(name)
    div.appendChild(actions)

    select.addEventListener("change", async (e) => {
        let sel = e.currentTarget;
        sel.setAttribute("disabled", "false")

        let body = {};
        body.groupId = gid;
        body.memberId = id;
        body.token = Main.obtenerCookie("hs");
        body.permis = sel.value;
        console.log(sel.value)
        body = JSON.stringify(body)
        let peti = await Request.sendRequest(body, "POST", "application/json", "http://localhost:8080/api/pm/updateMemberPermiss"
            , "application/json", token
        )
        let res = await peti.json();
        if (res.error == null) {
            sel.removeAttribute("disabled");
        }
    })

    kickBtn.addEventListener("click", async (e) => {
        let member = e.currentTarget.parentNode.parentNode;
        let box = member.parentNode;

        let body = {};
        body.groupId = gid;
        body.memberId = id;
        body.token = Main.obtenerCookie("hs");
        body = JSON.stringify(body)
        let peti = await Request.sendRequest(body, "POST", "application/json", "http://localhost:8080/api/pm/kickMember"
            , "application/json", token
        )
        let res = await peti.json();
        console.log(res.error)
        if (res.error == null) {
            box.removeChild(member);
        }
    })

    name.textContent = memberName;

    return div;
}



async function createGroupInfoDialog(adm, div, dialogB, groupName, groupId, token) {
    const groupInfoBox = document.createElement("DIV");
    const groupInfoImg = document.createElement("IMG");
    const groupInfoName = document.createElement("P");
    const groupInfoMembersAmount = document.createElement("P");

    const groupButtonsBoxFrist = document.createElement("DIV");
    const groupButtonInvite = document.createElement("BUTTON");
    const groupButtonSearch = document.createElement("BUTTON");

    const groupMemberLabel = document.createElement("LABEL");

    const groupMembersBox = document.createElement("DIV");

    const groupButtonsBoxSecond = document.createElement("DIV");
    const groupButtonBack = document.createElement("BUTTON");
    const groupButtonRed = document.createElement("BUTTON");

    const groupJoinLink = document.createElement("div")

    groupJoinLink.classList.add("dialog-input-f")

    groupInfoBox.classList.add("groupInfo-box")
    groupInfoImg.classList.add("dialog-img")
    groupInfoName.classList.add("groupName")
    groupInfoMembersAmount.classList.add("groupMembersAmount")

    groupButtonsBoxFrist.classList.add("groupButtons-box")
    groupButtonInvite.classList.add("groupButton")
    groupButtonSearch.classList.add("groupButton")

    groupMemberLabel.classList.add("groupMember-label")

    groupMembersBox.classList.add("groupMembers-box")

    groupButtonsBoxSecond.classList.add("groupButtons-box")
    groupButtonBack.classList.add("groupButton")
    groupButtonRed.classList.add("groupButton", "red")

    groupInfoBox.appendChild(groupInfoImg)
    groupInfoBox.appendChild(groupInfoName)
    groupInfoBox.appendChild(groupInfoMembersAmount)

    groupButtonsBoxFrist.appendChild(groupButtonInvite)
    groupButtonsBoxFrist.appendChild(groupButtonSearch)

    groupButtonsBoxSecond.appendChild(groupButtonBack)
    groupButtonsBoxSecond.appendChild(groupButtonRed)

    groupInfoName.textContent = groupName;

    let img = localStorage.getItem(groupId);
    img = img.split(", ")
    groupInfoImg.src = img[1];

    groupButtonInvite.textContent = "Invite people";
    groupButtonSearch.textContent = "Search";
    groupButtonBack.textContent = "Back";

    if (adm == "true") {
        groupButtonRed.textContent = "Delete group";
    } else {
        groupButtonRed.textContent = "Leave group";
    }

    groupMemberLabel.textContent = "Members";

    Main.loading(groupMembersBox)

    let body = {};
    body.groupId = groupId;
    body = JSON.stringify(body)
    let peti = await Request.sendRequest(body, "POST", "application/json", "http://localhost:8080/api/pm/getMembers"
        , "application/json", token
    )
    let res = await peti.json();
    let num = showMembers(res, groupMembersBox)
    let joinlink = res.groupJoinlink;
    groupInfoMembersAmount.textContent = num + " Members";


    groupButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    groupButtonInvite.addEventListener("click", () => {
        createInviteDialog(div, dialogB, groupId, token)
    })
    groupButtonRed.addEventListener("click", () => {
        confirm("Are you sure that you want to leave this group?")
    })



    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Group Info</p>
                </div>`;

    groupJoinLink.innerHTML = `<p class="dialog-p-f">
                                    Joinlink: 
                                    <span class="dialog-unselectable-span">${joinlink}
                                    </span>
                                </p>
                                <span class="fa fa-copy" style="margin-left:5px">
                                </span>`

    groupJoinLink.addEventListener("click", (e) => {
        navigator.clipboard.writeText(joinlink);
        let span = e.currentTarget.lastElementChild;

        span.classList.add("bounce");
        setTimeout(() => {
            span.classList.remove("bounce");
        }, 400);
    })

    div.appendChild(groupInfoBox)
    div.appendChild(groupButtonsBoxFrist)
    div.appendChild(groupMemberLabel)
    div.appendChild(groupMembersBox)
    div.appendChild(groupJoinLink)
    div.appendChild(groupButtonsBoxSecond)
}





function createInviteDialog(div, dialogB, groupId, token) {
    const btns = document.createElement("DIV");
    const back = document.createElement("BUTTON");
    const input = document.createElement("INPUT");
    const invite = document.createElement("BUTTON");

    btns.classList.add("dialog-button-box-f")
    back.classList.add("dialog-button-f")
    invite.classList.add("dialog-button-f", "blue")
    input.classList.add("dialog-input")

    input.name = "Invite Input"
    input.id = "inviteInput"

    back.textContent = "Back"
    invite.textContent = "Invite"

    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    btns.appendChild(back)
    btns.appendChild(invite)

    invite.addEventListener("click", async () => {

        if (input.value == "") {
            input.classList.add("wrong-input", "b-red");
            setTimeout(() => {
                input.classList.remove("wrong-input");
            }, 200)
            return;
        }

        let body = {};
        body.groupId = groupId;
        body.token = token;
        body.userName = input.value;
        body = JSON.stringify(body)

        let peti = await Request.sendRequest(body, "POST", "application/json"
            , "http://localhost:8080/api/pm/inviteUser"
            , "application/json", token
        )
        let res = await peti.json();
        console.log(res.error)
        if (res.error == null) {
            Main.buildErrorLog("green", "User added successfully")
            input.value = "";
        } else {
            Main.showErrors(res.error)
        }
    })
    input.addEventListener("input", () => {
        input.classList.remove("b-red")
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Invite Someone</p>
                </div>
                <div class="dialog-p-box">
                    <p class="dialog-p">Invite people to your group and enjoy working together.</p>
                    <p class="dialog-p">You can invite someone by passing the user's name or, if you prefer, their User ID.</p>
                </div>
                <label for="inviteInput" class="dialog-label">User Name</label>`;

    div.appendChild(input)
    div.appendChild(btns)
}




async function createChangeGroupInfoDialog(div, dialogB, groupName, groupId, token) {
    const changeImgBox = document.createElement("DIV");
    const changeImg = document.createElement("IMG");
    const changeInput = document.createElement("INPUT");
    const changeImgLabel = document.createElement("LABEL");

    const changeNameLabel = document.createElement("LABEL");
    const changeName = document.createElement("INPUT");

    const changeButtonBox = document.createElement("DIV");
    const changeButtonBack = document.createElement("BUTTON");
    const changeButtonSave = document.createElement("BUTTON");

    changeImgBox.classList.add("uploadChangeImage-box")
    changeImg.classList.add("dialog-img")
    changeInput.classList.add("uploadInput")
    changeImgLabel.classList.add("uploadLabel")

    changeNameLabel.classList.add("dialog-label")
    changeName.classList.add("dialog-input")

    changeButtonBox.classList.add("dialog-button-box-s")
    changeButtonBack.classList.add("dialog-button-s")
    changeButtonSave.classList.add("dialog-button-s", "green")

    changeButtonBack.textContent = "Back"
    changeButtonSave.textContent = "Save"

    changeImgBox.appendChild(changeImg)
    changeImgBox.appendChild(changeInput)
    changeImgBox.appendChild(changeImgLabel)

    changeButtonBox.appendChild(changeButtonBack)
    changeButtonBox.appendChild(changeButtonSave)

    changeInput.type = "file";
    changeInput.accept = ".jpg, .jpeg, .png";
    changeName.value = groupName;

    changeImgLabel.textContent = "Upload new image";
    changeNameLabel.textContent = "New group name";

    let img = localStorage.getItem(groupId);
    img = img.split(", ")
    changeImg.src = img[1];

    changeButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    changeButtonSave.addEventListener("click", async () => {

        let file = null;
        if (changeInput.files[0] != undefined) {
            file = changeInput.files[0];
        }

        let body = {};
        body.groupId = groupId;
        body.token = token;
        body.groupName = changeName.value;
        body = JSON.stringify(body)

        let peti, res;

        if (file != null) {

            const form = new FormData();
            form.append("file", file)
            form.append("content", body)

            peti = await Request.sendRequest(form, "POST", null
                , "http://localhost:8080/api/pm/updateGroupImg"
                , "multipart/form-data", token
            )
            res = await peti.json();
            if (res.error == null) {

                let groupImage = Main.getGroupButton(groupId).nextElementSibling;
                Main.saveImgInLocal(res.img, changeInput.files[0], groupId, groupImage);

                let imgToSet = URL.createObjectURL(changeInput.files[0])
                Main.updateGroup(groupId, imgToSet, changeName.value)

                toggleElement(dialogB)
            }
        } else {
            peti = await Request.sendRequest(body, "POST", "application/json"
                , "http://localhost:8080/api/pm/updateGroup"
                , "application/json", token
            )
            res = await peti.json();
            if (res.error == null) {
                let group = Main.getGroupButton(groupId).parentNode.lastElementChild.firstElementChild;
                group.textContent = changeName.value;
                toggleElement(dialogB)
            }
        }
        if (res.error == null) {
            Main.buildErrorLog("green", "Group Info changed successfully")
        }
        else {
            Main.showErrors(res.error)
        }
    })

    changeImg.addEventListener("click", () => {
        changeInput.click()
    })

    changeInput.addEventListener("change", (e) => {
        let image = e.currentTarget.files[0];
        changeImg.src = URL.createObjectURL(e.currentTarget.files[0])
        changeImgLabel.textContent = image.name;
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Change Group Info</p>
                </div>`;


    div.appendChild(changeImgBox)
    div.appendChild(changeNameLabel)
    div.appendChild(changeName)
    div.appendChild(changeButtonBox)
}




async function createPermissionsDialog(div, dialogB, groupId, token) {

    const permissMembersBox = document.createElement("DIV");

    const permissButtonBox = document.createElement("DIV");
    const permissButtonBack = document.createElement("BUTTON");
    permissMembersBox.classList.add("permissMembers-box")


    permissButtonBox.classList.add("dialog-button-box-s")
    permissButtonBack.classList.add("dialog-button-s")

    permissButtonBox.appendChild(permissButtonBack)


    permissButtonBack.textContent = "Back"


    Main.loading(permissMembersBox)

    let body = {};
    body.groupId = groupId;
    body = JSON.stringify(body)
    let peti = await Request.sendRequest(body, "POST", "application/json", "http://localhost:8080/api/pm/getMembers"
        , "application/json", token
    )
    let res = await peti.json();
    showModifiableMembers(res, permissMembersBox, groupId, token)


    permissButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Permissions Settings</p>
                </div>`;

    div.appendChild(permissMembersBox)
    div.appendChild(permissButtonBox)

}




export default {
    createJoinDialog, createCreateDialog
    , createGroupInfoDialog, createInviteDialog, createChangeGroupInfoDialog,
    createPermissionsDialog
};