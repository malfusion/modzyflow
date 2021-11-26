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

const initialElements = [{ id: '1', type: 'input', data: { label: 'input node' }, position: { x: 350, y: 50 } }];
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

  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge({animated:true, ...params}, els));
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) => {_reactFlowInstance.setTransform({ x: 0, y: 0, zoom: 2.0 }); setReactFlowInstance(_reactFlowInstance); };


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


  // useEffect(() => { 
  //   console.log(elements);
  //   console.log(modelsList);
  // }, [elements, modelsList])

  useEffect(() => { 
    refreshModels();
  }, [])

  const loadWorkflow = (name: any) => {
    fetch('/api/loadflow?flow='+name)
    .then(response => response.json())
    .then(data => {
      setElements((es) => data);
      id = data.length;
    });
    // if (name == "face_match"){
    //   let wf = getWorkflow();
    //   setElements((es) => wf);  
    //   id = getWorkflow().length;  
    // }
  }

  const saveWorkflow = (name: any) => {
    fetch('/api/saveflow?flow='+name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elements)
    });
  }

  const runWorkflow = async (name: any) => {
    const input = await getWorkflowInput();
    fetch('/api/runflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "flow": elements,
        "input": input
      })
    })
  }

  const getWorkflowInput = async () => {
    return await fetch('/api/getinputype', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elements)
    })
    .then(response => response.text())
    .then(data => {
      if (data == "text/plain") {
        const textinput = prompt()
        return textinput
      }
    });
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


export default DnDFlow;
