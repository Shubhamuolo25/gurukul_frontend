import React from "react";
import { RotatingLines } from "react-loader-spinner";

export function ImageWithLoading({ src }) {
  const [loading, setLoading] = React.useState(true);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          zIndex: 1
        }}>
          <span style={{ color: '#888', fontSize: '1.2em' }}>Loading...</span>
        </div>
      )}
      <img
        src={src || process.env.PUBLIC_URL + '/noimage.svg'}
        alt="Profile"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          background: '#fff',
          display: loading ? 'none' : 'block',
          minWidth: 0,
          minHeight: 0,
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: '16px 16px 0 0'
        }}
        onLoad={() => setLoading(false)}
        onError={e => {
          e.target.onerror = null;
          e.target.src = process.env.PUBLIC_URL + '/noimage.svg';
          setLoading(false);
        }}
      />
    </div>
  );
}

function LoadingState({ height = 60, width = 60, color = "#5b17e7", strokeWidth = 4, visible = true }) {
  return (
    <div style={{
      width: "100%",
      height: "500px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      position:"absolute",
    }}>
      <RotatingLines
        visible={visible}
        height={height}
        width={width}
        color={color}
        strokeWidth={strokeWidth}
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}

export default LoadingState;

