const OfferServices = artifacts.require("OfferServices");
const ChatContract = artifacts.require("ChatContract");
module.exports= function (deployer){
    deployer.deploy(OfferServices);
    deployer.deploy(ChatContract);
};