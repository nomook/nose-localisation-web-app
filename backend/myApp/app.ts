import express from "express";
import { mongooseInit } from "./service/mongo.js";
import { errorHandler } from "./handler/errors.js";

main().catch((err) => console.log(err));

async function main() {
  const port = 3000;
  const userModel = mongooseInit();

  var app: express.Application = express();

  app.use(express.json());
  app.use(errorHandler());

  app.get("/", function (req: express.Request, res: express.Response) {
    console.log("[" + new Date().toISOString() + "] GET on /");
    res.send("Hello World");
  });

  app.get(
    "/users",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] GET on /users");
      res.send({'#totalUsers': await userModel.countDocuments({}),users : await userModel.find({}, {'__v': 0}).limit(Number(req.query?.limit) || 20).sort(req.query?.order || '_id').skip(Number(req.query?.offset) || 0).exec()});
    }
  );

  app.post(
    "/user",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] POST on /user");
      const userBody = {...{'uid': crypto.randomUUID()}, ...req.body}
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
    "/upload",
    async function (req: express.Request, res: express.Response) {
      console.log("[" + new Date().toISOString() + "] POST on /upload");

      try {
        res.send('OK');
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}


