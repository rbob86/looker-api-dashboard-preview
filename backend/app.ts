import express, { Request, Response } from "express";
import { IEmbedSsoParams } from "@looker/sdk";
import cors from "cors";
import { LookerNodeSDK } from "@looker/sdk-node";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
const port = 3001;
const sdk = LookerNodeSDK.init40();

app.get("/api/get-dashboards", async (req: Request, res: Response) => {
  const lookerDashboards = await sdk.ok(sdk.all_dashboards("id, title"));
  const firstTenDashboards = lookerDashboards.slice(0, 10);

  const dashboards = await Promise.all(
    firstTenDashboards.map(async (dashboard) => {
      const thumbnailResponse: any = await sdk.ok(
        sdk.content_thumbnail({
          type: "dashboard",
          resource_id: dashboard.id!,
          format: "png",
          width: 200,
          height: 200,
        })
      );

      const buffer = Buffer.from(thumbnailResponse, "binary");
      const base64Thumbnail = buffer.toString("base64");

      return {
        title: dashboard.title,
        description: "Lorem ipsum dolor lorem ipsum dolor lorem ipsum lorem",
        rawThumbnail: `data:image/png;base64,${thumbnailResponse}`,
        thumbnail: `data:image/png;base64,${base64Thumbnail}`,
      };
    })
  );

  res.json(dashboards);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
