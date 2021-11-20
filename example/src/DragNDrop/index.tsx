import React, { useState, DragEvent, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  OnLoadParams,
  Elements,
  Connection,
  Edge,
  ElementId,
  Node,
} from 'react-flow-renderer';

import Sidebar from './Sidebar';

import './dnd.css';

const initialElements = [{ id: '1', type: 'input', data: { label: 'input node' }, position: { x: 250, y: 5 } }];
let _modelsList: any[] = [];

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

let id = 0;
const getId = (): ElementId => `dndnode_${id++}`;

const DnDFlow = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const [modelsList, setModelsList] = useState<Elements>(_modelsList);

  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);
  

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData('application/reactflow');
      const nodeObject = JSON.parse(event.dataTransfer.getData('nodeObject'));
      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
      const newNode: Node<any> = {
        id: getId(),
        type,
        position,
        data: { label: `${type}`, nodeObject: nodeObject },
        className: "react-flow__node-default"
      };
      setElements((es) => es.concat(newNode));
    }
  };


  useEffect(() => { 
    console.log(elements);
    console.log(modelsList);
  }, [elements, modelsList])

  useEffect(() => { 
    refreshModels();
  }, [])

  const loadWorkflow = (name: any) => {
    if (name == "face_match"){
      let wf = getWorkflow();
      setElements((es) => wf);  
      id = getWorkflow().length;
    }
  }

  const saveWorkflow = (name: any) => {
    console.log(elements);
  }

  const runWorkflow = (name: any) => {
    console.log("Running");
    console.log("Output Results");
  }

  const refreshModels = () => {
    fetch('/api/listmodels')
          .then(response => response.json())
          .then(data => setModelsList(() => data));
  }  


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar onLoad={loadWorkflow} onSave={saveWorkflow} onRun={runWorkflow} modelsList={modelsList}/>
      </ReactFlowProvider>
    </div>
  );
};


const getWorkflow = () => {
  return [
    {
        "id": "1",
        "type": "input",
        "data": {
            "label": "input node"
        },
        "position": {
            "x": 250,
            "y": 5
        }
    },
    {
        "id": "dndnode_0",
        "type": "Face Detection",
        "position": {
            "x": 743,
            "y": 176
        },
        "data": {
            "label": "Face Detection",
            "nodeObject": {
                "modelId": "model1id",
                "modelName": "Face Detection",
                "latestVersion": "0.0.1",
                "versions": [
                    "0.0.1"
                ]
            }
        },
        "className": "react-flow__node-default"
    },
    {
        "source": "1",
        "sourceHandle": null,
        "target": "dndnode_0",
        "targetHandle": null,
        "id": "reactflow__edge-1null-dndnode_0null"
    },
    {
        "id": "dndnode_1",
        "type": "Name Matching",
        "position": {
            "x": 913,
            "y": 292
        },
        "data": {
            "label": "Name Matching",
            "nodeObject": {
                "modelId": "model2id",
                "modelName": "Name Matching",
                "latestVersion": "0.0.1",
                "versions": [
                    "0.0.1"
                ]
            }
        },
        "className": "react-flow__node-default"
    },
    {
        "source": "dndnode_0",
        "sourceHandle": null,
        "target": "dndnode_1",
        "targetHandle": null,
        "id": "reactflow__edge-dndnode_0null-dndnode_1null"
    },
    {
        "id": "dndnode_2",
        "type": "Emotion Detection",
        "position": {
            "x": 591,
            "y": 327
        },
        "data": {
            "label": "Emotion Detection",
            "nodeObject": {
                "modelId": "model3id",
                "modelName": "Emotion Detection",
                "latestVersion": "0.0.1",
                "versions": [
                    "0.0.1"
                ]
            }
        },
        "className": "react-flow__node-default"
    },
    {
        "source": "dndnode_0",
        "sourceHandle": null,
        "target": "dndnode_2",
        "targetHandle": null,
        "id": "reactflow__edge-dndnode_0null-dndnode_2null"
    },
    {
        "id": "dndnode_3",
        "type": "output",
        "position": {
            "x": 996,
            "y": 426
        },
        "data": {
            "label": "output",
            "nodeObject": {}
        },
        "className": "react-flow__node-default"
    },
    {
        "source": "dndnode_1",
        "sourceHandle": null,
        "target": "dndnode_3",
        "targetHandle": null,
        "id": "reactflow__edge-dndnode_1null-dndnode_3null"
    },
    {
        "id": "dndnode_4",
        "type": "output",
        "position": {
            "x": 617,
            "y": 444
        },
        "data": {
            "label": "output",
            "nodeObject": {}
        },
        "className": "react-flow__node-default"
    },
    {
        "source": "dndnode_2",
        "sourceHandle": null,
        "target": "dndnode_4",
        "targetHandle": null,
        "id": "reactflow__edge-dndnode_2null-dndnode_4null"
    },
    {
        "id": "dndnode_5",
        "type": "Emotion Detection",
        "position": {
            "x": 1317,
            "y": 275
        },
        "data": {
            "label": "Emotion Detection",
            "nodeObject": {
                "modelId": "model3id",
                "modelName": "Emotion Detection",
                "latestVersion": "0.0.1",
                "versions": [
                    "0.0.1"
                ]
            }
        },
        "className": "react-flow__node-default"
    }
];
}


export default DnDFlow;
