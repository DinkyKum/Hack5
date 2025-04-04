const express = require("express");
const traderRouter = express.Router();
const UnmergedTruck = require("../models/unmergedTruck");
const FreeTruck = require("../models/freeTruck");
const TraderRequest = require("../models/traderRequest");
const TraderMerged = require("../models/TraderMerged");
const { companyAuth } = require("../middlewares/auth");
const MergeableTrader = require("../models/mergeableTrader")

// Route to handle trader truck merging
traderRouter.get("/mergedTrader", companyAuth, async (req, res) => {
    try {
        const traderRequests = await TraderRequest.find();
        const unmergedTrucks = await UnmergedTruck.find();
        const freeTrucks = await FreeTruck.find();
        let traderMergedData = [];

        for (let request of traderRequests) {
            let assignedTruck = unmergedTrucks.find(truck => 
                truck.stops.includes(request.source) && truck.stops.includes(request.destination)
            );

            if (!assignedTruck) {
                assignedTruck = freeTrucks.shift(); // Assign free truck if no unmerged truck available
            }

            if (assignedTruck) {
                const mergedEntry = {
                    truckId: assignedTruck.truckId,
                    load: request.load,
                    source: request.source,
                    destination: request.destination,
                    stops: request.stops,
                };
                traderMergedData.push(mergedEntry);
            }
        }

        if (traderMergedData.length > 0) {
            await MergeableTrader.insertMany(traderMergedData);
        }

        res.json({ message: "Traders merged successfully", traderMergedData });
    } catch (error) {
        console.error("Error merging traders with trucks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = traderRouter;
