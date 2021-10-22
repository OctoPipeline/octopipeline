import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../util/dbConnect";
import { Request } from "../../../util/models/index";
import ApiFuncs from "../../../util/functions";

interface Data {
  message: string;
  error?: Error;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // capture api method
  const method: keyof ApiFuncs = req.method as keyof ApiFuncs;

  //function for catch errors
  const catcher = (error: Error) =>
    res.status(400).json({ message: "Failure", error: error });

  // connect to the database
  await connectToDatabase();

  // potential Responses
  const handleCase: ApiFuncs = {
    // Response for GET requests
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const db = await connectToDatabase(); // connect to database
      res.json(await Request.find({}).catch(catcher));
    },
    // Response for POST requests
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const db = await connectToDatabase(); // connect to database
      res.json(await Request.create(req.body).catch(catcher));
    },
  };

  const response = handleCase[method];
  if (response) {
    response(req, res);
  } else {
    res
      .status(405)
      .json({ message: "Failure", error: "No Response for This Request" });
  }
};

export default handler;
