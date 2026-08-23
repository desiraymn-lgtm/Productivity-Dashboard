function parseInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

const CHECKLIST_ITEM = /^- \[([ x])\] (.*)$/;

/**
 * Purpose-built renderer for the small set of markdown patterns this app's
 * own seed content uses (## headings, - [ ] checklists, - bullets, | tables,
 * **bold**, and plain paragraphs) — not a general-purpose markdown parser.
 */
export function RichText({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={key++} className="richtext-heading">
          {line.slice(3)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^[\s|:-]+$/.test(l))
        .map((l) => l.split('|').slice(1, -1).map((cell) => cell.trim()));
      const [header, ...body] = rows;
      if (header) {
        blocks.push(
          <table key={key++} className="richtext-table">
            <thead>
              <tr>
                {header.map((cell, ci) => (
                  <th key={ci}>{parseInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    }

    if (CHECKLIST_ITEM.test(line)) {
      const items: { checked: boolean; text: string }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(CHECKLIST_ITEM);
        if (!m) break;
        items.push({ checked: m[1] === 'x', text: m[2] });
        i++;
      }
      blocks.push(
        <ul key={key++} className="richtext-checklist">
          {items.map((item, ii) => (
            <li key={ii} className={item.checked ? 'is-checked' : ''}>
              <span className="richtext-check" aria-hidden="true">
                {item.checked ? '✓' : ''}
              </span>
              {parseInline(item.text)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ') && !CHECKLIST_ITEM.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="richtext-bullets">
          {items.map((item, ii) => (
            <li key={ii}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    blocks.push(<p key={key++}>{parseInline(line)}</p>);
    i++;
  }

  return <>{blocks}</>;
}
