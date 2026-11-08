# 《机器学习到底在学习什么》研究底稿

> 用途：机器学习系列第一篇博客的事实与推导底稿。本文不是发布稿；所有外部事实尽量追溯到课程讲义或项目官方文档。

## 1. 核心结论

机器学习不是让计算机“记住答案”，而是在给定数据、假设空间和损失函数后，选择一个函数，使它对未见过、但来自目标分布的数据也能产生较小损失。

这句话包含四个不可省略的对象：

1. **数据**：监督学习的训练集由输入与目标组成，记作 \(S=\{(x^{(i)},y^{(i)})\}_{i=1}^{n}\)。
2. **假设空间**：学习算法只能从预先允许的函数集合 \(\mathcal H\) 中选择模型。
3. **损失函数**：\(\ell(h(x),y)\) 定义一次预测“错了多少”。
4. **目标分布**：真正关心的是模型在未来未见样本上的期望损失，不只是训练集损失。

Stanford CS229 将监督学习形式化为：给定训练集，学习函数 \(h:\mathcal X\to\mathcal Y\)，使 \(h(x)\) 成为对应 \(y\) 的良好预测器。[CS229 Notes 1](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)

## 2. 经验风险最小化不是最终目标

训练时可以计算经验风险：

\[
\hat R_S(h)=\frac{1}{n}\sum_{i=1}^{n}\ell(h(x^{(i)}),y^{(i)}).
\]

经验风险最小化（ERM）从假设空间中选择：

\[
\hat h\in\arg\min_{h\in\mathcal H}\hat R_S(h).
\]

