import fs from "node:fs";

const W = 1280;
const H = 720;

const C = {
  bg: "#F7F9FC",
  ink: "#111827",
  muted: "#5B6472",
  faint: "#E6EBF2",
  panel: "#FFFFFF",
  blue: "#145CFF",
  blue2: "#0B3EA8",
  cyan: "#00A3FF",
  green: "#12B886",
  amber: "#F59F00",
  red: "#E03131",
  slate: "#273140",
  softBlue: "#EAF1FF",
  softGreen: "#EAF8F2",
  softAmber: "#FFF6DE",
};

const FONT = "PingFang SC";
const MONO = "Menlo";
const ASSET = "/Users/tzy/code/personal-coach/ppt_work/material_pack/evidence_images";

const images = {
  type9Design: `${ASSET}/slide14_type9_multi_board_refactor_03.png`,
  type9Flow: `${ASSET}/slide14_type9_multi_board_refactor_02.png`,
  type9Spec: `${ASSET}/slide14_type9_multi_board_refactor_01.png`,
  validationLog: `${ASSET}/slide13_smbios_validation_auto_02.png`,
  validationDmi: `${ASSET}/slide13_smbios_validation_auto_01.png`,
  refactorPlan: `${ASSET}/slide12_type8_11_12_ai_refactor_01.png`,
  refactorRules: `${ASSET}/slide12_type8_11_12_ai_refactor_02.png`,
};

const dims = {
  [images.type9Design]: [582, 804],
  [images.type9Flow]: [591, 812],
  [images.type9Spec]: [576, 801],
  [images.validationLog]: [599, 873],
  [images.validationDmi]: [619, 685],
  [images.refactorPlan]: [573, 854],
  [images.refactorRules]: [573, 605],
};

const dataUrlCache = new Map();

function imageDataUrl(src) {
  if (!dataUrlCache.has(src)) {
    dataUrlCache.set(src, `data:image/png;base64,${fs.readFileSync(src).toString("base64")}`);
  }
  return dataUrlCache.get(src);
}

function slideBase(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill.color = C.bg;
  rect(slide, 0, 0, W, 16, { fill: C.ink });
  rect(slide, 0, 16, W, 4, { fill: C.blue });
  return slide;
}

function rect(slide, x, y, w, h, opts = {}) {
  const sh = slide.shapes.add({
    geometry: "rect",
    position: { left: x, top: y, width: w, height: h },
  });
  if (opts.fill) sh.fill.color = opts.fill;
  if (opts.line === false || opts.line === "none") {
    sh.line.visible = false;
  } else if (opts.line) {
    sh.line.color = opts.line;
    sh.line.width = opts.lineWidth ?? 1;
  } else {
    sh.line.visible = false;
  }
  if (opts.radius !== undefined) sh.borderRadius = opts.radius;
  if (opts.shadow) sh.shadow = opts.shadow;
  return sh;
}

function line(slide, x, y, w, color = C.faint, h = 1) {
  return rect(slide, x, y, w, h, { fill: color });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const sh = rect(slide, x, y, w, h, { fill: opts.fill, line: false });
  sh.text.set(value);
  sh.text.typeface = opts.font ?? FONT;
  sh.text.fontSize = opts.size ?? 24;
  sh.text.color = opts.color ?? C.ink;
  sh.text.bold = Boolean(opts.bold);
  sh.text.alignment = opts.align ?? "left";
  sh.text.verticalAlignment = opts.valign ?? "top";
  sh.text.insets = opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  if (opts.autoFit !== false) sh.text.autoFit = "shrinkText";
  return sh;
}

function header(slide, section, title, page) {
  text(slide, section, 72, 44, 180, 22, {
    size: 13,
    bold: true,
    color: C.blue,
    font: MONO,
  });
  text(slide, title, 72, 72, 900, 74, {
    size: 32,
    bold: true,
    color: C.ink,
    autoFit: true,
  });
  line(slide, 72, 154, 1136, C.faint, 2);
  text(slide, String(page).padStart(2, "0"), 1160, 54, 48, 28, {
    size: 14,
    color: C.muted,
    font: MONO,
    align: "right",
  });
}

