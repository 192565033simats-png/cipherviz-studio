import { useMemo } from 'react';
import { Step, TreeNode } from '../../engine/types';
import { GitBranch } from 'lucide-react';

interface TreeViewProps {
  step: Step;
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
  return { id: node.id, char: node.char, freq: node.freq, x, y: depth * 80, left, right };
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

export function TreeView({ step }: TreeViewProps) {
  const forest = step.snapshot.priorityQueue;
  const activeNodeIds = step.highlight.nodes;
  const mergedNodeId = step.highlight.mergedNodeId;

  const { nodes, edges, width, height } = useMemo(() => {
    if (forest.length === 0) return { nodes: [] as LayoutNode[], edges: [] as any[], width: 0, height: 0 };

    const allNodes: LayoutNode[] = [];
    const allEdges: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];
    const gap = 55;
    const xRef = { val: 30 };

    for (const tree of forest) {
      const laid = layoutTree(tree, 0, xRef, gap);
      if (laid) {
        collectNodes(laid, allNodes);
        collectEdges(laid, allEdges);
      }
      xRef.val += gap;
    }

    const maxX = Math.max(...allNodes.map(n => n.x), 100) + 50;
    const maxY = Math.max(...allNodes.map(n => n.y), 50) + 60;

    return { nodes: allNodes, edges: allEdges, width: maxX, height: maxY };
  }, [forest]);

  if (forest.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
        Huffman tree will grow here
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <GitBranch className="w-3.5 h-3.5 text-primary" />
        Huffman Tree
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{forest.length} tree{forest.length > 1 ? 's' : ''} in queue</span>
      </h3>
      <div className="overflow-auto rounded-xl bg-secondary/20 border border-border/30 p-4" style={{ maxHeight: 400 }}>
        <svg width={width} height={height} className="min-w-full">
          {/* Edges */}
          {edges.map((e, i) => {
            const isActiveEdge = activeNodeIds.some(id =>
              nodes.find(n => n.id === id && (n.x === e.x1 && n.y === e.y1 || n.x === e.x2 && n.y === e.y2))
            );
            return (
              <g key={i}>
                <line
                  x1={e.x1} y1={e.y1 + 18} x2={e.x2} y2={e.y2 - 4}
                  stroke={isActiveEdge ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isActiveEdge ? 2.5 : 1.5}
                  opacity={isActiveEdge ? 1 : 0.6}
                  className="transition-all duration-500"
                />
                <text
                  x={(e.x1 + e.x2) / 2 + (e.label === '0' ? -12 : 8)}
                  y={(e.y1 + e.y2) / 2 + 10}
                  fill={isActiveEdge ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  fontSize={11}
                  fontWeight={isActiveEdge ? 700 : 400}
                  fontFamily="var(--font-mono)"
                >
                  {e.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const isActive = activeNodeIds.includes(n.id);
            const isMerged = n.id === mergedNodeId;
            const isLeaf = n.char !== null;

            let fill = 'hsl(var(--node-default))';
            let strokeColor = 'none';
            let strokeWidth = 0;
            if (isMerged) {
              fill = 'hsl(var(--node-merged))';
              strokeColor = 'hsl(var(--accent))';
              strokeWidth = 3;
            } else if (isActive) {
              fill = 'hsl(var(--node-active))';
              strokeColor = 'hsl(var(--primary))';
              strokeWidth = 3;
            } else if (isLeaf) {
              fill = 'hsl(var(--node-leaf))';
            }

            const r = isActive || isMerged ? 22 : 18;

            return (
              <g key={n.id} className="transition-all duration-500">
                {/* Glow ring for active/merged */}
                {(isActive || isMerged) && (
                  <circle
                    cx={n.x} cy={n.y}
                    r={r + 8}
                    fill="none"
                    stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                    strokeWidth={1.5}
                    opacity={0.3}
                    className="node-pulse"
                  />
                )}
                <circle
                  cx={n.x} cy={n.y}
                  r={r}
                  fill={fill}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-500"
                />
                {isLeaf && (
                  <text
                    x={n.x} y={n.y - 3}
                    textAnchor="middle"
                    fill="hsl(var(--background))"
                    fontSize={13}
                    fontWeight={700}
                    fontFamily="var(--font-mono)"
                  >
                    {n.char === ' ' ? '␣' : n.char}
                  </text>
                )}
                <text
                  x={n.x} y={n.y + (isLeaf ? 10 : 5)}
                  textAnchor="middle"
                  fill={isLeaf ? 'hsl(var(--background))' : 'hsl(var(--foreground))'}
                  fontSize={10}
                  fontWeight={600}
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
