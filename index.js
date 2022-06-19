const {Client, Intents, MessageEmbed} = require('discord.js');
const {token} = require('./config.json');
const axieData = require('./getAxiesData');
const similarAxies = require('./getSimilarAxies');
const checkearArgs = require('./checkearArgumentos');


const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const prefix = "!";


client.once('ready', ()=>{
  console.log("**************************************************");
  console.log("Ready!!");
  console.log("**************************************************");
});


client.on('messageCreate', async (msg) =>{
  if(msg.author.bot) return;
  if(!msg.content.startsWith(prefix))return;
  if(msg.content.startsWith(prefix)){
    const arg = msg.content.slice(prefix.length).split(/ +/);
    const command = arg.shift().toLowerCase();
    const data = checkearArgs.checkearArgs(arg);  //Chequea los argumentos y los va analizando para la personalizacion del comando

    //// CONSEGUIR AXIES DEL MARKETPLACE ////
    if(command === 'getmarketplace'){
      let axies = await axieData.getAxies(data);
      if(axies.length === 0){msg.reply('No hemos encontrado Axies con esas caracteristicas, revise los valores introducidos, o pruebe con otras caracteristicas')}
      axies.forEach(element =>{
        const me = new MessageEmbed()
        .setTitle(`${element.name}: ${element.getId()}`)
        .setURL(`https://marketplace.axieinfinity.com/axie/${element.id}`)
        .setThumbnail(element.urlImg)
        .setDescription(`Axie de tipo ${element.clase}, cuya genetica se encuentra en este Hash: ${element.getGenes()}`)
        .addFields(
          {name: 'Hp', value:`${element.getStats().hp}`, inline:true},
          {name: 'Speed', value:`${element.getStats().speed}`, inline:true},
          {name: 'Skill', value:`${element.getStats().skill}`, inline:true},
          {name: 'Morale', value:`${element.getStats().morale}`, inline:true},
          {name: '\u200B', value: '\u200B' },
          {name: 'movimiento1', value: `${element.getMovements()[0]}`, inline:true},
          {name: 'movimiento2', value: `${element.getMovements()[1]}`, inline:true},
          {name: 'movimiento3', value: `${element.getMovements()[2]}`, inline:true},
          {name: 'movimiento4', value: `${element.getMovements()[3]}`, inline:true},
          {name: '\u200B', value: '\u200B' }
        )
        .setFooter(`Precio: ${element.getPrice()}$`)
        msg.reply({embeds:[me]});

      });
    }
    //// CONSEGUIR AXIES SIMILARES POR ID ////
    if(command === 'getsimilaraxie'){
      if(arg[0] != undefined){
        const axieId = parseInt(arg[0],10);
        if(!isNaN(axieId)){
          const axiesSimilares =  await similarAxies.similarAxies(axieId);
          const getEthPrice = await axieData.getEthPrice()
          console.log(axiesSimilares)
          axiesSimilares.forEach(e=>{
            const axiePrice = Math.round(e[1] * getEthPrice);
            const me = new MessageEmbed()
            .addFields(
                {name:'ID del Axie', value:`${e[0]}`, inline:true},
                {name:'N.Crias', value: `${e[2]}`, inline:true},
                {name:`Precio`, value:`${axiePrice}$`, inline:true}
            )
            msg.reply({embeds:[me]});
          })
          
        }else{
          msg.reply(`${arg[0]} no es un numero valido`);
        }
      }else{
        msg.reply('Estas introduciendo mal los valores del comando')
      }
    }
    console.log(command, arg);
  }  
});


client.login(token);


