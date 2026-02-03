
//Modelo y carga de datos iniciales
const{Sequelize,Model,DataTypes}=require('sequelize');

const options={loggin: false};//para no hacer login //super borrador en desarrollo
const sequelize = new Sequelize("sqlite:dbLogistica.sqlite",options);//especifico tipo de DDBB

class Choferes extends Model{}
Choferes.init(
   {//estructura de tabla
       id_chofer:   {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,//aca agregamos que esta es primaryKey
    },
       nombre:      DataTypes.STRING,  
       apellido:    DataTypes.STRING,
       dni:         DataTypes.STRING,
       licencia:    DataTypes.STRING,
       edad:        DataTypes.INTEGER,
   },
   {
    sequelize, modelName:"Choferes"
    }
);

class Vehiculos extends Model{}
Vehiculos.init(
   {//estructura de tabla
       id_vehiculo: {
        type: DataTypes.INTEGER ,
        allowNull: false,
        primaryKey: true,//aca agregamos que esta es primaryKey
    },  
       patente:      DataTypes.STRING,  
       carga_util:    DataTypes.REAL,
       licencia_minima:    DataTypes.STRING,
       en_uso:        DataTypes.INTEGER,
   },
   {
    sequelize, modelName:"Vehiculos"
    }
);

//Podria ser un alias de  relacion , pero no se puede llenar con bulkCreate sino.
const Habilitaciones = sequelize.define('Habilitaciones', {
    id_chofer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_vehiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
},
{
    sequelize, modelName:"Habilitaciones"
    }
);

Choferes.belongsToMany(Vehiculos,{
    as:'Puede conducir',//nombre de la relacion de ida
    foreignKey: 'id_chofer',// extranjera de origen
    otherKey:'id_vehiculo',//extranjera de llegada
    through:'Habilitaciones' //Nombre de la tabla intermedia
});

Vehiculos.belongsToMany(Choferes,{
    as:'Puede ser conducido por',//nombre de la relacion de ida
    foreignKey: 'id_vehiculo',// extranjera de origen
    otherKey:'id_chofer',//extranjera de llegada
    through:'Habilitaciones' //Nombre de la tabla intermedia
});

//para poder importar los modelos desde otro archivo


//Por defecto onDelete:'Cascade' ,
// al eliminar un chofer elimina su asociacion con vehiculos

//()();  funcion inmediata

//Carga de datos en DDBB
//Luego mutar a seed
// (async()=>{
// try
// {
//     await sequelize.sync();//construye tablas vacias si no estan?

//     //count promesa devuelve cantidad de registros de una tabla
//     let cantChoferes = await Choferes.count();
//     let cantVehiculos = await Vehiculos.count();
//     let cantHabilitaciones = await Habilitaciones.count();//explota por promesa


//     if(cantChoferes===0)
//     {
//         let crearChoferes= await Choferes.bulkCreate(
//             [
//                 {id_chofer: 1,nombre:'Juan',apellido:'Fangio',
//                 dni:'111111',licencia:'D4',edad:120},
//                 {id_chofer: 3,nombre:'Ayrton',apellido:'Senna',
//                 dni:'222222',licencia:'C2',edad:60},
//                 {id_chofer: 5,nombre:'Juan',apellido:'Galvez',
//                 dni:'333333',licencia:'B2',edad:150},
//                 {id_chofer: 9,nombre:'Mikka',apellido:'Hakinnen',
//                 dni:'444444',licencia:'C3',edad:40},
//                 {id_chofer: 8,nombre:'Kimmi',apellido:'Raikonnen',
//                 dni:'555555',licencia:'D4',edad:50}

//             ]
//         );
//     }

//     if(cantVehiculos===0)
//     {
//         let crearVehiculos= await Vehiculos.bulkCreate(
//             [
//                 {id_vehiculo:2,patente:'AAA111',carga_util:10000,
//                 licencia_minima:'C3',en_uso:1},
//                 {id_vehiculo:4,patente:'BBB111',carga_util:1000,
//                 licencia_minima:'B2',en_uso:0},
//                 {id_vehiculo:44,patente:'CCC222',carga_util:11000,
//                 licencia_minima:'C1',en_uso:1},
//                 {id_vehiculo:12,patente:'DDD333',carga_util:40000,
//                 licencia_minima:'B1',en_uso:0},
//                 {id_vehiculo:6,patente:'EEE444',carga_util:5000,
//                 licencia_minima:'A1',en_uso:0}

//             ]
//         );

//     }

// //Explota aca
//     if(cantHabilitaciones===0)
//     {
//         let crearHabilitaciones= await Habilitaciones.bulkCreate(
//             [
//                 {id_chofer:1,id_vehiculo:2,},
//                 {id_chofer:1,id_vehiculo:4,},
//                 {id_chofer:1,id_vehiculo:12,},
//                 {id_chofer:3,id_vehiculo:6,},
//                 {id_chofer:9,id_vehiculo:2,}
//             ]
//         );

//     }

// return;


// }catch(error)
// {
//     console.log(`El error fue"${error}`);
// }




// })

// ();
sequelize.sync()
  .then(() => console.log("Tablas creadas/sincronizadas"))
  .catch(err => console.error("Error sync:", err));


module.exports = {
  sequelize,
  models: {
    Choferes,
    Vehiculos,
    Habilitaciones
  }
};
