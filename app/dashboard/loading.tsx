export default function DashboardRootLoading() {
  return (
    <div style={{ padding: "32px 20px", maxWidth: "480px", margin: "0 auto" }}>
      {/* Title skeleton */}
      <div
        style={{
          width: "120px",
          height: "28px",
          background: "#F5F0EB",
          borderRadius: "6px",
          marginBottom: "8px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "160px",
          height: "16px",
          background: "#F5F0EB",
          borderRadius: "4px",
          marginBottom: "20px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      {/* Card skeletons */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#F5F0EB",
              flexShrink: 0,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: "140px",
                height: "14px",
                background: "#F5F0EB",
                borderRadius: "4px",
                marginBottom: "6px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              style={{
                width: "60px",
                height: "11px",
                background: "#F5F0EB",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
