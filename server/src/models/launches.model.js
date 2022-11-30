const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBBER = 100;

const launches = new Map();

// let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 25,2030"),
  target: "Kepler-1652 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};
saveLaunch(launch);

// launches.set(launch.flightNumber, launch);
// console.log(launches.get(100)===launch);

async function existsLaunchedWithId(launchId) {
  console.log(launchId);
  // return launches.has(launchId);
 return await launchesDatabase.findOne({
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
    try {
  // console.log("SujanSave launch", launch);
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  } else{
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
 
    } catch (error) {
      console.log(`Could not save the launches ${error}`);
    }
}

async function scheduleNewlaunch(launch){
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
  existsLaunchedWithId,
  getAllLaunches,
  // addNewLaunch,
  scheduleNewlaunch,
  abortLaunchById,
};
