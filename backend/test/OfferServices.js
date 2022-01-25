const OfferServices =artifacts.require("OfferServices")
contract("OfferServices",() => {
    before(async () => {
        this.offerServices = await OfferServices.deployed()
    })
    it('migrate deployed successfully',async ()=> {
        const address = this.offerServices.address
        assert.notEqual(address,null);
        assert.notEqual(address,undefined);
        assert.notEqual(address,0x0);
        assert.notEqual(address,"");
    })
    it('offer created successfully',async () => {
        await this.offerServices.createOffer("Desarrollador Blockchain 2", "Soy un desarrollador de blockchain de 21 y/o")
        const offerCounter = await this.offerServices.offerCounter()
        const offer = await this.offerServices.offers(offerCounter)
        assert.equal(offer.id.toNumber(),offerCounter)
        assert.equal(offer.title,"Desarrollador Blockchain 2")
        assert.equal(offer.description,"Soy un desarrollador de blockchain de 21 y/o")
    })
    it('offer deleted successfully',async () => {
        await this.offerServices.deleteOffer(1)
        const offer = await this.offerServices.offers(1)
        assert.equal(offer.title,'')
    })

    
})