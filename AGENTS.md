# Repository Instructions

## Technical blog rendering

### Mathematical formulas

- Display formulas must use semantic MathML that is rendered natively by the browser. Do not simulate mathematical notation with Unicode characters, combining accents, plain text, or `<pre><code>` blocks.
- Fractions, roots, sums, integrals, expectations, subscripts, superscripts, accents, and multi-line equation systems must use the corresponding MathML elements, such as `mfrac`, `msqrt`, `munderover`, `msub`, `msup`, `mover`, and separate block-level `math` nodes.
- Every `<math>` element must include a concise Chinese `aria-label` that explains how the expression is read. Mathematical meaning must not depend on visual layout alone.
- Keep formula rendering compatible with the site's Content Security Policy. Do not add remote MathJax, KaTeX, fonts, scripts, or stylesheets merely to render formulas.
- Inline identifiers and short numeric expressions may use Markdown code formatting only when they are being discussed as literal values or code. Any expression whose structure matters must use MathML.

### Formula styling

- Reuse the shared `.formula` container in `notes/notes.css`; do not add article-specific copies of the same formula styles.
- Formula containers must support horizontal overflow on narrow screens. Do not shrink formulas until operators, limits, or indices become unreadable.
- Equation systems must preserve a clear visual relationship between their lines without merging them into a plain-text multiline block.

### Required verification

After adding or changing formulas:

1. Run the default Jekyll build with `PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle exec jekyll build`.
2. Confirm the generated article contains `<math>` elements and does not contain formula-shaped `<pre><code>` blocks.
3. Inspect the rendered page in a real browser at desktop width and a narrow/mobile width.
4. Visually verify fractions, sum limits, subscripts, superscripts, accents, line wrapping, and horizontal overflow.
5. Do not claim the rendering is fixed based only on a successful build; the browser view is part of acceptance.