function chip(slide, label, x, y, w, fill = C.softBlue, color = C.blue) {
  rect(slide, x, y, w, 26, { fill, line: false, radius: 4 });
  text(slide, label, x + 10, y + 4, w - 20, 18, {
    size: 12,
    bold: true,
    color,
    align: "center",
    valign: "middle",
  });
}

function card(slide, x, y, w, h, opts = {}) {
  rect(slide, x, y, w, h, {
    fill: opts.fill ?? C.panel,
    line: opts.line ?? C.faint,
    lineWidth: 1,
    radius: 2,
  });
}

function kpi(slide, x, y, w, value, label, note, color = C.blue) {
  card(slide, x, y, w, 140, { fill: C.panel });
  rect(slide, x, y, 6, 140, { fill: color });
  text(slide, value, x + 22, y + 22, w - 44, 38, {
    size: 34,
    bold: true,
    color,
    font: MONO,
  });
  text(slide, label, x + 22, y + 66, w - 44, 26, {
    size: 18,
    bold: true,
    color: C.ink,
  });
  text(slide, note, x + 22, y + 96, w - 44, 30, {
    size: 12,
    color: C.muted,
  });
}

function bullet(slide, value, x, y, w, opts = {}) {
  rect(slide, x, y + 8, 6, 6, { fill: opts.color ?? C.blue });
  text(slide, value, x + 16, y, w - 16, opts.h ?? 34, {
    size: opts.size ?? 17,
    bold: opts.bold,
    color: opts.textColor ?? C.ink,
  });
}

function stage(slide, label, x, y, w, fill = C.panel, color = C.ink) {
  card(slide, x, y, w, 70, { fill });
  text(slide, label, x + 12, y + 12, w - 24, 46, {
    size: 16,
    bold: true,
    color,
    align: "center",
    valign: "middle",
  });
}

function arrow(slide, x, y) {
  text(slide, "→", x, y, 26, 30, {
    size: 24,
    bold: true,
    color: C.blue,
    align: "center",
  });
}

function evidence(slide, src, x, y, w, h, label) {
  const [iw, ih] = dims[src] ?? [w, h];
  const captionH = label ? 24 : 0;
  const maxW = w;
  const maxH = h - captionH - (label ? 8 : 0);
  const s = Math.min(maxW / iw, maxH / ih);
  const rw = iw * s;
  const rh = ih * s;
  const ix = x + (w - rw) / 2;
  const iy = y + Math.max(0, (maxH - rh) / 2);
  slide.images.add({
    dataUrl: imageDataUrl(src),
    position: { left: ix, top: iy, width: rw, height: rh },
    alt: label ?? "evidence screenshot",
  });
  if (label) {
    text(slide, label, x, y + maxH + 8, w, 20, {
      size: 12,
      bold: true,
      color: C.muted,
      align: "center",
    });
  }
}

function imageSlot(slide, x, y, w, h, title, note) {
  rect(slide, x, y, w, h, { fill: "#F8FAFE", line: "#CBD5E1", lineWidth: 1 });
  text(slide, title, x + 26, y + 26, w - 52, 30, {
    size: 22,
    bold: true,
    color: C.ink,
    align: "center",
  });
  text(slide, note, x + 34, y + h / 2 - 8, w - 68, 54, {
    size: 17,
    color: C.muted,
    align: "center",
    valign: "middle",
  });
  line(slide, x + 38, y + h - 44, w - 76, C.faint, 1);
  text(slide, "后续替换为实际截图", x + 34, y + h - 34, w - 68, 18, {
    size: 12,
    color: C.muted,
    align: "center",
  });
}

function sectionLabel(slide, textValue, x, y, color = C.blue) {
  rect(slide, x, y, 7, 24, { fill: color });
  text(slide, textValue, x + 14, y + 1, 260, 24, {
    size: 17,
    bold: true,
    color: C.ink,
  });
}

