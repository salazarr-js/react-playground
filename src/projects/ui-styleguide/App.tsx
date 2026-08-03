// Every element here is bare (no utility classes) — the point is to show the base
// styles from src/styles/global.css. If it looks good here, it looks good everywhere.
export default function App() {
  return (
    <div>
      <h1>UI Styleguide</h1>
      <p>
        Base element styles driven entirely by <code>global.css</code> — no classes,
        Pico-inspired. This page renders bare tags so the defaults are visible at a glance.
      </p>

      <h2>Headings</h2>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>

      <h2>Text</h2>
      <p>
        A paragraph with <strong>strong emphasis</strong>, <em>italic emphasis</em>, an
        inline <code>code snippet</code>, and a <a href="#">link</a> that turns on hover.
      </p>
      <p>
        A second paragraph to show the spacing rhythm between blocks. Read more in the{' '}
        <a href="https://picocss.com" target="_blank" rel="noreferrer">Pico docs</a>.
      </p>

      <h2>Buttons</h2>
      <button type="button">Primary button</button>
      <button type="button" disabled>Disabled button</button>

      <h2>Forms</h2>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" placeholder="Jane Doe" />

      <label htmlFor="role">Role</label>
      <select id="role">
        <option>Developer</option>
        <option>Designer</option>
      </select>

      <label htmlFor="bio">Bio</label>
      <textarea id="bio" rows={3} placeholder="A few words…" />

      <label htmlFor="email">Email (invalid)</label>
      <input id="email" type="email" defaultValue="not-an-email" aria-invalid="true" />

      <label htmlFor="user">Username (valid)</label>
      <input id="user" type="text" defaultValue="jane" aria-invalid="false" />

      <label htmlFor="disabled">Disabled</label>
      <input id="disabled" type="text" defaultValue="Read only" disabled />

      <p>
        <label>
          <input type="checkbox" defaultChecked /> Subscribe
        </label>{' '}
        <label>
          <input type="radio" name="plan" defaultChecked /> Free
        </label>{' '}
        <label>
          <input type="radio" name="plan" /> Pro
        </label>
      </p>
      <input type="range" defaultValue={50} />

      <h2>Lists</h2>
      <ul>
        <li>Unordered item</li>
        <li>
          With a nested list:
          <ul>
            <li>Nested one</li>
            <li>Nested two</li>
          </ul>
        </li>
        <li>Third item</li>
      </ul>
      <ol>
        <li>First step</li>
        <li>Second step</li>
        <li>Third step</li>
      </ol>

      <h2>Details</h2>
      <details>
        <summary>Click to expand</summary>
        <p>Hidden content revealed when the disclosure is open.</p>
      </details>

      <h2>Quote &amp; rule</h2>
      <blockquote>
        A blockquote reads in the muted color with a start border.
      </blockquote>
      <hr />

      <h2>Code</h2>
      <p>
        Inline <code>const x = 1</code> and a keyboard hint <kbd>Ctrl</kbd> + <kbd>C</kbd>.
      </p>
      <pre>
        <code>{`function greet(name) {\n  return \`Hi, \${name}\`\n}`}</code>
      </pre>

      <h2>Table</h2>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--primary</code>
            </td>
            <td>Accent color</td>
          </tr>
          <tr>
            <td>
              <code>--radius-field</code>
            </td>
            <td>Control roundness</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
