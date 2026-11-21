import type { Block } from "@/calculators/types";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 text-ink">
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "h3") return <h3 key={i} className="pt-2 text-lg font-bold text-primary">{b.text}</h3>;
        if (b.type === "list")
          return (
            <ul key={i} className="list-disc space-y-1.5 pr-6 marker:text-secondary">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        return (
          <div key={i} className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[28rem] text-sm">
              <thead className="bg-bg">
                <tr>
                  {b.head.map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 text-right font-semibold text-primary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j} className="border-t border-line">
                    {r.map((c, k) => (
                      <td key={k} className="num px-3 py-2">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
