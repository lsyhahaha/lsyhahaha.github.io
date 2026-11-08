---
title: "机器学习到底在学习什么"
display_title: "机器学习到底<br /><em>在学习什么？</em>"
date: 2026-11-08 13:00:00 +0800
permalink: /notes/what-machine-learning-learns.html
note_id: "003"
organization: ML Foundations
topic: Supervised Learning
category: Machine Learning
evidence: Course notes + official docs
source: https://cs229.stanford.edu/main_notes.pdf
summary: "训练模型不是把训练误差压到最低，而是在明确的数据、假设空间和损失函数下，寻找能够泛化到未见样本的预测规则。"
tags:
  - Supervised Learning
  - Generalization
  - Empirical Risk Minimization
  - Linear Regression
---

<section class="summary-box" aria-labelledby="summary-title">
  <p id="summary-title">TL;DR</p>
  <strong>机器学习真正要优化的是未见数据上的损失。训练误差只是可计算的代理目标；没有独立评估和简单基线，再漂亮的训练结果也不能证明模型有用。</strong>
</section>

## 01. “学习”不是记住训练答案

监督学习从一组输入与目标的配对样本开始：

<div class="formula">
  <math display="block" aria-label="S 等于由 x_i 和 y_i 组成的 n 个训练样本集合">
    <mi>S</mi><mo>=</mo><mo>{</mo>
    <mo>(</mo><msub><mi>x</mi><mn>1</mn></msub><mo>,</mo><msub><mi>y</mi><mn>1</mn></msub><mo>)</mo><mo>,</mo>
    <mo>(</mo><msub><mi>x</mi><mn>2</mn></msub><mo>,</mo><msub><mi>y</mi><mn>2</mn></msub><mo>)</mo><mo>,</mo>
    <mo>…</mo><mo>,</mo>
    <mo>(</mo><msub><mi>x</mi><mi>n</mi></msub><mo>,</mo><msub><mi>y</mi><mi>n</mi></msub><mo>)</mo>
    <mo>}</mo>
  </math>
</div>

学习算法要从一组允许的函数中选择一个模型 `h`，让 `h(x)` 能够预测对应的 `y`。Stanford CS229 对监督学习的定义也是如此：给定训练集，学习一个从输入空间到输出空间的函数，使其成为目标值的良好预测器。这里至少存在四个不能省略的对象：

<div class="stack-list">
  <div><span>01</span><h3>Data</h3><p>样本决定模型看到了什么，也限定了结论适用的人群、时间和环境。</p></div>
  <div><span>02</span><h3>Hypothesis space</h3><p>算法只能在预先允许的函数集合中选择；线性模型不会凭空获得任意非线性能力。</p></div>
  <div><span>03</span><h3>Loss</h3><p>损失函数定义一次预测错了多少，也把业务偏好转化成可优化目标。</p></div>
  <div><span>04</span><h3>Target distribution</h3><p>最终关心的是未来样本，而不是已经看过的训练记录。</p></div>
</div>

因此，模型不会脱离人为设定的目标“自己发现真理”。数据采集、函数选择和损失设计共同决定了它能学到什么。

## 02. 训练误差只是代理目标

对给定训练集，我们可以计算平均训练损失，也叫经验风险：

<div class="formula">
  <math display="block" aria-label="经验风险 R S hat 等于 n 分之一乘以从 i 等于一到 n 的损失函数之和">
    <msub><mover accent="true"><mi>R</mi><mo>^</mo></mover><mi>S</mi></msub><mo>(</mo><mi>h</mi><mo>)</mo>
    <mo>=</mo>
    <mfrac><mn>1</mn><mi>n</mi></mfrac>
    <munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover>
    <mi>ℓ</mi><mo>(</mo><mi>h</mi><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo><mo>,</mo><msub><mi>y</mi><mi>i</mi></msub><mo>)</mo>
  </math>
</div>

经验风险最小化（ERM）选择训练损失较小的模型。问题是，我们真正想知道的总体风险依赖尚未看到的数据分布，训练时不能直接完整计算：

<div class="formula">
  <math display="block" aria-label="总体风险 R h 等于来自分布 D 的 x y 上损失函数的期望">
    <mi>R</mi><mo>(</mo><mi>h</mi><mo>)</mo><mo>=</mo>
    <msub><mi>𝔼</mi><mrow><mo>(</mo><mi>x</mi><mo>,</mo><mi>y</mi><mo>)</mo><mo>∼</mo><mi>D</mi></mrow></msub>
    <mo>[</mo><mi>ℓ</mi><mo>(</mo><mi>h</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>,</mo><mi>y</mi><mo>)</mo><mo>]</mo>
  </math>
</div>

