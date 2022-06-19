const parts = require('./parts.json');


const checkearArgs = (args)=>{
    let data = {}
    args.forEach(element => {
        const command = element.split(":")
        if(command[0] === "stats"){
            const stast = command[1].split(',');
            data.stat = {
                hp:parseInt(stast[0]),
                speed:parseInt(stast[1]),
                skill:parseInt(stast[2]),
                morale:parseInt(stast[3])
            }
        }
        if(command[0]==="movimientos"){
            const movimientos = command[1].split(",");
            const cartas = [];
            movimientos.forEach(e=>{
                cartas.push(e.replace('_', ' ').toLowerCase())
            })
            data.movimientos = cartas;
        }
        if(command[0] === "clase"){
            const clase = command[1]
            let arrClase = [];
            arrClase.push(clase);
            data.clase = arrClase
        }

        if(command[0] === "size"){
            data.size = parseInt(command[1]);
        }
    });
    return(data);
}
/// FUNCION QUE CHEQUEA EL JSON DE LAS CARTAS Y DEVUELVE EL VALOR CORRESPONDIENTE PARA EL QUERY
const obtenerLosMovimientosDelArgumento = (movimientos)=>{
    if(movimientos.length === 0)return;
    let cartas = [];
    movimientos.forEach(e=>{
        for(x in parts){
            for(y in parts[x]){
                if(e===y){
                    let arrayDeCartas = []
                    arrayDeCartas.push(`${x}`, `${parts[x][y]}`);
                    cartas.push(arrayDeCartas);
                }
            }
        }
    })
    return cartas;
}

exports.checkearArgs = checkearArgs;
exports.obtenerLosMovimientosDelArgumento = obtenerLosMovimientosDelArgumento;