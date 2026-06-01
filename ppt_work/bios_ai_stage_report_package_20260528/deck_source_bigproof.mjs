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
const PACKAGE_ASSET = "/Users/tzy/code/personal-coach/ppt_work/bios_ai_stage_report_package_20260528/evidence";

const images = {
  type9Design: `${ASSET}/slide14_type9_multi_board_refactor_03.png`,
  type9Flow: `${ASSET}/slide14_type9_multi_board_refactor_02.png`,
  type9Spec: `${ASSET}/slide14_type9_multi_board_refactor_01.png`,
  validationLog: `${ASSET}/slide13_smbios_validation_auto_02.png`,
  validationDmi: `${ASSET}/slide13_smbios_validation_auto_01.png`,
  refactorPlan: `${ASSET}/slide12_type8_11_12_ai_refactor_01.png`,
  refactorRules: `${ASSET}/slide12_type8_11_12_ai_refactor_02.png`,
  aiReviewContext: `${PACKAGE_ASSET}/ai_review_docx_images/image3.png`,
  aiReviewResult: `${PACKAGE_ASSET}/ai_review_docx_images/image2.png`,
  aiReviewRiskRecord: `${PACKAGE_ASSET}/ai_review_wait_confirm_risk_record.jpg`,
};

const dims = {
  [images.type9Design]: [582, 804],
  [images.type9Flow]: [591, 812],
  [images.type9Spec]: [576, 801],
  [images.validationLog]: [599, 873],
  [images.validationDmi]: [619, 685],
  [images.refactorPlan]: [573, 854],
  [images.refactorRules]: [573, 605],
  [images.aiReviewContext]: [489, 766],
  [images.aiReviewResult]: [666, 727],
  [images.aiReviewRiskRecord]: [645, 732],
};

