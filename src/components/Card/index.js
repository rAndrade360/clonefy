import React, {useRef, useContext} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Boardcontext from '../Board/context';
 import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const {move} = useContext(Boardcontext);
  const[{isDragging}, dragRef] = useDrag({
    item: {type: 'CARD', index, listIndex},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  

  const [, dropRef] = useDrop({
      accept: 'CARD',
      hover(item, monitor){
        const draggedListIndex = item.listIndex;
        const targetListIndex = listIndex;


        const targetIndex = index;
        const draggedIndex = item.index;

        if(targetIndex === draggedIndex && draggedListIndex === targetListIndex)
          return;

        const targetSize = ref.current.getBoundingClientRect();
        const targetCenter = (targetSize.bottom - targetSize.top)/2;
        
        const draggedOffSet = monitor.getClientOffset();
        const draggedTop = draggedOffSet.y - targetSize.top;

        if(draggedIndex < targetIndex && draggedTop < targetCenter)
          return;

        if(draggedIndex > targetIndex && draggedTop > targetCenter)
          return;

        move(draggedListIndex, targetListIndex , draggedIndex, targetIndex);

        item.index = targetIndex;
        item.listIndex = targetListIndex;
      }

    
  });

  dragRef(dropRef(ref));

  return (
    <Container isDragging={isDragging} ref={ref}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
       
      </header>
      <p>{data.content}</p>
      {data.user &&  <img src={data.user} alt="avatar"/>}
    </Container>
  );
}
