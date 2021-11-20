import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string, nodeObject: any) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData('nodeObject', JSON.stringify(nodeObject));
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = ({ onSave, onRun, onLoad, modelsList } : any ) => {
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
      <button onClick={(event) => onSave(prompt())}>Save</button>
      <button onClick={(event) => onLoad(prompt())}>Load</button>
      <button onClick={(event) => onRun()}>Run</button>

    </aside>
  );
};


export default Sidebar;
