//10:30
const scaffold = require("./scaffold.json");
const _params = require("./paramsEx.json");
const fs = require('fs');

const params = filter(_params);
let blueprint = scaffold;
let place;
let replace;

//Begin building the blueprint
//Add compiler version
place = blueprint.header.pragmaStatement.inputs.compilerVersion;
replace = params.header.compilerVersion;
blueprint.header.pragmaStatement.content[place] = replace;

//Add imports
//Note. Only adds one import right now. Going to need to keep working on it
place = blueprint.header.imports.inputs.importPaths;
replace = "@openzeppelin/contracts/ERC20.sol";
blueprint.header.imports.content[place] = replace;

//Create contract definition
//First set the name
place = blueprint.header.contractDefinition.inputs.name;
replace = params.header.name;
blueprint.header.contractDefinition.content[place] = replace;
//Next set the child contracts to inherit
place = blueprint.header.contractDefinition.inputs.children;
replace = ["ERC20","Ownable"];                                  //ERC20 will be hardcoded always but a function will need to determine other inheritance
blueprint.header.contractDefinition.content[place] = replace;

//Write blueprint
const json = JSON.stringify(blueprint,null,2);

fs.writeFile('blueprint.json', json, 'utf8', (err)=>{
    if(err){
        console.log("error writting to json file:\n "+err)
    }
});

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