function miniTable(slide, rows, x, y, w, rowH) {
  const col = [0.18, 0.55, 0.27];
  rect(slide, x, y, w, rowH, { fill: C.ink });
  ["工作项", "交付结果", "状态口径"].forEach((h, i) => {
    const cx = x + w * col.slice(0, i).reduce((a, b) => a + b, 0);
    text(slide, h, cx + 12, y + 11, w * col[i] - 24, 18, {
      size: 13,
      bold: true,
      color: "#FFFFFF",
      align: i === 2 ? "center" : "left",
    });
  });
  rows.forEach((r, idx) => {
    const yy = y + rowH * (idx + 1);
    rect(slide, x, yy, w, rowH, { fill: idx % 2 ? "#F4F7FB" : "#FFFFFF", line: C.faint });
    let cx = x;
    text(slide, r[0], cx + 12, yy + 14, w * col[0] - 24, rowH - 34, {
      size: 14,
      bold: true,
      color: C.ink,
    });
    cx += w * col[0];
    text(slide, r[1], cx + 12, yy + 14, w * col[1] - 24, rowH - 34, {
      size: 13.5,
      color: C.slate,
    });
    cx += w * col[1];
    chip(slide, r[2], cx + 18, yy + 18, w * col[2] - 36, r[3] ?? C.softGreen, r[4] ?? C.green);
  });
}

