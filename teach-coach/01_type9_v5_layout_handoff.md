# 工作 A 交接文档

## 1. 一句话总结

本窗口主要围绕 **V5 SMBIOS Type9 多版型重构方案** 做了背景梳理、技术方案设计、V3 AI 机型逻辑复盘、PPT/代码证据整理、打分匹配算法解释，以及两页领导汇报 PPT 大纲；核心建议是：**V5 Type9 以 SlotNumber 为运行时主 key，以客户 PPT 的 DisplayName 为最终显示名，通过 Layout Table + 打分匹配实现多版型复用，并为未来 AI 机型预留 Provider 扩展点**。

## 2. 背景与问题

### 2.1 业务背景

用户当前在处理腾讯/客户相关 BIOS V5 平台的 SMBIOS Type9 插槽信息上报问题。客户要求 Type9 能正确显示主板上 PCIe 槽位的丝印名称，例如：

- `Slot0`
- `Slot1`
- `PCIe0`
- `Node0-Slot0`
- `Node1-M.2_0`

这些显示名最终会进入 SMBIOS Type9 的 `SlotDesignation` 字段，是客户可见信息。

### 2.2 技术背景

Type9 的基本逻辑是：

1. BIOS 扫描 PCIe Root Port / Downstream Port。
2. 从 PCIe Slot Capability 中读取 `SlotNumber`。
3. 根据平台版型、Single/Multi 模式、Node 信息等，把 `SlotNumber` 映射成客户要求的显示名。
4. 生成 SMBIOS Type9 结构。

### 2.3 当前痛点

当前 V5 代码已经有一定重构，但仍存在几个核心问题：

- PPT 里有 20 多种版型，客户要求的显示名不完全一致。
- IIO 层实际 SlotNumber 分配模板只有 3 到 4 套，但上层显示规则很多。
- 有些版型需要 Node 区分，例如 `Node0-Slot0` / `Node1-Slot0`。
- 有些版型没有 Node，显示名就是 `Slot1` 或 `PCIe0`，不能代码里强行拼 `Node0-`。
- Single/Multi 模式会影响布局选择。
- 未来可能要适配 AI 机型，AI 机型的槽位来源可能不是普通 Root Port，而是 Switch / DSP / GPU 侧。
- 如果继续写大量 `if/else`，后续新增版型和 AI 机型会越来越难维护。

### 2.4 用户当前的理解诉求

用户不是只要代码实现，而是需要真正理解：

- 为什么要这么设计。
- SlotNumber、SilkName、DisplayName 之间是什么关系。
- 为什么不能简单照搬 V3 AI 架构。
- 为什么不用 `silkname` 当主逻辑。
- 为什么需要打分匹配。
- 如果 PCD 获取失败，最终显示应该怎么降级。
- 这种架构是否调试方便。
- 后续如何把这些内容做成 PPT 给领导汇报。

## 3. 当前已经完成的工作

### 3.1 已整理内网投喂资料包

已经生成一套可交给内网模型继续处理的资料包：

- 目录：`/Users/tzy/code/personal-coach/type9-v5-intranet-package/`
- 压缩包：`/Users/tzy/code/personal-coach/type9-v5-intranet-package-20260522.zip`

资料包中包含：

- `README.md`
- `01_v5_type9_design.md`
- `02_v3_ai_logic_reconstructed.md`
- `03_v5_current_code_evidence.md`
- `04_ppt_silkname_slotnumber_mapping.csv`
- `04_ppt_mapping_readme.md`
- `05_iio_slotnumber_profiles.md`
- `06_fallback_display_rules.md`
- `07_intranet_model_prompt.md`
- `08_type9_logic_deep_explanation.md`

注意：用户后来明确要求删除 `assets/`，所以资料包中不应保留图片 assets。

### 3.2 已提取/整理 PPT 映射 CSV

