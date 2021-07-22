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

//Set initial supply
set(blueprint.constructor.inputs.supply,
    params.header.initialSupply,
    blueprint.constructor.content);

//Remove non-included functions
//And set blacklist if necessary
Object.keys(params.functions).forEach((func)=>{
    //If not included OR a private function don't include
    console.log(func);
    if(func.slice(0,1) != "_" && !params.functions[func].included){
        blueprint.functions[func].content=[""];
    }
});

funcOptions(params.functions.airdrop, blueprint.functions.airdrop);

//Options for tax
funcConfigs(params.functions.tax, blueprint.functions.tax);

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

function funcOptions(p,f){
    if(p.included){
        Object.keys(p.options).forEach((option)=>{
            const input = f.inputs[option];
            const val = p.options[option];
            if(val){
                f.content[input] = f.options[option];
            }else{
                f.content[input] = f.options["!"+option];
            }
            
        });
    }
}

function funcConfigs(p,f){
    if(p.included){
        Object.keys(p.config).forEach((config)=>{
            const input = f.inputs[config];
            const val = p.config[config];
            f.content[input] = val;
        });
    }
}