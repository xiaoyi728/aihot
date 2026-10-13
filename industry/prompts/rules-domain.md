
【本平台同时覆盖 AI 与 PCB（印制电路板）两个行业。以下 AI 与 PCB 术语规则都严格遵守】

## 一、AI 领域翻译规则

1. 歧义默认值：以下词在中文有非 AI 歧义，**一律按 AI 含义翻译**：
   - LLM = 大语言模型（绝不译"法学硕士"/"Master of Laws"）
   - Token / tokens = 模型 token（保留英文；绝不译"代币"/"令牌"）
   - Transformer = Transformer 架构（保留英文；不译"变压器"）
   - Diffusion = 扩散模型（AI 生成，不是物理扩散）
   - Agent / Agentic = AI 智能体 / 智能体的（不译"代理人"/"中介"）
   - Alignment = 对齐（AI 安全语境）
   - Inference = 推理（模型生成）
   - Reasoning = 推理（注意：与 inference 都译"推理"，必要时用"链式推理"区分 CoT；reasoning model 指 o1/o3/R1 这类思考型模型）
   - Embedding = 嵌入向量（也可保留英文）
   - Distillation = 知识蒸馏
   - Hallucination = 模型幻觉
   - Fine-tune / Fine-tuning = 微调
   - Pretrain / Pretraining = 预训练
   - Context window = 上下文窗口
   - Prompt = 提示词
   - Skill / Skills = 技能（Claude 等 Agent 框架的能力包，不译"特长"）

2. 以下专有名词**一律保留英文原文**，不翻译不加中文括注：
   - AI 公司：OpenAI / Anthropic / Google DeepMind / xAI / Meta AI / Mistral / DeepSeek / Cohere / HuggingFace（HF）/ Runway / ElevenLabs / Suno / Pika / Midjourney / Perplexity
   - 模型族（举例 + 通用规则）：GPT / Claude / Gemini / Llama / Qwen / Grok / o 系列 / DeepSeek / Mistral / Mixtral / Phi / Sora / Veo / Imagen
     **规则**：任何大模型族名、产品代号一律保留英文
   - 模型版本号（举例 + 通用规则）：GPT-5 / Claude 4.7 / Claude Sonnet 4.6 / Llama 4 / Gemini 3 / o3 / o4 / DeepSeek-V4 / Qwen3.7
     **规则**：版本号一字不改（包括字母数字后缀如 4o / 4.7 / 405B / V4 / R1），绝不"翻译性扩写"（不要把 "405B" 译成 "4050 亿"，不要把 "V4" 译成 "第 4 代"）
   - 技术缩写（举例 + 通用规则）：LLM / RAG / RLHF / DPO / LoRA / QLoRA / PEFT / MoE / CoT / ReAct / KV cache / SOTA / AGI / MCP / ADK / NPU / GPU / TPU
     **规则**：任何 2-5 字母的全大写缩写，默认按 AI/ML 含义保留英文
   - 评测基准（举例 + 通用规则）：MMLU / GPQA / HumanEval / SWE-bench / SWE-bench Verified / AIME / HLE / ARC-AGI / ARC-AGI 2 / MT-Bench / Chatbot Arena / Aider Polyglot / LiveCodeBench
     **规则**：以 -bench / -eval 结尾或全大写的评测名一律保留英文
   - AI 工具/产品：Cursor / Copilot / Codex / Aider / Devin / Cline / Claude Code / Windsurf / Zed / v0 / Bolt / Lovable / Replit Agent
   - Agent 框架：LangChain / LangGraph / LlamaIndex / CrewAI / AutoGen / Pydantic AI / Vercel AI SDK / DSPy
   - 推理/部署：Ollama / vLLM / SGLang / TensorRT / Triton / CUDA / ROCm
   - 通用技术：API / SDK / CLI / IDE / SaaS / CDN / SSO / OAuth / JWT / WebSocket / SSE / gRPC

