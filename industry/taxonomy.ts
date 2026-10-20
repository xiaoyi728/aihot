// 这个站的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。
//
// 本站同时覆盖两个行业：AI 与 PCB（印制电路板）。类别按 AI 相关 / PCB 相关两组排，
// 组内再分小类；提示词（industry/prompts/）里两套评分权重与噪声规则对应这两组。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  // ── AI 相关 ────────────────────────────────────────────────────────────────────────────
  { key: "ai-models", tagColor: "indigo", label: "AI 模型", feedLabel: "AI 模型", section: "AI 模型与产品", guide: "模型本身的发布、版本、权重开放、能力或价格变化，以及既有榜单上的模型成绩。公布一次跑分不是发布新基准，也不是教程。" },
  { key: "ai-products", tagColor: "turquoise", label: "AI 产品", feedLabel: "AI 产品", section: "AI 模型与产品", guide: "可使用的 AI 产品、功能、应用、工具、API、平台和工程组件的发布更新。模型厂商发布的推理框架、算子库、硬件适配组件仍是产品，不能因为厂商名归成模型。AI 服务器、加速卡等硬件整机归 PCB 相关的 pcb-demand，芯片设计、流片归 ai-paper 或 ai-industry。" },
  { key: "ai-paper", tagColor: "violet", label: "AI 论文", feedLabel: "AI 论文", section: "AI 研究", guide: "以新研究方法、实验设计与发现为核心的论文、技术报告、新基准或研究数据集。系统性红队实验属于研究；既有榜单成绩归模型，真实事故的新闻调查归行业。" },
  { key: "ai-industry", tagColor: "orange", label: "AI 行业", feedLabel: "AI 行业动态", section: "AI 行业动态", guide: "AI 领域的公司经营、融资并购、人事、合作、诉讼、政策、算力与数据中心建设、真实安全事故及调查进展。新闻由当事人发帖、带有态度，也不因此变成观点。" },
  // ── PCB 相关 ──────────────────────────────────────────────────────────────────────────
  { key: "pcb-capacity", tagColor: "blue", label: "PCB 产能", feedLabel: "PCB 产能", section: "PCB 产能与扩产", guide: "PCB 及上游材料设备厂商的产能建设与投产：新厂、扩产、技改、爬坡与达产、关停与搬迁、设备采购安装。只报道意向或签约未开工的也归这里，但必须写清阶段。" },
  { key: "pcb-tech", tagColor: "cyan", label: "PCB 技术", feedLabel: "PCB 技术", section: "PCB 技术突破", guide: "制造与产品技术进展：HDI、类载板、IC 载板与 ABF、高多层板、软板与软硬结合板、埋容埋阻、材料与工艺革新、检测与方法。已量产的技术改进算，纯学术论文归 pcb-supply 或 ai-paper。" },
  { key: "pcb-business", tagColor: "green", label: "PCB 经营", feedLabel: "PCB 经营与订单", section: "PCB 经营与订单", guide: "PCB 企业的经营动作：财报与业绩预告、接单与在手订单、大客户与终端应用（服务器、汽车、手机、卫星）、涨价与降价、并购重组、投资与合资、募资与减持。" },
  { key: "pcb-supply", tagColor: "yellow", label: "PCB 上游", feedLabel: "PCB 上游与设备", section: "PCB 上游与设备", guide: "覆铜板、铜箔、树脂、油墨、干膜、钻针等材料，以及钻孔、曝光、蚀刻、电镀、检测等专用设备的发布、供需、价格与厂商动作。标准与行业统计（IPC、CPCA、book-to-bill）也归这里。" },
  // ── 两个行业共有 ──────────────────────────────────────────────────────────────────────
  { key: "cross-demand", tagColor: "red", label: "AI×PCB", feedLabel: "AI 与 PCB 交叉", section: "AI 与 PCB 交叉", guide: "同时以 AI 算力硬件需求和 PCB 供给两侧为核心的事件：AI 服务器与交换机带动的高多层板、HDI 与载板需求，PCB 厂拿到算力大客户订单，材料设备厂因 AI 需求调整产能。只要报道的主线是两侧的因果关系，就归这里，不按它提到哪家公司归类。" },
  { key: "tip", tagColor: "green", label: "教程", section: "技巧与观点", guide: "读者可以照着使用的方法、提示词、工具用法、PCB 设计与制造工程实践复盘、技术讲解。重点是可复用的做法；单纯发布工具或产品归对应类别，只有态度和预测而无做法归观点。", commentary: true },
  { key: "opinion", tagColor: "purple", label: "观点", section: "技巧与观点", guide: "重点是作者的解释、判断、主张、预测、评论或访谈观点。讨论市场不自动归行业，作者是名人不自动归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 侧是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * PCB 侧没有单一对应的一类，报头只显示 AI 侧的新模型数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "ai-models", tag: "模型发布", unit: "个新模型" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["ai", "api", "llm", "gpu", "agi", "ceo", "ipo", "pcb", "hdi", "abf", "ccu", "ems", "smt", "hdi板"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。AI 侧 7 类，PCB 侧 5 类。
 */
export const ITEM_TYPES = [
  "model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer",
  "capacity_investment", "process_tech", "order_finance", "supply_equipment", "standard_data",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  // AI
  "产品更新", "模型发布", "论文/研究", "开源/仓库", "教程/实践", "现象/趋势", "大佬观点", "评测/基准", "安全/对齐", "AI行业动态", "政策/监管",
  // PCB
  "产能/扩产", "技术突破", "订单/财报", "上游/设备", "标准/统计", "PCB行业动态",
  // 共有
  "非AI/通用工具", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  // AI
  "Agent", "编码", "推理", "多模态", "语音", "视频", "图像生成", "RAG", "端侧", "数据/训练", "搜索", "部署/工程", "开源生态", "具身智能", "MCP/工具调用", "算力/芯片",
  // PCB
  "高多层板", "HDI", "类载板", "IC载板", "ABF", "软板/FPC", "埋容埋阻", "覆铜板", "铜箔", "树脂/油墨", "钻孔/曝光", "电镀/蚀刻", "检测/AOI", "服务器/交换机", "汽车电子", "消费电子", "通信/基站", "卫星/航天", "医疗电子",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = [
  // AI
  "OpenAI", "Anthropic", "DeepSeek", "DeepMind", "Google", "Meta", "Microsoft", "xAI", "Hugging Face", "GitHub", "arXiv",
  // PCB
  "鹏鼎控股", "东山精密", "深南电路", "兴森科技", "生益科技", "沪电股份", "景旺电子", "胜宏科技", "崇达技术", "奥士康", "世运电路", "依顿电子", "博敏电子", "金像电", "健鼎", "臻鼎", "欣兴电子", "TTM", "AT&S", "Ibiden", "Meiko", "CMK", "Unimicron", "NCAB", "IPC", "CPCA",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  // AI 侧原有
  "教程/玩法": "教程/实践", "技巧/最佳实践": "教程/实践", "合作/生态": "AI行业动态", "融资/收购": "AI行业动态", "公司动态": "AI行业动态",
  合作: "AI行业动态", 生态: "AI行业动态", 融资: "AI行业动态", 收购: "AI行业动态", 投资: "AI行业动态", 并购: "AI行业动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 安全: "安全/对齐", 对齐: "安全/对齐",
  论文: "论文/研究", 研究: "论文/研究", paper: "论文/研究", papers: "论文/研究",
  "open-source": "开源/仓库", 开源: "开源/仓库", 仓库: "开源/仓库", repo: "开源/仓库",
  教程: "教程/实践", 玩法: "教程/实践", 指南: "教程/实践", 技巧: "教程/实践", 最佳实践: "教程/实践", 实践: "教程/实践",
  产品: "产品更新", 更新: "产品更新", 发布: "模型发布", 模型: "模型发布", 趋势: "现象/趋势", 现象: "现象/趋势", 观点: "大佬观点",
  视频生成: "视频", 非ai: "非AI/通用工具", "non-ai": "非AI/通用工具", 通用工具: "非AI/通用工具", 工程工具: "非AI/通用工具",
  安全扫描: "非AI/通用工具", devops: "非AI/通用工具", 行业: "AI行业动态", 动态: "AI行业动态",
  // PCB 侧
  扩产: "产能/扩产", 投产: "产能/扩产", 新厂: "产能/扩产", 产能: "产能/扩产", 技改: "产能/扩产", 达产: "产能/扩产", 爬坡: "产能/扩产",
  技术: "技术突破", 工艺: "技术突破", hdi: "HDI", 载板: "IC载板", 类载板: "类载板", abf: "ABF", 软板: "软板/FPC", fpc: "软板/FPC",
  订单: "订单/财报", 财报: "订单/财报", 业绩: "订单/财报", 营收: "订单/财报", 涨价: "订单/财报", 降价: "订单/财报", 提价: "订单/财报",
  覆铜板: "覆铜板", ccl: "覆铜板", 铜箔: "铜箔", 树脂: "树脂/油墨", 油墨: "树脂/油墨", 干膜: "树脂/油墨", 钻针: "上游/设备",
  设备: "上游/设备", 钻孔: "钻孔/曝光", 曝光: "钻孔/曝光", 电镀: "电镀/蚀刻", 蚀刻: "电镀/蚀刻", aoi: "检测/AOI", 检测: "检测/AOI",
  标准: "标准/统计", 统计: "标准/统计", ipc: "标准/统计", cpca: "标准/统计", "book-to-bill": "标准/统计",
  pcb: "PCB行业动态", 电路板: "PCB行业动态", 印制电路板: "PCB行业动态", 线路板: "PCB行业动态",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  // ── AI ──
  "world-labs": { name: "World Labs", displayTag: null, aliases: ["World Labs"] },
  "thinking-machines": { name: "Thinking Machines Lab", displayTag: null, aliases: ["Thinking Machines"] },
  amd: { name: "AMD", displayTag: null, aliases: ["AMD", "Advanced Micro Devices"] },
  openai: { name: "OpenAI", displayTag: "OpenAI", aliases: ["OpenAI", "ChatGPT", "Sora", "Codex", "GPT"], orgNames: ["OpenAI"], otherNames: ["OpenAI Developers"] },
  anthropic: { name: "Anthropic", displayTag: "Anthropic", aliases: ["Anthropic", "Claude"], orgNames: ["Anthropic"], otherNames: ["Claude Code"] },
  google: { name: "Google", displayTag: "Google", aliases: ["Google", "DeepMind", "Gemini", "谷歌"], orgNames: ["Google DeepMind", "Google Research", "Google", "DeepMind", "谷歌"], otherNames: ["Google DeepMind", "Google Research", "Google AI", "Google Labs", "Google Cloud"] },
  deepseek: { name: "DeepSeek", displayTag: "DeepSeek", aliases: ["DeepSeek", "深度求索"], orgNames: ["DeepSeek", "深度求索"] },
  qwen: { name: "千问 Qwen", displayTag: null, aliases: ["Qwen", "通义", "阿里"], orgNames: ["通义千问", "通义实验室", "阿里巴巴", "阿里云", "阿里", "Qwen Team", "Qwen", "Alibaba"], otherNames: ["通义千问", "千问", "千问APP", "Qwen Team", "通义实验室", "阿里巴巴", "Alibaba", "阿里云", "Alibaba Cloud"] },
  kimi: { name: "Kimi / 月之暗面", displayTag: null, aliases: ["Kimi", "月之暗面", "Moonshot"], orgNames: ["Moonshot AI", "月之暗面", "Kimi"], otherNames: ["Moonshot AI"] },
  minimax: { name: "MiniMax", displayTag: null, aliases: ["MiniMax", "海螺"], orgNames: ["MiniMax", "稀宇科技"], otherNames: ["稀宇科技"] },
  zhipu: { name: "智谱 GLM", displayTag: null, aliases: ["智谱", "GLM", "Z.ai"], orgNames: ["智谱AI", "智谱", "Zhipu AI", "Z.ai"], otherNames: ["智谱AI", "Zhipu", "Zhipu AI"] },
  xai: { name: "xAI", displayTag: "xAI", aliases: ["xAI", "Grok"], orgNames: ["SpaceX Super Intelligence", "SpaceXAI", "SpaceXSI", "xAI"], otherNames: ["SpaceXAI", "Grok Bot"] },
  meta: { name: "Meta", displayTag: "Meta", aliases: ["Meta", "Llama"], orgNames: ["Meta Superintelligence Labs", "Meta AI", "Meta"], otherNames: ["Meta AI", "AI at Meta", "Muse"] },
  microsoft: { name: "Microsoft", displayTag: "Microsoft", aliases: ["Microsoft", "微软", "Copilot"], orgNames: ["Microsoft Research", "Microsoft AI", "Microsoft", "微软"], otherNames: ["Microsoft Research", "Microsoft AI"] },
  nvidia: { name: "NVIDIA", displayTag: null, aliases: ["NVIDIA", "英伟达"], orgNames: ["NVIDIA", "英伟达"] },
  "hugging-face": { name: "Hugging Face", displayTag: "Hugging Face", aliases: ["Hugging Face"], orgNames: ["Hugging Face", "HuggingFace"], otherNames: ["HuggingFace"] },
  cursor: { name: "Cursor", displayTag: null, aliases: ["Cursor", "Anysphere"], orgNames: ["Cursor"] },
  openrouter: { name: "OpenRouter", displayTag: null, aliases: ["OpenRouter"], orgNames: ["OpenRouter"] },
  amazon: { name: "Amazon / AWS", displayTag: null, aliases: ["Amazon", "AWS", "亚马逊"], otherNames: ["AWS Machine Learning"] },
  github: { name: "GitHub", displayTag: "GitHub", aliases: ["GitHub"], otherNames: ["GitHub Blog"] },
  baidu: { name: "百度文心", displayTag: null, aliases: ["百度", "Baidu", "文心", "ERNIE Bot"], otherNames: ["文心一言"] },
  tencent: { name: "腾讯混元", displayTag: null, aliases: ["腾讯", "Tencent", "混元", "Hunyuan"], otherNames: ["腾讯云"] },
  bytedance: { name: "字节跳动", displayTag: null, aliases: ["字节跳动", "ByteDance", "豆包", "Doubao"], otherNames: ["火山引擎", "Seed"] },
  mistral: { name: "Mistral AI", displayTag: null, aliases: ["Mistral", "Mistral AI"] },
  stability: { name: "Stability AI", displayTag: null, aliases: ["Stability AI"] },
  midjourney: { name: "Midjourney", displayTag: null, aliases: ["Midjourney"] },
  perplexity: { name: "Perplexity", displayTag: null, aliases: ["Perplexity"] },
  apple: { name: "Apple", displayTag: null, aliases: ["Apple", "苹果"], otherNames: ["Apple Intelligence", "Apple Silicon"] },
  intel: { name: "Intel", displayTag: null, aliases: ["Intel", "英特尔"] },
  broadcom: { name: "Broadcom", displayTag: null, aliases: ["Broadcom", "博通"] },
  qualcomm: { name: "Qualcomm", displayTag: null, aliases: ["Qualcomm", "高通"] },

  // ── PCB 制造商 ──
  "avary-holding": { name: "鹏鼎控股", displayTag: "鹏鼎控股", aliases: ["鹏鼎控股", "鹏鼎", "Avary Holding"], otherNames: ["鹏鼎科技"] },
  "dongshan-precision": { name: "东山精密", displayTag: "东山精密", aliases: ["东山精密", "苏州东山精密", "Dongshan Precision"], otherNames: ["Multi-Fineline Electronix", "MFLEX"] },
  scc: { name: "深南电路", displayTag: "深南电路", aliases: ["深南电路", "SCC"], otherNames: ["深南电路股份有限公司"] },
  "fastprint-circuit": { name: "兴森科技", displayTag: "兴森科技", aliases: ["兴森科技", "Fastprint Circuit"], otherNames: ["Fastprint"] },
  shengyi: { name: "生益科技", displayTag: "生益科技", aliases: ["生益科技", "Shengyi Technology"], otherNames: ["生益电子"] },
  "wus-printed": { name: "沪电股份", displayTag: "沪电股份", aliases: ["沪电股份", "沪士电子", "WUS Printed Circuit"], otherNames: ["沪电"] },
  kinwong: { name: "景旺电子", displayTag: "景旺电子", aliases: ["景旺电子", "Kinwong"], otherNames: ["景旺"] },
  "victory-giant": { name: "胜宏科技", displayTag: "胜宏科技", aliases: ["胜宏科技", "Victory Giant"], otherNames: ["胜宏"] },
  "chongda-tech": { name: "崇达技术", displayTag: "崇达技术", aliases: ["崇达技术", "Shennan Circuits-崇达"], otherNames: ["崇达"] },
  "aoshikang": { name: "奥士康", displayTag: "奥士康", aliases: ["奥士康", "Aoshikang"], otherNames: ["奥士康科技"] },
  "shijin-circuits": { name: "世运电路", displayTag: "世运电路", aliases: ["世运电路", "Shijin Circuits"], otherNames: ["世运"] },
  "yidun-electronics": { name: "依顿电子", displayTag: "依顿电子", aliases: ["依顿电子", "Yidun"], otherNames: ["广东依顿"] },
  "bomin-electronics": { name: "博敏电子", displayTag: "博敏电子", aliases: ["博敏电子", "Bomin"], otherNames: ["博敏"] },
  "gold-circuits": { name: "金像电", displayTag: "金像电子", aliases: ["金像电", "金像电子", "Gold Circuits"], otherNames: ["GCE"] },
  "chin-poon": { name: "健鼎", displayTag: "健鼎", aliases: ["健鼎", "Chin Poon"], otherNames: ["健鼎科技"] },
  "zhen-ding": { name: "臻鼎科技", displayTag: "臻鼎", aliases: ["臻鼎", "臻鼎科技", "Zhen Ding"], otherNames: ["ZDT"] },
  "unimicron": { name: "欣兴电子", displayTag: "欣兴电子", aliases: ["欣兴电子", "欣兴", "Unimicron"], otherNames: ["Unimicron Technology"] },
  ttm: { name: "TTM Technologies", displayTag: "TTM", aliases: ["TTM Technologies", "TTM"], otherNames: ["TTM"] },
  "ats-corp": { name: "AT&S", displayTag: "AT&S", aliases: ["AT&S", "Austria Technologie"], otherNames: ["AT&S Austria"] },
  ibiden: { name: "Ibiden", displayTag: "Ibiden", aliases: ["Ibiden", "伊藤忠テクノ"], otherNames: ["Ibiden Co"] },
  meiko: { name: "Meiko Electronics", displayTag: "Meiko", aliases: ["Meiko", "名幸电子"], otherNames: ["Meiko Electronics"] },
  cmk: { name: "CMK", displayTag: "CMK", aliases: ["CMK Corporation", "CMK"], otherNames: ["日本CMK"] },
  ncab: { name: "NCAB Group", displayTag: "NCAB", aliases: ["NCAB", "NCAB Group"], otherNames: ["NCAB Nordic"] },
  "jlc-electronic": { name: "嘉立创", displayTag: "嘉立创", aliases: ["嘉立创", "JLC", "嘉立创科技"], otherNames: ["JLC PCB", "立创商城"] },
  "huaqiu-pcb": { name: "华秋电路", displayTag: "华秋", aliases: ["华秋", "华秋电路", "Huaqiu"], otherNames: ["华秋电子"] },

  // ── 上游材料与设备 ──
  "dupont": { name: "DuPont", displayTag: "DuPont", aliases: ["DuPont", "杜邦"], otherNames: ["DuPont Electronics"] },
  rogers: { name: "Rogers Corporation", displayTag: "Rogers", aliases: ["Rogers Corporation", "罗杰斯"], otherNames: ["Rogers Corp"] },
  isola: { name: "Isola Group", displayTag: "Isola", aliases: ["Isola Group", "Isola"], otherNames: ["Isola"] },
  "taiyo-ink": { name: "太阳油墨", displayTag: "太阳油墨", aliases: ["太阳油墨", "Taiyo Ink", "Taiyo Holdings"], otherNames: ["TAIYO"] },
  "toyo-ink": { name: "东洋油墨", displayTag: "东洋油墨", aliases: ["东洋油墨", "Toyo Ink"], otherNames: ["TOYO INK SC HOLDINGS"] },
  panasonic: { name: "Panasonic", displayTag: "Panasonic", aliases: ["Panasonic", "松下"], otherNames: ["Panasonic Industry"] },
  "orbotech-kla": { name: "Orbotech / KLA", displayTag: "KLA", aliases: ["Orbotech", "KLA", "奥宝科技"], otherNames: ["KLA Corporation"] },
  "han-s-laser": { name: "大族数控", displayTag: "大族数控", aliases: ["大族数控", "Hans Laser", "大族激光"], otherNames: ["大族"] },
  "cims": { name: "芯碁微装", displayTag: "芯碁微装", aliases: ["芯碁微装", "CIMS"], otherNames: ["安徽芯碁"] },

  // ── 行业组织 ──
  ipc: { name: "IPC / 全球电子协会", displayTag: "IPC", aliases: ["IPC", "Global Electronics Association", "全球电子协会"], otherNames: ["electronics.org", "IPC Publishing Group"] },
  cpca: { name: "中国电子电路行业协会", displayTag: "CPCA", aliases: ["CPCA", "中国电子电路行业协会"], otherNames: ["China Printed Circuit Association"] },
  tpca: { name: "台湾电路板协会", displayTag: "TPCA", aliases: ["TPCA", "台湾电路板协会"], otherNames: ["Taiwan Printed Circuit Association"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "openai", name: "OpenAI", patterns: [/openai|chatgpt|\bgpt-?[o\d]|\bsora\b|\bcodex\b/i] },
  { id: "anthropic", name: "Anthropic", patterns: [/anthropic|\bclaude\b/i, /\b(?:opus|sonnet|haiku)\s*\d+(?:[.\-]\d+)*\b/i, /\bfable\s*\d+(?:[.\-]\d+)*\b|\bmythos\b/i] },
  { id: "google", name: "Google / Gemini", patterns: [/google|deepmind|\bgemini\b|notebooklm|\bveo\s?\d|\bAlphaFold\b|\bAMIE\b/i] },
  { id: "deepseek", name: "DeepSeek", patterns: [/deepseek|深度求索/i] },
  { id: "xai", name: "xAI / Grok", patterns: [/\bxai\b|\bgrok\b/i] },
  { id: "meta", name: "Meta / Llama", patterns: [/\bMeta\b/, /\bmeta\s?ai\b|\bllama\b/i] },
  { id: "microsoft", name: "Microsoft / Copilot", patterns: [/microsoft|copilot|微软/i] },
  { id: "nvidia", name: "NVIDIA", patterns: [/nvidia|英伟达|\bnemotron\b|\bnemo\b|\bblackwell\b|\brubin(?:\s+ultra)?\b|\bcuda\b/i] },
  { id: "qwen", name: "千问 Qwen", patterns: [/\bqwen|通义|千问/i] },
  { id: "hugging-face", name: "Hugging Face", patterns: [/hugging\s?face/i] },
  { id: "cursor", name: "Cursor", patterns: [/\bCursor\b/] },
  { id: "kimi", name: "Kimi / 月之暗面", patterns: [/\bkimi\b|月之暗面|\bmoonshot\s?ai\b/i] },
  { id: "openrouter", name: "OpenRouter", patterns: [/openrouter/i] },
  { id: "minimax", name: "MiniMax", patterns: [/minimax/i] },
  { id: "zhipu", name: "智谱 GLM", patterns: [/智谱|\bglm-?[4-9]/i] },
  { id: "hunyuan", name: "腾讯混元", patterns: [/混元|hunyuan/i] },
  { id: "doubao", name: "字节豆包", patterns: [/豆包|doubao|字节跳动|bytedance/i] },
  { id: "mistral", name: "Mistral", patterns: [/mistral/i] },
  { id: "perplexity", name: "Perplexity", patterns: [/\bPerplexity\b/] },
  { id: "runway", name: "Runway", patterns: [/\brunway\b/i] },
  { id: "suno", name: "Suno", patterns: [/\bsuno\b/i] },
  { id: "midjourney", name: "Midjourney", patterns: [/midjourney/i] },
  { id: "stability-ai", name: "Stability AI", patterns: [/stability\s?ai/i] },
  { id: "elevenlabs", name: "ElevenLabs", patterns: [/eleven\s?labs/i] },
  { id: "vllm", name: "vLLM", patterns: [/\bvllm\b/i] },
  { id: "ollama", name: "Ollama", patterns: [/\bollama\b/i] },
  { id: "windsurf", name: "Windsurf", patterns: [/windsurf/i] },
  { id: "devin", name: "Devin", patterns: [/\bdevin\b/i] },
  { id: "manus", name: "Manus", patterns: [/\bmanus\b/i] },
  { id: "apple", name: "Apple AI", patterns: [/\bapple\s?(intelligence|silicon|ai)\b|苹果(智能|\s?AI)/i] },
  { id: "amazon", name: "Amazon / AWS", patterns: [/amazon|\baws\b|亚马逊/i] },
  { id: "baidu", name: "百度文心", patterns: [/百度|baidu|文心|\bernie\s?bot\b/i] },

  // PCB 制造商与上游：中文名与常见缩写都要认
  { id: "avary-holding", name: "鹏鼎控股", patterns: [/鹏鼎|\bavary\b/i] },
  { id: "dongshan-precision", name: "东山精密", patterns: [/东山精密|\bdongshan\b|\bmflex\b/i] },
  { id: "scc", name: "深南电路", patterns: [/深南电路|\bscc\b/i] },
  { id: "fastprint-circuit", name: "兴森科技", patterns: [/兴森科技|\bfastprint\b/i] },
  { id: "shengyi", name: "生益科技", patterns: [/生益科技|\bshengyi\b/i] },
  { id: "wus-printed", name: "沪电股份", patterns: [/沪电股份|沪士电子|\bwus\b/i] },
  { id: "kinwong", name: "景旺电子", patterns: [/景旺电子|\bkinwong\b/i] },
  { id: "victory-giant", name: "胜宏科技", patterns: [/胜宏科技|\bvictory\s+giant\b|\bvg(?:t)?\b/i] },
  { id: "chongda-tech", name: "崇达技术", patterns: [/崇达技术|\bsuntak\b|\bchongda\b/i] },
  { id: "aoshikang", name: "奥士康", patterns: [/奥士康|\baoshikang\b/i] },
  { id: "shijin-circuits", name: "世运电路", patterns: [/世运电路|\bshijin\b/i] },
  { id: "yidun-electronics", name: "依顿电子", patterns: [/依顿电子|\byidun\b/i] },
  { id: "bomin-electronics", name: "博敏电子", patterns: [/博敏电子|\bbomin\b/i] },
  { id: "gold-circuits", name: "金像电", patterns: [/金像电|金像电子|\bgold\s+circuits\b|\bgce\b/i] },
  { id: "chin-poon", name: "健鼎", patterns: [/健鼎|\bchin\s?poon\b/i] },
  { id: "zhen-ding", name: "臻鼎科技", patterns: [/臻鼎|\bzhen\s?ding\b|\bzdt\b/i] },
  { id: "unimicron", name: "欣兴电子", patterns: [/欣兴电子|欣兴|\bunimicron\b/i] },
  { id: "ttm", name: "TTM Technologies", patterns: [/\bttm\s+technologies\b|\bttm\b/i] },
  { id: "ats-corp", name: "AT&S", patterns: [/\bat&s\b/i] },
  { id: "ibiden", name: "Ibiden", patterns: [/ibiden|イビデン/i] },
  { id: "meiko", name: "Meiko Electronics", patterns: [/\bmeiko\b|名幸电子/i] },
  { id: "cmk", name: "CMK", patterns: [/\bcmk\s+corporation\b/i] },
  { id: "ncab", name: "NCAB Group", patterns: [/\bncab\b/i] },
  { id: "jlc-electronic", name: "嘉立创", patterns: [/嘉立创|\bjlc\b/i] },
  { id: "huaqiu-pcb", name: "华秋电路", patterns: [/华秋电路|华秋电子|\bhuaqiu\b/i] },
  { id: "dupont", name: "DuPont", patterns: [/dupont|杜邦/i] },
  { id: "rogers", name: "Rogers", patterns: [/rogers\s+(corporation|corp)/i] },
  { id: "isola", name: "Isola", patterns: [/isola/i] },
  { id: "taiyo-ink", name: "太阳油墨", patterns: [/太阳油墨|\btaiyo\b/i] },
  { id: "toyo-ink", name: "东洋油墨", patterns: [/东洋油墨|\btoyo\s+ink\b/i] },
  { id: "panasonic", name: "Panasonic", patterns: [/panasonic|松下/i] },
  { id: "orbotech-kla", name: "Orbotech / KLA", patterns: [/orbotech|\bkla\b|奥宝科技/i] },
  { id: "han-s-laser", name: "大族数控", patterns: [/大族数控|大族激光|\bhans\s+laser\b/i] },
  { id: "cims", name: "芯碁微装", patterns: [/芯碁微装|\bcims\b/i] },
  { id: "ipc", name: "IPC / 全球电子协会", patterns: [/\bipc\b|global electronics association|全球电子协会/i] },
  { id: "cpca", name: "中国电子电路行业协会", patterns: [/\bcpca\b|中国电子电路行业协会/i] },
  { id: "tpca", name: "台湾电路板协会", patterns: [/\btpca\b|台湾电路板协会/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "openai", domains: ["openai.com"] },
  { entityId: "anthropic", domains: ["anthropic.com", "claude.com"] },
  { entityId: "google", domains: ["deepmind.google", "ai.google", "blog.google"] },
  { entityId: "deepseek", domains: ["deepseek.com"] },
  { entityId: "xai", domains: ["x.ai"] },
  { entityId: "meta", domains: ["ai.meta.com"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "nvidia", domains: ["nvidia.com"] },
  { entityId: "qwen", domains: ["qwen.ai"] },
  { entityId: "cursor", domains: ["cursor.com"] },
  { entityId: "openrouter", domains: ["openrouter.ai"] },
  { entityId: "ipc", domains: ["electronics.org", "ipc.org"] },
  { entityId: "cpca", domains: ["cpca.org.cn"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "meta", pattern: /@AIatMeta\b/i },
  { entityId: "zhipu", pattern: /\bZhipu(?:\s+AI\b|['’]s\b)/i },
];
