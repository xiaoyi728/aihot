# PCB（印制电路板）行业公开信源清单

> 验证时间：2026-10-13。所有标注「✅已实测」的地址均由我本人用 curl 实际抓取过，返回 200 且内容为合法 RSS/Atom XML 或可抓的 HTML 列表页；标注「⚠️需试抓确认」的表示该 URL 形态常见但我未能从本机成功抓到（多为 Cloudflare 拦截或 DNS 污染），不代表不存在。

## 关于验证的说明

- 抓取方式：`curl -4 -L` + 桌面 Safari UA，超时 20-25s。区分了三种失败：
  - `403 Just a moment...` = Cloudflare 挑战页，feed 可能真实存在但需要浏览器级 UA/JS；
  - `000` = 连接失败，多为本地 DNS 污染或 IPv6 优先导致（中文站点常见）；
  - `404` = 路径确实不存在。
- 我**没有编造任何 URL**。找不到确切地址的一律写「需试抓确认」。

---

# 第一类：官方一手（T1）

## 1.1 行业协会 / 标准组织

### 1. IPC — Global Electronics Association（原国际电子工业联接协会）
- **域名**：electronics.org（原 ipc.org，301 跳转至此）
- **RSS**：`https://www.electronics.org/rss.xml` ✅已实测（www.ipc.org/rss.xml 同样 200，两址同源）
- **类型**：标准发布、新闻稿、协会博客、赛事/活动
- **收录理由**：IPC 标准（IPC-6012、IPC-A-600、IPC-1783 等）是 PCB 品质与验收的行业语言，标准换版本身就是产业链信号。
- **备注**：IPC 中国站 `www.ipc.org.cn/rss.xml` 虽返回 200，但内容全是「首页/辅助导航」等**导航垃圾 item，无信息价值，不要收**。

### 2. CPCA — 中国电子电路行业协会 🇨🇳
- **域名**：cpca.org.cn
- **RSS**：**无 RSS**（/rss.xml、/feed 均 404）
- **可抓列表页**：
  - 协会新闻：`https://www.cpca.org.cn/news-334.html` ✅已实测（分页 -2、-3… 规律明确）
  - 行业动态：`https://www.cpca.org.cn/industry.html` ✅已实测
  - 英文站：`https://www.cpca.org.cn/en/news.html` ✅已实测
- **类型**：行业统计、政策、协会通知、展会（CPCA Show Plus）
- **收录理由**：中国 PCB 产量占全球一半以上，CPCA 的行业运行动态和年会是国内最权威的一手口径。
- **备注**：页面为服务端渲染静态 HTML（IIS），**可直接抓**；但列表页正文内不输出日期，需进详情页取时间。

### 3. TPCA — 台湾电路板协会 🇨🇳（繁体）
- **域名**：tpca.org.tw
- **RSS**：**无 RSS**（/rss.xml、/feed 均 404）
- **可抓列表页**：`https://www.tpca.org.tw/content.php?menu_no=141&mod_no=24` ✅已实测（PHP 站点，必须带 `mod_no` 参数，否则 404）
- **类型**：台湾电路板产业统计、TPCA Show 展会、会员动态
- **收录理由**：台湾是全球 HDI/载板/服务器板重镇（欣兴、健鼎、臻鼎/鹏鼎总部均在此），TPCA 的月营收统计是判断景气的高频指标。
- **备注**：站点还会挂 PDF 报告下载（如「2027 PCB Shop Electronics Industrial Index ASEAN」类文件名），PDF 为主要附件形态。

### 4. SMTA — 表面贴装技术协会
- **域名**：smta.org
- **RSS**：`https://www.smta.org/rss.xml` ⚠️需试抓确认（本机返回 Cloudflare「Just a moment...」403）
- **类型**：SMT/贴装技术论文、行业新闻
- **收录理由**：PCB 下游贴装工艺的第一手技术源，HNP/混合组装趋势常先在此披露。
- **备注**：**Cloudflare 反爬**，需要浏览器级请求头或 Playwright。

### 5. iNEMI — 国际电子制造倡议组织
- **域名**：inemi.org
- **RSS**：**无 RSS**（/rss.xml 返回 HTML 404 页）
- **可抓列表页**：`https://www.inemi.org/news` ⚠️需试抓确认（首页 200，但 /news 404，新闻栏目路径需在站内确认）
- **类型**：技术路线图、研究报告、 consortium 项目
- **收录理由**：iNEMI 路线图覆盖 PCB/基板/互连的长期技术走向，是判断技术代际的锚点。