已将 PPT 中的丝印/版型映射整理为 CSV：

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/04_ppt_silkname_slotnumber_mapping.csv`

该 CSV 的目标字段包括：

- `BoardCode`
- `BoardName`
- `HostMode`
- `NodePolicy`
- `NodeId`
- `DisplayName`
- `SilkName`
- `LaneDesc`
- `IioProfile`
- `SlotNumber`
- `SourceSlide`
- `MatchStatus`
- `Note`

重要原则：

- `DisplayName` 必须逐字来自客户 PPT。
- `SlotNumber` 是运行时匹配主 key。
- `SilkName` 是映射证据和 debug 字段，不是运行时唯一 key。

### 3.3 已写 V5 Type9 深度讲解文档

已写一篇从“为什么”讲起的 Type9 深度文档：

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-layout-slotnumber-deep-dive.md`

该文档已经本地修改过，早先版本曾提交并推送到 GitHub：

- Commit：`409a8ce Add V5 Type9 layout deep dive note`
- URL：`https://github.com/mhlucifer/personal-coach/blob/main/LearningCoach/notes/bios/smbios/type9-v5-layout-slotnumber-deep-dive.md`

注意：本地版本后来又根据用户反馈做了教学风格重写，不一定已经再次推送。

### 3.4 已写两页汇报 PPT 大纲

