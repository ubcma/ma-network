import { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { type GraphData, type GraphNode } from '@/utils/graphUtils';

interface NetworkGraphProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
}

function PersonNode({ data }: NodeProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: data.size,
          height: data.size,
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: data.color,
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: data.size / 3,
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {data.label.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: data.size + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 14,
          fontWeight: 500,
          color: '#333',
          whiteSpace: 'nowrap',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '4px 8px',
          borderRadius: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = {
  person: PersonNode,
};

function applyForceLayout(graphData: GraphData): { nodes: Node[]; edges: Edge[] } {
  const personNodes = graphData.nodes.filter(node => node.type === 'person');
  
  const simulationNodes = personNodes.map(node => ({
    ...node,
    x: Math.random() * 400,
    y: Math.random() * 400,
  }));

  const simulationLinks = graphData.links
    .filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const sourceNode = personNodes.find(n => n.id === sourceId);
      const targetNode = personNodes.find(n => n.id === targetId);
      return sourceNode && targetNode;
    })
    .map(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      return {
        source: sourceId,
        target: targetId,
        type: link.type,
      };
    });

  forceSimulation(simulationNodes)
    .force('link', forceLink(simulationLinks).id((d: any) => d.id).distance(80))
    .force('charge', forceManyBody().strength(-200))
    .force('center', forceCenter(200, 200))
    .tick(300);

  const nodes: Node[] = simulationNodes.map(node => ({
    id: node.id,
    type: node.type,
    position: { x: node.x!, y: node.y! },
    data: {
      label: node.name,
      color: node.color,
      size: 80,
      photo: node.photo,
      originalNode: node,
    },
  }));

  const edges: Edge[] = simulationLinks.map((link, index) => ({
    id: `e${index}`,
    source: link.source as string,
    target: link.target as string,
    animated: link.type === 'current',
    style: {
      stroke: 'rgba(150, 150, 150, 0.3)',
      strokeWidth: link.type === 'current' ? 2 : 1,
    },
  }));

  return { nodes, edges };
}

export function NetworkGraph({ data, onNodeClick, width, height }: NetworkGraphProps) {
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => applyForceLayout(data),
    [data]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = applyForceLayout(data);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [data, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'person') {
        onNodeClick(node.data.originalNode);
      }
    },
    [onNodeClick]
  );

  return (
    <div style={{ width, height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}