import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Cargar el script de Google AdSense
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7837330375752439';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="ad-container" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', maxWidth: '100%' }}
        data-ad-client="ca-pub-7837330375752439"
        data-ad-slot="4684996871"
        data-ad-format="auto"
      ></ins>
    </div>
  );
};

export default AdComponent;
