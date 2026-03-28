import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ classId, date }) => {
    // QR Content: JSON string with Class ID and Date
    const qrData = JSON.stringify({ classId, date });

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Scan to Mark Attendance</h3>
            <div className="p-4 bg-white border-2 border-gray-100 rounded">
                <QRCodeSVG value={qrData} size={256} level={"H"} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
                Date: {date}
            </p>
            <p className="text-xs text-gray-400 mt-1">
                Students can scan this using their dashboard.
            </p>
        </div>
    );
};

export default QRCodeGenerator;
