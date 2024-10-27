async function sendRequest(bodyContent, type, accept, address, contentType, token) {
    let header = {
        'Accept': accept,
        'Content-Type': contentType,
        'Authorization': 'Bearer ' + token
    }

    if (accept == null) {
        header = {
            'Authorization': 'Bearer ' + token
        }
    }

    try {
        let peticion = await fetch(address, {
            method: type,
            headers: header,
            body: bodyContent
        });

        return peticion;
    } catch (e) {
        return e;
    }
}




function sayHi() {
    console.log("Hi")
}

export default {
    sayHi, sendRequest
}