用户要求先不要做正式 PPT，只要两页 PPT 大纲。已写入：

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-refactor-two-page-ppt-outline.md`

这份大纲按领导图中“金字塔原理”写法组织：

- 第 1 页：方案结论。
- 第 2 页：落地架构。

### 3.5 已沉淀用户偏好的讲解方式

用户明确指出，讲解技术方案时不应该一开始就讲架构/函数，而应该：

1. 先讲为什么需要这个设计。
2. 再讲如果不用会出什么问题。
3. 再用一句话讲核心思想。
4. 再给具体例子。
5. 最后才讲算法、数据结构、架构和代码。

本地已在：

- `/Users/tzy/code/personal-coach/LearningCoach/AGENTS.md`

中加入 `Teaching Explanation Rule`，但该改动是否提交需要后续确认。

## 4. 关键技术/业务结论

### 4.1 最核心结论

V5 Type9 推荐采用：

```text
Context + Layout Table + Match Engine + SMBIOS Builder + Future AI Provider
```

即：

```text
当前机器状态 -> 选择布局表 -> 扫描实际槽位 -> 匹配显示规则 -> 生成 Type9
```

### 4.2 SlotNumber / SilkName / DisplayName 的角色

确定结论：

- `SlotNumber`：运行时硬件匹配主 key，来自 PCIe Slot Capability / IIO 配置结果。
- `DisplayName`：最终客户可见显示名，进入 SMBIOS Type9 `SlotDesignation`，必须严格来自客户 PPT。
- `SilkName`：PPT 映射证据和 debug 信息，用来说明某条规则对应哪个 PE/Port/丝印，但不作为运行时唯一 key。

为什么不用 `SilkName` 做主 key：

- 运行时 BIOS 更自然、稳定能拿到的是 `SlotNumber`。
- `SilkName` 更像工程文档/板卡丝印信息，不一定是运行时硬件枚举天然产物。
- 当前 IIO 已经通过 PE/Port 配置了 `PhysicalSlotNumber`，Type9 从 Slot Capability 拿到的就是这个结果。

### 4.3 为什么需要 Layout Table

确定结论：

- 客户 PPT 的显示名是最高优先级来源。
- 不同版型对同一个硬件槽位可能有不同显示名。
- 不应该在代码里临时拼接 `Node0-`、`SlotX`、`PCIeX`。
- 应该把 `Board + HostMode + NodePolicy + SlotNumber -> DisplayName` 放在布局表中维护。

### 4.4 为什么需要打分匹配算法

这是用户后来真正听懂的关键点，建议后续 PPT 或讲解优先使用这个表达：

> 为了兼容“通用规则”和“特例规则”，如果不用打分制，就需要把每一个 Node、每一个 HostMode 的组合穷举出来，维护成本很高。  
> 有了打分机制，表里可以先写一条通用规则，例如 `HostMode=Any, NodePolicy=NoNode, SlotNumber=7 -> Slot20`；再补一条特例规则，例如 `HostMode=Multi, NodeId=Node0, SlotNumber=7 -> Node0-Slot20`。  
> 当两条都命中时，特例规则因为 HostMode 和 Node 都精确匹配，得分更高，所以自动胜出。这就是“特例优先，通用兜底”。

确定结论：

- 打分制解决的是“多条规则都能匹配时，该选更具体的那条”。
- 它不是为了炫技，而是为了减少穷举表项。
- 需要额外做同分冲突检测。

### 4.5 打分是否可能同分

确定结论：可能同分。

典型冲突：

```text
规则 A: HostMode=Any, NodePolicy=NoNode, SlotNumber=7 -> Slot20
规则 B: HostMode=Any, NodePolicy=NoNode, SlotNumber=7 -> PCIe7
```

这两条条件一样，分数一样，但显示名不同。算法不能替人判断，应该认为是布局表冲突。

建议：

- 如果最高分只有一条：使用它。
- 如果最高分多条且 `DisplayName` 一样：可以警告为重复配置。
- 如果最高分多条且 `DisplayName` 不同：打印 ERROR，不能静默选第一条。

### 4.6 PCD 获取失败时怎么处理

确定结论：不同字段失败后的降级策略不同。

建议策略：

| 数据 | 作用 | 获取失败后建议 |
|---|---|---|
| `BoardType` | 决定选哪张布局表 | 风险最高，不生成客户丝印名；走 legacy fallback 或跳过，并打 ERROR |
| `HostMode` | 区分 Single/Multi | 只允许匹配 `HostMode=Any` 的 layout/slot 规则 |
| `NodeId` | 区分 Node0/Node1 | 只允许匹配不需要 Node 的规则；不能默认 Node0 |
| `SlotNumber` | 硬件槽位主 key | 不从 PPT 表匹配；走 legacy fallback 或不生成该条 Type9 |
| `AiMode` | AI 扩展开关 | 当前 V5 按 None；未来真实 AI 机型需 WARN |

最重要的原则：

- 失败时可以少显示一点，但不能显示错。
- 不能因为 `NodeId` 获取失败就默认 Node0。
- 不能因为匹配不到就临时拼 `Slot7` 或 `Node0-Slot7`。

### 4.7 代码复杂度的判断

确定结论：

- 新架构表面上会多一点代码。
- 但它把复杂度集中到少数固定模块，而不是散落在大量 `if/else` 中。

建议最小可维护版本：

```text
1. 一个 Context 结构
2. 一组 Layout 表
3. 一个 SelectLayout()
4. 一个 FindBestSlotDesc()
5. 一个 BuildType9FromRootBridge()
6. AI Provider 先只预留接口，不展开真实实现
```

不要过度设计：

- 当前 V5 没有真实 AI 机型。
- 不建议现在就实现完整插件式注册表。
- AI Provider 只做结构预留即可。

### 4.8 调试是否好调试

确定结论：只要日志设计好，这种架构比散乱 `if/else` 更好调试。

推荐日志分段：

```text
[TYPE9][CTX] Board=0x11 HostMode=Multi NodeId=0 AiMode=None
[TYPE9][LAYOUT] Selected C2_8CXL HostMode=Any SlotCount=9
[TYPE9][PCI] BDF=80:01.0 SlotNumber=7 Link=x8 Gen5 Silk=CPU0_PE1_x8AH
[TYPE9][MATCH] SlotNumber=7 candidates=2
[TYPE9][MATCH] row0 Display=Slot20 Host=Any Node=NoNode score=11
[TYPE9][MATCH] row1 Display=Node0-Slot20 Host=Multi Node=Node0 score=200 SELECTED
[TYPE9][BUILD] Add Type9 SlotDesignation=Node0-Slot20 SlotID=7
```

定位思路：

- 显示名错：看 `MATCH` 选中了哪条。
- SlotNumber 错：看 `PCI` 扫描和 IIO 配置。
- Node 错：看 `CTX` 中的 NodeId。
- Single/Multi 错：看 HostMode。
- AI 后续错：看 Provider 提供了什么槽位。

### 4.9 AI 机型如何预留

确定结论：

- 当前 V5 没有真实 AI 机型需求。
- 现在只做架构预留，不实现真实 AI 逻辑。

建议未来扩展方式：

- 非 AI 机型：继续从 PCIe Root Port 获取槽位。
- AI 机型：新增 Switch / DSP / GPU Provider，收集 AI 插槽候选。
- 主流程仍走统一匹配和生成，不把 AI 分支写满主流程。

可能需要新增：

- `AiMode`
- `TYPE9_SLOT_PROVIDER`
- `TYPE9_SLOT_SOURCE`
- AI 专用 Layout 表
- 必要时扩展 Type11 OEM 信息

## 5. 重要证据、文件、代码路径

### 5.1 V5 Type9 相关代码路径

Type9 主代码：

- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType9Update/TencentType9Update.c`

