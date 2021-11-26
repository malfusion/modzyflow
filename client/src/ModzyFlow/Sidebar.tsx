import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string, nodeObject: any) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData('nodeObject', JSON.stringify(nodeObject));
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = ({ onSave, onRun, onLoad, modelsList } : any ) => {
  return (
    <aside>
      <button className="btn" onClick={(event) => onSave(prompt("Save workflow as:"))}>Save</button>
      <button className="btn" onClick={(event) => onLoad(prompt("Enter name of the workflow to load:"))}>Load</button>
      <button className="btn" onClick={(event) => onRun()}>Run</button>
      <div className="description">Drag and drop models to the left pane.</div>
      <div className="centerer">
        <div className="react-flow__node-input" onDragStart={(event: DragEvent) => onDragStart(event, 'input', {})} draggable>
          Input Node
        </div>
        <div className="react-flow__node-output" onDragStart={(event: DragEvent) => onDragStart(event, 'output', {})} draggable>
          Output Node
        </div>
        {modelsList.map(function(o: any){
          return <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, o.model.name, o.model)} draggable>
            {o.model.name}
          </div>
        })}  
      </div>
      
    </aside>
  );
};


export default Sidebar;
