# Type9 V3 AI 与 V5 重构讨论资料

整理时间：2026-05-21

这个目录用于保存本轮 Type9 讨论的素材，方便后续在另一台机器继续分析。

## 目录内容

- `v3 ai机型逻辑/`
  - `v3ai_type9_01.jpg` 到 `v3ai_type9_17.jpg`
  - 来源：内网模型/截图整理的 V3 AI 机型 Type9 架构说明。
- `v5当前代码逻辑/`
  - `v5_type9_01.jpg` 到 `v5_type9_07.jpg`
  - 来源：当前 V5 Type9 实现逻辑截图。

## 这轮讨论背景

客户对 Type9 的核心要求不是单纯“照搬 V3”或者“必须使用 silkname”，而是：

1. 可复用性好。
2. 代码结构清晰、易维护。
3. 未来继续加机型时，改动范围尽量小。

当前需要考虑的是：

- V3 AI 机型已经做了一套多机型、多版型扩展方案。
- V5 已经有自己的重构方向和现有逻辑。
- V5 当前重点是如何在保留 V5 现有能力的前提下，支持类似 V3 AI 的扩展。
- 需要判断 `slotnumber`、`silkname`、`boardid`、`node` 这些信息分别应该处在架构的哪一层。

## 从 V3 AI 截图反推的逻辑

V3 AI 的核心思路大致是：

1. 用 `SLOT_STRING` 维护每个可上报插槽的静态描述。
2. 每个数组代表一种机型或配置形态，例如：
   - 普通 Root Port 配置。
   - Switch/GearBox 配置。
   - PEX144 配置。
   - ScaleOut 配置。
   - ScaleUp 配置。
3. 运行时枚举 PCIe Root Port / Downstream Port。
4. 用 `SlotNumber` 去静态表中匹配。
5. 匹配到以后生成 SMBIOS Type9。
6. 对 AI Switch 下的 GPU 插槽，额外保存物理位置信息到 Type11。

V3 AI 里比较关键的函数包括：

- `GetStringCount`
  - 根据板型或 Switch 配置选择对应的 `SLOT_STRING` 数组。
- `FindAllRootBridgeAndDownStreamPort`
  - 枚举 PCIe Bridge，并区分 Root Port / Downstream Port。
- `IsSwitch`
  - 根据 Vendor ID / Device ID 判断设备是否为 Switch。
- `SlotInfoConfig`
  - 根据真实链路速度和宽度设置 SMBIOS Type9 的 `SlotType`。
- `AddType9StructForDsp`
  - 给 Switch DSP 下游端口添加 Type9。
- `SaveSlotInfoInType11`
  - 把部分插槽的 Bus/Dev/Func 和物理位置写入 Type11。
- `UpdateSmbiosType9TableSysSlot`
  - 主流程入口。

## 当前 V5 的关键事实

V5 Type9 当前动态路径里，`SlotNumber` 来自 PCIe Slot Capability，而不是 Type9 自己随便定义：

```c
RootBridge->SlotNumber = (UINT16)(SlotCap >> 19);
```

也就是说，Type9 只是消费 `SlotNumber`，真正决定 `Socket/PE/Port -> SlotNumber` 的地方在 IIO slot config。

V5 的 IIO 配置里存在多套带宽和 slot config，例如：

- `IioSlotBoardC2_28E3SConfig`
- `IioSlotBoardC2_8CXLConfig`

这些配置体现了一个重要特征：

```text
x4x4x4x4: Slot 7, 9, 11, 13
x8x8:     Slot 7,    11
```

也就是说，x8x8 并没有重新发明一套 SlotNumber，而是使用 x4x4x4x4 中 A/E port 对应的 SlotNumber。  
这就是“少数几套带宽分配可以兼容很多版型”的关键。

## 对“兼容所有”的理解

这里的“兼容所有”不应该理解成：

```text
20 多种版型全部使用完全一样的显示名称和完全一样的 Type9 数据。
```

更合理的理解是：

```text
20 多种版型底层只落在 3 到 4 套 PCIe 拓扑/带宽分配模板里。
只要 SlotNumber 编号体系覆盖这几套模板，Type9 的匹配逻辑就可以兼容这些版型。
```

所以架构上不应该写成：

```text
BoardId_A -> SlotString_A
BoardId_B -> SlotString_B
BoardId_C -> SlotString_C
...
20 多个 BoardId 复制 20 多套表
```

更应该写成：

```text
BoardId / 平台信息 / AI 配置
    -> 映射到少量 Type9 Profile
        -> Profile 内部用 SlotNumber 查表
            -> 动态枚举补齐 LinkSpeed / LinkWidth / 占用状态
```

## 建议的 V5 架构方向

推荐把 Type9 分成三层。

### 1. 机型选择层

负责判断当前机器属于哪个 Type9 profile。