### 6. PCEA — Printed Circuit Engineering Association（印制电路工程协会）
- **域名**：pcea.net
- **RSS**：`https://pcea.net/feed/` ✅已实测（WordPress，内容极活跃，lastBuildDate 隔日更新）
- **类型**：新闻稿、行业奖项、PCB West/East 会议、技术通讯
- **收录理由**：PCEA 是 Circuits Assembly / PCD&F 杂志的主办方，其新闻稿直接覆盖 PCB 设计—制造—组装全链条，且**大量转载 N.T. Information 的 Nakahara 市场分析**。
- **备注**：强烈推荐，内容质量与抓取稳定性俱佳。

## 1.2 PCB 制造商 / 上市公司 IR

### 7. TTM Technologies（TTMI，美，军工/航天/服务器板龙头）
- **域名**：investors.ttm.com
- **RSS**：`https://investors.ttm.com/news-events/press-releases/rss` ✅已实测（Notified IR 平台，内容实时）
- **类型**：财报、并购、扩产、客户公告
- **收录理由**：北美最大 PCB 厂之一，是 AI 服务器高多层板与军工板的风向标。
- **备注**：注意路径必须是 `/news-events/press-releases/rss`，`/news-events/rss` 是 404。

### 8. AT&S（奥超科技，奥地利，载板/HDI）
- **域名**：ats.net
- **RSS**：**未找到 RSS**（/feed 返回 HTML 而非 XML）
- **可抓列表页**：`https://ats.net/en/investors/ir-news/` ✅已实测（页面 1.2MB，含完整 IR 新闻列表）
- **类型**：扩产公告、财报、投资者演示
- **收录理由**：欧洲 IC 载板与 HDI 代表厂，其在马来西亚/厦门的扩产节奏是载板供给端的重要信号。
- **备注**：`/en/investors/ir-news/feed/` 返回 200 但 content-type 是 text/html，**不是真 feed，不要收**。

### 9. NCAB Group（瑞典，PCB 分销/小批量）
- **域名**：ncabgroup.com
- **RSS**：**未找到**（ncab.com 域名已无法解析，现为 ncabgroup.com）
- **可抓列表页**：`https://www.ncabgroup.com/news` ✅已实测（标题「Printed Circuit Board News - NCAB Group」）
- **类型**：行业市场评论、PCB 价格/交期观察、公司新闻
- **收录理由**：NCAB 长期发布 PCB 市场景气与交期评述，视角偏采购端，对判断供需松紧很实用。

### 10. NVIDIA（AI 算力，PCB 需求端最大边际变量）
- **域名**：nvidianews.nvidia.com
- **RSS**：`https://nvidianews.nvidia.com/releases.xml` ✅已实测（RSS 2.0，内容活跃）
- **类型**：产品发布、架构路线、供应链合作
- **收录理由**：GPU 平台迭代直接决定 AI 服务器高多层板/HDI 的层数、面积与材料等级需求，是 PCB 需求端最强领先指标。
- **备注**：属于「需求侧一手信源」，建议与 PCB 厂 IR 交叉比对。

### 11. 深南电路（SCC，002915，中国 PCB/封装基板龙头）🇨🇳
- **域名**：scc.com.cn
- **RSS**：无
- **可抓列表页**：官网首页 ⚠️需试抓确认（本机多次返回 504 Gateway Time-out / Tengine，站点不稳定）
- **类型**：公司新闻、投资者关系
- **收录理由**：国内少数同时具备高多层板与 FCBGA 封装基板能力的厂商，是国产载板进展的核心观测点。
- **备注**：**官网抓取稳定性差**，建议改走巨潮/交易所公告作为兜底。

### 12. 兴森科技（China Fastprint，002436，IC 载板）🇨🇳
- **域名**：chinafastprint.com
- **RSS**：无（/news 返回 200 但疑似 SPA 外壳）
- **可抓列表页**：`https://www.chinafastprint.com/` ✅已实测
- **类型**：公司新闻、载板/半导体测试板进展
- **收录理由**：国内 IC 载板与半导体测试板的主要供应商，ABF 载板国产化进程的观测点。

### 13. 芯碁微装（CFMEE，688630，LDI 直写光刻设备）🇨🇳
- **域名**：cfmee.cn
- **RSS**：无
- **可抓列表页**：`https://www.cfmee.cn/` ✅已实测（首页含带日期的新闻条目，如「2026-06-26 芯碁微装正式登陆香港交易所主板」）
- **类型**：设备发布、订单、客户突破
- **收录理由**：PCB 直接成像（LDI）设备国产主力，其订单变化反映 PCB 厂资本开支与产能扩张意愿。

