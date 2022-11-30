const {
  getAllLaunches,
  // addNewLaunch,
  existsLaunchedWithId,
  abortLaunchById,
  scheduleNewlaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.target ||
    !launch.rocket
  ) {
    return res.status(400).json({ error: "Missing required launch property" });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch Date",
    });
  }
  // addNewLaunch(launch);
  await scheduleNewlaunch(launch)
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  //if launch doesn't exists
  const existsLaunch = await existsLaunchedWithId(launchId)
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  //if launch does exist
  const aborted = await abortLaunchById(launchId);
  if(!aborted){
    return res.status(400).json({
      error:"Launch not aborted"
    })
  }
  // return res.status(200).json(aborted);
  return res.status(200).json({
    ok:true
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