已确认事实：

- Type9 从 PCIe Slot Capability 中读取 `SlotNumber`：

```c
RootBridge->SlotNumber = (UINT16)(SlotCap >> 19);
```

- 当前已有匹配逻辑大体是按 `SlotNum == SlotNumber && Used == FALSE`。
- 当前存在 static fallback 逻辑。

### 5.2 IIO SlotNumber 配置代码路径

IIO 配置：

- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentProjectPkg/Uba/UbaMain/TriRiverV5/Pei/IioBifurInit.c`

已确认事实：

- IIO 层维护 `Socket / PE / Port -> PhysicalSlotNumber`。
- 当前大概有几套 SlotNumber profile：
  - Default profile
  - `C2_28E3S`
  - `C2_8CXL`

示例：

- `C2-8CXL` 中，`CPU0_PE1_x8AH` 对应 SlotNumber 7，PPT 显示可能是 `Slot20`。
- `C2_28E3S` 中，`CPU0_PE1_x4AD` 对应 SlotNumber 7。

注意：具体值应以 CSV 和 IIO 代码为准。

### 5.3 HostMode 相关 PCD

PCD 定义：

- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentLegoPkg/TencentLegoPkg.dec`

相关 PCD：

- `PcdPe9Bifurcation`
- `PcdPe3Bifurcation`

已确认规则：

- `SocketCount <= 1` 看 `PcdPe9Bifurcation`
- `SocketCount > 1` 看 `PcdPe3Bifurcation`
- 值 `== 3` 按 Multi，其他按 Single/Default

用户曾指出：`PcdPe9Bifurcation` 就是判断 Single/Multi 的关键依据之一。

### 5.4 SMBus PCD 获取/写入参考

SMBus 获取数据并写 PCD 的代码：

- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentProjectPkg/Uba/UbaMain/TriRiverV5/Pei/TencentGetDataBySmbus/TencentGetDataBySmbus.c`

已确认/用户补充：

- 当前没有看到明确的 NodeId PCD。
- 但用户说获取方式可以参考 SMBus 里其它 PCD 的写法。
- 未来可新增/消费类似 `PcdTencentNodeId` 的字段。

### 5.5 PPT 原始材料

PPT 路径：

- `/Users/tzy/code/personal-coach/local-materials/private/smbios-v5/TriRiver_v5丝印编排v1.1_0515(1).pptx`

注意：

- 这个 PPT 是客户显示名的最高优先级来源。
- 内网模型可能不能读 PPT，所以已提取 CSV 和 Markdown 资料供投喂。

### 5.6 已整理资料包路径

资料包目录：

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/`

压缩包：

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package-20260522.zip`

重点文件：

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/04_ppt_silkname_slotnumber_mapping.csv`
- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/08_type9_logic_deep_explanation.md`

### 5.7 已写学习/汇报文档

深度讲解：

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-layout-slotnumber-deep-dive.md`

