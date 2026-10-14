// 这个模块给网页加的东西：侧栏里通往 /juya 的一个入口。
// 橘鸦的条目和别家信源一样，要靠精选才进日报，所以这个模块不改日报页：日报页上出现的每一条，
// 都和其他信源一样过了同一套评分与编排。
import { defineWebModule } from "@aihot/web/modules";
import { IconDoc } from "../../apps/web/app/components/icons";
import { SOURCE_LABEL } from "./view.ts";

export default defineWebModule({
  name: "juya-daily",
  sidebar: { section: "内容", items: [{ to: "/juya", label: SOURCE_LABEL, icon: IconDoc }] },
});