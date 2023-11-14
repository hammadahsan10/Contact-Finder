import React from 'react';
// import { Box, Typography } from '@mui/material';

// import { useTheme } from '@mui/material/styles';

import { Audio } from  'react-loader-spinner'

const Loading = ({ noTitle }) => {


  return (
    <div>
      <div
        className='cPhARM'
        style={{
          margin: 'auto',
          background:'#454d55',
          position: 'absolute',
          inset: 0,
          minWidth: 'fit-content',
          transform: 'translateY(-40px)',
        }}
      >
        {!noTitle && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
           <Audio 
        height = "80"
        width = "80"
        radius = "9"
        color = '#F8A91B'
        ariaLabel = 'three-dots-loading'     
        wrapperStyle
        wrapperClass
        />  
          </div>
        )}
      </div>
        
   </div>
  );
};

export default Loading;