两页 PPT 大纲：

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-refactor-two-page-ppt-outline.md`

教学规则：

- `/Users/tzy/code/personal-coach/LearningCoach/AGENTS.md`

### 5.8 Git 状态注意

早先已推送的 commit：

- `409a8ce Add V5 Type9 layout deep dive note`

注意：

- 本地仓库可能有不少用户已有改动和未跟踪目录。
- 如果后续窗口要提交，必须只 stage 明确相关文件，不要误提交用户其它改动。

## 6. 适合放进 PPT 的候选页

### Slide 1：V5 Type9 重构结论

**本页要表达的核心结论**

V5 Type9 建议采用 `SlotNumber + Layout Table + 打分匹配` 的架构，把多版型显示规则从代码分支中抽出来，提升复用性和可维护性。

**3-5 个 bullet**

- 当前需要兼容 20+ 版型、Single/Multi、Node 差异和客户 PPT 丝印显示规则。
- 底层 IIO SlotNumber profile 只有 3 到 4 套，上层显示布局却很多。
- `SlotNumber` 作为运行时硬件匹配主 key，`DisplayName` 作为最终 Type9 显示名。
- `SilkName` 只作为映射证据和 debug 字段，不作为运行时主逻辑。
- 打分匹配实现“特例优先，通用兜底”，减少穷举表项。

**推荐图示/流程图/表格**

```text
PCIe/IIO -> SlotNumber -> Layout Table -> DisplayName -> SMBIOS Type9
```

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/04_ppt_silkname_slotnumber_mapping.csv`
- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentLegoPkg/Dxe/TencentSmbiosUpdate/TencentType9Update/TencentType9Update.c`
- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentProjectPkg/Uba/UbaMain/TriRiverV5/Pei/IioBifurInit.c`

**确定/推测**

- 确定：Type9 运行时可以从 Slot Capability 拿 SlotNumber。
- 确定：PPT DisplayName 是客户可见显示名来源。
- 推测/建议：用打分算法替代多层 `if/else` 是更适合后续维护的方案。

### Slide 2：为什么不能继续堆 if/else

**本页要表达的核心结论**

如果把 Board、HostMode、Node、SlotNumber、AI 机型都写成条件分支，短期能跑，长期不可维护。

**3-5 个 bullet**

- 版型组合多：Board × HostMode × Node × SlotNumber 很快膨胀。
- 显示名不统一：不能靠代码拼接 `Node0-` 或 `SlotX` 解决。
- 特例越来越多：AI 机型会引入 Switch / DSP / GPU 等新槽位来源。
- 调试困难：错误分散在多个分支，不容易定位是 PCD、IIO、匹配还是生成问题。
- 表驱动可以让新增版型优先改数据，减少流程改动。

**推荐图示/流程图/表格**

左右对比图：

```text
左：if/else 分支树，越来越宽
右：固定主流程 + Layout 表，新增规则进入表
```

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-layout-slotnumber-deep-dive.md`

**确定/推测**

- 确定：当前业务规则组合确实多。
- 推测/建议：如果继续堆分支，后续维护成本会显著增加。

### Slide 3：SlotNumber、SilkName、DisplayName 三者关系

**本页要表达的核心结论**

三者不能混用：`SlotNumber` 负责运行时匹配，`DisplayName` 负责客户显示，`SilkName` 负责映射证据。

**3-5 个 bullet**

- `SlotNumber`：来自 PCIe Slot Capability，是硬件/IIO 配置结果。
- `DisplayName`：来自客户 PPT，最终进入 SMBIOS Type9。
- `SilkName`：说明某条 PPT 规则对应哪个 PE/Port/丝印，主要用于人工校验和 debug。
- 同一个 SlotNumber 在不同版型/Node 下可能映射到不同显示名。
- 同一个显示风格不能靠代码拼接，必须来自 Layout 表。

**推荐图示/流程图/表格**

三列表：

| 名称 | 来源 | 用途 | 是否作为运行时主 key |
|---|---|---|---|
| SlotNumber | PCIe/IIO | 匹配 | 是 |
| DisplayName | PPT | Type9 显示 | 否，是输出值 |
| SilkName | PPT/丝印 | 证据/debug | 否 |

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/04_ppt_silkname_slotnumber_mapping.csv`
- `/Users/tzy/code/personal-coach/code-repositories/tririverv5-ami/TencentProjectPkg/Uba/UbaMain/TriRiverV5/Pei/IioBifurInit.c`

