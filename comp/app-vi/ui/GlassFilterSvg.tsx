export default function GlassFilterSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <filter
        id="glassLensSvg"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feComponentTransfer in="SourceAlpha" result="alpha">
          <feFuncA type="identity" />
        </feComponentTransfer>

        <feGaussianBlur in="alpha" stdDeviation="60" result="blur" />

        <feDisplacementMap
          in="SourceGraphic"
          in2="blur"
          scale="60"
          xChannelSelector="A"
          yChannelSelector="A"
        />
      </filter>
    </svg>
  );
}
