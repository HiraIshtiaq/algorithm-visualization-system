/**
 * treeTraversal.js
 *
 * Provides:
 *   1. buildSampleTree()  — returns a binary tree node structure
 *   2. Traversal animation generators for:
 *        - Inorder   (Left → Root → Right)
 *        - Preorder  (Root → Left → Right)
 *        - Postorder (Left → Right → Root)
 *        - BFS / Level Order
 *
 * Each animation step:
 *   { type: 'visit',   nodeId }   — node is being visited (highlight)
 *   { type: 'active',  nodeId }   — node is on the call stack / queue
 *   { type: 'done',    nodeId }   — node processing complete
 *   { type: 'edge',    from, to } — traversal edge highlight
 *   { type: 'result',  value }    — append value to result array display
 */

// ─── Tree node structure ──────────────────────────────────────────────────────
export class TreeNode {
  constructor(id, value, x, y) {
    this.id    = id;
    this.value = value;
    this.x     = x;    // 0–100 coordinate space
    this.y     = y;
    this.left  = null;
    this.right = null;
  }
}

// ─── Pre-built trees ──────────────────────────────────────────────────────────
export function buildBalancedTree() {
  // A balanced BST with 15 nodes, 4 levels
  //                     8
  //              4             12
  //          2       6     10      14
  //        1   3   5   7  9  11  13  15

  const n = (id, val, x, y) => new TreeNode(id, val, x, y);

  const root = n('n8',  8,  50, 8);
  root.left  = n('n4',  4,  25, 25);
  root.right = n('n12',12,  75, 25);

  root.left.left   = n('n2',  2, 12, 45);
  root.left.right  = n('n6',  6, 38, 45);
  root.right.left  = n('n10',10, 62, 45);
  root.right.right = n('n14',14, 88, 45);

  root.left.left.left   = n('n1',  1,  6, 65);
  root.left.left.right  = n('n3',  3, 18, 65);
  root.left.right.left  = n('n5',  5, 32, 65);
  root.left.right.right = n('n7',  7, 44, 65);
  root.right.left.left  = n('n9',  9, 56, 65);
  root.right.left.right = n('n11',11, 68, 65);
  root.right.right.left = n('n13',13, 82, 65);
  root.right.right.right= n('n15',15, 94, 65);

  return root;
}

export function buildSmallTree() {
  //         5
  //      3     8
  //    1   4  7  9
  //      2

  const n = (id, val, x, y) => new TreeNode(id, val, x, y);
  const root = n('n5', 5, 50, 10);
  root.left  = n('n3', 3, 28, 30);
  root.right = n('n8', 8, 72, 30);
  root.left.left  = n('n1', 1, 16, 52);
  root.left.right = n('n4', 4, 40, 52);
  root.right.left  = n('n7', 7, 60, 52);
  root.right.right = n('n9', 9, 84, 52);
  root.left.left.right = n('n2', 2, 24, 74);
  return root;
}

export const SAMPLE_TREES = {
  balanced: { label: 'Balanced BST (15 nodes)', build: buildBalancedTree },
  small:    { label: 'Small Tree (8 nodes)',     build: buildSmallTree    },
};

// ─── Collect all nodes/edges from tree ───────────────────────────────────────
export function collectTree(root) {
  const nodes = [], edges = [];
  const dfs = (node) => {
    if (!node) return;
    nodes.push({ id: node.id, value: node.value, x: node.x, y: node.y });
    if (node.left)  { edges.push({ from: node.id, to: node.left.id  }); dfs(node.left);  }
    if (node.right) { edges.push({ from: node.id, to: node.right.id }); dfs(node.right); }
  };
  dfs(root);
  return { nodes, edges };
}

// ─── Inorder: Left → Root → Right ────────────────────────────────────────────
export function getInorderAnimations(root) {
  const animations = [];
  const inorder = (node, parent) => {
    if (!node) return;
    animations.push({ type: 'active', nodeId: node.id });
    if (parent) animations.push({ type: 'edge', from: parent.id, to: node.id });
    inorder(node.left, node);
    animations.push({ type: 'visit',  nodeId: node.id });
    animations.push({ type: 'result', value: node.value });
    inorder(node.right, node);
    animations.push({ type: 'done',   nodeId: node.id });
  };
  inorder(root, null);
  return animations;
}

// ─── Preorder: Root → Left → Right ───────────────────────────────────────────
export function getPreorderAnimations(root) {
  const animations = [];
  const preorder = (node, parent) => {
    if (!node) return;
    if (parent) animations.push({ type: 'edge', from: parent.id, to: node.id });
    animations.push({ type: 'visit',  nodeId: node.id });
    animations.push({ type: 'result', value: node.value });
    animations.push({ type: 'active', nodeId: node.id });
    preorder(node.left,  node);
    preorder(node.right, node);
    animations.push({ type: 'done', nodeId: node.id });
  };
  preorder(root, null);
  return animations;
}

// ─── Postorder: Left → Right → Root ──────────────────────────────────────────
export function getPostorderAnimations(root) {
  const animations = [];
  const postorder = (node, parent) => {
    if (!node) return;
    animations.push({ type: 'active', nodeId: node.id });
    if (parent) animations.push({ type: 'edge', from: parent.id, to: node.id });
    postorder(node.left,  node);
    postorder(node.right, node);
    animations.push({ type: 'visit',  nodeId: node.id });
    animations.push({ type: 'result', value: node.value });
    animations.push({ type: 'done',   nodeId: node.id });
  };
  postorder(root, null);
  return animations;
}

// ─── BFS / Level Order ────────────────────────────────────────────────────────
export function getBFSAnimations(root) {
  const animations = [];
  if (!root) return animations;
  const queue = [{ node: root, parent: null }];
  while (queue.length > 0) {
    const { node, parent } = queue.shift();
    if (parent) animations.push({ type: 'edge',   from: parent.id, to: node.id });
    animations.push({ type: 'visit',  nodeId: node.id });
    animations.push({ type: 'result', value: node.value });
    animations.push({ type: 'done',   nodeId: node.id });
    if (node.left)  queue.push({ node: node.left,  parent: node });
    if (node.right) queue.push({ node: node.right, parent: node });
  }
  return animations;
}

export const TRAVERSALS = {
  inorder:   { label: 'Inorder (L→Root→R)',   fn: getInorderAnimations   },
  preorder:  { label: 'Preorder (Root→L→R)',   fn: getPreorderAnimations  },
  postorder: { label: 'Postorder (L→R→Root)',  fn: getPostorderAnimations },
  bfs:       { label: 'BFS / Level Order',     fn: getBFSAnimations       },
};
