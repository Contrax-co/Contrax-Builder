//spx identifier: None.... Make sure this is right
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Billy_Coin_ is ERC20,Ownable{
uint ONE_HUNDRED_PERCENT = 10000;
enum Permission{PERMITED,PROHIBITED,UNPAUSED_ONLY,TIMELOCK}
mapping(bytes32=>mapping(address=>Permission)) public permissions;
constructor(bytes32[] memory _functionSignatures, address[] memory _permissionsUsers, Permission[] memory _permissionsEnum)ERC20("Billy_Coin_","BLC"){
require(_permissionsUsers.length == _permissionsEnum.length);
for(uint i = 0; i < _permissionsUsers.length; i++){
permissions[_functionSignatures[i]][_permissionsUsers[i]] = _permissionsEnum[i];
}
}
function mint(address _who, uint _amount)external{
require(_permissionCheck(msg.sig, msg.sender),'Not permitted to call this function');
_mint(_who, _amount);
}
function airdrop(address[] memory _receivers, uint[] memory _amounts)external{
require(_permissionCheck(msg.sig, msg.sender),'Not permitted to call this function');
require(_receivers.length == _amounts.length,'Arrays must be the same length');
for(uint i = 0; i < _receivers.length; i++){
_transfer(address(this),_recievers[i],_amounts[i]);
}
}
function _beforeTokenTransfer(address from, address to, uint256 amount)internal override{
if(_permissionCheck(msg.sig, msg.sender)){
_transfer(from, '0xabcdefg',_percent(amount, 100));
}

function _permissionCheck(bytes32 _sig, address _who)private returns(bool){
Permission p = permissions[_sig][_who];
return((p != PROHIBITED) && (p == PERMITED || (p == UNPAUSED && !paused()) ));
}
}
function _percent(uint _amount, uint _percent)private returns(uint){
return ((_amount * _percent) / ONE_HUNDRED_PERCENT);
}
}