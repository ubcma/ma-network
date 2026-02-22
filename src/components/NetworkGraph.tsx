import { useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { type GraphData, type GraphNode } from "@/utils/graphUtils";
import type { PastExperience } from "@/utils/networkProfileUtils";

interface NetworkGraphProps {
  data: GraphData;
  visibleProfileIds: Set<string>;
  onNodeClick: (node: GraphNode) => void;
  width: number;
  height: number;
}

function PersonNode({ data }: NodeProps) {
  return (
    <div style={{ position: "relative" }}>
      <Handle type="source" position={Position.Top} />
      <div
        style={{
          width: data.size,
          height: data.size,
          borderRadius: "50%",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(39, 11, 11, 0.2)",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: data.color,
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: data.size / 3,
              color: "#fff",
            }}
          >
            <div className="font-semibold">
              {data.label.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: data.size + 8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 12,
          fontWeight: 500,
          color: "#f7f1e9",
          whiteSpace: "nowrap",
          backgroundColor: "rgba(18, 12, 20, 0.95)",
          padding: "6px 10px",
          borderRadius: 8,
          boxShadow: "0 8px 20px rgba(8, 6, 12, 0.5)",
          textAlign: "center",
          minWidth: 160,
          maxWidth: 200,
          textWrap: "wrap",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="font-semibold">
          {data.label}
        </div>
        {data.company ? (
          <div className="text-xs mt-1" style={{ color: "#c9beb2" }}>
            {data.company}
          </div>
        ) : (
          <div className="text-xs mt-1" style={{ color: "#a99da0" }}>
            {data.originalNode.profile.contact_type === "alumni"
              ? "Alumni"
              : data.ma_role.position + ", " + data.ma_role.portfolio}
          </div>
        )}
        {data.past_experience && data.past_experience.length > 0 && (
          <div className="text-xs mt-1" style={{ color: "#8f848c" }}>
            Prev.{" "}
            {data.past_experience
              .map((exp: PastExperience) => exp.company)
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioNode({ data }: NodeProps) {
  return (
    <div style={{ position: "relative" }}>
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          width: data.size,
          height: data.size,
          borderRadius: "50%",
          border: "3px solid #ef3050",
          boxShadow: "0 10px 22px rgba(12, 8, 18, 0.55)",
          overflow: "hidden",
          backgroundColor: "rgba(16, 12, 20, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#f7f1e9",
            textAlign: "center",
            padding: "0 10px",
          }}
        >
          {data.label}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  person: PersonNode,
  portfolio: PortfolioNode,
};

function groupedLayout(graphData: GraphData, visibleProfileIds: Set<string>) {
  const personNodes = graphData.nodes.filter((node) => node.type === "person");

  // Group people by their portfolio
  const portfoliosMap = new Map<string, GraphNode[]>();
  const unassigned: GraphNode[] = [];

  personNodes.forEach((node) => {
    const portfolio = node.ma_role?.portfolio;
    if (portfolio) {
      if (!portfoliosMap.has(portfolio)) portfoliosMap.set(portfolio, []);
      portfoliosMap.get(portfolio)!.push(node);
    } else {
      unassigned.push(node);
    }
  });

  const portfolios = Array.from(portfoliosMap.keys());
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Center of our graph canvas
  const centerX = 800;
  const centerY = 800;

  // STEP 1: Layout Portfolios in a large circle
  const mainRadius = 450;
  const portfolioPositions = new Map<string, { x: number; y: number }>();

  portfolios.forEach((portfolio, index) => {
    const angle = (index / portfolios.length) * 2 * Math.PI;
    const px = centerX + Math.cos(angle) * mainRadius;
    const py = centerY + Math.sin(angle) * mainRadius;

    portfolioPositions.set(portfolio, { x: px, y: py });

    nodes.push({
      id: `portfolio-${portfolio}`,
      type: "portfolio",
      position: { x: px, y: py },
      data: {
        label: `${portfolio} Portfolio`,
        color: "#ff2259",
        size: 100,
      },
    });
  });

  // STEP 2: Layout Members orbiting their specific portfolio
  const subRadius = 180; // Distance of members from their portfolio

  portfoliosMap.forEach((members, portfolio) => {
    const parentPos = portfolioPositions.get(portfolio)!;
    const portfolioVisible = members.some((member) =>
      visibleProfileIds.has(member.id),
    );

    members.forEach((member, index) => {
      // Offset the starting angle slightly so they don't overlap the center connections
      const angle = (index / members.length) * 2 * Math.PI + 0.5;
      const mx = parentPos.x + Math.cos(angle) * subRadius;
      const my = parentPos.y + Math.sin(angle) * subRadius;

      nodes.push({
        id: member.id,
        type: "person",
        position: { x: mx, y: my },
        hidden: !visibleProfileIds.has(member.id),
        data: {
          label: member.name,
          color: member.color || "#3a202d",
          size: 80,
          photo: member.photo,
          company: member.company,
          past_experience: member.past_experience || [],
          ma_role: member.ma_role,
          originalNode: member,
        },
      });

      // ADD EDGE: Connect member to their portfolio (RED)
      edges.push({
        id: `link-${member.id}-to-${portfolio}`,
        source: member.id,
        target: `portfolio-${portfolio}`,
        animated: true,
        hidden:
          !visibleProfileIds.has(member.id) ||
          !portfolioVisible,
        style: { stroke: "#ef446c", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#ef446c" },
      });
    });

    const portfolioNode = nodes.find(
      (node) => node.id === `portfolio-${portfolio}`,
    );
    if (portfolioNode) {
      portfolioNode.hidden = !portfolioVisible;
    }
  });

  // STEP 3: Layout unassigned members in the center
  unassigned.forEach((member, index) => {
    const angle = (index / unassigned.length) * 2 * Math.PI;
    nodes.push({
      id: member.id,
      type: "person",
      position: {
        x: centerX + Math.cos(angle) * 150,
        y: centerY + Math.sin(angle) * 150,
      },
      hidden: !visibleProfileIds.has(member.id),
      data: {
        label: member.name,
        color: member.color || "#3a202d",
        size: 80,
        photo: member.photo,
        // ... rest of data
      },
    });
  });

  return { nodes, edges };
}

export function NetworkGraph({
  data,
  visibleProfileIds,
  onNodeClick,
  width,
  height,
}: NetworkGraphProps) {
  const layoutData = useMemo(
    () => groupedLayout(data, visibleProfileIds),
    [data, visibleProfileIds],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutData.edges);

  useEffect(() => {
    const newLayoutData = groupedLayout(data, visibleProfileIds);
    setNodes(newLayoutData.nodes);
    setEdges(newLayoutData.edges);
  }, [data, visibleProfileIds, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "person") {
        onNodeClick(node.data.originalNode);
      }
    },
    [onNodeClick],
  );

  return (
    <div style={{ width, height, position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          style: {
            stroke: "#ef446c", // Red color
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#ef446c",
          },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