const dataUrlCache = new Map();
let currentPublicPage = null;

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
  text(slide, String(currentPublicPage ?? page).padStart(2, "0"), 1160, 54, 48, 28, {
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

async function createOriginalSlide(presentation, _ctx, number) {
  const slide = slideBase(presentation);

  if (number === 1) {
    rect(slide, 72, 112, 14, 430, { fill: C.blue });
    text(slide, "5月月度汇报", 112, 140, 740, 76, {
      size: 62,
      bold: true,
      color: C.ink,
    });
    text(slide, "BIOS / SMBIOS 适配与 AI 辅助工程闭环", 112, 224, 760, 48, {
      size: 32,
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
    text(slide, "BIOS 腾讯组", 112, 526, 220, 28, {
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
    header(slide, "EXECUTIVE SUMMARY", "本阶段完成客户可见信息适配，并跑通 SMBIOS 场景的 AI 辅助工程最小闭环", 2);
    const cards = [
      ["客户问题闭环", "V3 遗留显示问题与 V5 新增问题单进入阶段处理，客户可见字段按需求适配。", C.blue],
      ["AI 辅助提效", "Type8 / Type9 / Type11 / Type12 等 SMBIOS 模块进入 AI 辅助重构流程。", C.green],
      ["AI Review 能力建设", "SMBIOS 自动验证和 AI Review 开始沉淀日志、报告、上下文材料和风险处置记录。", C.amber],
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
    text(slide, "当前 AI 提效聚焦 SMBIOS 场景，优先选择规则清晰、结果可比对、可复测的问题。", 224, 522, 880, 28, {
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
    header(slide, "01 / WORK RESULTS", "V5 SMBIOS 客户可见字段适配和新增问题单完成阶段交付与持续推进", 4);
    miniTable(slide, [
      ["V3 遗留问题闭环", "修复 7 项 SMBIOS 显示问题，覆盖显示名异常、字段缺失、不显示等。", "已上库", C.softGreen, C.green],
      ["V5 新增问题单", "覆盖 Type41 显示缺失、不插设备 boot 启动黑屏等问题。", "进行中", C.softAmber, C.amber],
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
    kpi(slide, 110, 410, 290, "2700+", "行实现 / 重构代码量", "SMBIOS 相关规模参考", C.blue);
    kpi(slide, 495, 410, 290, "9", "类数据采集", "SMBIOS 自动验证范围", C.green);
    kpi(slide, 880, 410, 290, "降低", "内存类问题风险", "越界 / 泄漏 / 空指针", C.amber);
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
    text(slide, "新增版型优先补显示规则，不反复改核心流程，提升复用性、减少维护时间；同时降低误显示风险。", 82, 548, 530, 58, {
      size: 18,
      color: C.slate,
    });
    evidence(slide, images.type9Design, 666, 198, 500, 430, "Type9 重构设计截图");
    return slide;
  }

  if (number === 7) {
    header(slide, "02 / SPEC-DRIVEN BUILD", "Type9 重构通过“规格先行、AI 生成代码、人工验收”完成落地", 7);
    const flow = ["客户需求\n架构边界", "结构化规则", "设计文档", "AI 生成代码", "编译验证", "人工验收"];
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
    header(slide, "03 / VALIDATION", "SMBIOS 验证从“人工多环境切换”沉淀为基于 opencode skills 的可追踪自动化流程", 8);
    sectionLabel(slide, "旧方式", 72, 204, C.muted);
    card(slide, 72, 244, 248, 136, { fill: C.panel });
    text(slide, "人工刷写 + 手动比对", 100, 268, 180, 24, { size: 19, bold: true, color: C.ink });
    text(slide, "手动切换环境、执行 dmidecode、整理日志，每一步都需要人工确认。", 100, 306, 174, 46, { size: 14, color: C.slate });
    sectionLabel(slide, "新方式", 72, 414, C.blue);
    card(slide, 72, 454, 248, 146, { fill: C.softBlue });
    text(slide, "opencode + skills", 100, 478, 180, 24, { size: 19, bold: true, color: C.ink });
    text(slide, "将上传、校验、刷写、采集、报告生成串成可重复流程，并可与 AI 辅助开发联动。", 100, 516, 174, 54, { size: 14, color: C.slate });

    const steps = ["BIOS 上传", "SHA256 校验", "远程刷写", "人工确认", "系统侧采集", "报告生成"];
    steps.forEach((s, i) => {
      const y = 206 + i * 62;
      rect(slide, 374, y + 11, 22, 22, { fill: i === 3 ? C.amber : C.blue });
      text(slide, String(i + 1), 374, y + 14, 22, 16, { size: 12, bold: true, color: "#FFFFFF", align: "center", font: MONO });
      text(slide, s, 416, y + 8, 210, 28, { size: 19, bold: true, color: C.ink });
      if (i < steps.length - 1) rect(slide, 385, y + 37, 1, 28, { fill: C.faint });
    });
    evidence(slide, images.validationLog, 670, 190, 300, 430, "验证日志截图");
    evidence(slide, images.validationDmi, 990, 190, 190, 430, "dmidecode 输出截图");
    return slide;
  }

  if (number === 9) {
    header(slide, "03 / AI REFACTOR", "Type8 / Type11 / Type12 已验证 AI 适合规范化移植", 9);
    const flow = ["客户规则\n脚本提取", "边界约束", "AI 生成 V5 代码", "人工复核", "编译测试"];
    flow.forEach((f, i) => {
      stage(slide, f, 72 + i * 112, 218, 92, i === 2 ? C.ink : C.panel, i === 2 ? "#FFFFFF" : C.ink);
      if (i < flow.length - 1) text(slide, "→", 166 + i * 112, 238, 20, 26, { size: 20, color: C.blue, bold: true });
    });
    card(slide, 84, 360, 285, 150, { fill: C.ink });
    text(slide, "5.0 天", 112, 386, 90, 38, { size: 30, bold: true, color: "#FFFFFF", font: MONO });
    text(slide, "→", 218, 386, 32, 38, { size: 30, bold: true, color: C.cyan });
    text(slide, "2.0 天", 250, 386, 102, 38, { size: 30, bold: true, color: "#FFFFFF", font: MONO });
    text(slide, "以 Type8 / Type11 / Type12 移植试点为例。", 112, 448, 190, 42, {
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
    header(slide, "04 / AI REVIEW", "AI Review 新增上下文完整性检查，降低模型只看局部 diff 的漏判风险", 10);
    sectionLabel(slide, "旧方式", 72, 204, C.muted);
    card(slide, 72, 244, 236, 126, { fill: C.panel });
    text(slide, "diff + 固定规则", 100, 268, 170, 26, { size: 20, bold: true, color: C.ink });
    text(slide, "评论较少时，不容易判断是没有风险，还是上下文不够。", 100, 310, 166, 42, { size: 14, color: C.slate });

    sectionLabel(slide, "当前方式", 72, 406, C.blue);
    const flow10 = ["代码变更", "上下文收集", "完整性检查", "受控分析", "证据补充", "AI Review"];
    flow10.forEach((s, i) => {
      const x = 72 + (i % 3) * 94;
      const y = 446 + Math.floor(i / 3) * 74;
      stage(slide, s, x, y, 74, i === 2 ? C.ink : C.panel, i === 2 ? "#FFFFFF" : C.ink);
      if (i % 3 < 2) text(slide, "→", x + 76, y + 20, 16, 24, { size: 16, color: C.blue, bold: true });
    });

    const caps = [
      ["上下文材料", "补充变更文件、函数窗口、EDK 元数据和上报链路。", C.blue],
      ["完整性检查", "记录模块、配置、调用链和上报路径是否足够。", C.green],
      ["过程留痕", "输出上下文覆盖记录，管理员可回看缺什么、补了什么。", C.amber],
    ];
    caps.forEach((c, i) => {
      const y = 214 + i * 116;
      rect(slide, 354, y, 330, 88, { fill: i === 0 ? C.softBlue : i === 1 ? C.softGreen : C.softAmber });
      text(slide, c[0], 382, y + 18, 130, 24, { size: 21, bold: true, color: C.ink });
      text(slide, c[1], 382, y + 48, 260, 28, { size: 14, color: C.slate });
    });

    evidence(slide, images.aiReviewContext, 736, 190, 360, 290, "AI Review 上下文材料与 planner 记录");
    miniTable(slide, [
      ["真实提交回放", "6 个 case 成功运行", "已验证", C.softGreen, C.green],
      ["历史问题反向样本", "4 / 4 在中间过程触达预期风险", "触达", C.softBlue, C.blue],
      ["negative 负样本", "2 个正常改动未进入正式问题", "无正式误报", C.softGreen, C.green],
    ], 736, 494, 360, 38);

    text(slide, "重点不是页面换样式，而是审查前先判断材料是否足够；评论为空也能区分“无明确问题”还是“上下文 / 证据不足”。", 72, 626, 620, 32, {
      size: 15,
      color: C.slate,
    });
    return slide;
  }

  if (number === 11) {
    header(slide, "04 / AI REVIEW VALIDATION", "管理员界面将模型看到的风险沉淀为可见、可追踪、可复盘的处置记录", 11);
    const top = [
      ["问题断点", "早期能在分析过程看到风险，但正式评论可能只有一部分。", C.red],
      ["修复动作", "新增管理员界面的台账检查，要求每条风险都有正式问题、待确认或排除记录。", C.blue],
      ["结果收益", "风险从中间过程进入可见结果，后台能解释为什么保留或排除。", C.green],
    ];
    top.forEach((c, i) => {
      const x = 72 + i * 244;
      rect(slide, x, 206, 216, 104, { fill: i === 0 ? "#FFF2F2" : i === 1 ? C.softBlue : C.softGreen });
      text(slide, c[0], x + 20, 226, 120, 24, { size: 21, bold: true, color: C.ink });
      text(slide, c[1], x + 20, 264, 170, 34, { size: 13.5, color: C.slate });
    });

    card(slide, 72, 344, 686, 206, { fill: C.panel });
    text(slide, "代表样本回放", 96, 366, 180, 24, { size: 20, bold: true, color: C.ink });
    const sampleRows = [
      ["RF001", "固定 buffer 风险", "正式问题"],
      ["RF003", "链路异常处理风险", "正式问题 + 后台追踪"],
      ["RF004", "长度和异常上报风险", "2 个正式问题 + 待确认"],
      ["NEG001", "MFGID 正常扩展", "无用户可见正式评论"],
      ["NEG002", "字符串清理", "无用户可见正式评论"],
    ];
    sampleRows.forEach((r, i) => {
      const y = 406 + i * 28;
      rect(slide, 96, y, 638, 24, { fill: i % 2 ? "#F6F8FC" : "#FFFFFF" });
      text(slide, r[0], 110, y + 4, 58, 14, { size: 11.5, bold: true, color: C.blue, font: MONO });
      text(slide, r[1], 184, y + 4, 250, 14, { size: 12.5, color: C.slate });
      text(slide, r[2], 458, y + 4, 250, 14, { size: 12.5, bold: true, color: i < 3 ? C.ink : C.green });
    });

    evidence(slide, images.aiReviewRiskRecord, 814, 196, 300, 288, "AI Review 待确认项与后台处置记录");
    kpi(slide, 804, 504, 150, "3/3", "风险样本可见", "RF 样本", C.blue);
    kpi(slide, 982, 504, 150, "0", "新增正式误报", "NEG 当前样本", C.green);
    rect(slide, 72, 654, 1060, 44, { fill: C.ink });
    text(slide, "边界", 100, 666, 60, 18, { size: 16, bold: true, color: "#FFFFFF" });
    text(slide, "可以看出代表样本回放改善；后续继续添加实际案例进行迭代，不扩大为全场景准确率结论。", 174, 664, 830, 20, { size: 15, color: "#FFFFFF" });
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

function proofNote(slide, title, body, x, y, w, color = C.blue) {
  rect(slide, x, y, w, 106, { fill: C.panel });
  rect(slide, x, y, 8, 106, { fill: color });
  text(slide, title, x + 24, y + 18, w - 48, 24, { size: 20, bold: true, color: C.ink });
  text(slide, body, x + 24, y + 52, w - 48, 34, { size: 14.5, color: C.slate });
}

function proofImage(slide, src, x, y, w, h, label) {
  evidence(slide, src, x, y, w, h, label);
}

function createProofSlide(presentation, page, section, title, items, notes = []) {
  const slide = slideBase(presentation);
  header(slide, section, title, page);
  items.forEach((item) => proofImage(slide, item.src, item.x, item.y, item.w, item.h, item.label));
  return slide;
}

function createSingleProofSlide(presentation, page, section, title, src, label, noteTitle, noteBody) {
  const slide = slideBase(presentation);
  header(slide, section, title, page);
  proofNote(slide, noteTitle, noteBody, 86, 214, 310, C.blue);
  proofImage(slide, src, 430, 178, 430, 500, label);
  rect(slide, 902, 226, 206, 150, { fill: C.softBlue });
  text(slide, "放大证据页", 930, 252, 150, 26, { size: 22, bold: true, color: C.ink, align: "center" });
  text(slide, "截图作为本页主体，正文页只保留结论和价值。", 930, 300, 150, 44, { size: 15, color: C.slate, align: "center" });
  return slide;
}

const insertedProofMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  8: 7,
  10: 8,
  12: 9,
  14: 10,
  16: 11,
  18: 12,
};

export async function createSlide(presentation, ctx, number) {
  if (insertedProofMap[number]) {
    currentPublicPage = number;
    try {
      return await createOriginalSlide(presentation, ctx, insertedProofMap[number]);
    } finally {
      currentPublicPage = null;
    }
  }

  if (number === 7) {
    return createProofSlide(
      presentation,
      7,
      "02 / TYPE9 EVIDENCE",
      "Type9 规则重构证据页：把多版型差异集中到可维护的规则定义",
      [
        { src: images.type9Design, x: 138, y: 184, w: 430, h: 470, label: "Type9 多版型重构设计截图" },
        { src: images.type9Flow, x: 672, y: 184, w: 430, h: 470, label: "Type9 主流程与匹配关系截图" },
      ],
      [
        ["看什么", "重点看版型规则、SlotNumber、显示名之间的对应关系被集中管理。", C.blue],
        ["为什么", "后续新增版型优先补规则，不反复改主流程。", C.green],
        ["汇报口径", "提高代码复用性，降低丝印误显示风险。", C.amber],
      ]
    );
  }

  if (number === 9) {
    return createSingleProofSlide(
      presentation,
      9,
      "02 / TYPE9 SPECCODE",
      "Type9 规格驱动证据页：先结构化客户规则，再让 AI 辅助实现",
      images.type9Spec,
      "SpecCode 规格驱动实现截图",
      "放大的目的",
      "这页给听众看清楚：不是直接让 AI 写代码，而是先把客户规则整理成规格。"
    );
  }

  if (number === 11) {
    return createProofSlide(
      presentation,
      11,
      "03 / SMBIOS VERIFY EVIDENCE",
      "SMBIOS 自动验证证据页：日志和 dmidecode 输出可以直接追溯",
      [
        { src: images.validationLog, x: 154, y: 178, w: 400, h: 500, label: "自动验证日志截图" },
        { src: images.validationDmi, x: 680, y: 178, w: 420, h: 500, label: "dmidecode 采集结果截图" },
      ],
      [
        ["看什么", "刷写、采集、报告生成都有过程记录。", C.blue],
        ["价值", "人工黑盒验证转为可追溯的半自动流程。", C.green],
      ]
    );
  }

  if (number === 13) {
    return createProofSlide(
      presentation,
      13,
      "03 / TYPE8 TYPE11 TYPE12 EVIDENCE",
      "Type8 / Type11 / Type12 重构证据页：规则清晰的模块适合 AI 辅助移植",
      [
        { src: images.refactorPlan, x: 160, y: 178, w: 400, h: 500, label: "任务拆解与实现计划截图" },
        { src: images.refactorRules, x: 672, y: 178, w: 420, h: 500, label: "规范检查项与验证截图" },
      ],
      [
        ["看什么", "AI 先拆任务，再按规则补代码和检查项。", C.blue],
        ["边界", "仍需要人工验收，不宣传自动替代人工。", C.amber],
      ]
    );
  }

  if (number === 15) {
    return createProofSlide(
      presentation,
      15,
      "04 / AI REVIEW EVIDENCE",
      "AI Review 上下文证据页：审查前先补齐材料，再输出结果",
      [
        { src: images.aiReviewContext, x: 140, y: 178, w: 430, h: 500, label: "上下文材料与 planner 记录" },
        { src: images.aiReviewResult, x: 672, y: 178, w: 430, h: 500, label: "最终 Review 页面统计截图" },
      ],
      [
        ["看什么", "模型审查前先理解模块、配置链路和上下文材料。", C.blue],
        ["结果", "正式问题、待确认项和校验状态进入页面展示。", C.green],
      ]
    );
  }

  if (number === 17) {
    return createSingleProofSlide(
      presentation,
      17,
      "04 / AI REVIEW RISK EVIDENCE",
      "AI Review 风险处置证据页：待确认项也能被保留和复盘",
      images.aiReviewRiskRecord,
      "待确认项与后台处置记录截图",
      "看什么",
      "这张图说明风险没有被静默丢掉，而是经过判断后降级为待确认记录。"
    );
  }

  throw new Error(`Unknown slide number: ${number}`);
}
