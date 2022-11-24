const http = require("http")
const app = require("./app")

const {loadPlanetsData} = require("./models/planets.model")

const port = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await loadPlanetsData();

    server.listen(port,()=>{
        console.log(`Server listening on port ${port}`)
    })
}

startServer()



// Benefits => organize the code a little more 