### 14. 生益科技（Shengyi，600183，覆铜板 CCL 龙头）🇨🇳
- **域名**：syst.com.cn
- **RSS**：无
- **可抓列表页**：`https://www.syst.com.cn/` ✅已实测
- **类型**：CCL 新品、产能、行业景气观点
- **收录理由**：上游材料端龙头，CCL 涨价函与新品发布是 PCB 成本传导的最前端信号。

## 1.3 上游材料 / 设备（部分已并入 1.2 的国内厂商，此处补国际）

### 15. Rogers Corporation（罗杰斯，高频/高速板材）
- **域名**：rogerscorp.com
- **RSS**：**未找到**（/feed/、/insights 均 404）
- **可抓列表页**：
  - 新闻：`https://www.rogerscorp.com/news` ✅已实测（条目带年月路径，如 /news/2026/rogers-corporation-reports-second-quarter-2026-results）
  - 博客：`https://www.rogerscorp.com/blog` ✅已实测
- **类型**：财报、新品材料（如 PORON）、管理层变动、投资者日
- **收录理由**：高频高速板材三巨头之一，AI 服务器与汽车雷达材料升级的核心供应商。
- **备注**：无 sitemap.xml，需按 /news/<年>/<slug> 结构解析列表页。

### 16. Isola Group（伊索拉，覆铜板/半固化片）
- **域名**：isola-group.com
- **RSS**：**未找到**（/feed/ 返回 502）
- **可抓列表页**：`https://www.isola-group.com/news` ✅已实测（标题「News Archives | Isola Group」）
- **类型**：材料新品、技术白皮书、应用文章
- **收录理由**：高频高速 CCL 主要供应商，其材料等级命名（如 I-Tera MT40）直接对应 PCB 厂可做的层数与损耗水平。

### 17. KLA（科磊，AOI/检测，原 Orbotech 母公司）
- **域名**：kla.com
- **RSS**：**未找到**（/feed 403）
- **可抓列表页**：`https://www.kla.com/newsroom` ✅已实测
- **类型**：财报、检测/量测新品、行业观点
- **收录理由**：Orbotech 的 PCB AOI/直写曝光业务归入 KLA 后，是 PCB 制造设备与先进封装检测的一手信源。

### 18. Amkor Technology（安靠，封装测试）
- **域名**：amkor.com
- **RSS**：**未找到**（/feed/ 404）
- **可抓列表页**：`https://amkor.com/news/` ✅已实测
- **类型**：封装产能、客户合作、财报
- **收录理由**：OSAT 龙头，先进封装产能扩张直接拉动 ABF 载板与高多层基板需求。

### 19. ASE / 日月光（封装测试龙头）
- **域名**：aseglobal.com
- **RSS**：无
- **可抓列表页**：`https://www.aseglobal.com/` ✅已实测（首页可抓；/en/news 为 404，新闻栏目路径需站内确认）
- **类型**：月营收、扩产、技术布局
- **收录理由**：全球最大 OSAT，其先进封装报价与产能是载板需求端的核心变量（TrendForce 已报道其调涨先进封装报价 20%+）。

---

# 第二类：专业媒体（T2）

## 2.1 英文电子/半导体制造媒体

### 20. EE Times
- **域名**：eetimes.com
- **RSS**：`https://www.eetimes.com/feed/` ✅已实测（application/rss+xml，23KB，含 Europe's Advanced Packaging Gap 等最新文章）
- **类型**：半导体/电子行业新闻、深度分析
- **收录理由**：全球覆盖面最广的电子行业媒体，先进封装与 PCB 供应链报道密度高。
- **备注**：`/feed`（无斜杠）同样有效。

### 21. EDN
- **域名**：edn.com
- **RSS**：`https://www.edn.com/rss` ✅已实测（192KB，条目丰富）
- **类型**：电子设计技术、产品、行业趋势
- **收录理由**：偏设计端，能反映 PCB 设计侧对材料/层数/阻抗的新要求。
- **备注**：`/rss/`（带斜杠）本机超时，用不带斜杠的。