**确定/推测**

- 确定：Type9 代码能读取 SlotNumber。
- 确定：PPT 中存在不同风格的 DisplayName。

### Slide 4：打分匹配算法：特例优先，通用兜底

**本页要表达的核心结论**

打分算法的价值是允许表里同时存在通用规则和特例规则，命中多条时自动选择更具体的一条。

**3-5 个 bullet**

- 通用规则：例如 `HostMode=Any, NodePolicy=NoNode, SlotNumber=7 -> Slot20`。
- 特例规则：例如 `HostMode=Multi, NodeId=Node0, SlotNumber=7 -> Node0-Slot20`。
- 两条都命中时，特例因 HostMode 和 Node 精确匹配得分更高。
- 不需要穷举每个 HostMode 和 Node 组合。
- 若最高分相同但显示名不同，必须报错，不能静默选择。

**推荐图示/流程图/表格**

规则打分示例表：

| 规则 | HostMode | Node | SlotNumber | DisplayName | 得分 | 结果 |
|---|---|---|---|---|---|---|
| 通用 | Any | NoNode | 7 | Slot20 | 低 | 兜底 |
| 特例 | Multi | Node0 | 7 | Node0-Slot20 | 高 | 选中 |

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/08_type9_logic_deep_explanation.md`
- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-layout-slotnumber-deep-dive.md`

**确定/推测**

- 确定：用户已经认可这个讲法更容易理解。
- 建议：PPT 中应优先用这个例子讲打分制，不要先讲函数。

### Slide 5：四层落地架构

**本页要表达的核心结论**

通过 Context、Layout、Matcher、Builder/Provider 分层，把复杂度收敛到固定位置，让主流程稳定。

**3-5 个 bullet**

- Context：读取 BoardType、HostMode、NodeId、AiMode。
- Layout：维护客户 PPT 的显示规则。
- Matcher：按 SlotNumber 和 Context 打分选择最优 DisplayName。
- Builder：生成 SMBIOS Type9。
- Provider：当前支持 Root Port，未来为 AI Switch/DSP/GPU 预留。

**推荐图示/流程图/表格**

```text
BuildType9Context
        ↓
SelectType9Layout
        ↓
FindRootBridge / Future AI Provider
        ↓
FindBestSlotDesc
        ↓
BuildType9FromDesc
        ↓
SMBIOS Type9
```

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/LearningCoach/notes/bios/smbios/type9-v5-refactor-two-page-ppt-outline.md`

**确定/推测**

- 确定：这是当前推荐架构。
- 推测/建议：未来 AI 机型用 Provider 接入，不污染当前非 AI 主流程。

### Slide 6：异常与 fallback 策略

**本页要表达的核心结论**

Type9 是客户可见信息，降级原则是“可以少显示，但不能显示错”。

**3-5 个 bullet**

- `BoardType` 失败：不安全，不能选择客户布局表。
- `HostMode` 失败：只允许匹配 `HostMode=Any`。
- `NodeId` 失败：不能默认 Node0，只能匹配不需要 Node 的规则。
- `SlotNumber` 失败：不能从 PPT 表匹配，走 legacy fallback 或跳过。
- 匹配不到时不能临时拼 `Slot7` / `Node0-Slot7`。

**推荐图示/流程图/表格**

失败场景表：

| 失败字段 | 推荐处理 | 是否允许生成客户显示名 |
|---|---|---|
| BoardType | ERROR / legacy / skip | 否 |
| HostMode | Host Any 兜底 | 仅表中有 Any 时 |
| NodeId | NoNode 规则兜底 | 仅无 Node 显示版型 |
| SlotNumber | legacy / skip | 否 |

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/06_fallback_display_rules.md`

**确定/推测**

- 确定：这是当前设计原则。
- 建议：PPT 中可以简短提，不一定展开太多。

### Slide 7：AI 机型预留方案

**本页要表达的核心结论**

当前 V5 不实现真实 AI 机型逻辑，只在架构上预留 Provider 扩展点，避免未来改动主流程。

**3-5 个 bullet**

