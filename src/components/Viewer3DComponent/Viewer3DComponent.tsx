"use client";

import React from 'react';

export default function Viewer3DComponent({ combinedChoice }: { combinedChoice: string }) {


return (
    <div style={{ width: '100%', height: '500px' }}>
      {/* Replace the src URL with your actual iJewel Drive embed URL */}
      <iframe
        src={`https://useryze.ijewel3d.com/drive/files/${combinedChoice}/embedded`} // Use your specific URL
        height="100%"
        width="100%"
        allowFullScreen
        title="iJewel 3D Model Viewer"
      ></iframe>
    </div>
  );
};
