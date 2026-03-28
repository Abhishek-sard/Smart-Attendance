import { useState, useEffect } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react';

const StudentQRScan = () => {
    const [scanResult, setScanResult] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [scannerActive, setScannerActive] = useState(false);

    useEffect(() => {
        // Cleanup scanner on unmount
        return () => {
            const element = document.getElementById('reader');
            if (element) {
                element.innerHTML = '';
            }
        };
    }, []);

    const startScanner = () => {
        setScannerActive(true);
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);

            function onScanSuccess(decodedText, decodedResult) {
                // Handle the scanned code as you like, for example:
                console.log(`Code matched = ${decodedText}`, decodedResult);
                setScanResult(decodedText);
                scanner.clear();
                setScannerActive(false);
                setMessage('QR Code Scanned! Ready to submit.');
            }

            function onScanFailure(error) {
                // handle scan failure, usually better to ignore and keep scanning.
                // code scan error = NotFoundException: No MultiFormat Readers were able to detect the code.
                if (typeof error === 'string' && error.includes("NotFoundException")) {
                    return; // Ignore this error as it just means no QR code was found in the current frame
                }
                // console.warn(`Code scan error = ${error}`);
            }
        }, 100);
    };


    const getLocation = () => {
        if (!navigator.geolocation) {
            setMessage('Geolocation is not supported by your browser');
            return;
        }
        setMessage('Fetching location...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setMessage('Location fetched.');
            },
            (err) => {
                setMessage('Error fetching location: ' + err.message);
            }
        );
    }

    const handleSubmit = async () => {
        if (!scanResult) return;
        setLoading(true);
        setMessage('Processing...');

        try {
            // Parse QR Data
            let parsedData;
            try {
                parsedData = JSON.parse(scanResult);
            } catch (e) {
                setMessage('Invalid QR Code format');
                setLoading(false);
                return;
            }

            // Append Location (Optional)
            const payload = {
                ...parsedData,
                latitude: location?.latitude || null,
                longitude: location?.longitude || null
            };

            await axios.post('http://localhost:5000/api/attendance/qr', payload, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setMessage('Attendance Marked Successfully!');
            setScanResult('');
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
                <Camera className="mr-3 text-blue-600" />
                Scan QR Code
            </h1>

            {/* Step 1: Location */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                    <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    Location Verification (Optional)
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {location ? 'Location verified.' : 'Required only for geofenced classes.'}
                    </p>
                    <button
                        onClick={getLocation}
                        disabled={!!location}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${location
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                    >
                        {location ? <><CheckCircle size={16} className="mr-1" /> Verified</> : <><MapPin size={16} className="mr-1" /> Get Location</>}
                    </button>
                </div>
            </div>

            {/* Step 2: Scanner */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                    <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    Scan QR
                </h3>

                {!scanResult ? (
                    <div className="text-center">
                        {scannerActive ? (
                            <div id="reader" className="w-full"></div>
                        ) : (
                            <button
                                onClick={startScanner}
                                className="w-full py-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 transition flex flex-col items-center justify-center bg-white"
                            >
                                <Camera size={32} className="mb-2" />
                                Click to Open Camera
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center text-green-700">
                        <CheckCircle size={20} className="mr-2" />
                        QR Code Scanned Successfully
                    </div>
                )}
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mb-6 p-3 rounded-lg flex items-start ${message.includes('Success') || message.includes('Location fetched') ? 'bg-green-100 text-green-700 border border-green-200' :
                    message.includes('Processing') || message.includes('Fetching') ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.includes('Success') || message.includes('Location fetched') ? <CheckCircle size={18} className="mr-2 mt-0.5" /> : <AlertCircle size={18} className="mr-2 mt-0.5" />}
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Step 3: Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading || !scanResult}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-lg shadow-slate-200"
            >
                {loading ? 'Marking Attendance...' : 'Submit Attendance'}
            </button>
        </div>
    );
};

export default StudentQRScan;
