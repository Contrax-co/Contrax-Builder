const scaffold = require("./scaffold.json");
const _params = require("./paramsEx.json");
const fs = require('fs');

const params = filter(_params);
let blueprint = scaffold;
let place;
let replace;
let imports = getChildContracts(params);

//Begin building the blueprint
//Add compiler version
set(blueprint.header.pragmaStatement.inputs.compilerVersion, 
    params.header.compilerVersion,
    blueprint.header.pragmaStatement.content
    );

//Add imports
//Note. Only adds one import right now. Going to need to keep working on it
set(blueprint.header.imports.inputs.importPaths,
    imports.imports,
    blueprint.header.imports.content);

//Create contract definition
//First set the name
set(place = blueprint.header.contractDefinition.inputs.name,
    replace = params.header.name,
    blueprint.header.contractDefinition.content);
//Next set the child contracts to inherit
set(blueprint.header.contractDefinition.inputs.children,
    imports.inheritance,
    blueprint.header.contractDefinition.content);

//Create contract constructor
//Set token name
set(blueprint.constructor.inputs.name,
    '"'+params.header.name+'"',
    blueprint.constructor.content);
//Set token symbol
set(blueprint.constructor.inputs.symbol,
    '"'+params.header.symbol+'"',
    blueprint.constructor.content);


//Write blueprint
const json = JSON.stringify(blueprint,null,2);

fs.writeFile('blueprint.json', json, 'utf8', (err)=>{
    if(err){
        console.log("error writting to json file:\n "+err)
    }
});

function set(place, paramsValue, blueprintContent){
    blueprintContent[place] = paramsValue;
}

// filter function. Takes in params to check for illegal entries
function filter(p){
    //Cannot be a whitelist AND blacklist
    if(p.accessors.whiteList && p.accessors.blackList){
        p.accessors.whiteList = false;
    }
    //Compiler version must be 0.8.0 for now. Could change in the future
    if(p.header.compilerVersion != "0.8.0"){
        p.header.compilerVersion = "0.8.0";
    }
    //Require name has no spaces or special characters
    if(p.header.name.includes(" ") || !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(p.header.name)){
        p.header.name = p.header.name.replace(/[^A-Z0-9]+/ig, "_");
    }
    //Will likely need to add more filters as we go on. For now this is it
    return p;
}

function getChildContracts(p){
    let children = {
        imports: ['"@openzeppelin/contracts/token/ERC20/ERC20.sol"'],
        inheritance: ["ERC20"],
        constructorInheritance: [""]
    }
    if(p.accessors.ownable){
        children.imports.push('"@openzeppelin/contracts/access/Ownable.sol"');
        children.inheritance.push("Ownable");
        children.constructorInheritance.push("Ownable()");
    }
    return children;
}