### 22. Semiconductor Engineering（SemiEngineering）
- **域名**：semiengineering.com
- **RSS**：`https://semiengineering.com/feed/` ✅已实测（205KB，含 Chip Industry Technical Paper Roundup）
- **类型**：半导体工艺/封装/测试深度技术文章
- **收录理由**：**先进封装与载板技术最优质的英文技术源**，Chiplet、2.5D/3D、ABF 基板、玻璃基板等主题报道深入。

### 23. eeNews Europe
- **域名**：eenewseurope.com
- **RSS**：`https://www.eenewseurope.com/rss` ✅已实测（含 pSemi RF、ams OSRAM 光互连等条目）
- **类型**：欧洲电子产业新闻
- **收录理由**：欧洲视角的供应链与光互连/汽车电子报道，补充 EE Times 的北美偏向。
- **备注**：`/en/rss` 同样有效。

### 24. 3D InCites（IMAPS 内容平台）
- **域名**：3dincites.com
- **RSS**：`https://www.3dincites.com/feed` ✅已实测（**需 Safari UA**，Chrome UA 会 403）
- **类型**：先进封装、3D 集成、封装基板技术文章
- **收录理由**：专注先进封装与基板，ABF/载板/中介层技术细节丰富。
- **备注**：**有 Cloudflare 反爬**，Chrome UA 直接被 403；必须用 Safari/WebKit UA 才能拿到 XML。收录时需在抓取器里固定 UA。

### 25. Circuits Assembly（PCEA 旗下，SMT/组装）
- **域名**：circuitsassembly.com
- **RSS**：**未找到**（/feed、/rss、/feed/ 全部 404）
- **替代方案**：PCEA 的 `https://pcea.net/feed/` ✅已实测 已覆盖其大部分内容（PCEA 新闻稿明确说明 Circuits Assembly 是 PCEA 旗下刊物）
- **类型**：SMT 工艺、电子制造服务、行业奖项
- **收录理由**：组装环节（PCB 下游）的主要行业刊物，年度 Service Excellence Awards 是 EMS/供应商格局参考。

### 26. PCB007 / I-Connect007（IPC Publishing Group 旗下）
- **域名**：iconnect007.com
- **RSS**：**无公开 RSS**。RSS 中心页 `https://iconnect007.com/my/rss-center` ✅可访问，但**需要登录才能看到具体 feed 地址**；我实测 /rss.xml、/feed、/index.php/rss 等常见路径全部 404。
- **可抓列表页**：`https://iconnect007.com/landing/pcb` ✅已实测（PCB007 主题落地页，可作 HTML 抓取入口）
- **类型**：PCB 设计/制造/材料/组装全链条新闻、播客、杂志
- **收录理由**：**PCB 垂直领域最专业的英文媒体矩阵**（PCB007/SMT007/Design007/EIN007/FLEX007/MilAero007），内容密度极高。
- **备注**：中文站 `iconnect007china.com` 可访问但为英文站镜像。**建议以 HTML 列表抓取为主**，RSS 走登录不现实。

## 2.2 中文电子/半导体媒体

### 27. 爱集微 / 集微网（ijiwei，原 laoyaoba.com）🇨🇳
- **域名**：laoyaoba.com（现品牌 ijiwei，站内域名仍为 laoyaoba.com）
- **RSS**：**无 RSS**（/rss.xml、/feed、/feed.xml 均返回首页 HTML，属 SPA 兜底，不是 feed）
- **可抓列表页**：`https://www.laoyaoba.com/` ✅已实测（服务端渲染完整，含标题+标签+相对时间）
- **类型**：半导体全产业链新闻、业绩分析、概念股、产业风向、专题
- **收录理由**：**中文半导体/PCB 资讯更新最快、最全的媒体之一**，实测抓到「2026H1 半导体封测板块：14 家营收 775.57 亿」「20 亿美元硅中介层协议背后：先进封装产业格局加速重构」「芯爱科技…高端 IC 基板」等高度相关内容，且带结构化标签（业绩分析/本土 IC/概念股），非常适合做归组。
- **备注**：域名 `jwinsights.com` 存在 TLS 证书问题（ERR_TLS_CERT_ALTNAME_INVALID），不要用。

### 28. 国际电子商情（ESM China，ASPENCORE 旗下）🇨🇳
- **域名**：esmchina.com
- **RSS**：`https://www.esmchina.com/rss.xml` ⚠️需试抓确认（本机连接超时/DNS 异常，无法从本机验证）
- **可抓列表页**：`https://www.esmchina.com/` ⚠️需试抓确认
- **类型**：电子元器件/供应链/市场分析、分销、国产替代
- **收录理由**：中文电子行业主流媒体，覆盖元器件供需与分销渠道视角。
- **备注**：同属 ASPENCORE 体系的 **电子工程专辑（eet-china.com）** 同样本机不可达，需在部署环境验证。这两个域名在本机均表现为连接超时，疑似网络环境限制，**不代表站点不可抓**。

