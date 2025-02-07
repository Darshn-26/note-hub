interface FollowPointerProps {
  x: number;
  y: number;
  info?: {
    name?: string;
    color?: string;
  };
}

function FollowPointer({ x, y, info }: FollowPointerProps) {
  const color = info?.color || '#000';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color}
        stroke="white"
        strokeWidth="2"
      >
        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" />
      </svg>
      
      {/* Name label */}
      {info?.name && (
        <div
          className="absolute left-4 top-4 px-2 py-1 rounded-md text-sm text-white"
          style={{ 
            backgroundColor: color,
            whiteSpace: 'nowrap'
          }}
        >
          {info.name}
        </div>
      )}
    </div>
  );
}

export default FollowPointer;