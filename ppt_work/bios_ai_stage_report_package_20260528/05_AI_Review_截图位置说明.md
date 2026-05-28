# AI Review 截图位置说明

## 新增截图

### 1. 待确认项处置截图

- `evidence/ai_review_wait_confirm_risk_record.jpg`

来源：

- 微信截图，原图尺寸约 `645 x 732`。

截图内容摘要：

- AI Review 中的 `Critic 过滤项 L79`。
- 问题点是 `CloseEvent(Event)` 后继续使用 `Event` 变量可能不安全。
- 后续判断认为该模式是团队内部一致用法，且回调中 `CloseEvent` 后不再引用 `Event`，因此不构成正式 finding。
- 最终被降级为“待确认项 / reviewNote 确认性记录”。

## 推荐放置位置

### 首选：Slide 11 右侧截图位

对应页面：

- `Slide 11：AI Review 风险闭环`

放置位置：

- 右侧“截图位 2”
- 当前占位说明为：`正式问题 / 待确认项 / 后台处置记录截图`

推荐说明文字：

- `AI Review 待确认项与后台处置记录`

推荐理由：

- 这张图最适合证明“模型看到风险后，不是直接丢掉，而是进入可见的处置记录”。
- 图里展示了从风险识别、证据判断到降级为待确认项的完整过程。
- 它支撑 Slide 11 的核心结论：风险从中间过程进入可见、可追踪、可复盘的处置路径。

### 不建议放在 Slide 10

`Slide 10` 的主题是“上下文完整性检查”，重点是模型审查前拿到的材料是否足够。

这张图更偏“风险被识别后如何处置”，如果放在 Slide 10，容易让页面主题从“上下文增强”偏到“风险处置”。

## PPT 放图建议

由于截图是竖图，建议：

- 保留原比例，不要横向拉伸。
- 放在右侧截图位时，按高度优先缩放。
- 可裁掉少量顶部/底部空边，但不要裁掉：
  - `Critic 过滤项 L79`
  - `Critic 降级为待确认项`
  - “过审判断”段落
  - “反馈”三条 bullet

如果需要更像正式汇报页，可以在截图外侧只保留很浅的灰色边框，不加厚白框。

## 可配合页面文字

放入 Slide 11 后，可把右侧截图说明写成：

> 待确认项示例：模型识别到潜在风险后，经证据判断未形成正式 finding，但保留为可回溯处置记录。

这句话比直接写 `riskLedger / reviewNote / diagnostics` 更适合领导汇报。

### 2. 上下文完整性检查截图

文件：

- `evidence/ai_review_docx_images/image3.png`

来源：

- `source_docs/ai review.docx` 内嵌截图。

截图内容摘要：

- Review Agents 页面显示 planner 已执行完成。
- 展示模型在审查前先理解了哪些变更、模块、任务和上下文。
- 支撑 Slide 10 的核心结论：AI Review 不是只看局部 diff，而是先补齐上下文，再进入审查。

推荐放置位置：

- `Slide 10：AI Review 新增上下文完整性检查`
- 右侧证据区，说明文字：`AI Review 上下文材料与 planner 记录`

### 3. 最终 Review 页面截图（备选）

文件：

- `evidence/ai_review_docx_images/image2.png`

来源：

- `source_docs/ai review.docx` 内嵌截图。

用途：

- 可作为 Slide 10 或 Slide 11 的备选证据，展示正式问题、待确认项、校验状态和置信度。
- 如果后续想强调“用户最终看到什么”，可以替换到 Slide 11 右侧，或作为 AI Review 附录截图。
