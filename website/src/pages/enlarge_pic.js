import React, {useState} from 'react';

const EnlargeableImage = ({src, alt}) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const toggleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
  };

  const closeEnlarged = e => {
    e.stopPropagation();
    setIsEnlarged(false);
  };

  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      <img
        src={src}
        alt={alt}
        onClick={toggleEnlarge}
        style={{cursor: 'pointer', maxWidth: '100%'}}
      />
      {isEnlarged && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={toggleEnlarge}>
          <div
            style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            <button
              onClick={closeEnlarged}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                fontSize: '20px',
                cursor: 'pointer',
              }}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnlargeableImage;
