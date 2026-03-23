import { TreeNode } from './types';

export interface HuffmanEncodingSession {
  input: string;
  encodedOutput: string;
  tree: TreeNode;
  codes: Record<string, string>;
  updatedAt: number;
}

let latestEncodingSession: HuffmanEncodingSession | null = null;

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function saveLatestEncodingSession(
  session: Omit<HuffmanEncodingSession, 'updatedAt'>
): void {
  latestEncodingSession = {
    ...session,
    tree: cloneTree(session.tree)!,
    codes: { ...session.codes },
    updatedAt: Date.now(),
  };
}

export function getLatestEncodingSession(): HuffmanEncodingSession | null {
  if (!latestEncodingSession) return null;

  return {
    ...latestEncodingSession,
    tree: cloneTree(latestEncodingSession.tree)!,
    codes: { ...latestEncodingSession.codes },
  };
}
