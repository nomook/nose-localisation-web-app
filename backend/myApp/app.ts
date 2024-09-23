import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

import { mongooseInit } from "./service/mongo.js";
import { errorHandler } from "./handler/errors.js";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const staticDir = path.dirname(path.dirname(__filename)) + '/static';


main().catch((err) => console.log(err));

async function main() {
  const port = 3000;
  const userModel = mongooseInit();

  var app: express.Application = express();


  // Enable CORS for all routes
  app.use(cors({origin: 'http://127.0.0.1:8080'}));

  app.use(express.json());
  app.use(errorHandler());
  app.use('/img', express.static(staticDir));
  
  app.get("/health", function (req: express.Request, res: express.Response) {
    console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.path);
    res.send("OK");
  });

  app.get(
    "/users",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.path);
      res.send({'#totalUsers': await userModel.countDocuments({}),users : await userModel.find({}, {'__v': 0}).limit(Number(req.query?.limit) || 20).sort(req.query?.order || '_id').skip(Number(req.query?.offset) || 0).exec()});
    }
  );

  app.get(
    "/user",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.path);
      if (req.query._id) {
        res.send(await userModel.find({'_id': req.query._id}, {'__v': 0}).limit(1));
      } else {
        res.status(500).send('No query parameters provided');
      }
    }
  )
  app.delete(
    "/user",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.originalUrl);
      if (req.query._id) {
        res.send(await userModel.deleteOne({'_id': req.query._id}));
      } else {
        res.status(500).send('No query parameters provided');
      }
    }
  )
  app.put(
    "/user",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.originalUrl);
      if (req.query._id) {
        res.send(await userModel.updateOne({'_id': req.query._id}, {...req.body, ...{lastUpdateDate: new Date()}}));
      } else {
        res.status(500).send('No query parameters provided');
      }
    }
  )

  app.post(
    "/user",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.path);
      const userBody = req.body;
      const newUser = new userModel(userBody);
      try {
        await newUser.save();
        res.send({userCreatedId: newUser._id});
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );
  
  app.post(
    "/uploadImg",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] "+req.method+" on " + req.path);

      if (req.get('content-type')?.split('/')[0] ===  'image') {
        
        const ext = req.get('content-type').split('/')[1];
        const fileName = `/${randomUUID()}.${ext}`
        const imgStream : fs.WriteStream = fs.createWriteStream(staticDir+fileName);

        req.on("data", (chunk) => {
          const sucess = imgStream.write(chunk, () => {
            console.log(`Write ${chunk.length} bytes to ${fileName}.`);
          });
        });
        req.on("end",() => {
          res.send({fileURL:`/img${fileName}`});
        });
      } else {
        res.status(500).send('File is not an image');
      }
    }
  );
  

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}


