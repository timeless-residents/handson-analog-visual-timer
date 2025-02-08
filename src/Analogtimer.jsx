import { useState, useEffect } from 'react';

const AnalogTimer = () => {
  const [inputMinutes, setInputMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(inputMinutes * 60);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(inputMinutes * 60);
  };

  // 残り時間を時、分、秒に変換
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // 進捗率を計算（秒針は0秒のとき満タン）
  const secondsProgress = seconds === 0 ? 1 : seconds / 60;
  const minutesProgress = (minutes + seconds / 60) / 60;
  const hoursProgress = (hours + minutes / 60) / 12;

  // 角度を計算（反時計回り）
  const secondsDegrees = secondsProgress * 360;
  const minutesDegrees = minutesProgress * 360;
  const hoursDegrees = hoursProgress * 360;

  // 扇形のパスを生成する関数
  const createArc = (startRadius, endRadius, angle) => {
    const startAngle = -90;
    const endAngle = startAngle + angle;
    
    const end = {
      x: 100 + endRadius * Math.cos(startAngle * Math.PI / 180),
      y: 100 + endRadius * Math.sin(startAngle * Math.PI / 180)
    };
    const endOuter = {
      x: 100 + endRadius * Math.cos(endAngle * Math.PI / 180),
      y: 100 + endRadius * Math.sin(endAngle * Math.PI / 180)
    };

    const largeArcFlag = angle <= 180 ? 0 : 1;

    // startRadiusが0の場合（中心から始まる場合）
    if (startRadius === 0) {
      return `
        M 100 100
        L ${end.x} ${end.y}
        A ${endRadius} ${endRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
        Z
      `;
    }

    // それ以外の場合（リング状の扇形）
    const start = {
      x: 100 + startRadius * Math.cos(startAngle * Math.PI / 180),
      y: 100 + startRadius * Math.sin(startAngle * Math.PI / 180)
    };
    const endInner = {
      x: 100 + startRadius * Math.cos(endAngle * Math.PI / 180),
      y: 100 + startRadius * Math.sin(endAngle * Math.PI / 180)
    };

    return `
      M ${start.x} ${start.y}
      L ${end.x} ${end.y}
      A ${endRadius} ${endRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${endInner.x} ${endInner.y}
      A ${startRadius} ${startRadius} 0 ${largeArcFlag} 0 ${start.x} ${start.y}
    `;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      {/* デジタル表示 */}
      <div className="text-4xl font-bold font-mono bg-white px-6 py-2 rounded-lg shadow-md">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* アナログタイマー */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* 背景の円 */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="#f3f4f6"
            stroke="#374151"
            strokeWidth="2"
          />

          {/* 時針用の背景円 */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="#e5e7eb"
            strokeWidth="0"
          />
          {/* 時針の扇形（外側） */}
          <path
            d={createArc(65, 95, hoursDegrees)}
            fill="#1f2937"
          />

          {/* 分針用の背景円 */}
          <circle
            cx="100"
            cy="100"
            r="65"
            fill="#d1d5db"
            strokeWidth="0"
          />
          {/* 分針の扇形（中間） */}
          <path
            d={createArc(35, 65, minutesDegrees)}
            fill="#4b5563"
          />

          {/* 秒針用の背景円 */}
          <circle
            cx="100"
            cy="100"
            r="35"
            fill="#fee2e2"
            strokeWidth="0"
          />
          {/* 秒針の扇形（内側、中心まで） */}
          <path
            d={createArc(0, 35, secondsDegrees)}
            fill={!isRunning ? "#dc2626" : "#ef4444"}
          />
        </svg>
      </div>

      {/* コントロール */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="720"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1 border rounded text-center text-lg"
            disabled={isRunning}
          />
          <span className="text-gray-600 text-lg">分</span>
        </div>

        <div className="flex space-x-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none text-lg"
            >
              開始
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none text-lg"
            >
              停止
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none text-lg"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimer;
