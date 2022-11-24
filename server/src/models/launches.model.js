const launches = new Map()

let latestFlightNumber = 100;
const launch = {
    flightNumber:100,
    mission:"Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date('December 25,2030'),
    target:"Kepler-442 b",
    customer: ['NASA',"ZTM"],
    upcoming: true,
    success:true
}

launches.set(launch.flightNumber,launch);
// console.log(launches.get(100)===launch);

function existsLaunchedWithId(launchId){
    console.log(launchId)
    return launches.has(launchId)
}

function getAllLaunches(){
    return Array.from(launches.values())
}

const addNewLaunch  = (launch) =>{
    // console.log(launch)
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            success:true,
            upcoming:true,
            customers:['Zero to Mastery','NASA'],
            flightNumber: latestFlightNumber,
        })
    )
}

function abortLaunchById(launchId){
    // launch.delete(launchId);
    const aborted = launches.get(launchId);
    console.log(aborted)
    aborted.upcoming = false;
    aborted.success = false;
    return aborted
}

module.exports= {
    existsLaunchedWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}