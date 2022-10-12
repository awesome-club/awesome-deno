import { NewsPath } from "./env.ts";
import { parse } from "./deps.ts";
import { Application, Router } from "./deps.ts";

interface Story {
  title: string;
  url: string;
}

const router = new Router()
  .get("/stories/:count", async (ctx) => {
    const count = ctx.params.count ?? "10";

    const response = await fetch(`${NewsPath}/topstories.json`);
    const ids = await response.json();

    const promises = [] as Promise<Response>[];
    for (let idx = 0; idx < parseInt(count); idx++) {
      promises.push(fetch(`${NewsPath}/item/${ids[idx]}.json`));
    }

    const responses = await Promise.all(promises);
    const stories = await Promise.all(
      responses.map((it) => it.json() as Promise<Story>),
    );

    ctx.response.body = stories.map((it) => it.title);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
