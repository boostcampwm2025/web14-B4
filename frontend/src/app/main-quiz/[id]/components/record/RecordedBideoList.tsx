type RecordedVideoListProps = {
  videos: string[];
};

export default function RecordedVideoList({ videos }: RecordedVideoListProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">녹화된 영상</h2>

      <div className="w-full max-w-md">
        <div className="space-y-3">
          {videos.map((url, index) => (
            <div key={url} className="border rounded-lg p-3 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">녹화 {index + 1}</p>

              <video
                src={url}
                controls
                className="w-full rounded-lg mb-2"
                style={{ maxHeight: '250px' }}
              />

              <a
                href={url}
                download={`recording-${index + 1}.webm`}
                className="inline-block w-full text-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
              >
                다운로드
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
