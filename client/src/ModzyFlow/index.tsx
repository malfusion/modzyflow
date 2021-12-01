import React, { useState, DragEvent, useEffect, MouseEvent } from 'react';
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

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Sidebar from './Sidebar';
import { Typography, Popover } from "@material-ui/core";
import './dnd.css';

const initialElements = [{ id: '1', type: 'input', data: { label: 'Input Node' }, position: { x: 150, y: 50 } }];
let _modelsList: any[] = [];

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};


let id = 0;
const getId = (): ElementId => `dndnode_${id++}`

const DnDFlow = () => {
  var _workflow_title = "";
  var _flow_results = {};
  var _status = "Ready";
  var _popoverContent = "";
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const [modelsList, setModelsList] = useState(_modelsList);
  const [workflowTitle, setWorkflowTitle] = useState<string>(_workflow_title);
  const [flowResults, setFlowResults] = useState<any>(_flow_results);
  const [status, setStatus] = useState<any>(_status);
  const [popoverContent, setPopoverContent] = useState<any>(_popoverContent);

  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge({animated:true, ...params}, els));
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) => {_reactFlowInstance.setTransform({ x: 0, y: 0, zoom: 2.0 }); setReactFlowInstance(_reactFlowInstance); };

  const onClick = (event: MouseEvent, element: any) => {
    if (element.type == "output") {
      setAnchorEl(event.target as any);
      const nodeId = element.id;
      setPopoverContent(() => JSON.stringify(flowResults[nodeId]));
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const onDrop = (event: DragEvent) => {
    console.log("flow", flowResults)
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
    if (name == undefined)
      return
    fetch('/api/loadflow?flow='+name)
    .then(response => response.json())
    .then(data => {
      setElements((es) => data);
      setWorkflowTitle(() => name);
      id = data.length;
    });
    // if (name == "face_match"){
    //   let wf = getWorkflow();
    //   setElements((es) => wf);  
    //   id = getWorkflow().length;  
    // }
  }

  const saveWorkflow = (name: any) => {
    if (name == undefined) {
      return
    }
    fetch('/api/saveflow?flow='+name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elements)
    }).then(() => {
      setWorkflowTitle(() => name);
    });
  }
  

  const getFile = () => {
    return new Promise((res, rej) => {
      const inp = document.getElementById("myInput");
      if (inp != undefined){
        var fileByteArray: number[] = [];
        inp.click();
        inp.addEventListener('change', function() {
          var reader = new FileReader();
          reader.readAsArrayBuffer((this as HTMLInputElement).files![0]);
          console.log("asdasdasdas")
          reader.onloadend = function (evt) {
            console.log("vxcvxcv")
              if (evt.target!.readyState == FileReader.DONE) {
                var arrayBuffer = evt.target!.result,
                    array = new Uint8Array(arrayBuffer as ArrayBuffer);
                for (var i = 0; i < array.length; i++) {
                    fileByteArray.push(array[i]);
                }
                return res(fileByteArray);
              }
          }
          // var reader = new FileReader();
          // reader.onload = function() {
        
          //   var arrayBuffer = this.result;
          //   var array = new Uint8Array(arrayBuffer as ArrayBuffer);
          //   console.log(array)
          //   var binaryString = String.fromCharCode.apply(null, array as any);
          //   return res(binaryString);
          // }
          // if ((this as HTMLInputElement).files == undefined)
          //   return rej("No files found")
          // reader.readAsArrayBuffer((this as HTMLInputElement).files![0]);
        }, false);
      }
    })
  }

  const runWorkflow = async (name: any) => {
    setStatus(() => "Running");
    setFlowResults(() => { return {}; });
    const input = await getWorkflowInput();
    const res = await fetch('/api/runflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "flow": elements,
        "input": input
      })
    }).then((resp) => resp.json());
    console.log(res);
    setFlowResults(() => res);
    setStatus(() => "Success");
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
      if (data == "text/plain")
        return prompt("Enter text content to be used as input");
      if (data.indexOf("image") >= 0)
        return getFile();
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
        <div className="wrapper">
          <div className={`reactflow-wrapper ${status == "Success" ? "success" : ""}`} >
            <ReactFlow
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onElementClick={(event, element) => {
                onClick(event, element);
              }}
            >
              <Controls />
            </ReactFlow>
            <Popover
              id={popoverId}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <Card variant="outlined">
              <CardHeader
                subheader="Result of execution"
              />
              <CardContent >
                <Typography>
                  {popoverContent}
                </Typography>
              </CardContent>
              
            </Card>
            </Popover>
          </div>
          <div className={`output ${status == "Success" ? "success" : ""}`}>
            <p className="title">Status: {status}...</p>
            
            {/* {              
              Object.entries(flowResults).map(([key, value]) => {
                return <p> <strong>{key} :  </strong> {JSON.stringify(value)} </p>
            }) */}

            
          </div>
        </div>
        <input id="myInput" type="file" style={{visibility:"hidden"}} />
        <Sidebar onLoad={loadWorkflow} onSave={saveWorkflow} onRun={runWorkflow} modelsList={modelsList} workflowTitle={workflowTitle}/>
      </ReactFlowProvider>
    </div>
  );
};


export default DnDFlow;