- 非 AI：槽位来源是 PCIe Root Port。
- AI：未来可能从 Switch / DSP / GPU Provider 收集槽位。
- AI Provider 输出统一的 Slot Candidate，再走同一套 Matcher 和 Builder。
- 可新增 `AiMode`、`SlotSource`、AI Layout 表。
- Type11 OEM 信息未来按需扩展。

**推荐图示/流程图/表格**

```text
Root Port Provider ┐
AI Switch Provider ├─> Slot Candidate -> Matcher -> Type9
GPU/DSP Provider   ┘
```

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/02_v3_ai_logic_reconstructed.md`
- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/08_type9_logic_deep_explanation.md`

**确定/推测**

- 确定：当前 V5 没有真实 AI 机型需求。
- 推测/建议：Provider 是未来扩展方向，不应在当前过度实现。

### Slide 8：实施收益与下一步

**本页要表达的核心结论**

该方案的收益是减少主流程改动、提高显示准确性、降低新增版型成本，并为 AI 机型预留空间。

**3-5 个 bullet**

- 新增版型主要改 Layout 表。
- 显示名严格来自 PPT，降低误显示风险。
- 通用规则 + 特例规则减少穷举。
- 日志按 Context/Layout/Match/Build 分段，便于定位。
- 下一步需要确认 NodeId PCD、补齐 Layout 表、设计单元/集成测试。

**推荐图示/流程图/表格**

收益矩阵：

| 目标 | 对应设计 |
|---|---|
| 可复用 | SlotNumber + Layout |
| 清晰 | 分层主流程 |
| 易维护 | 数据表驱动 |
| 可扩展 | Provider |
| 可调试 | 分段日志 |

**可以引用的证据或文件路径**

- `/Users/tzy/code/personal-coach/type9-v5-intranet-package/07_intranet_model_prompt.md`

**确定/推测**

- 确定：这是对领导“复用性、代码结构清晰、易维护”要求的回应。
- 建议：作为收尾页或口头总结。

## 7. 风险与注意事项

### 7.1 不要把推测当事实

确定事实：

- Type9 当前能读取 `SlotNumber`。
- IIO 代码中存在几套 SlotNumber 配置模板。
- PPT 是显示名来源。
- `PcdPe9Bifurcation` / `PcdPe3Bifurcation` 可用于判断 Single/Multi。

仍需确认：

- `PcdTencentNodeId` 的最终命名、来源和写入时机。
- AI 机型真实 V5 需求和硬件路径。
- 所有 PPT 映射是否已完全准确转成 CSV。
- 某些版型的 HostMode 和 NodePolicy 是否需要进一步人工确认。

### 7.2 不要在代码中拼客户显示名

错误做法：

```text
AsciiSPrint("node%u-%a", NodeId, SlotName)
AsciiSPrint("Slot%d", SlotNumber)
```

原因：

- PPT 中有些显示是 `PCIe0`。
- 有些是 `Slot1`。
- 有些是 `Node0-M.2_0`。
- 不是所有版型都有 Node。

正确做法：

- `DisplayName` 必须来自 Layout 表。
- NodePolicy 只决定匹配，不决定现场拼字符串。

### 7.3 打分算法必须做冲突检测

风险：

- 两条规则可能同分。
- 如果显示名不同，静默选第一条会造成隐藏 bug。

建议：

- 同分同名：WARN。
- 同分异名：ERROR，拒绝静默选择。

### 7.4 fallback 不能显示错误名称

原则：

- 可以降级显示少一点。
- 不能生成错误客户丝印名。

尤其注意：

- NodeId 获取失败不能默认 Node0。
- SlotNumber 找不到不能自动拼 `SlotX`。
- BoardType 找不到不能随便选通用 Board。

### 7.5 当前不要过度实现 AI

风险：

- 真实 AI V5 机型尚未明确。
- 现在过早实现复杂 Provider 可能反而降低可读性。

建议：

- 当前代码只预留接口/枚举/结构。
- 等真实 AI 需求明确后再补 Provider。

### 7.6 PPT 汇报不要从代码讲起

