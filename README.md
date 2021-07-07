Contrax Smart Contract Builder ~v1.0.0
==============================
First version of the contrax builder is out! Only has some simple functions without much complexity and code is a bit confusing. But a great starting place for the MVP.

Current Architecture
--------------------
- a params json is read by the buildBlueprint.js file
- the buildBlueprint.js file runs a filter() function to correct any illegal params
- the buildBlueprint uses the scaffold.json to help construct the params in a more orderly fassion
- the ordered params are written to "blueprint.json"
- compiler.js reads the blueprint to create a text string of working code and prints it to a Solidity file 

Helper Functions
----------------
The blueprint builder has a few helper functions:
- `getChildContracts()` pushes children to the blueprint for necessary imports, inheritance declarations and constructor modifiers
- `funcOptions()` handles options in the params.json. Options are binary options that change what code is injected
- `funcConfigs()` handles configs in the params.json. Configs are nonBinary text to be injected in the code

What's next
-----------
- An expressJS backend needs to be created to take a params.json as a POST request.
- More functions, options, and configs

How to run
----------
* first edit the paramsEx.json to customize your contract. This is what will eventually come from the frontend
* next run `npm run build`
* Look at your newly created Solidity file. Notice indentation is not yet included
