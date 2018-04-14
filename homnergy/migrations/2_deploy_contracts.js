var HomnergyToken = artifacts.require("HomnergyToken");
var Homnergy = artifacts.require("Homnergy");

module.exports = function(deployer) {
  deployer
    .deploy(HomnergyToken)
    .then(() => {
      return deployer.deploy(Homnergy, HomnergyToken.address);
    })
    .then(() => {
      return HomnergyToken.deployed();
    })
    .then(tokenInstance => {
      return tokenInstance.setNewOwner(Homnergy.address);
    }).catch((err) => console.log("There was an error: " + err));
};
