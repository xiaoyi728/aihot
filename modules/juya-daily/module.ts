// 这个模块的地址：/juya 看某一期的全部内容，/juya/2026-10-14 看某一期；/api/juya/ 是给这些页面读的数据。
import { defineModule } from "@aihot/contracts/modules";

export default defineModule({
  name: "juya-daily",
  pages: [
    { path: "juya", file: "page.tsx", id: "juya-latest" },
    { path: "juya/:date", file: "page.tsx", id: "juya-issue" },
  ],
  apiPaths: [/^\/api\/juya\//],
});