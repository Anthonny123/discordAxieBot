const axios = require('axios');
const { CommandInteractionOptionResolver } = require('discord.js');
const Axie = require('./axieClass');
const {obtenerLosMovimientosDelArgumento} = require('./checkearArgumentos');

const getEthPrice = ()=>{
    return new Promise(async(resolve, reject) =>{
        bodyDetail = {
            "operationName": "NewEthExchangeRate",
            "query": "query NewEthExchangeRate {\n  exchangeRate {\n    eth {\n      usd\n      __typename\n    }\n    __typename\n  }\n}\n"
          }
        await axios.post('https://axieinfinity.com/graphql-server-v2/graphql', bodyDetail, {responseType:'json'}).then((res)=>{
            let ethPrice = res.data['data']['exchangeRate']["eth"]["usd"];
            resolve(ethPrice);
        })
    })
}

const getAxies = (data) =>{
    return new Promise(async (resolve, reject) =>{
        let movements = [];
        let cards = [];
        let size = 3;
        let clase = ["Beast"]
        let statsAxie = [[30,30],[30,30],[30,30],[30,30]]
        if(data["stat"]){
            let newAxieStats = Object.values(data["stat"])
            statsAxie[0][0] = statsAxie[0][1] = newAxieStats[0]
            statsAxie[1][0] = statsAxie[1][1] = newAxieStats[1]
            statsAxie[2][0] = statsAxie[2][1] = newAxieStats[2]
            statsAxie[3][0] = statsAxie[1][0] = newAxieStats[3]
        }
        if(data.size){
            size = data.size;
        }
        if(data.clase){
            clase = data.clase;
        }
        if(data.movimientos){
            movements = obtenerLosMovimientosDelArgumento(data.movimientos);
            movements.forEach(e=>{
                let str = `${e[0]}-${e[1]}`
                cards.push(str);
            })
        }
        let body = {
            "operationName": "GetAxieLatest",
            "variables": {
              "from": 0,
              "size": size,
              "sort": "Latest",
              "auctionType": "Sale",
              "criteria": {
                  "classes":clase,
                  "hp":statsAxie[0],
                  "skill":statsAxie[1],
                  "speed":statsAxie[2],
                  "morale":statsAxie[3],
                  "breedCount":[0,4],
                  "parts":cards
              }
            },
            "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"
          }
        await axios.post('https://axieinfinity.com/graphql-server-v2/graphql', body, {respondType:'json'}).then((res)=>{
            let axies = res.data['data']['axies']['results'];
            let axieArray = [];
            axies.forEach(element =>{
                let axieModel = new Axie();
                axieModel.setName(element.name);
                axieModel.setId(element.id);
                axieModel.setClass(element.class);
                axieModel.setParts(element.parts);
                axieModel.setStats(element.stats);
                axieModel.setBreadCount(element.breedCount)
                axieModel.setPrice(element['auction']['currentPriceUSD']);
                axieModel.setUrlImg(element.image);
                axieModel.setGenes(element.genes);
                axieArray.push(axieModel);
            })
            resolve(axieArray);
        }).catch((err)=>reject(err));
    })
}

axiesPriceMedia = ()=>{
    return new Promise(async (resolve, reject)=>{
        const axies = await getAxies();
        let media = 0;
        axies.forEach(element=>{
            media += parseInt(element['auction']['currentPriceUSD']);
        })
        media = media / axies.length;
        resolve(media);
    })
}

exports.getAxies = getAxies;
exports.getEthPrice = getEthPrice;
