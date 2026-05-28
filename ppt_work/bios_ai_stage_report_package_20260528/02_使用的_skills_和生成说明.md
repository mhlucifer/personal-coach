# 使用的 Skills 和生成说明

## 实际使用的 Skill

### Presentations

本次 PPTX 生成实际使用的是本地 Presentations skill：

- Skill 名称：`presentations:Presentations`
- Skill 文件：`/Users/tzy/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/SKILL.md`
- 生成方式：artifact-tool presentation modules
- 输出类型：可编辑 `.pptx`

选择原因：
- 能生成可编辑 PowerPoint。
- 能渲染每页 PNG 预览和 contact sheet。
- 能跑布局 QA，检查文字重叠、溢出、过密等问题。
- 更适合领导汇报里的截图落位和页面级设计控制。

## 参考但未作为依赖的外部方向

前面讨论时参考过几类 GitHub / Markdown slides 方向，但本次最终没有安装或依赖它们：

- Codex / ChatGPT 风格 PPTX 生成 skill：可参考“生成 + QA”思路。
- 偏学术公式和复杂 diagram 的 PowerPoint skill：不适合作为本次主工具。
- Markdown 转 slides 工具：适合快速转页，但对截图证据落位、领导汇报版式控制较弱。

本资料包里的最终可编辑稿仍以本地 Presentations skill 输出为准。

## 本次视觉风格

风格定位：瑞士工程风。

页面规则：
- 一页一个结论。
- 大面积留白。
- 强网格布局。
- 黑灰 + 工程蓝为主色。
- 少量绿色/黄色用于状态和强调。
- 技术名词保留原名，例如 Type8、Type9、Type11、Type12、AI Review。
- 领导不需要理解的底层实现术语不直接上页面，例如不直接写 Layout Table、Matcher、Provider。

## 本次内容组织

全稿 12 页：

- 1 封面
- 2 阶段总览
- 3 目录
- 4-5 工作成果
- 6-11 重点工作
- 12 下一步计划

重点处理：
- Type9 是架构复用案例，重点讲“后续新增版型改规则，少改核心流程”。
- SMBIOS 验证是自动化流程案例，重点讲“可追踪、可复测”。
- Type8 / Type11 / Type12 是 AI 规范化移植案例，重点讲“规则清晰模块适合 AI 辅助”。
- AI Review 是质量闭环案例，重点讲“上下文、识别过程、处置记录可见”。

## 生成与 QA 记录

已生成：
- PPTX：`05_BIOS_AI_阶段汇报_瑞士工程风.pptx`
- 缩略总览：`05_BIOS_AI_阶段汇报_瑞士工程风_contact_sheet.png`

已检查：
- 12 页均成功渲染。
- 截图证据已嵌入对应正文页，不再堆到最后。
- AI Review 两页已预留截图位。
- 最后一轮布局检查无 error，仅有少量紧凑文字 warning。

## 后续编辑建议

优先修改 PPTX 中以下位置：

- Slide 10：替换“截图位 1”为 AI Review 页面 / 评审结果截图。
- Slide 11：替换“截图位 2”为风险识别结果 / 正式问题项截图。
- Slide 4：如状态口径有最新变化，优先改表格右侧状态。
- Slide 9：如果 2.0 天到 0.5 天需要更严谨口径，可加“试点样本”或“预估”说明。