用户明确反馈：之前从架构/函数开始讲会听晕。

后续 PPT 要按这个顺序：

1. 先讲为什么需要这个方案。
2. 再讲不用会发生什么问题。
3. 再用一句话讲核心思想。
4. 再用具体例子讲通。
5. 最后再讲架构和代码。

## 8. 未完成/需要主窗口继续追问的问题

### 8.1 需要确认 PPT 目标

需要问用户：

- 最终 PPT 是给领导做技术方案汇报，还是给组内做实现评审？
- 需要 2 页、5 页，还是完整 8-10 页？
- 是否需要正式生成 `.pptx` 文件，还是只要 Markdown 大纲？

### 8.2 需要确认听众层级

需要问用户：

- 听众是否懂 BIOS/SMBIOS/IIO？
- 是否需要解释 Type9 基础？
- 是否需要弱化代码细节，突出“复用性、结构清晰、易维护”？

### 8.3 需要确认 NodeId 获取方案

当前已知：

- 代码里没明确找到 NodeId PCD。
- 用户认为可以按 SMBus 其它 PCD 写法扩展。

需确认：

- NodeId 从哪里来？
- PCD 名称是否确定？
- 失败时是否允许使用无 Node fallback？

### 8.4 需要确认 Layout 表最终来源

当前有 CSV，但仍需确认：

- CSV 是否完全覆盖 PPT 所有版型。
- `MatchStatus` 是否仍有 `TO_CONFIRM`。
- 是否有人需要人工复核 DisplayName 是否逐字来自 PPT。

### 8.5 需要确认 legacy fallback 策略

需确认：

- 如果匹配不到 Layout，是否保留老逻辑？
- legacy fallback 是否需要 PCD 开关？
- 出货版本是否允许跳过 Type9，还是必须生成保底记录？

### 8.6 需要确认 AI 机型范围

当前假设：

- V5 当前没有真实 AI 机型。
- 只做架构预留。

需确认：

- 未来 AI 是否一定是 Switch/DSP/GPU 路径？
- 是否需要 Type11 保存物理位置信息？
- 是否会复用 V3 AI 的 `GetStringCount` / `FindAllRootBridgeAndDownStreamPort` / `AddType9StructForDsp` 思路？

## 9. 推荐 PPT 页数与优先级

### 9.1 如果只做领导快速汇报：建议 2 页

优先级最高：

1. **V5 Type9 重构结论**  
   讲为什么要用 SlotNumber 驱动的 Layout 架构。

2. **落地架构与收益**  
   讲 Context / Layout / Matcher / Provider 四层，以及可维护性收益。

适合场景：

- 时间短。
- 领导只关心方向是否合理。
- 不展开细节算法。

### 9.2 如果做技术方案评审：建议 5 页

推荐页：

1. V5 Type9 重构结论。
2. 当前问题：为什么不能继续堆 if/else。
3. SlotNumber / SilkName / DisplayName 关系。
4. 打分匹配：特例优先，通用兜底。
5. 四层落地架构与 fallback/AI 预留。

适合场景：

- 组内评审。
- 需要让同事理解为什么这么改。
- 需要讨论实现边界。

### 9.3 如果做完整方案沉淀：建议 8 页

推荐页：

1. V5 Type9 重构结论。
2. 当前问题与复杂度来源。
3. SlotNumber / SilkName / DisplayName 关系。
4. Layout 表设计。
5. 打分匹配算法。
6. fallback 和异常处理。
7. AI 机型预留方案。
8. 实施收益、风险与下一步。

适合场景：

- 设计文档转 PPT。
- 后续需要给内网模型或同事继续实现。
- 需要保留证据链和风险说明。

### 9.4 当前建议

如果用户当前只是要按领导要求先做两页汇报，建议最终 PPT 占 **2 页**：

- 第 1 页：**方案结论 + 为什么要改**。
- 第 2 页：**落地架构 + 可维护性收益**。

如果后续领导或组内追问细节，再扩展到 **5 页版本**，重点补充：

- 打分匹配算法。
- fallback 策略。
- AI 机型预留边界。
