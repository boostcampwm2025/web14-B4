type RecordedVideoListProps = {
  videoUrl: string | null;
};

export default function RecordedVideo({ videoUrl }: RecordedVideoListProps) {
  if (!videoUrl) return null;

  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">녹화된 영상</h2>

      <div className="w-full max-w-md">
        <div className="border rounded-lg p-3 bg-gray-50">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg mb-2"
            style={{ maxHeight: '250px' }}
          />

          <a
            href={videoUrl}
            download="recording.webm"
            className="inline-block w-full text-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
          >
            다운로드
          </a>
        </div>
      </div>
    </div>
  );
}
