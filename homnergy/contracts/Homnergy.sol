pragma solidity ^0.4.21;

import "./token/HomnergyToken.sol";

contract Homnergy {
    
    HomnergyToken homnergyToken;

    uint256 numElementsPenalize = 0;
    address[] addressesToPenalize;

    uint256 numElementsReward = 0;
    address[] addressesToReward;

    mapping(address=>bool) public joined;

    function Homnergy(address _homnergyTokenAddress) public {
        homnergyToken = HomnergyToken(_homnergyTokenAddress);
    }

    /**
    * @dev Publish a temperature, if it is 
    * @param _temperature of the house
    */
    function publishTemperature(uint256 _temperature) public {
        bool userJoined = joined[msg.sender];
        if (!userJoined) {
            homnergyToken.join(msg.sender);
            joined[msg.sender] = true;
        }

        if (_temperature < 21) {
            if(numElementsReward == addressesToReward.length) {
                addressesToReward.length += 1;
            }
            addressesToReward[numElementsReward++] = msg.sender;
        } else {
            if(numElementsPenalize == addressesToPenalize.length) {
                addressesToPenalize.length += 1;
            }
            addressesToPenalize[numElementsPenalize++] = msg.sender;
        }
    }

    /**
    * @dev Generate the rewards
    */
    function generateRewards() public {
        for (uint256 i = 0; i < numElementsReward; i++) {
            homnergyToken.reward(addressesToReward[i]);
        }
        numElementsReward = 0;

        for (uint256 j = 0; j < numElementsPenalize; j++) {
            homnergyToken.penalize(addressesToPenalize[j]);
        }
        numElementsPenalize = 0;
    }
}