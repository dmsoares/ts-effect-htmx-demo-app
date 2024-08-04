import { Context, Layer } from "effect";
import express from "express";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";

// Define Express as a service
export class Express extends Context.Tag("Express")<
  Express,
  ReturnType<typeof express>
>() {}

// Setting Up Express
export const ExpressLive = Layer.sync(Express, () => {
  const app = express();

  nunjucks.configure("src/app/browser/views", {
    autoescape: true,
    express: app,
  });

  return app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));
});
