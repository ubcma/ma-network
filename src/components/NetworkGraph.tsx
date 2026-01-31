import { useRef, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { type GraphData, type GraphNode } from '@/utils/graphUtils';

interface NetworkGraphProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
}

export function NetworkGraph({ data, onNodeClick, width, height }: NetworkGraphProps) {
  const fgRef = useRef<any>(null);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(100);
      fgRef.current.zoomToFit(400);
    }
  }, [data]);

  const handleNodeClick = useCallback((node: any) => {
    if (node.type === 'person') {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      width={width}
      height={height}
      nodeLabel={(node: any) => node.name}
      nodeColor={(node: any) => node.color}
      nodeVal={(node: any) => node.type === 'person' ? node.val * 2 : node.val * 0.5}
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        const nodeSize = node.type === 'person' ? node.val * 2 : node.val * 0.5;
        ctx.font = `${fontSize}px Sans-Serif`;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        if (node.type === 'person') {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2 / globalScale;
          ctx.stroke();
        }

        if (globalScale > 0.8) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#333';
          
          if (node.type === 'company' && globalScale > 2) {
            ctx.fillStyle = '#fff';
            ctx.fillText(label, node.x, node.y);
          } else {
            ctx.fillText(label, node.x, node.y + nodeSize + fontSize + 2);
          }
        }
      }}
      linkColor={() => 'rgba(150, 150, 150, 0.3)'}
      linkWidth={(link: any) => link.type === 'current' ? 2 : 1}
      linkDirectionalParticles={(link: any) => link.type === 'current' ? 2 : 0}
      linkDirectionalParticleWidth={2}
      onNodeClick={handleNodeClick}
      onNodeHover={(node) => {
        document.body.style.cursor = node && node.type === 'person' ? 'pointer' : 'default';
      }}
      cooldownTicks={150}
      onEngineStop={() => fgRef.current && fgRef.current.zoomToFit(400)}
      enableZoomInteraction={true}
      enablePanInteraction={true}
    />
  );
}