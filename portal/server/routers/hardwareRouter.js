const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const si = require("systeminformation");

router.get("/hardware-check", async (req, res) => {
  try {
    const cpuData = await si.cpu();
    const gpuData = await si.graphics();
    const memoryData = await si.memLayout();
    const networkData = await si.networkInterfaces('default');

    let gpuTypes = [];

    gpuData.controllers.forEach((element) => {
      gpuTypes.push({
        vendor: element.vendor,
        model: element.model,
      });
    });
    
    let totalMemorySize = 0;
    if (memoryData.length > 0) {
      memoryData.forEach((element) => {
        totalMemorySize += element.size;
      });
    } else {
      totalMemorySize = memoryData.size;
    }
    
    const gpu = gpuTypes.length > 0 ? { gpuTypes: gpuTypes } : gpuTypes.length === 0 ? gpuTypes[0] : null;
    
    const hardWareData = [
      {
        cpu: {
          cpuManufacturer: cpuData.manufacturer,
          cpuBrand: cpuData.brand,
          cpuCores: cpuData.cores.toString(),
        },
        gpu: gpu,
        memory: {
          totalMemory: totalMemorySize.toString(),
        },
        network : {
          speed: networkData.speed
        }
      },
    ];
    res.status(200).json(hardWareData);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = router;
