const { RichPresenceAssets } = require("discord.js");

class Axie{
    id;
    name;
    clase;
    breadCount;
    parts=[];
    stats={};
    price;
    urlImg;
    genes;
    constructor(){
        console.log('Nuevo Axie');
    }

    setName(name){
        this.name = name;
    }
    setClass(clase){
        this.clase = clase;
    }
    setId(id){
        this.id = id;
    }
    setParts(parts){
        this.parts = parts;
    }
    setStats(stats){
        this.stats = stats;
    }
    setPrice(price){
        this.price = price;
    }
    setBreadCount(breadCount){
        this.breadCount = breadCount
    }
    setUrlImg(urlImg){
        this.urlImg = urlImg;
    }
    setGenes(genes){
        this.genes = genes;
    }

    getName(){
        return this.name;
    }
    getClass(){
        return this.clase;
    }
    getId(){
        return this.id;
    }
    getParts(){
        return this.parts;
    }
    getStats(){
        return this.stats;
    }
    getPrice(){
        return this.price;
    }
    getUrlImg(){
        return this.urlImg;
    }
    getBreedCount(){
        return this.breadCount;
    }
    getGenes(){
        return this.genes;
    }

    getMovements(){
        let movements = [];
        this.parts.forEach(e =>{
            if(e.abilities[0]==null ||e['abilities'][0]==undefined)return;
            movements.push(e.abilities[0].name);
        })
        return movements;
    }
}

module.exports = Axie;