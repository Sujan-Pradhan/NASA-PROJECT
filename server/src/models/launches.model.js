
const axios = require('axios')

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBBER = 100;

const launches = new Map();

// let latestFlightNumber = 100;
const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name 
  launchDate: new Date("December 25,2030"), //date_local
  target: "Kepler-1652 b", //not applicable
  customers: ["NASA", "ZTM"], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};
saveLaunch(launch);

// launches.set(launch.flightNumber, launch);
// console.log(launches.get(100)===launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
  console.log("Downloading launches data...");
  const response = await axios.post(SPACEX_API_URL,{
    query:{},
    options:{
      pagination:false,
      populate:[
        {
          path:'rocket',
          select:{
            name:1,
          }
        },
        {
          path:'payloads',
          select:{
            'customers':1
          }
        }
      ]
    }
  })

  if(response.status !== 200){
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed")
  }

  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs){

    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload)=>{
      return payload['customers']
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission:launchDoc['name'],
      rocket:launchDoc['rocket']['name'],
      launchDate:launchDoc['date_local'],
      upcoming:launchDoc['upcoming'],
      success:launchDoc['success'],
      customers,
    }
    // console.log(`${launch.flightNumber} ${launch.mission}`);
     
    // TODO: populate launches collection....
    await saveLaunch(launch);
  }
}

async function loadLaunchesData(){

const firstLaunch = await findLaunch({
    flightNumber:1,
    rocket:'Falcon 1',
    mission:'FalconSat',
  })

  if(firstLaunch){
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
  
}

async function findLaunch(filter){
  return await launchesDatabase.findOne(filter)
} 

async function existsLaunchedWithId(launchId) {
  console.log(launchId);
  // return launches.has(launchId);
  return await findLaunch({
//  return await launchesDatabase.findOne({
    flightNumber: launchId
  })
}

// to make auto-increment in mongo
async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber');

  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  //   return Array.from(launches.values());
  return await launchesDatabase.find(
    {},
    {
      '_id': 0,
      '__v': 0,
    }
  );
}

async function saveLaunch(launch) {
  // console.log("SujanSave launch", launch);
  // const planet = await planets.findOne({
  //   keplerName: launch.target,
  // });
  // if (!planet) {
  //   throw new Error("No matching planet found");
  // }
    // console.log("Hello Your are not there !!!")

    // const findData = await launchesDatabase.find({
    // },{
    //   '__v':0,
    //   '_id':0
    // })
    // console.log("Sujan Pradhan",findData)
    await launchesDatabase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch ,
      {
        upsert: true,
      }
    );
  }

async function scheduleNewlaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch,{
    success: true,
    upcoming : true,
    customers:['Sujan Pradhan','ZTM','NASA'],
    flightNumber: newFlightNumber,
  })

  await saveLaunch(newLaunch)
}

// const addNewLaunch = (launch) => {
//   // console.log(launch)
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["Zero to Mastery", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// };

async function abortLaunchById(launchId) {
  // console.log("Pradhan log",launchId);
  // launch.delete(launchId);
  // const aborted = launches.get(launchId);
  //   console.log("Sujan Aborted", aborted);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;

  const aborted = await launchesDatabase.updateOne({
    flightNumber:launchId,},{
    upcoming:false,
    success:false,
  })

  return aborted.matchedCount === 1 && aborted.modifiedCount === 1 
}

module.exports = {
  loadLaunchesData,
  existsLaunchedWithId,
  getAllLaunches,
  // addNewLaunch,
  scheduleNewlaunch,
  abortLaunchById,
};
