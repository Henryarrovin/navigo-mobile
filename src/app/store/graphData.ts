export interface VertexData {
    id: string;
    objectName: string | null;
    cx: number;
    cy: number;
}

export interface EdgeData {
    id: string;
    from: string;
    to: string;
}

export interface GraphData {
    vertices: VertexData[];
    edges: EdgeData[];
}

const graphData: GraphData = {
    vertices: [
        { id: "V1", objectName: "Object1", cx: 115, cy: 1754 },
        { id: "V2", objectName: "Object2", cx: 3008, cy: 115 },
        { id: "V3", objectName: "Object3", cx: 7125, cy: 1813 },
        { id: "V4", objectName: "Object4", cx: 6855, cy: 623 },
        { id: "V5", objectName: "Object5", cx: 6855, cy: 3000 },
        { id: "V6", objectName: "Object6", cx: 3353, cy: 3395 },
        { id: "V7", objectName: "Object7", cx: 6589, cy: 3193 },
        { id: "V8", objectName: "Object8", cx: 6583, cy: 368 },
        { id: "V9", objectName: "Object9", cx: 6685, cy: 1154 },
        { id: "V10", objectName: "Object10", cx: 6685, cy: 2500 },
        { id: "V11", objectName: "Object11", cx: 4728, cy: 1436 },
        { id: "V12", objectName: "Object12", cx: 557, cy: 1757 },
        { id: "V13", objectName: "Object13", cx: 3304, cy: 2170 },
    ],
    edges: [
        { id: "E1", from: "V1", to: "V2" },
        { id: "E2", from: "V2", to: "V6" },
        { id: "E3", from: "V3", to: "V4" },
        { id: "E4", from: "V4", to: "V5" },
        { id: "E5", from: "V5", to: "V7" },
        { id: "E6", from: "V6", to: "V12" },
        { id: "E7", from: "V7", to: "V8" },
        { id: "E8", from: "V8", to: "V9" },
        { id: "E9", from: "V9", to: "V10" },
        { id: "E10", from: "V10", to: "V11" },
        { id: "E11", from: "V11", to: "V13" },
        { id: "E12", from: "V12", to: "V13" },
    ],
};

export default graphData;