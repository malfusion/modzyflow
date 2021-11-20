import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string, nodeObject: any) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData('nodeObject', JSON.stringify(nodeObject));
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = ({ onSave, onRun, onLoad, modelsList } : any ) => {

  console.log(modelsList)

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="react-flow__node-input" onDragStart={(event: DragEvent) => onDragStart(event, 'input', {})} draggable>
        Input Node
      </div>
      <div className="react-flow__node-output" onDragStart={(event: DragEvent) => onDragStart(event, 'output', {})} draggable>
        Output Node
      </div>
      {modelsList.map(function(o: any){
        return <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, o.modelId, o)} draggable>
          {o.modelId}
        </div>
      })}
      <button onClick={(event) => onSave("new_algo")}>Save</button>
      <button onClick={(event) => onLoad("face_match")}>Load</button>
      <button onClick={(event) => onRun()}>Run</button>

    </aside>
  );
};


// const getModels = () => {
//   console.log("Running once");
//   return [
//     {
//       "modelId": "model1id",
//       "modelName": "Face Detection",
//       "latestVersion": "0.0.1",
//       "versions": [
//         "0.0.1"
//       ]
//     },
//     {
//       "modelId": "model2id",
//       "modelName": "Name Matching",
//       "latestVersion": "0.0.1",
//       "versions": [
//         "0.0.1"
//       ]
//     },
//     {
//       "modelId": "model3id",
//       "modelName": "Emotion Detection",
//       "latestVersion": "0.0.1",
//       "versions": [
//         "0.0.1"
//       ]
//     }
//   ];
// }


export default Sidebar;