### 29. 与非网 eefocus 🇨🇳
- **域名**：eefocus.com
- **RSS**：**未找到**（/rss.xml、/rss、/feed 均 404）
- **可抓列表页**：
  - 首页：`https://www.eefocus.com/` ✅已实测
  - 文章列表：`https://www.eefocus.com/article/` ✅已实测（从首页链接确认存在）
- **类型**：电子/半导体技术文章、产业新闻、工程师社区
- **收录理由**：偏技术与产业结合，覆盖模拟/功率/材料等 PCB 上游话题。

### 30. 电源网 🇨🇳
- **域名**：dianyuan.com
- **RSS**：`https://www.dianyuan.com/rss.xml` ✅已实测（返回 200）
- **类型**：电源技术、元器件应用、行业新闻
- **收录理由**：PCB 在电源/新能源场景的应用报道多，对「原材料波动 + 下游需求」交叉验证有帮助。
- **备注**：偏应用向，作为补充信源而非核心。

## 2.3 Newsletter / 厂商技术博客

### 31. DuPont 电子材料（DuPont Electronics）
- **域名**：dupont.com
- **RSS**：**未找到**（/feed/、/electronics/rss.xml 均 404/不可达）
- **可抓入口**：`https://www.rogerscorp.com/blog`（同类材料商可抓博客范例）；DuPont 站点本体需站内确认 insights 路径 ⚠️需试抓确认
- **类型**：材料技术、应用指南、行业观点
- **收录理由**：上游关键材料（光刻胶、CCL 树脂、封装材料）的一手技术口径。
- **备注**：**Rogers Insights** 类 newsletter 无独立 RSS，建议抓 `/news` 与 `/blog` 列表页。

---

# 第三类：市场数据 / 研报（T2，仅公开可抓）

### 32. TrendForce 集邦咨询（英文站）✅已实测
- **域名**：trendforce.com
- **RSS**：`https://www.trendforce.com/news/feed/` ✅已实测（WordPress RSS 2.0，最新条目即「ASE Reportedly Raises Advanced Packaging Quotes by More Than 20% in Latest AI-Driven Price Hike」，与 PCB/载板强相关）
- **可抓列表页**：`https://www.trendforce.com/news/` ✅已实测（含 /news/category/semiconductors、/news/category/display 等分类，分页 /news/page/2/ 规律明确）
- **类型**：半导体/显示/新能源市场快讯、价格趋势、产能数据
- **收录理由**：**AI 服务器、先进封装、载板、CCL 涨价等 PCB 相关市场信号最密集的公开数据源**，且完全免费公开。
- **备注**：另有官方 RSS 订阅说明页 `https://www.trendforce.com/presscenter/rss.html`（列出半导体/显示/LED/能源/消费电子/通讯等分类 feed 入口），但分类 feed 的 `/news/category/<cat>/feed/` 路径实测返回 HTML 404，**分类 feed 需试抓确认**；用主 feed 最稳。

### 33. TrendForce 集邦咨询（中文站）✅已实测
- **域名**：trendforce.cn
- **RSS**：`https://www.trendforce.cn/feed/Semiconductors.html` ✅已实测（返回合法 RSS 2.0，中文条目）
- **类型**：中文市场快讯
- **收录理由**：中文口径的市场数据，方便直接写入中文站点。
- **备注**：**该 feed 的 `<link>` 指向 `test.new.trendforce.com` 且 `pubDate` 全是 1970-01-01**，说明是测试/占位数据。收录时**只取标题与分类做线索，正文需回原文站确认**，或直接用英文站 feed 为主。

### 34. Prismark Partners（PCB 行业权威市场研究机构）
- **域名**：prismark.com
- **RSS**：**无 RSS**（/rss.xml 返回 400）
- **可抓入口**：`https://www.prismark.com/printed-circuit-report-pcb` ⚠️需试抓确认（首页 200，具体报告页结构需站内确认）
- **类型**：PCB/封装基板市场规模、增速、区域结构、厂商排名（付费报告为主）
- **收录理由**：**PCB 行业市场规模与预测的黄金标准**，其公开摘要（如季度报告解读）常被 EET-China 等中文媒体转述。
- **备注**：**主要产出为 PDF 付费研报**，公开可抓的只有报告目录与摘要页。建议：抓官网目录页 + 抓中文媒体对 Prismark 报告的转述文章（如 eet-china.com 的「Prismark 2026 Q1 最新 PCB 和 Substrate 市场报告解读」）作为替代信号。