[CS229 学习理论讲义](https://cs229.stanford.edu/main_notes.pdf)区分了训练误差与泛化误差。把训练损失降下来是手段，不是最终成功标准。一个容量足够大的模型可以记住训练标签，却在新样本上失败。

> 训练误差回答“模型多贴合已见样本”；泛化误差才回答“模型面对未来数据是否仍然有效”。

## 03. 三份数据，三种职责

<div class="comparison-grid comparison-grid-three">
  <div><h3>Train</h3><p>拟合模型参数，也负责拟合标准化、缺失值填充、特征选择等所有会从数据中学习的步骤。</p></div>
  <div><h3>Validation</h3><p>选择模型、特征、超参数和阈值。交叉验证是训练数据内部更充分的估计方式。</p></div>
  <div><h3>Test</h3><p>开发决策完成后，只用于评估完整预测流程；不能再反过来指导调参。</p></div>
</div>

[scikit-learn 的交叉验证指南](https://scikit-learn.org/stable/modules/cross_validation.html)明确指出，在拟合数据上评估模型是方法错误；反复根据测试集选择超参数，也会对测试集过拟合。

切分顺序同样重要。标准化、插补、PCA 和特征选择都必须只在训练数据上 `fit`，再对验证集和测试集 `transform`。否则，未来信息会通过预处理进入训练过程，产生数据泄漏。scikit-learn 的[常见陷阱指南](https://scikit-learn.org/stable/common_pitfalls.html)建议用 Pipeline 把预处理与模型绑定，降低泄漏风险。

## 04. 欠拟合与过拟合不是模型标签

- **欠拟合**：训练误差和验证误差都较高，说明模型、特征或训练过程没有捕捉到有效结构。
- **过拟合**：训练误差很低，但验证误差明显更高，说明模型把训练数据中的偶然噪声也当成了规律。
- **泛化**：模型在未参与拟合和选择的新样本上，仍能保持可接受的损失。

“神经网络一定过拟合”或“线性模型一定欠拟合”都不是严谨判断。这些现象只能在具体数据、特征、训练流程和评价指标下，通过训练—验证行为来识别。scikit-learn 的[多项式回归示例](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)直观展示了模型复杂度过低和过高的两种失败方式。

## 05. 手算一次线性回归

假设只有三个训练样本：`(1, 2)`、`(2, 3)`、`(3, 5)`。我们选择一元线性模型：

<div class="formula">
  <math display="block" aria-label="h x 等于 w x 加 b">
    <mi>h</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mi>w</mi><mi>x</mi><mo>+</mo><mi>b</mi>
  </math>
</div>

以均方误差为损失。因为 `x̄ = 2`、`ȳ = 10/3`，最小二乘解为：

<div class="formula formula-system">
  <math display="block" aria-label="w 的最小二乘解等于协方差项除以 x 的离差平方和，结果为二分之三">
    <mi>w</mi><mo>=</mo>
    <mfrac>
      <mrow><mo>∑</mo><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>−</mo><mover accent="true"><mi>x</mi><mo>¯</mo></mover><mo>)</mo><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>−</mo><mover accent="true"><mi>y</mi><mo>¯</mo></mover><mo>)</mo></mrow>
      <mrow><mo>∑</mo><msup><mrow><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>−</mo><mover accent="true"><mi>x</mi><mo>¯</mo></mover><mo>)</mo></mrow><mn>2</mn></msup></mrow>
    </mfrac>
    <mo>=</mo><mfrac><mn>3</mn><mn>2</mn></mfrac>
  </math>
  <math display="block" aria-label="b 等于 y bar 减去 w 乘以 x bar，结果为三分之一">
    <mi>b</mi><mo>=</mo><mover accent="true"><mi>y</mi><mo>¯</mo></mover><mo>−</mo><mi>w</mi><mover accent="true"><mi>x</mi><mo>¯</mo></mover><mo>=</mo><mfrac><mn>1</mn><mn>3</mn></mfrac>
  </math>
</div>

最终模型是 `h(x) = 1.5x + 1/3`。它对三个样本的预测分别为 `11/6`、`10/3`、`29/6`，训练 MSE 为 `1/18 ≈ 0.0556`。

这个过程里的“学习”，就是在允许的线性函数集合中，选择使训练 MSE 最小的 `w` 和 `b`。它没有证明变量之间存在因果关系，也没有证明同一条直线适用于未来环境。

## 06. 没有 baseline，指标没有坐标系

若回归 baseline 永远预测训练目标的均值 `10/3`，本例的训练 MSE 是 `14/9 ≈ 1.5556`。线性模型在这三个点上明显优于均值策略，至少说明输入 `x` 在当前训练样本中提供了额外信息。

但这仍然不是泛化证据：样本只有三个，没有独立测试数据，也没有验证未来数据来自相同分布。[DummyRegressor 官方文档](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyRegressor.html)把这类忽略输入特征的简单规则定义为基线；它的作用是建立最低参照，而不是给上线决策盖章。

<div class="warning-box"><strong>不要只报告一个分数</strong><p>一个可信结果至少要同时说明：数据来源、切分协议、完整预测流程、评价指标、baseline、随机性处理和适用边界。生产决策还要考虑错误成本、延迟、稳定性、公平性与分布漂移。</p></div>

## 07. 第一阶段的工程判断

<ol class="finding-list">
  <li><span>01</span><p>训练目标是可计算的代理；真实目标是未见数据上的表现。</p></li>
  <li><span>02</span><p>预处理也是模型的一部分，必须遵守训练数据边界。</p></li>
  <li><span>03</span><p>测试集参与选择后，就不再是独立的最终测试集。</p></li>
  <li><span>04</span><p>先击败合理 baseline，再讨论复杂模型是否值得增加成本。</p></li>
</ol>

下一篇将进入线性回归：从损失曲面、解析解与梯度下降三个角度，理解优化算法究竟在做什么。