3. 中国厂商**优先用官方中文品牌名**（首次出现可双标"千问（Qwen3）"，后续选一种保持一致）：
   - 千问（Qwen）/ 文心一言 / 智谱（GLM）/ 月之暗面（Kimi）/ 深度求索（DeepSeek）/ 阶跃星辰（Step）/ 零一万物（Yi）/ 百川 / 豆包（字节）/ 混元（腾讯）/ 可灵（Kling，快手）/ 即梦（Jimeng，字节）/ MiniMax（不译）/ 美团 LongCat / 昆仑万维 Skywork / 面壁 MiniCPM / 华为昇腾 / 寒武纪

4. 代码 / 命令 / URL / 数字单位 **一字不改**保留：
   - 反引号代码 `code` 不翻译
   - 命令如 /code-review、pip install、npm run 不译（不要译"代码审查"）
   - URL 原样
   - 数字+单位：8k context / 175B params / 3.5x speedup / $3 per M tokens / 99.9%
   - 金额、参数量、比例、区间必须保留原文的阿拉伯数字和单位；不要把 $10B-$100B 改写成“数百亿至数千亿美元”等中文数量词

## 二、PCB（印制电路板）领域翻译规则

1. **一律保留英文的术语与缩写**（行业内通用写法，不译）：
   - 板类与工艺：PCB / HDI / FPC /软板（FPC 可写"软板（FPC）"）/软硬结合板 / mSAP / SAP / IC Substrate / ABF / BT / CCL / RCC / SLP / Any-layer HDI / Build-up / Via /盲孔（blind via）/埋孔（buried via）／叠孔（stacked via）
   - 规格参数：层数（layer count）/板厚（thickness）/线宽线距（L/S，line width/space）/铜厚（copper thickness）/厚径比（aspect ratio）/阻抗（impedance）/Dk / Df /损耗（loss）/插损（insertion loss）/回损（return loss）
   - 材料：覆铜板（CCL）/铜箔（copper foil）/玻纤布（glass fabric）/树脂（resin）/油墨（ink）/干膜（dry film）/半固化片（prepreg）/填料（filler）/氢氧化铝/二氧化硅
   - 工艺与设备：钻孔（drilling）/激光钻孔（laser drilling）/曝光（exposure）/LDI（激光直接成像）/蚀刻（etching）/电镀（plating）/沉铜/PTH/表面处理（surface finish）/ENIG / OSP /沉金 /喷锡（HASL）/阻焊（solder mask）/字符（silkscreen）/AOI / AXI /飞针测试 / 测试架
   - 制造与服务：打样（prototype）/小批量（low-volume）/批量（mass production）/交期（lead time）/MOQ / BOM / DFM / Gerber / IPC 标准（IPC-6012 / IPC-A-600 / IPC-1783 等）
   - 经营与统计：book-to-bill（B2B，订单出货比）/稼动率（utilization）/产能利用率 / Capex / ASP /毛利（gross margin）/稼动 / 认证（qualification）/审厂（audit）

2. **中文为主、首次可双标**的常见词：
   - 印制电路板（PCB）/ 电路板 / 线路板
   - 载板：IC 载板 / IC Substrate / 类载板（SLP，Like Substrate）/ 封装基板
   - 高多层板（high-layer-count board）/ HDI 板
   - 埋容埋阻（embedded capacitance/resistance）
   - 扩产（capacity expansion）/ 技改（technical upgrade）/ 爬坡（ramp-up）/ 达产（full production）
   - 涨价（price increase）/ 涨价函（price increase letter）/ 交期（delivery lead time）

3. **公司名按官方写法**：中国大陆与台湾公司用中文名（鹏鼎控股、东山精密、深南电路、兴森科技、生益科技、沪电股份、景旺电子、胜宏科技、崇达技术、奥士康、世运电路、依顿电子、博敏电子、金像电、健鼎、臻鼎、欣兴电子、嘉立创、华秋电路、大族数控、芯碁微装）；海外公司保留英文（TTM Technologies、AT&S、Ibiden、Meiko、CMK、Unimicron、NCAB Group、Rogers、Isola、DuPont、Taiyo Ink、Toyo Ink、KLA、Orbotech、Via Mechanics、PCEA）。

4. **数字与单位保留原文**：层数（20 层 / 40 层）、面积（平方米）、金额（亿元 / 亿美元）、产能（万平方米/月）、比例（%）、交期（周 / 月）。不要把"32 层高多层板"译成"三十二层"，不要把"12 亿元"改写成"逾十亿元"。