### 35. CINNO Research（赛诺）
- **域名**：cinno.com.cn
- **RSS**：**无 RSS**（/rss.xml 404）
- **可抓入口**：`https://www.cinno.com.cn/compass/journal` ⚠️需试抓确认（站点以研究报告销售为主，公开文章栏目路径需站内确认）
- **类型**：显示/半导体/新能源市场研究、期刊
- **收录理由**：国内显示与半导体细分市场数据补充源。
- **备注**：**以 PDF/付费研报为主**，公开内容有限。

### 36. IDC
- **域名**：idc.com
- **RSS**：**未找到**（/rss.xml 404）
- **可抓入口**：`https://www.idc.com/` ✅已实测（新闻稿栏目路径需站内确认）
- **类型**：IT/半导体/终端设备市场数据与新闻稿
- **收录理由**：PC/服务器/AI 基础设施出货量数据，是 PCB 需求端的宏观锚。
- **备注**：新闻稿页面路径不固定，建议抓首页后解析。

### 37. Gartner
- **域名**：gartner.com
- **RSS**：`https://www.gartner.com/en/newsroom/rss.xml` ⚠️需试抓确认（Cloudflare 403）
- **可抓入口**：`https://www.gartner.com/en/newsroom` ⚠️需试抓确认（Cloudflare 403）
- **类型**：技术趋势、市场规模、新闻稿
- **收录理由**：IT 支出与技术成熟度曲线的宏观参考。
- **备注**：**强 Cloudflare 反爬**，抓取成本高，建议低优先级。

### 38. N.T. Information（NTI-100 排名发布方）
- **域名**：ntinformation.com
- **RSS**：无
- **可抓入口**：本机 DNS 解析失败（`getent hosts ntinformation.com` 无结果），`https://www.ntinformation.com/` ⚠️需试抓确认
- **类型**：NTI-100 全球最大 PCB 厂商排名、PCB 市场展望（Hayao Nakahara 博士）
- **收录理由**：**PCB 厂商营收排名的权威一手来源**，其观点大量出现在 PCEA（pcea.net/feed/）与 PCB West 上。
- **备注**：**实操建议：不直接抓 NTI，改为抓 PCEA 的 feed**——Nakahara 的市场展望几乎都会通过 PCEA 新闻稿公开出现（已在 PCEA feed 中实测到「PCB Market Authority Nakahara to Deliver Industry Outlook at PCB West」），这是免费获取其观点的稳定通道。

---

# 汇总表：按「抓取方式 × 稳定性」分层

## A 级：RSS 立即可用（已实测返回合法 XML）
| 信源 | Feed URL | 语言 |
|---|---|---|
| EE Times | https://www.eetimes.com/feed/ | EN |
| EDN | https://www.edn.com/rss | EN |
| Semiconductor Engineering | https://semiengineering.com/feed/ | EN |
| eeNews Europe | https://www.eenewseurope.com/rss | EN |
| 3D InCites | https://www.3dincites.com/feed | EN（**须 Safari UA**） |
| PCEA | https://pcea.net/feed/ | EN |
| TTM Technologies | https://investors.ttm.com/news-events/press-releases/rss | EN |
| NVIDIA Newsroom | https://nvidianews.nvidia.com/releases.xml | EN |
| TrendForce（英） | https://www.trendforce.com/news/feed/ | EN |
| TrendForce（中） | https://www.trendforce.cn/feed/Semiconductors.html | 中文（数据为占位，慎用） |
| IPC / Global Electronics Association | https://www.electronics.org/rss.xml | EN |
| 电源网 | https://www.dianyuan.com/rss.xml | 中文 |

