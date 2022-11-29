const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 25,2030"),
  target: "Kepler-442 f",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};
saveLaunch(launch);
// saveLaunch(launch).then(function(result){
//     console.log("Sujan Show me the result",result)
// });

// launches.set(launch.flightNumber, launch);
// console.log(launches.get(100)===launch);

function existsLaunchedWithId(launchId) {
  console.log(launchId);
  return launches.has(launchId);
}

async function getAllLaunches() {
  //   return Array.from(launches.values());
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  //   try {
  console.log("SujanSave launch", launch);
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    { launch },
    {
      upsert: true,
    }
  );
  //   } catch (error) {
  //     console.log(`Could not save the launches ${error}`);
  //   }
}

const addNewLaunch = (launch) => {
  // console.log(launch)
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["Zero to Mastery", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
};

function abortLaunchById(launchId) {
  // launch.delete(launchId);
  const aborted = launches.get(launchId);
  //   console.log("Sujan Aborted", aborted);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchedWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
