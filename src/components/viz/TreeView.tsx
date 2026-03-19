import { useMemo } from 'react';
import { StepState, TreeNode } from '../../engine/types';

interface TreeViewProps {
  state: StepState;
}

interface LayoutNode {
  id: string;
  char: string | null;
  freq: number;
  x: number;
  y: number;
  left: LayoutNode | null;
  right: LayoutNode | null;
}

function layoutTree(node: TreeNode | null, depth: number, xRef: { val: number }, gap: number): LayoutNode | null {
  if (!node) return null;
  const left = layoutTree(node.left, depth + 1, xRef, gap);
  const x = xRef.val;
  xRef.val += gap;
  const right = layoutTree(node.right, depth + 1, xRef, gap);
  return { id: node.id, char: node.char, freq: node.freq, x, y: depth * 70, left, right };
}

function collectEdges(node: LayoutNode | null, edges: { x1: number; y1: number; x2: number; y2: number; label: string }[]) {
  if (!node) return;
  if (node.left) {
    edges.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y, label: '0' });
    collectEdges(node.left, edges);
  }
  if (node.right) {
    edges.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y, label: '1' });
    collectEdges(node.right, edges);
  }
}

function collectNodes(node: LayoutNode | null, nodes: LayoutNode[]) {
  if (!node) return;
  collectNodes(node.left, nodes);
  nodes.push(node);
  collectNodes(node.right, nodes);
}

export function TreeView({ state }: TreeViewProps) {
  const { forest, activeNodeIds, mergedNodeId } = state;

  const { nodes, edges, width, height } = useMemo(() => {
    if (forest.length === 0) return { nodes: [] as LayoutNode[], edges: [] as any[], width: 0, height: 0 };

    const allNodes: LayoutNode[] = [];
    const allEdges: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];
    const gap = 50;
    const xRef = { val: 20 };

    for (const tree of forest) {
      const laid = layoutTree(tree, 0, xRef, gap);
      if (laid) {
        collectNodes(laid, allNodes);
        collectEdges(laid, allEdges);
      }
      xRef.val += gap;
    }

    const maxX = Math.max(...allNodes.map(n => n.x), 100) + 40;
    const maxY = Math.max(...allNodes.map(n => n.y), 50) + 50;

    return { nodes: allNodes, edges: allEdges, width: maxX, height: maxY };
  }, [forest]);

  if (forest.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Huffman tree will grow here
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Huffman Tree
      </h3>
      <div className="overflow-auto rounded-xl bg-secondary/30 p-2" style={{ maxHeight: 340 }}>
        <svg width={width} height={height} className="min-w-full">
          {edges.map((e, i) => (
            <g key={i}>
              <line
                x1={e.x1} y1={e.y1 + 16} x2={e.x2} y2={e.y2 - 2}
                stroke="hsl(var(--border))"
                strokeWidth={1.5}
                className="transition-all duration-300"
              />
              <text
                x={(e.x1 + e.x2) / 2 + (e.label === '0' ? -10 : 6)}
                y={(e.y1 + e.y2) / 2 + 8}
                fill="hsl(var(--muted-foreground))"
                fontSize={10}
                fontFamily="var(--font-mono)"
              >
                {e.label}
              </text>
            </g>
          ))}
          {nodes.map(n => {
            const isActive = activeNodeIds.includes(n.id);
            const isMerged = n.id === mergedNodeId;
            const isLeaf = n.char !== null;

            let fill = 'hsl(var(--node-default))';
            if (isActive) fill = 'hsl(var(--node-active))';
            else if (isMerged) fill = 'hsl(var(--node-merged))';
            else if (isLeaf) fill = 'hsl(var(--node-leaf))';

            return (
              <g key={n.id} className="transition-all duration-300">
                <circle
                  cx={n.x} cy={n.y}
                  r={isActive || isMerged ? 18 : 16}
                  fill={fill}
                  opacity={0.9}
                  className="transition-all duration-300"
                />
                {isLeaf && (
                  <text
                    x={n.x} y={n.y - 3}
                    textAnchor="middle"
                    fill="hsl(var(--background))"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="var(--font-mono)"
                  >
                    {n.char}
                  </text>
                )}
                <text
                  x={n.x} y={n.y + (isLeaf ? 9 : 4)}
                  textAnchor="middle"
                  fill={isLeaf ? 'hsl(var(--background))' : 'hsl(var(--foreground))'}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {n.freq}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