## B 级：无 RSS，但 HTML 列表页稳定可抓（已实测 200）
| 信源 | 列表页 | 语言 |
|---|---|---|
| CPCA | https://www.cpca.org.cn/news-334.html | 中文 |
| CPCA 行业动态 | https://www.cpca.org.cn/industry.html | 中文 |
| CPCA 英文 | https://www.cpca.org.cn/en/news.html | EN |
| TPCA | https://www.tpca.org.tw/content.php?menu_no=141&mod_no=24 | 繁体中文 |
| AT&S IR | https://ats.net/en/investors/ir-news/ | EN |
| NCAB Group | https://www.ncabgroup.com/news | EN |
| Rogers News | https://www.rogerscorp.com/news | EN |
| Rogers Blog | https://www.rogerscorp.com/blog | EN |
| Isola News | https://www.isola-group.com/news | EN |
| KLA Newsroom | https://www.kla.com/newsroom | EN |
| Amkor News | https://amkor.com/news/ | EN |
| 集微网 ijiwei | https://www.laoyaoba.com/ | 中文 |
| PCB007 / I-Connect007 | https://iconnect007.com/landing/pcb | EN |
| 与非网 | https://www.eefocus.com/article/ | 中文 |
| 兴森科技 | https://www.chinafastprint.com/ | 中文 |
| 芯碁微装 | https://www.cfmee.cn/ | 中文 |
| 生益科技 | https://www.syst.com.cn/ | 中文 |
| TrendForce 新闻列表 | https://www.trendforce.com/news/ | EN/中 |

## C 级：需试抓确认（Cloudflare / DNS / 站点不稳定）
| 信源 | 地址 | 原因 |
|---|---|---|
| SMTA | smta.org/rss.xml | Cloudflare 403 |
| Electronics Weekly | electronicsweekly.com/feed | Cloudflare 403 |
| All About Circuits | allaboutcircuits.com/rss | Cloudflare 403 |
| Electronic Design | electronicdesign.com/rss | Cloudflare 403 |
| Electronic Specifier | electronicspecifier.com/rss | Cloudflare 403 |
| Gartner Newsroom | gartner.com/en/newsroom | Cloudflare 403 |
| 国际电子商情 | esmchina.com | 本机连接超时 |
| 电子工程专辑 | eet-china.com | 本机连接超时 |
| iNEMI | inemi.org | 新闻栏目路径待确认 |
| Prismark | prismark.com | 无 RSS，摘要页路径待确认 |
| CINNO | cinno.com.cn | 无 RSS，公开文章少 |
| N.T. Information | ntinformation.com | DNS 解析失败 |
| 深南电路 | scc.com.cn | 官网 504 不稳定 |
| IDC | idc.com | RSS 不存在，栏目路径待确认 |

## D 级：明确不可用 / 不要收
| 地址 | 原因 |
|---|---|
| ipc.org.cn/rss.xml | 内容全是导航 item，无信息价值 |
| ats.net/en/investors/ir-news/feed/ | 返回 HTML 非 XML（假 feed） |
| trendforce.com/news/category/<cat>/feed/ | 返回 HTML 404 |
| jwinsights.com | TLS 证书 ALTNAME 无效 |
| unimicron.com | NXDOMAIN（金像电，域名无法解析） |
| pcbinfo.com.cn | NXDOMAIN |
| iconnect007.com/my/rss-center | 需登录才能拿到 feed 地址 |

---

# 特别标注汇总

## 中文站点（10 个）
CPCA（news-334.html / industry.html / en/news.html）、TPCA、集微网 ijiwei（laoyaoba.com）、国际电子商情（esmchina.com）、电子工程专辑（eet-china.com）、与非网（eefocus.com）、电源网（dianyuan.com）、兴森科技（chinafastprint.com）、芯碁微装（cfmee.cn）、生益科技（syst.com.cn）、TrendForce 中文站（trendforce.cn）、深南电路（scc.com.cn）

## 有反爬（Cloudflare 等）
SMTA、Electronics Weekly、All About Circuits、Electronic Design、Electronic Specifier、Gartner、3D InCites（**仅 Chrome UA 被拦，Safari UA 可过**）、TechInsights（/blog/feed 404）

## 主要发 PDF 研报
Prismark（PCB 市场报告）、N.T. Information（NTI-100）、CINNO Research、TPCA（部分统计以 PDF 附件发布）、IDC/Gartner（新闻稿为 HTML，研究报告为 PDF）

## 站点不稳定 / DNS 异常
深南电路（scc.com.cn 反复 504）、集微网旧域名 jwinsights.com（证书问题）、金像电 unimicron.com（域名消失）、ntinformation.com（DNS 失败）

---

# PCB 行业热点信号清单（用于行业提示词）

按信号强度与可观测性排列：

