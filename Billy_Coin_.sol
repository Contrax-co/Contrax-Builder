//spx identifier: None.... Make sure this is right
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Billy_Coin_ is ERC20,Ownable{
enum Permission{PERMITED,PROHIBITED,UNPAUSED_ONLY,TIMELOCK}
mapping(bytes32=>mapping(address=>Permission)) public permissions;
constructor(bytes32[] memory _functionSignatures, address[] memory _permissionsUsers, Permission[] memory _permissionsEnum)ERC20("Billy_Coin_","BLC"){
require(_permissionsUsers.length == _permissionsEnum.length);
for(uint i = 0; i < _permissionsUsers.length; i++){
permissions[_functionSignatures[i]][_permissionsUsers[i]] = _permissionsEnum[i];
}
}
}