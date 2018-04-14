pragma solidity ^0.4.21;

contract MainContract {
    
    struct Data {
        uint256 startTimpestamp;
        uint256 endTimpestamp;
        uint256 timeframe;
        bytes32 dataHash;
    }

    Data[] public dataStorage;

    mapping(bytes32 => uint256) arrayPositions;

    function addData(uint256 _startTimpestamp, uint256 _endTimpestamp, uint256 _timeframe, bytes32 _dataHash) public {
        arrayPositions[_dataHash] = dataStorage.length;
        dataStorage.push(Data(_startTimpestamp, _endTimpestamp, _timeframe, _dataHash));
    }

    function getData(bytes32 _hashData) public view returns (uint256 startTimpestamp, uint256 endTimpestamp, uint256 timeframe) {
        uint256 position = arrayPositions[_hashData];
        Data memory data = dataStorage[position];

        return (data.startTimpestamp, data.endTimpestamp, data.timeframe);
    }
}