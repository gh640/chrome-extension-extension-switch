function list_all(){

    chrome.management.getAll(function (apps){

        var eleParentEnabled = document.getElementById("extensions_enabled");
        var eleParentDisabled = document.getElementById("extensions_disabled");

        for(var i=0; i<apps.length; i++){
            console.log(apps[i].name);
            if(apps[i].name == "Extension Switch"){
                continue;
            }
            if(apps[i].type == "extension"){
                append_extension_to_list(apps[i], eleParentEnabled, eleParentDisabled);
            }
        }

    });

}

list_all();


function append_extension_to_list(app, eleParentEnabled, eleParentDisabled){

    var e = document.createElement("li");

    e.id = app.id;
    e.innerText = app.name;
    if(e.innerText.length>31){
        e.innerText = e.innerText.slice(0,30)+"...";
    }
    e.onclick = function(){
        switch_extension(this.id);
        this.parentNode.removeChild(this);
    };
    if(app.icons){
        var urlend = (app.enabled)? "" : "?grayscale=true";
        e.style.backgroundImage = "url(" + app.icons[0].url + urlend + ")";
        // e.style.backgroundAttachment = "fixed";
        e.style.backgroundPosition = "4px center";
        e.style.backgroundRepeat = "no-repeat";
        e.style.backgroundSize = "14px";
    }

    if(app.enabled == true){
        e.className = "enabled";
        eleParentEnabled.appendChild(e);
    } else {
        e.className = "disabled";
        eleParentDisabled.appendChild(e);
    }

}


function switch_extension(id){

    chrome.management.get(id, function (app){
        chrome.management.setEnabled(app.id, !app.enabled, function(){
            chrome.management.get(id, function (app2){
                var eleParentEnabled = document.getElementById("extensions_enabled");
                var eleParentDisabled = document.getElementById("extensions_disabled");
                append_extension_to_list(app2, eleParentEnabled, eleParentDisabled);
            });
        });
    });

}
