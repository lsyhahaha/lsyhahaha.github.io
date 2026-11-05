---
title: "Codex 的提示词是一套上下文控制系统"
display_title: "提示词不是一段文本，<br /><em>而是上下文控制系统。</em>"
date: 2026-11-05 11:00:00 +0800
permalink: /notes/openai-codex-prompt-architecture.html
note_id: "002"
organization: OpenAI Codex
topic: Source Analysis
evidence: Public source analysis
source: https://github.com/openai/codex
summary: "生产级 Prompt Engineering 的重点在运行时组装、优先级、状态投影和生命周期管理，而不只是写好一段 System Prompt。"
tags:
  - Prompt Architecture
  - Context Engineering
  - Agent Runtime
---

<section class="summary-box" aria-labelledby="summary-title">
  <p id="summary-title">EVIDENCE SCOPE</p>
  <strong>本文基于公开 Codex 仓库的源码结构与生产路径，不是 OpenAI Research 论文，也不代表未公开线上系统的完整实现。</strong>
</section>

## 01. 从 Prompt 文件到请求上下文

仓库中与 prompt、instruction、context、message 相关的文件很多，但只有一部分真正进入模型请求。分析时需要先排除测试快照、协议类型和普通业务字符串，再沿生产调用链确认每段指令如何被选择、渲染和排序。

> 真正的分析单位不是某个 Markdown 文件，而是一次模型请求最终收到的有序上下文。

## 02. 四层上下文结构

<div class="stack-list">
  <div><span>01</span><h3>Model base</h3><p>根据模型目录和能力假设选择基础指令，不同模型可以拥有不同的默认行为。</p></div>
  <div><span>02</span><h3>Policy & tools</h3><p>注入工具声明、审批策略、可写路径、插件规则和权限边界。</p></div>
  <div><span>03</span><h3>World state</h3><p>投影环境、AGENTS.md、协作模式、当前时间、预算和其他动态上下文。</p></div>
  <div><span>04</span><h3>Lifecycle</h3><p>处理压缩、恢复、模型切换、实时模式和 Agent 间消息。</p></div>
</div>

## 03. Prompt 是状态投影，不是授权系统

权限说明可以告诉模型应该如何行动，但不能成为安全边界。身份、目录权限、审批结果和工具参数必须由宿主系统校验。模型生成的 user ID、路径或“已经获批”文本都不能直接获得信任。

<div class="warning-box"><strong>关键不变量</strong><p>Prompt 可以约束意图，执行层必须约束后果。任何安全结论都需要在模型外部重新验证。</p></div>

## 04. 上下文生命周期

长会话不仅需要裁剪 Token，还需要区分事实历史、压缩摘要和当前动态状态。压缩后的摘要不能获得比原始消息更高的权限，也不能把模型推断升级成已发生事实。

- 原始历史保留事实来源，摘要只是派生表示。
- 模型切换时重新注入适配指令，避免沿用错误能力假设。
- 工具、权限和协作状态变化需要显式更新，而不是依靠旧消息。
- 子 Agent 消息需要标明来源和完成状态，不能伪装成用户指令。

## 05. 工程启示

<ol class="finding-list">
  <li><span>01</span><p>将静态原则与动态状态分离，减少重复 Token 和状态漂移。</p></li>
  <li><span>02</span><p>为每个上下文片段定义来源、优先级、生命周期和失败行为。</p></li>
  <li><span>03</span><p>对最终请求做可观测性，而不是只审查散落的 Prompt 模板。</p></li>
  <li><span>04</span><p>压缩、恢复和模型切换属于核心运行时能力，不是聊天 UI 的附属功能。</p></li>
</ol>