export async function createSlide(presentation, _ctx, number) {
  const slide = slideBase(presentation);

  if (number === 1) {
    rect(slide, 72, 112, 14, 430, { fill: C.blue });
    text(slide, "BIOS / SMBIOS 适配", 112, 130, 740, 64, {
      size: 54,
      bold: true,
      color: C.ink,
    });
    text(slide, "与 AI 辅助工程闭环阶段汇报", 112, 198, 760, 64, {
      size: 42,
      bold: true,
      color: C.ink,
    });
    text(slide, "客户需求交付 · SMBIOS 适配重构 · AI 辅助开发验证复核", 116, 292, 780, 34, {
      size: 20,
      color: C.muted,
    });
    rect(slide, 930, 102, 230, 230, { fill: C.ink });
    rect(slide, 972, 144, 146, 146, { fill: C.bg, line: false });
    text(slide, "SMBIOS", 984, 184, 122, 28, {
      size: 23,
      bold: true,
      color: C.ink,
      align: "center",
      font: MONO,
    });
    text(slide, "AI", 1002, 222, 86, 40, {
      size: 40,
      bold: true,
      color: C.blue,
      align: "center",
      font: MONO,
    });
    line(slide, 112, 468, 620, C.faint, 2);
    text(slide, "2026 年 5 月", 112, 494, 260, 28, {
      size: 18,
      color: C.slate,
      font: MONO,
    });
    text(slide, "研发工程组", 112, 526, 220, 28, {
      size: 18,
      color: C.slate,
    });
    text(slide, "SWISS ENGINEERING REPORT", 900, 620, 260, 22, {
      size: 12,
      color: C.muted,
      font: MONO,
      align: "right",
    });
    return slide;
  }

  if (number === 2) {
    header(slide, "EXECUTIVE SUMMARY", "本阶段完成客户可见信息适配，并跑通 SMBIOS 场景的 AI 辅助工程闭环", 2);
    const cards = [
      ["客户问题闭环", "V3 遗留显示问题与 V5 新增问题单进入阶段处理，客户可见字段按需求适配。", C.blue],
      ["AI 辅助提效", "Type8 / Type9 / Type11 / Type12 等 SMBIOS 模块进入 AI 辅助重构流程。", C.green],
      ["质量过程可追踪", "SMBIOS 自动验证和 AI Review 开始沉淀日志、报告和风险处置记录。", C.amber],
    ];
    cards.forEach((c, i) => {
      const x = 72 + i * 386;
      card(slide, x, 224, 344, 210, { fill: C.panel });
      rect(slide, x, 224, 344, 8, { fill: c[2] });
      text(slide, `0${i + 1}`, x + 24, 252, 54, 40, {
        size: 32,
        bold: true,
        color: c[2],
        font: MONO,
      });
      text(slide, c[0], x + 88, 258, 210, 28, {
        size: 22,
        bold: true,
        color: C.ink,
      });
      text(slide, c[1], x + 24, 324, 292, 76, {
        size: 17,
        color: C.slate,
      });
    });
    rect(slide, 72, 498, 1136, 82, { fill: C.ink });
    text(slide, "边界说明", 102, 522, 110, 24, { size: 17, bold: true, color: "#FFFFFF" });
    text(slide, "当前 AI 提效聚焦 SMBIOS 规则清晰、结果可比对的场景，不扩展为所有 BIOS 问题自动修复。", 224, 522, 880, 28, {
      size: 20,
      color: "#FFFFFF",
    });
    return slide;
  }

  if (number === 3) {
    header(slide, "AGENDA", "本次汇报围绕工作成果、重点工作和下一步计划展开", 3);
    const rows = [
      ["01", "工作成果", "客户需求响应、问题单闭环、AI 辅助工程闭环试点"],
      ["02", "重点工作", "Type9 重构、自动化验证、Type8/11/12 规范化移植、AI Review"],
      ["03", "下一步计划", "沉淀 SMBIOS 开发生成和测试问题修复两条 Agent 工作流"],
    ];
    rows.forEach((r, i) => {
      const y = 210 + i * 125;
      line(slide, 72, y - 24, 1020, C.faint, 1);
      text(slide, r[0], 92, y, 100, 50, { size: 42, bold: true, color: C.blue, font: MONO });
      text(slide, r[1], 250, y + 4, 260, 36, { size: 30, bold: true, color: C.ink });
      text(slide, r[2], 520, y + 13, 580, 30, { size: 19, color: C.slate });
    });
    line(slide, 72, 585, 1020, C.faint, 1);
    return slide;
  }

  if (number === 4) {
    header(slide, "01 / WORK RESULTS", "V5 SMBIOS 客户可见字段适配和新增问题单完成阶段处理", 4);
    miniTable(slide, [
      ["V3 遗留问题闭环", "修复 7 项 SMBIOS 显示问题，覆盖显示名异常、字段缺失、不显示等。", "已上库", C.softGreen, C.green],
      ["V5 新增问题单", "按客户新增需求完成代码调整和目标环境验证。", "问题单已关闭", C.softGreen, C.green],
      ["Type2 主板信息上报", "整合 PCB / BOARD / SKU 等客户可见字段。", "已上库", C.softGreen, C.green],
      ["Type11 OEM 扩展", "动态上报 TDX 相关 OEM 扩展信息。", "已上库", C.softGreen, C.green],
    ], 72, 206, 1060, 80);
    return slide;
  }

  if (number === 5) {
    header(slide, "01 / WORK RESULTS", "AI 辅助已进入 SMBIOS 开发、验证、AI Review 流程，但仍由工程师确认结果", 5);
    const xs = [80, 292, 504, 716, 928];
    const labels = ["客户规则\n历史实现", "AI 辅助\n生成代码", "自动化\n验证", "AI Review", "人工确认\n经验回流"];
    labels.forEach((label, i) => {
      stage(slide, label, xs[i], 226, 150, i === 0 || i === 4 ? C.ink : C.panel, i === 0 || i === 4 ? "#FFFFFF" : C.ink);
      if (i < labels.length - 1) arrow(slide, xs[i] + 158, 246);
    });
    kpi(slide, 110, 410, 290, "1,504", "行实现代码量", "Type9 相关规模参考", C.blue);
    kpi(slide, 495, 410, 290, "9", "类数据采集", "SMBIOS 自动验证范围", C.green);
    kpi(slide, 880, 410, 290, "0", "正式误报", "当前回归样本范围", C.amber);
    text(slide, "AI 当前定位是辅助实现、辅助验证、辅助复核，不替代工程师判断。", 180, 594, 920, 28, {
      size: 20,
      bold: true,
      color: C.ink,
      align: "center",
    });
    return slide;
  }

  if (number === 6) {
    header(slide, "02 / TYPE9 REFACTOR", "Type9 多版型适配从“重复改代码”转为“维护显示规则”", 6);
    sectionLabel(slide, "改造前", 76, 206, C.red);
    card(slide, 76, 246, 250, 160, { fill: "#FFF2F2" });
    bullet(slide, "板型、部署模式、节点配置散落在代码分支中", 104, 276, 190, { color: C.red, h: 50 });
    bullet(slide, "新增版型需要继续改主流程", 104, 344, 190, { color: C.red, h: 42 });
    sectionLabel(slide, "改造后", 360, 206, C.green);
    card(slide, 360, 246, 250, 160, { fill: C.softGreen });
    bullet(slide, "差异集中到显示规则", 388, 276, 190, { color: C.green, h: 36 });
    bullet(slide, "主流程只负责采集、选择、生成", 388, 334, 190, { color: C.green, h: 48 });
    text(slide, "底层槽位信息 → 统一槽位编号 → 显示规则 → 客户可见槽位名", 82, 460, 520, 50, {
      size: 19,
      bold: true,
      color: C.blue2,
      fill: C.softBlue,
      insets: { left: 18, right: 18, top: 12, bottom: 8 },
      valign: "middle",
    });
    text(slide, "新增版型优先补显示规则，不反复改核心流程；减少现场拼接显示名带来的误显示风险。", 82, 548, 530, 58, {
      size: 18,
      color: C.slate,
    });
    evidence(slide, images.type9Design, 666, 198, 500, 430, "Type9 重构设计截图");
    return slide;
  }

  if (number === 7) {
    header(slide, "02 / SPEC-DRIVEN BUILD", "Type9 重构通过“规格先行、AI 辅助生成、人工验收”完成落地", 7);
    const flow = ["客户规则", "结构化规则", "设计文档", "AI 辅助实现", "编译验证", "人工验收"];
    flow.forEach((f, i) => {
      const x = 72 + (i % 3) * 180;
      const y = 220 + Math.floor(i / 3) * 118;
      stage(slide, f, x, y, 142, i === 3 ? C.ink : C.panel, i === 3 ? "#FFFFFF" : C.ink);
      if (i % 3 < 2) arrow(slide, x + 150, y + 20);
    });
    sectionLabel(slide, "规则点", 72, 486, C.blue);
    bullet(slide, "规则冲突提前报错", 90, 530, 250, { h: 30 });
    bullet(slide, "异常路径可追踪", 90, 572, 250, { h: 30 });
    bullet(slide, "典型版型回归验证", 340, 530, 250, { h: 30 });
    bullet(slide, "人工确认后合入", 340, 572, 250, { h: 30 });
    evidence(slide, images.type9Spec, 676, 198, 490, 430, "SpecCode 输出截图");
    return slide;
  }

  if (number === 8) {
    header(slide, "03 / VALIDATION", "SMBIOS 验证从“人工多环境切换”沉淀为可追踪自动化流程", 8);
    const steps = ["BIOS 上传", "SHA256 校验", "远程刷写", "人工确认", "系统侧采集", "报告生成"];
    steps.forEach((s, i) => {
      const y = 206 + i * 62;
      rect(slide, 78, y + 11, 22, 22, { fill: i === 3 ? C.amber : C.blue });
      text(slide, String(i + 1), 78, y + 14, 22, 16, { size: 12, bold: true, color: "#FFFFFF", align: "center", font: MONO });
      text(slide, s, 122, y + 8, 240, 28, { size: 20, bold: true, color: C.ink });
      if (i < steps.length - 1) rect(slide, 89, y + 37, 1, 28, { fill: C.faint });
    });
    card(slide, 388, 214, 230, 250, { fill: C.panel });
    text(slide, "覆盖范围", 412, 240, 160, 28, { size: 22, bold: true, color: C.ink });
    bullet(slide, "9 类 SMBIOS 数据采集", 416, 294, 170, { h: 32 });
    bullet(slide, "保留刷写前人工确认点", 416, 340, 170, { h: 40, color: C.amber });
    bullet(slide, "输出原始日志和结构化报告", 416, 394, 170, { h: 40 });
    evidence(slide, images.validationLog, 670, 190, 300, 430, "验证日志截图");
    evidence(slide, images.validationDmi, 990, 190, 190, 430, "dmidecode 输出截图");
    return slide;
  }

  if (number === 9) {
    header(slide, "03 / AI REFACTOR", "Type8 / Type11 / Type12 已验证 AI 适合规范化移植", 9);
    const flow = ["客户规则\n旧平台实现", "规则整理", "AI 生成 V5 实现", "人工复核", "编译测试"];
    flow.forEach((f, i) => {
      stage(slide, f, 72 + i * 112, 218, 92, i === 2 ? C.ink : C.panel, i === 2 ? "#FFFFFF" : C.ink);
      if (i < flow.length - 1) text(slide, "→", 166 + i * 112, 238, 20, 26, { size: 20, color: C.blue, bold: true });
    });
    card(slide, 84, 360, 285, 150, { fill: C.ink });
    text(slide, "2.0 天", 112, 386, 90, 38, { size: 30, bold: true, color: "#FFFFFF", font: MONO });
    text(slide, "→", 218, 386, 32, 38, { size: 30, bold: true, color: C.cyan });
    text(slide, "0.5 天", 250, 386, 102, 38, { size: 30, bold: true, color: "#FFFFFF", font: MONO });
    text(slide, "以 Type8 / Type11 / Type12 移植试点为例，正式汇报需标注样本口径。", 112, 448, 190, 42, {
      size: 13,
      color: "#DDE7F5",
    });
    chip(slide, "Type8", 86, 544, 86, C.softBlue, C.blue);
    chip(slide, "Type11", 184, 544, 86, C.softBlue, C.blue);
    chip(slide, "Type12", 282, 544, 86, C.softBlue, C.blue);
    evidence(slide, images.refactorPlan, 640, 190, 265, 430, "任务拆解截图");
    evidence(slide, images.refactorRules, 928, 190, 255, 430, "检查项截图");
    return slide;
  }

  if (number === 10) {
    header(slide, "04 / AI REVIEW", "AI Review 从“结果展示”升级为“过程可回溯的风险处置”", 10);
    sectionLabel(slide, "旧链路", 82, 210, C.muted);
    stage(slide, "触发审查", 86, 260, 118, C.panel);
    arrow(slide, 212, 280);
    stage(slide, "AI 输出结果", 248, 260, 132, C.panel);
    arrow(slide, 388, 280);
    stage(slide, "网页展示评论", 424, 260, 146, C.panel);
    imageSlot(slide, 780, 214, 338, 276, "截图位 1", "AI Review 页面 / 评审结果截图");
    sectionLabel(slide, "新链路", 82, 418, C.blue);
    ["代码变更", "上下文材料", "完整性检查", "风险识别", "复核校验", "AI Review 页面"].forEach((s, i) => {
      stage(slide, s, 86 + i * 108, 478, 90, i === 3 ? C.ink : C.panel, i === 3 ? "#FFFFFF" : C.ink);
      if (i < 5) text(slide, "→", 178 + i * 108, 498, 20, 26, { size: 20, color: C.blue, bold: true });
    });
    rect(slide, 780, 522, 338, 74, { fill: C.softAmber });
    text(slide, "AI Review 留痕", 806, 536, 286, 24, { size: 20, bold: true, color: C.ink });
    text(slide, "保留上下文材料、识别过程和处置记录。", 806, 564, 286, 22, { size: 14, color: C.slate });
    text(slide, "团队仍通过 AI Review 页面查看最终结果；后台增加上下文材料和过程记录，用于解释“为什么报 / 为什么不报”。", 86, 584, 610, 56, {
      size: 17,
      color: C.slate,
    });
    return slide;
  }

  if (number === 11) {
    header(slide, "04 / AI REVIEW VALIDATION", "代表样本回放用于验证风险是否进入 AI Review 可见路径", 11);
    card(slide, 78, 214, 250, 150, { fill: C.panel });
    text(slide, "风险样本", 106, 242, 150, 28, { size: 24, bold: true, color: C.red });
    text(slide, "用历史问题反向还原，观察模型能否识别风险。", 106, 292, 180, 46, { size: 17, color: C.slate });
    card(slide, 360, 214, 250, 150, { fill: C.panel });
    text(slide, "负样本", 388, 242, 150, 28, { size: 24, bold: true, color: C.green });
    text(slide, "用正常兼容性修改和字符串清理，观察是否被误报。", 388, 292, 180, 46, { size: 17, color: C.slate });
    imageSlot(slide, 752, 214, 366, 300, "截图位 2", "风险识别结果 / 正式问题项截图");
    kpi(slide, 78, 430, 200, "4/4", "风险样本识别", "规划阶段触达风险", C.blue);
    kpi(slide, 310, 430, 200, "可见", "处置路径", "部分风险进入正式问题或复核", C.amber);
    kpi(slide, 542, 430, 200, "0", "新增正式误报", "负样本当前范围内", C.green);
    card(slide, 752, 546, 366, 76, { fill: C.ink });
    text(slide, "结论边界", 782, 566, 120, 24, { size: 20, bold: true, color: "#FFFFFF" });
    text(slide, "该页只说明链路改善，不扩大为全场景准确率结论。", 914, 566, 170, 34, { size: 14, color: "#FFFFFF" });
    return slide;
  }

  if (number === 12) {
    header(slide, "NEXT STEP", "下一步聚焦 SMBIOS 可观测问题，沉淀开发生成和测试修复两条 Agent 流程", 12);
    card(slide, 72, 198, 500, 310, { fill: C.panel });
    rect(slide, 72, 198, 500, 8, { fill: C.blue });
    text(slide, "开发阶段工作流", 104, 230, 260, 30, { size: 25, bold: true, color: C.ink });
    text(slide, "需求 / 客户规则 → 规格文档 → opencode skills → AI 辅助生成代码 → 自动化验证 → 人工验收 → 上库", 104, 294, 405, 96, {
      size: 20,
      bold: true,
      color: C.blue2,
    });
    text(slide, "适用：规则清晰、字段边界明确、输出可比对的 SMBIOS 模块。", 104, 430, 386, 38, { size: 16, color: C.slate });
    card(slide, 632, 198, 500, 310, { fill: C.panel });
    rect(slide, 632, 198, 500, 8, { fill: C.green });
    text(slide, "测试问题工作流", 664, 230, 260, 30, { size: 25, bold: true, color: C.ink });
    text(slide, "自动验证发现差异 → Agent 读取日志和代码 → 定位上报路径 → 输出修复建议 → 工程师确认 → 复测回归", 664, 294, 405, 104, {
      size: 20,
      bold: true,
      color: "#087F5B",
    });
    text(slide, "适用：字段缺失、显示异常、客户可见信息不一致、配置开关导致上报缺失。", 664, 430, 396, 48, { size: 16, color: C.slate });
    rect(slide, 72, 546, 1060, 60, { fill: C.ink });
    text(slide, "边界", 100, 566, 62, 22, { size: 18, bold: true, color: "#FFFFFF" });
    text(slide, "不做泛化 BIOS Bug 自动修复；启动失败、硬件链路异常、时序不稳定、偶发平台问题不纳入本轮闭环。", 178, 565, 858, 24, {
      size: 18,
      color: "#FFFFFF",
    });
    text(slide, "验收：选取 2-3 类 SMBIOS 显示 / 字段问题，保留验证报告、定位记录、修复建议、人工确认和复测结果。", 108, 626, 940, 30, {
      size: 15,
      color: C.muted,
    });
    return slide;
  }

  throw new Error(`Unknown slide number: ${number}`);
}
