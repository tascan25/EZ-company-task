interface TreeNode {
  id: string;
  label: string;
  level: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
}


export const initialData: TreeNode[] = [
  {
    id: 'a1',
    label: 'Level A',
    level: 'A',
    isExpanded: true,
    children: [
      {
        id: 'b1',
        label: 'Level A',
        level: 'B',
        isExpanded: true,
        children: [
          {
            id: 'c1',
            label: 'Level A',
            level: 'C',
            isExpanded: false,
            children: [
              { id: 'd1', label: 'Level A', level: 'D', hasChildren: true }
            ]
          },
          { id: 'c2', label: 'Level A', level: 'C', hasChildren: false },
          { id: 'c3', label: 'Level A', level: 'C', hasChildren: false }
        ]
      },
      { id: 'b2', label: 'Level A', level: 'B', hasChildren: false }
    ]
  }
];