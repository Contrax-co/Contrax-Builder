Contrax Smart Contract Builder
==============================
As of right now, the header of the contracts are built into a "blueprint" which will be used to compile into the solidity code.

Current Architecture
--------------------
- a params json is read by the buildBlueprint.js file
- the buildBlueprint.js file runs a filter() function to correct any illegal params
- the buildBlueprint uses the scaffold.json to help construct the params in a more orderly fassion
- the ordered params are written to "blueprint.json"

What's next
-----------
- The buildBlueprint.js file needs to be able to compile permissions and functions into rules as well forming the body of the contract blueprint.
- Inheritance/imports need to be filled out (they only import basic ERC20 functoins now)
- The buildContract program needs to be written to compile a blueprint to a contract
- An expressJS backend needs to be created to take a params.json as a POST request

How to run
----------
Make sure you have nodeJS installed and run the following command:  
`npm buildBlueprint.js`