CS229 的学习理论讲义用同样的形式定义 ERM：学习算法从 \(\mathcal H\) 中选择训练误差最小的假设。[CS229 Main Notes, learning theory](https://cs229.stanford.edu/main_notes.pdf)

但实际目标是总体风险（或泛化误差）：

\[
R(h)=\mathbb E_{(x,y)\sim D}[\ell(h(x),y)].
\]

这里的 \(D\) 是未来数据的目标分布。CS229 的泛化章节明确区分训练损失（empirical risk）与未见测试样本上的期望损失（population risk），并指出最小化训练损失只是获得预测模型的手段，而不是最终目标。[CS229 Generalization chapter](https://cs229.stanford.edu/notes2022fall/main_notes.pdf?forcedefault=true)

因此，“训练损失下降”只说明模型更贴合已有样本；它本身不能证明模型学到了可泛化规律。

## 3. 训练集、验证集与测试集的职责

| 数据集合 | 允许的用途 | 不应承担的用途 |
| --- | --- | --- |
| 训练集 | 拟合模型参数；拟合预处理器 | 最终无偏评估 |
| 验证集 / 交叉验证折 | 选择模型、特征、超参数和决策阈值 | 反复调参后再宣称为最终测试结果 |
| 测试集 | 在开发决策完成后估计最终流程的泛化性能 | 拟合、预处理、选模型或调参 |

scikit-learn 官方文档指出，在用于拟合的数据上测试是方法错误：记忆训练标签的模型也可能获得完美训练分数，却无法预测未见数据；当用测试集反复选择超参数时，也会对测试集过拟合。[Cross-validation: evaluating estimator performance](https://scikit-learn.org/stable/modules/cross_validation.html)

数据切分必须发生在会“学习数据”的预处理之前。标准化、缺失值填充、PCA、特征选择等步骤只能在训练数据上 `fit`，再对验证/测试数据 `transform`。否则测试信息会泄漏进模型，形成过于乐观的结果。[Common pitfalls: data leakage](https://scikit-learn.org/stable/common_pitfalls.html)

工程表达上，测试对象不是一个孤立 estimator，而应是完整预测流程：预处理、特征转换、模型和后处理。

## 4. 泛化、欠拟合与过拟合

- **泛化**：模型在未参与训练和选择的、来自目标分布的新样本上仍保持可接受损失。
- **欠拟合**：模型、特征或训练过程不足以捕捉数据中的有效结构，常表现为训练误差与验证误差都高。
- **过拟合**：模型把有限训练集中的偶然噪声也当成规律，训练误差很低，但验证/测试误差较高。

这不是仅凭模型名称就能判断的属性，必须在固定数据流程和评价指标下比较训练与验证行为。scikit-learn 的官方多项式回归示例展示：低阶模型无法拟合信号，高阶模型则可能学习训练噪声；示例通过交叉验证衡量未见数据上的误差。[Underfitting vs. Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)

## 5. 为什么必须有 baseline

一个分数脱离参照系没有解释力。分类问题至少可以与多数类、类别先验或分层随机预测比较；回归问题至少可以与训练目标均值或中位数预测比较。

scikit-learn 将 `DummyClassifier` / `DummyRegressor` 定义为忽略输入特征、按简单规则预测的基线；`DummyRegressor(strategy="mean")` 始终预测训练集目标均值。[DummyRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyRegressor.html) 官方评价指南也将 dummy estimator 作为指标的 baseline。[Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)

baseline 的意义不是“模型达到 baseline 就能上线”，而是先回答更基础的问题：当前特征和训练流程是否比不使用输入信息的简单策略更有价值。生产决策还必须加入业务成本、错误类型、延迟、稳定性、公平性和分布漂移等约束。

## 6. 可手算的线性回归例子

给定三个训练样本：

\[
(1,2),\quad(2,3),\quad(3,5).
\]

选择一元线性模型 \(h(x)=wx+b\)，损失使用均方误差：

\[
\operatorname{MSE}(w,b)=\frac{1}{3}\sum_{i=1}^{3}(wx_i+b-y_i)^2.
\]

最小二乘闭式解为：

\[
w=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2},
\qquad b=\bar y-w\bar x.
\]

本例中 \(\bar x=2\)，\(\bar y=10/3\)：

\[
w=\frac{3}{2},\qquad b=\frac{1}{3}.
\]

模型为 \(h(x)=1.5x+1/3\)。三个预测分别为 \(11/6,10/3,29/6\)，残差平方和为 \(1/6\)，训练 MSE 为：

\[
\operatorname{MSE}_{\text{linear}}=\frac{1}{18}\approx0.0556.
\]

若 baseline 永远预测训练目标均值 \(10/3\)，训练 MSE 为：

\[
\operatorname{MSE}_{\text{mean}}=\frac{14}{9}\approx1.5556.
\]

在线性模型允许的函数集合中，它比均值 baseline 更贴合这三个训练点。但这仍然不是泛化证据：样本极少，没有独立测试数据，而且我们尚未验证未来数据是否服从相同关系。这个限制应在博客中与数字同时出现。

## 7. 建议的发布稿结构

1. 反直觉开场：机器学习不是把训练误差压到零。
2. 四个对象：数据、假设空间、损失、目标分布。
3. ERM 与总体风险：训练目标和业务目标为何不是一回事。
4. 数据集职责：训练 / 验证 / 测试，以及泄漏边界。
5. 欠拟合与过拟合：从训练—验证差距理解，而非背定义。
6. 手算线性回归：把“学习”具体化为参数选择。
7. baseline：没有参照系的指标没有意义。
8. 工程结论：模型只是完整预测系统的一部分。

## 8. 文章中应避免的表述

- 不说“测试集用于调参”；调参属于验证过程。
- 不把一次随机切分的分数描述为稳定能力。
- 不把训练误差更低等价为模型更好。
- 不把线性相关系数或回归系数解释为因果效应。
- 不给出脱离数据、指标和切分协议的“准确率”。
- 不把示例中的训练 MSE 当成真实业务效果。

## 来源清单

- Stanford CS229, [Supervised Learning notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- Stanford CS229, [Main course notes: learning theory and ERM](https://cs229.stanford.edu/main_notes.pdf)
- Stanford CS229, [Generalization chapter](https://cs229.stanford.edu/notes2022fall/main_notes.pdf?forcedefault=true)
- scikit-learn, [Cross-validation: evaluating estimator performance](https://scikit-learn.org/stable/modules/cross_validation.html)
- scikit-learn, [Common pitfalls and recommended practices](https://scikit-learn.org/stable/common_pitfalls.html)
- scikit-learn, [Underfitting vs. Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)
- scikit-learn, [DummyRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyRegressor.html)
- scikit-learn, [Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
