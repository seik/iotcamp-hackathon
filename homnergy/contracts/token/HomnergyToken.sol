pragma solidity ^0.4.21;

import "./StandardToken.sol";

contract HomnergyToken is StandardToken {
    string public name = "Homnergy";
    string public symbol = "HNY";
    uint8 public decimals = 18;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function HomnergyToken() public {
        owner = msg.sender;
    }

    function setNewOwner(address _newOwner) onlyOwner public {
        owner = _newOwner;
    }

    function join(address _to) onlyOwner public returns (bool success) {
        balances[_to] = balances[_to].add(100);
        return true;
    }

    function reward(address _to) onlyOwner public returns (bool success) {
        balances[_to] = balances[_to].add(100);
        return true;
    }

    function penalize(address _to) onlyOwner public returns (bool success) {
        if (balances[_to] > 100) {
            balances[_to] = balances[_to].sub(100);
        }
        return true;
    }
}