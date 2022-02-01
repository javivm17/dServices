const OfferServices = artifacts.require("OfferServices");

module.exports= function (deployer){
    deployer.deploy(OfferServices);
};