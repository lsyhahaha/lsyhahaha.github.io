---
title: "长时间应用开发的 Harness 设计"
display_title: "长时间应用开发的<br /><em>Harness 设计</em>"
date: 2026-11-05 10:00:00 +0800
permalink: /notes/anthropic-harness-design.html
note_id: "001"
organization: Anthropic
topic: Harness Engineering
category: Agent
evidence: Official article notes
source: https://www.anthropic.com/research/harness-design-long-running-apps
summary: "长任务不能只依赖模型持续生成代码。规划、实现和验收需要明确的职责边界，并由真实环境中的证据决定是否完成。"
tags:
  - Agent Harness
  - Evaluation
  - Context Management
---

<section class="summary-box" aria-labelledby="summary-title">
  <p id="summary-title">TL;DR</p>
  <strong>最值得借鉴的不是“三 Agent”形式，而是可验证完成契约、独立评价、真实系统验收和强制返工形成的闭环。</strong>
</section>

## 01. 朴素长任务为什么失效

随着上下文增长，Agent 容易忘记早期约束、产生前后不一致、偏离目标或提前宣告完成。另一个更棘手的问题是：生成代码的 Agent 往往高估自己的成果，把存在按钮、函数或页面当作功能已经可用。

<div class="comparison-grid">
  <div><h3>Context degradation</h3><p>旧信息被淹没，约束逐渐失真，长任务后期容易草率收尾。</p></div>
  <div><h3>Self-evaluation bias</h3><p>生成者倾向为自己的实现辩护，难以稳定发现端到端缺陷。</p></div>
</div>

## 02. 三类职责

<ol class="role-list">
  <li><span>Planner</span><p>把简短需求扩展成产品目标、用户故事、功能范围与视觉方向，但避免过早锁死底层实现。</p></li>
  <li><span>Generator</span><p>实现约定范围，自检后提交可运行系统，而不是仅提交代码片段或完成声明。</p></li>
  <li><span>Evaluator</span><p>像真实用户一样操作 UI，检查 API 和数据状态，并根据硬性阈值决定通过或返工。</p></li>
</ol>

## 03. Sprint Contract

Sprint Contract 把高层产品目标转换成当前迭代可执行、可验证的完成定义。编码开始前需要明确：

- 本轮实现哪些内容，以及明确不实现什么。
- 用户能观察到哪些完成行为。
- Evaluator 如何验证 UI、API 与数据副作用。
- 哪些情况必须判定失败，不能用其他亮点抵消。

> 功能入口存在，不等于功能真正可用。

## 04. 上下文治理

**Compaction** 压缩旧对话，让同一个 Agent 保持连续工作；**Context Reset** 则启动新 Agent，并依靠结构化交接恢复状态。后者更干净，但增加 Token、延迟和编排复杂度。

交接材料至少需要记录：已完成内容、当前系统状态、未完成任务、已知问题、下一步操作和验证证据。文件通信适合实验，生产系统还需要原子更新、版本控制、并发隔离与失败恢复。

## 05. 成本与适用边界

文章中的完整 Harness 用显著增加的时间和 Token 成本换取更高的复杂应用完整性。这证明严格规划和外部验收能够改善结果，但不能直接推出它适合普通业务，也不能证明投入产出比必然更高。

<div class="warning-box"><strong>不要固化 Harness。</strong><p>每个组件都代表对“当前模型做不到什么”的假设。模型升级后应重新消融，删除不再创造价值的 Sprint、上下文重置或多 Agent 结构。</p></div>

## 06. 我的工程结论

<ol class="finding-list">
  <li><span>01</span><p>把“完成”定义成业务系统能够验证的契约。</p></li>
  <li><span>02</span><p>不要信任 Agent 的自我完成声明；验证真实 UI、API 和数据库状态。</p></li>
  <li><span>03</span><p>由业务系统掌握验收、权限和状态迁移，模型只提出候选行动。</p></li>
  <li><span>04</span><p>根据任务风险选择 Evaluator，不为低风险任务支付固定的高昂编排成本。</p></li>
</ol>