可能输入：

- `BoardId`
- `TencentBoardType`
- AI / 非 AI 标识
- Switch 配置 ID
- ScaleOut / ScaleUp 配置

输出：

```c
TYPE9_PROFILE_ID
```

这一层不直接生成 Type9，只负责选 profile。

### 2. 数据层

负责维护少量可复用的 slot 描述表。

建议按拓扑 family 维护，而不是按 20 多个 BoardId 维护：

```c
typedef struct {
  UINT16 SlotNumber;
  CHAR8  SlotDesignation[...];
  CHAR8  LocationString[...];
  UINT8  Socket;
  UINT8  Port;
  BOOLEAN ReportInType11;
} TYPE9_SLOT_DESC;
```

然后：

```c
typedef struct {
  TYPE9_PROFILE_ID ProfileId;
  TYPE9_SLOT_DESC  *RootPortSlots;
  UINTN            RootPortSlotCount;
  TYPE9_SLOT_DESC  *DspSlots;
  UINTN            DspSlotCount;
} TYPE9_PROFILE;
```

### 3. 引擎层

负责统一处理动态枚举和 SMBIOS 生成。

主流程大致是：

```text
Locate SMBIOS Protocol
    ↓
删除旧 Type9
    ↓
读取平台信息，选择 Type9 Profile
    ↓
枚举 PCIe Root Port / Downstream Port
    ↓
读取 Slot Capability 中的 SlotNumber
    ↓
用 SlotNumber 在当前 Profile 里找描述
    ↓
读取 LinkSpeed / LinkWidth
    ↓
设置 SlotType / DataBusWidth / CurrentUsage
    ↓
添加 SMBIOS Type9
    ↓
如果是 AI Switch DSP 插槽，需要时额外写 Type11
```

## SlotNumber 与 silkname 的关系

当前更建议：

```text
SlotNumber 做主 key。
silkname 做显示名来源或 override 来源。
```

理由：

1. `SlotNumber` 是 PCIe Slot Capability 中的标准字段。
2. V5 的 IIO slot config 已经在维护 `Socket/PE/Port -> SlotNumber`。
3. 同一套 SlotNumber 编号可以兼容多种带宽分配。
4. Type9 动态枚举天然能读到 SlotNumber。
5. silkname 更像展示层信息，适合决定 `SlotDesignation` / `LocationString`，不适合作为唯一匹配 key。

但需要注意：

如果不同版型同一个 SlotNumber 的显示丝印不同，则需要 profile 或 override，而不是认为一个表能解决所有显示差异。

## AI 机型的特殊点

AI 机型和非 AI 机型枚举对象可能不同：

- 非 AI 主要关注 Root Port。
- AI 还要关注 Switch / DSP 下游端口。
- AI ScaleUp / ScaleOut 可能还涉及 node 概念。
- AI GPU 插槽可能需要写 Type11，保存 Bus/Dev/Func 与物理位置的关系。

所以 AI 不建议简单塞进普通 Root Port 表里。

更合理的是：

```text
公共 Type9 引擎
    + RootPort provider
    + Switch/DSP provider
    + Type11 location provider
```

这样非 AI 只启用 RootPort provider，AI 额外启用 DSP 和 Type11 provider。

## 当前最需要确认的问题

后续继续设计 V5 时，建议优先确认这些点：

1. V5 的 20 多个版型分别归属哪 3 到 4 套带宽分配/slot config。
2. 这些版型之间，同一个 SlotNumber 的显示名是否一致。
3. AI 机型中 GPU 插槽是否也有稳定 SlotNumber。
4. AI Switch DSP 下游端口是否能通过 PCIe capability 读到可靠 SlotNumber。
5. 如果 DSP 没有可靠 SlotNumber，是否需要用 Bus/Device/Function、Switch port index、node id 或 silkname 作为辅助 key。
6. Type11 是否是客户强需求，还是只针对部分 AI GPU 插槽需要。

## 暂定结论

V5 不建议直接复制 V3 的所有数组式写法，也不建议完全改成 silkname 驱动。

更推荐：

```text
少量 profile
    + SlotNumber 主 key
    + silkname/display override
    + 公共动态枚举引擎
    + AI DSP 扩展 provider
```

这样可以同时满足：

- 可复用。
- 结构清晰。
- 新增机型改动小。
- 保留 V5 现有 SlotNumber 动态枚举优势。
- 兼容 V3 AI 的 Switch/DSP/Type11 思路。

## 中午继续讨论入口

可以从这个问题继续：

```text
V5 的 AI 机型中，GPU / DSP 下游端口有没有可靠 SlotNumber？
如果有，就继续用 SlotNumber 统一架构。
如果没有，就需要给 AI DSP 单独设计辅助匹配 key，但仍然复用公共 Type9 生成引擎。
```

