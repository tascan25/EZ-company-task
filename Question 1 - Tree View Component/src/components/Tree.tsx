import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Loader } from 'lucide-react';
import { initialData } from '../data/InitialData';

interface TreeNode {
  id: string;
  label: string;
  level: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
}

const mockLazyLoad = (parentId: string): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: `${parentId}-lazy-1`, label: 'Lazy Loaded Node 1', level: 'A', hasChildren: false },
        { id: `${parentId}-lazy-2`, label: 'Lazy Loaded Node 2', level: 'A', hasChildren: false }
      ]);
    }, 800);
  });
};


const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
  const [draggedNode, setDraggedNode] = useState<{ node: TreeNode; parentId: string | null; index: number } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const findNodeAndParent = useCallback((
    nodes: TreeNode[],
    nodeId: string,
    parent: TreeNode | null = null
  ): { node: TreeNode; parent: TreeNode | null } | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return { node, parent };
      }
      if (node.children) {
        const found = findNodeAndParent(node.children, nodeId, node);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateNode = useCallback((nodes: TreeNode[], nodeId: string, updates: Partial<TreeNode>): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return { ...node, children: updateNode(node.children, nodeId, updates) };
      }
      return node;
    });
  }, []);

  const removeNode = useCallback((nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter(node => {
      if (node.id === nodeId) return false;
      if (node.children) {
        node.children = removeNode(node.children, nodeId);
      }
      return true;
    });
  }, []);

  const addNode = useCallback((nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          hasChildren: true
        };
      }
      if (node.children) {
        return { ...node, children: addNode(node.children, parentId, newNode) };
      }
      return node;
    });
  }, []);

  const handleToggle = async (nodeId: string) => {
    const result = findNodeAndParent(treeData, nodeId);
    if (!result) return;

    const { node } = result;
    
    if (!node.isExpanded && node.hasChildren && (!node.children || node.children.length === 0)) {
      setTreeData(updateNode(treeData, nodeId, { isLoading: true }));
      const lazyChildren = await mockLazyLoad(nodeId);
      setTreeData(prev => updateNode(prev, nodeId, { 
        isExpanded: true, 
        isLoading: false,
        children: lazyChildren 
      }));
    } else {
      setTreeData(updateNode(treeData, nodeId, { isExpanded: !node.isExpanded }));
    }
  };

  const handleAddNode = (parentId: string) => {
    const nodeName = prompt('Enter node name:');
    if (!nodeName) return;

    const newNode: TreeNode = {
      id: `node-${Date.now()}`,
      label: nodeName,
      level: 'A',
      hasChildren: false
    };

    setTreeData(addNode(treeData, parentId, newNode));
  };

  const handleRemoveNode = (nodeId: string) => {
    if (window.confirm('Are you sure you want to delete this node and all its children?')) {
      setTreeData(removeNode(treeData, nodeId));
    }
  };

  const handleEditStart = (node: TreeNode) => {
    setEditingNodeId(node.id);
    setEditValue(node.label);
  };

  const handleEditComplete = (nodeId: string) => {
    if (editValue.trim()) {
      setTreeData(updateNode(treeData, nodeId, { label: editValue.trim() }));
    }
    setEditingNodeId(null);
    setEditValue('');
  };

  const handleDragStart = (node: TreeNode, parentId: string | null, index: number) => {
    setDraggedNode({ node, parentId, index });
  };

  const handleDrop = (targetParentId: string | null, targetIndex: number) => {
    if (!draggedNode) return;

    let newTree = [...treeData];
    
    // Remove from old position
    if (draggedNode.parentId === null) {
      newTree.splice(draggedNode.index, 1);
    } else {
      const removeFromParent = (nodes: TreeNode[], parentId: string): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.children) {
            return {
              ...node,
              children: node.children.filter((_, i) => i !== draggedNode.index)
            };
          }
          if (node.children) {
            return { ...node, children: removeFromParent(node.children, parentId) };
          }
          return node;
        });
      };
      newTree = removeFromParent(newTree, draggedNode.parentId);
    }

    // Add to new position
    if (targetParentId === null) {
      newTree.splice(targetIndex, 0, draggedNode.node);
    } else {
      const addToParent = (nodes: TreeNode[], parentId: string): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            const newChildren = [...(node.children || [])];
            newChildren.splice(targetIndex, 0, draggedNode.node);
            return { ...node, children: newChildren, hasChildren: true };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children, parentId) };
          }
          return node;
        });
      };
      newTree = addToParent(newTree, targetParentId);
    }

    setTreeData(newTree);
    setDraggedNode(null);
  };

  const renderNode = (node: TreeNode, parentId: string | null = null, index: number = 0, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const canExpand = hasChildren || node.hasChildren;

    return (
      <div key={node.id} className="select-none">
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            handleDragStart(node, parentId, index);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDrop(parentId, index);
          }}
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-move group"
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {canExpand ? (
            <button
              onClick={() => handleToggle(node.id)}
              className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
            >
              {node.isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-gray-500" />
              ) : node.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm
              ${node.level === 'A' ? 'bg-blue-500' : 
                node.level === 'B' ? 'bg-green-500' : 
                node.level === 'C' ? 'bg-lime-500' : 
                'bg-yellow-500'}`}
          >
            {node.level}
          </div>

          {editingNodeId === node.id ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleEditComplete(node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditComplete(node.id);
                if (e.key === 'Escape') {
                  setEditingNodeId(null);
                  setEditValue('');
                }
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span 
              className="flex-1 text-gray-700 font-medium"
              onDoubleClick={() => handleEditStart(node)}
            >
              {node.label}
            </span>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEditStart(node)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Edit"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleAddNode(node.id)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Add child"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleRemoveNode(node.id)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {node.isExpanded && node.children && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(node.id, node.children?.length || 0);
            }}
          >
            {node.children.map((child, idx) => renderNode(child, node.id, idx, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tree View Component</h1>
        <div 
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(null, treeData.length);
          }}
        >
          {treeData.map((node, idx) => renderNode(node, null, idx, 0))}
        </div>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>• Click chevron to expand/collapse nodes</p>
          <p>• Double-click node name or click edit icon to rename</p>
          <p>• Drag and drop to reorder nodes</p>
          <p>• Hover over nodes to see action buttons</p>
          <p>• Nodes with hasChildren flag will lazy load children on first expand</p>
        </div>
      </div>
    </div>
  );
};

export default TreeView;