const blueprint = require("./blueprint.json");

const fs = require('fs');

const name = blueprint.header.contractDefinition.content[blueprint.header.contractDefinition.inputs.name];
let text = "";

//Create header
const header = blueprint.header;
text += header.license;
text += header.pragmaStatement.content.join('');
text += serializeImports(header.imports.content, header.imports.inputs);
text += header.contractDefinition.content.join('');

//create state vars
text += blueprint.stateVars.permissionsMapping.content.join('');

//create constructor
text += blueprint.constructor.content.join('');

//Add functions
blueprint.functions.names.forEach((funcName)=>{
    text += blueprint.functions[funcName].content.join('');
});

//create footer
text += blueprint.footer;

//write solidity file
fs.writeFile(name+'.sol',text, (err)=>{
    if(err){
        console.log("error writting to json file:\n "+err)
    }
});

function serializeImports(importsContent,importsInput){
    let returnText = "";
    importsContent[importsInput.importPaths].forEach((str)=>{
        for (let i = 0; i < importsContent.length; i++){
            if(i != importsInput.importPaths){
                returnText += importsContent[i];
            }else{
                returnText += str;
            }
        }
    });

    return returnText;
}