## 1. 产能与资本开支（最强信号）
- **新厂投产 / 新产能释放**：「XX 基地一期投产」「二期开工」「产能爬坡」——直接改变供给格局
- **扩产公告 / 定增募资**：尤其投向「高多层板」「HDI」「IC 载板」的扩产项目，是判断技术升级方向的硬指标
- **设备订单**：芯碁微装（LDI）、大族数控（钻孔/曝光）、Via Mechanics（激光钻孔）等设备厂订单与中标，**领先 PCB 厂营收 2-4 个季度**

## 2. 价格与成本（高频信号）
- **涨价函**：CCL（生益、建滔）、铜箔、玻纤布、树脂涨价——成本推动型，最终传导至 PCB 报价
- **原材料价格**：铜价、金价、树脂、电子级玻纤布；**铜价是 PCB 成本的最大单一变量**
- **交期变化**：NCAB、PCB 厂交期从 N 周拉长到 M 周，是供需紧张最直接的证据
- **代工/封测报价**：ASE、Amkor 调涨先进封装报价 → 拉动载板需求与议价

## 3. 技术突破与产品分级（技术代际信号）
- **HDI / 任意层互连（Anylayer）**：阶数提升（一阶→二阶→三阶→anylayer）
- **IC 载板 / ABF 载板**：FCBGA、ABF 膜供应、载板层数与面积、国产化突破（深南、兴森、珠海越亚）
- **高多层板**：层数跃升（20 层→30 层→40+ 层），AI 服务器主板/OAM/UBB 的核心指标
- **高速材料等级**：Megtron 6/7、I-Tera MT40、Very Low Loss / Ultra Low Loss 材料的采用
- **先进封装配套**：Chiplet、2.5D/3D、CoWoS、硅中介层（interposer）、玻璃基板、埋容埋阻
- **新工艺**：mSAP（改良半加成法）、半孔/背钻、阶梯槽、光电合封（CPO）用板

## 4. 需求侧驱动（决定景气方向）
- **AI 服务器 / AI 数据中心**：GB200/GB300/Vera Rubin 平台迭代 → 高多层板面积与层数需求爆发（**当前最强主线**）
- **800G/1.6T 光模块、CPO**：高速板需求
- **汽车电子**：ADAS、域控制器、雷达板（77GHz）
- **消费电子复苏/疲软**：手机、PC 板需求（当前为拖累项）
- **卫星互联网 / 低轨星座**：相控阵板需求
- **机器人 / 具身智能**：新兴增量

## 5. 客户与订单（验证性信号）
- **大客户订单 / 认证通过**：进入英伟达、AMD、思科、特斯拉、华为供应链
- **英伟达 GTC / OCP 峰会**：新平台发布 → PCB 规格升级预告
- **头部 PCB 厂月营收**：欣兴、健鼎、臻鼎/鹏鼎、金像电、沪电、深南——**月度频率，是最灵敏的景气指标**

## 6. 并购与格局（结构性信号）
- **并购 / 合资**：产能整合、技术补强、区域布局
- **上市/IPO**：芯碁微装港股上市等
- **产能转移 / 地缘**：东南亚（泰国、越南、马来西亚）建厂、美国本土化（TTM）、出口管制

## 7. 财务与业绩（结果验证）
- **季报 / 年报**：营收、毛利率、产能利用率
- **业绩预告**：A 股/台股预告是最高频的公开财务信号
- **行业统计**：CPCA、TPCA、Prismark 的行业增速与厂商排名（NTI-100）

## 提示词建议的「重要性加权」方向
- **高价值**：新厂投产/扩产、AI 服务器带动的高多层板与载板订单、涨价函、月营收超预期、大客户认证突破、并购
- **中价值**：技术突破（HDI/ABF/mSAP/玻璃基板）、设备订单、原材料波动、展会/标准发布
- **噪声（需压制）**：纯人事任命、展会通稿、无关领域半导体新闻（如消费电子价格战）、无数据支撑的「行业展望」泛泛之谈、转载无新增信息的二手稿

## 建议的交叉验证组合（提高可信度）
- 产能信号：设备厂订单（芯碁微装/大族数控）+ PCB 厂公告（深南/兴森）+ 协会统计（CPCA/TPCA）
- 需求信号：NVIDIA/AMD 平台发布 + TrendForce 数据 + PCB 厂月营收
- 价格信号：材料厂涨价函（生益/建滔）+ NCAB 交期评论 + PCB 厂毛利率变化
- 技术信号：SemiEngineering / 3D InCites 技术文章 + IPC 标准发布 + PCB 厂新品
